const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const store = require('../lib/fileStore');

function isolatedDataDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-chat-interface-'));
  process.env.CHAT_DATA_DIR = directory;
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('создание чата и обмен сообщениями сохраняются единым состоянием', async (t) => {
  isolatedDataDirectory(t);
  const userId = randomUUID();
  const chat = await store.createChat(userId, { title: 'Проверка', model: 'gpt-4o-mini' });

  await store.appendExchange(userId, {
    chatId: chat.id,
    model: chat.model,
    message: 'Привет',
    response: 'Демонстрационный ответ',
  });

  const saved = await store.getChat(userId, chat.id);
  assert.equal(saved.messages.length, 2);
  assert.equal(saved.messages[0].content, 'Привет');
  assert.equal((await store.listChats(userId))[0].messagesCount, 2);
});

test('другой пользователь не видит и не изменяет чужой чат', async (t) => {
  isolatedDataDirectory(t);
  const ownerId = randomUUID();
  const otherUserId = randomUUID();
  const chat = await store.createChat(ownerId, { title: 'Закрытый чат', model: 'gpt-4o-mini' });

  assert.equal(await store.getChat(otherUserId, chat.id), null);
  await assert.rejects(
    store.appendExchange(otherUserId, {
      chatId: chat.id,
      model: chat.model,
      message: 'Попытка',
      response: 'Ответ',
    }),
    (error) => error.code === 'CHAT_NOT_FOUND',
  );
});

test('параллельная регистрация не создаёт два одинаковых адреса', async (t) => {
  isolatedDataDirectory(t);
  const candidate = { name: 'Пользователь', email: 'person@example.test', password: 'hash' };
  const results = await Promise.allSettled([
    store.createUser(candidate),
    store.createUser(candidate),
  ]);

  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter((result) => result.status === 'rejected').length, 1);
});

test('удаление чата удаляет и его сообщения', async (t) => {
  isolatedDataDirectory(t);
  const userId = randomUUID();
  const chat = await store.createChat(userId, { title: 'На удаление', model: 'gpt-4o-mini' });

  assert.equal(await store.deleteChat(userId, chat.id), true);
  assert.equal(await store.getChat(userId, chat.id), null);
  assert.equal(await store.deleteChat(userId, chat.id), false);
});
