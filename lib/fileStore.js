const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const locks = new Map();

function dataDirectory() {
  return path.resolve(process.env.CHAT_DATA_DIR || path.join(process.cwd(), 'data'));
}

function safeId(value, field) {
  if (typeof value !== 'string' || !/^[0-9a-f-]{36}$/i.test(value)) {
    throw new Error(`${field} has an invalid format`);
  }
  return value;
}

function usersPath() {
  return path.join(dataDirectory(), 'users.json');
}

function chatStatePath(userId) {
  return path.join(dataDirectory(), `chat-state-${safeId(userId, 'userId')}.json`);
}

async function ensureDirectory() {
  await fs.mkdir(dataDirectory(), { recursive: true, mode: 0o700 });
  await fs.chmod(dataDirectory(), 0o700);
}

async function readJson(filePath, fallback) {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(contents);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return structuredClone(fallback);
    }
    throw error;
  }
}

async function atomicWriteJson(filePath, value) {
  await ensureDirectory();
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
      flag: 'wx',
    });
    await fs.rename(temporaryPath, filePath);
  } finally {
    await fs.unlink(temporaryPath).catch(() => {});
  }
}

async function withLock(filePath, operation) {
  const previous = locks.get(filePath) || Promise.resolve();
  const current = previous.catch(() => {}).then(operation);
  locks.set(filePath, current);
  try {
    return await current;
  } finally {
    if (locks.get(filePath) === current) {
      locks.delete(filePath);
    }
  }
}

async function listUsers() {
  const users = await readJson(usersPath(), []);
  if (!Array.isArray(users)) {
    throw new Error('User storage is corrupted');
  }
  return users;
}

async function findUserByEmail(email) {
  return (await listUsers()).find((user) => user.email === email) || null;
}

async function createUser({ name, email, password }) {
  const filePath = usersPath();
  return withLock(filePath, async () => {
    const users = await listUsers();
    if (users.some((user) => user.email === email)) {
      const error = new Error('User already exists');
      error.code = 'DUPLICATE_USER';
      throw error;
    }
    const user = {
      id: randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await atomicWriteJson(filePath, users);
    return user;
  });
}

function emptyChatState() {
  return { chats: [], messages: {} };
}

async function readChatState(userId) {
  const state = await readJson(chatStatePath(userId), emptyChatState());
  if (!Array.isArray(state.chats) || !state.messages || typeof state.messages !== 'object') {
    throw new Error('Chat storage is corrupted');
  }
  return state;
}

async function updateChatState(userId, operation) {
  const filePath = chatStatePath(userId);
  return withLock(filePath, async () => {
    const state = await readChatState(userId);
    const result = await operation(state);
    await atomicWriteJson(filePath, state);
    return result;
  });
}

async function listChats(userId) {
  return (await readChatState(userId)).chats;
}

async function createChat(userId, { title, model }) {
  return updateChatState(userId, (state) => {
    const now = new Date().toISOString();
    const chat = {
      id: randomUUID(),
      title,
      model,
      createdAt: now,
      updatedAt: now,
      messagesCount: 0,
    };
    state.chats.unshift(chat);
    state.messages[chat.id] = [];
    return chat;
  });
}

async function getChat(userId, chatId) {
  safeId(chatId, 'chatId');
  const state = await readChatState(userId);
  const chat = state.chats.find((item) => item.id === chatId);
  if (!chat) return null;
  return { chatId, model: chat.model, messages: state.messages[chatId] || [] };
}

async function appendExchange(userId, { chatId, model, message, response }) {
  return updateChatState(userId, (state) => {
    let chat = null;
    if (chatId) {
      safeId(chatId, 'chatId');
      chat = state.chats.find((item) => item.id === chatId);
      if (!chat) {
        const error = new Error('Chat not found');
        error.code = 'CHAT_NOT_FOUND';
        throw error;
      }
    } else {
      const now = new Date().toISOString();
      chat = {
        id: randomUUID(),
        title: message.length > 60 ? `${message.slice(0, 60)}…` : message,
        model,
        createdAt: now,
        updatedAt: now,
        messagesCount: 0,
      };
      state.chats.unshift(chat);
      state.messages[chat.id] = [];
    }

    const messages = state.messages[chat.id] || [];
    const now = new Date().toISOString();
    messages.push({ role: 'user', content: message, timestamp: now });
    messages.push({ role: 'assistant', content: response, timestamp: now });
    state.messages[chat.id] = messages.slice(-100);
    chat.updatedAt = now;
    chat.messagesCount = state.messages[chat.id].length;
    state.chats = [chat, ...state.chats.filter((item) => item.id !== chat.id)];
    return chat;
  });
}

async function deleteChat(userId, chatId) {
  safeId(chatId, 'chatId');
  return updateChatState(userId, (state) => {
    const index = state.chats.findIndex((item) => item.id === chatId);
    if (index === -1) return false;
    state.chats.splice(index, 1);
    delete state.messages[chatId];
    return true;
  });
}

module.exports = {
  appendExchange,
  createChat,
  createUser,
  deleteChat,
  findUserByEmail,
  getChat,
  listChats,
};
