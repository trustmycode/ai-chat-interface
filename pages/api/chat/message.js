import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

// Заглушки для API клиентов
const OpenAI = {
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
};

const Anthropic = {
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key'
};

// Путь к файлу с сообщениями чата
const getChatMessagesFilePath = (chatId) => {
  return path.join(process.cwd(), `data/messages_${chatId}.json`);
};

// Путь к файлу с чатами пользователя
const getUserChatsFilePath = (userId) => {
  return path.join(process.cwd(), `data/chats_${userId}.json`);
};

// Проверка и обновление информации о чате
const updateChatInfo = (userId, chatId, messagesCount) => {
  try {
    const chatsFilePath = getUserChatsFilePath(userId);
    if (!fs.existsSync(chatsFilePath)) {
      return false;
    }

    const chatsData = fs.readFileSync(chatsFilePath, 'utf8');
    const chats = JSON.parse(chatsData);
    
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          updatedAt: new Date().toISOString(),
          messagesCount
        };
      }
      return chat;
    });
    
    // Перемещаем обновленный чат в начало списка
    const chatIndex = updatedChats.findIndex(chat => chat.id === chatId);
    if (chatIndex > 0) {
      const [chat] = updatedChats.splice(chatIndex, 1);
      updatedChats.unshift(chat);
    }
    
    fs.writeFileSync(chatsFilePath, JSON.stringify(updatedChats, null, 2));
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении информации о чате:', error);
    return false;
  }
};

// Создание нового чата
const createNewChat = async (userId, model, message) => {
  try {
    // Создаем новый чат
    const chatId = Date.now().toString();
    const chatsFilePath = getUserChatsFilePath(userId);
    let chats = [];
    
    if (fs.existsSync(chatsFilePath)) {
      const chatsData = fs.readFileSync(chatsFilePath, 'utf8');
      chats = JSON.parse(chatsData);
    } else {
      // Создаем директорию data, если она не существует
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }
    
    // Первые слова сообщения пользователя как название чата
    const title = message.length > 30 
      ? `${message.substring(0, 30)}...` 
      : message;
    
    const newChat = {
      id: chatId,
      title,
      model,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messagesCount: 2 // Сообщение пользователя + ответ ассистента
    };
    
    chats.unshift(newChat);
    fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2));
    
    return chatId;
  } catch (error) {
    console.error('Ошибка при создании нового чата:', error);
    throw error;
  }
};

// Получение данных чата
const getChatData = (chatId) => {
  const messagesFilePath = getChatMessagesFilePath(chatId);
  
  if (!fs.existsSync(messagesFilePath)) {
    return [];
  }
  
  try {
    const chatData = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(chatData);
  } catch (error) {
    console.error('Ошибка при чтении данных чата:', error);
    return [];
  }
};

// Сохранение данных чата
const saveChatData = (chatId, chatData) => {
  const messagesFilePath = getChatMessagesFilePath(chatId);
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(messagesFilePath, JSON.stringify(chatData, null, 2));
};

// Получение ответа от AI
const getAIResponse = async (model, messages) => {
  try {
    // Формат сообщений для API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Имитация ответов от моделей
    const dummyResponses = {
      'gpt-4o': 'Это ответ от модели GPT-4o. Для полноценной работы требуется API ключ OpenAI.',
      'gpt-4o-mini': 'Это ответ от модели GPT-4o mini. Для полноценной работы требуется API ключ OpenAI.',
      'gpt-3.5-turbo': 'Это ответ от модели GPT-3.5 Turbo. Для полноценной работы требуется API ключ OpenAI.',
      'claude-3-sonnet-20240229': 'Это ответ от модели Claude 3.5 Sonnet. Для полноценной работы требуется API ключ Anthropic.',
      'claude-3-haiku-20240307': 'Это ответ от модели Claude 3.5 Haiku. Для полноценной работы требуется API ключ Anthropic.',
      'claude-3-opus-20240229': 'Это ответ от модели Claude 3.7 Sonnet. Для полноценной работы требуется API ключ Anthropic.'
    };

    return dummyResponses[model] || 'Ответ от AI ассистента. Для полноценной работы требуется подключение к API.';
  } catch (error) {
    console.error('Ошибка при получении ответа от AI:', error);
    return 'Произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.';
  }
};

// Обработчик запросов
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  // Проверяем авторизацию
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  const userId = session.user.id;
  const { chatId, message, model } = req.body;

  try {
    // Проверяем наличие сообщения
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    let currentChatId = chatId;
    let messages = [];

    // Если чат не указан, создаем новый
    if (!currentChatId) {
      currentChatId = await createNewChat(userId, model, message);
    } else {
      // Получаем существующие сообщения
      const chatData = getChatData(currentChatId);
      if (chatData && Array.isArray(chatData)) {
        messages = chatData;
      }
    }

    // Добавляем сообщение пользователя
    messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Сохраняем сообщения
    saveChatData(currentChatId, messages);

    // Получаем ответ от AI
    const assistantResponse = await getAIResponse(model, messages);

    // Добавляем ответ ассистента
    messages.push({
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date().toISOString()
    });

    // Сохраняем сообщения и обновляем информацию о чате
    saveChatData(currentChatId, messages);
    updateChatInfo(userId, currentChatId, messages.length);

    // Возвращаем ответ
    return res.status(200).json({
      chatId: currentChatId,
      response: assistantResponse
    });
  } catch (error) {
    console.error('Ошибка при обработке сообщения:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
} 