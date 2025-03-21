import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

// Путь к файлу с чатами
const getChatsFilePath = (userId) => path.join(process.cwd(), `data/chats_${userId}.json`);

// Проверяем и создаем директорию и файл, если они не существуют
const ensureChatsFile = (userId) => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = getChatsFilePath(userId);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
  return filePath;
};

// Получение чатов пользователя
const getUserChats = (userId) => {
  const filePath = ensureChatsFile(userId);
  const chatsData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(chatsData);
};

// Сохранение чатов пользователя
const saveUserChats = (userId, chats) => {
  const filePath = getChatsFilePath(userId);
  fs.writeFileSync(filePath, JSON.stringify(chats, null, 2));
};

export default async function handler(req, res) {
  // Проверяем авторизацию
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  const userId = session.user.id;

  // GET - получение списка чатов
  if (req.method === 'GET') {
    try {
      const chats = getUserChats(userId);
      return res.status(200).json(chats);
    } catch (error) {
      console.error('Ошибка при получении чатов:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  // POST - создание нового чата
  if (req.method === 'POST') {
    try {
      const { title = 'Новый чат', model = 'gpt-4o' } = req.body;
      
      const chats = getUserChats(userId);
      
      const newChat = {
        id: Date.now().toString(),
        title,
        model,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messagesCount: 0
      };
      
      // Сохраняем новый чат
      chats.unshift(newChat);
      saveUserChats(userId, chats);
      
      // Создаем пустой файл сообщений для этого чата
      const chatMessagesFilePath = path.join(process.cwd(), `data/messages_${newChat.id}.json`);
      fs.writeFileSync(chatMessagesFilePath, JSON.stringify({
        chatId: newChat.id,
        model,
        messages: []
      }, null, 2));
      
      return res.status(201).json(newChat);
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  // Метод не разрешен
  return res.status(405).json({ message: 'Метод не разрешен' });
} 