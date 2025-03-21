import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

// Получение пути к файлу сообщений чата
const getChatMessagesFilePath = (chatId) => {
  return path.join(process.cwd(), `data/messages_${chatId}.json`);
};

// Получение пути к файлу с чатами пользователя
const getUserChatsFilePath = (userId) => {
  return path.join(process.cwd(), `data/chats_${userId}.json`);
};

// Проверка, принадлежит ли чат пользователю
const isChatOwnedByUser = (userId, chatId) => {
  try {
    const chatsFilePath = getUserChatsFilePath(userId);
    if (!fs.existsSync(chatsFilePath)) {
      return false;
    }

    const chatsData = fs.readFileSync(chatsFilePath, 'utf8');
    const chats = JSON.parse(chatsData);
    return chats.some(chat => chat.id === chatId);
  } catch (error) {
    console.error('Ошибка при проверке владельца чата:', error);
    return false;
  }
};

// Получение данных чата
const getChatData = (chatId) => {
  const messagesFilePath = getChatMessagesFilePath(chatId);
  
  if (!fs.existsSync(messagesFilePath)) {
    return null;
  }
  
  const chatData = fs.readFileSync(messagesFilePath, 'utf8');
  return JSON.parse(chatData);
};

export default async function handler(req, res) {
  // Проверяем авторизацию
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  const { chatId } = req.query;
  const userId = session.user.id;

  // Проверяем, принадлежит ли чат пользователю
  if (!isChatOwnedByUser(userId, chatId)) {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }

  // GET - получение сообщений чата
  if (req.method === 'GET') {
    try {
      const chatData = getChatData(chatId);
      
      if (!chatData) {
        return res.status(404).json({ message: 'Чат не найден' });
      }
      
      return res.status(200).json(chatData);
    } catch (error) {
      console.error('Ошибка при получении сообщений чата:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  // DELETE - удаление чата
  if (req.method === 'DELETE') {
    try {
      // Удаляем файл с сообщениями
      const messagesFilePath = getChatMessagesFilePath(chatId);
      if (fs.existsSync(messagesFilePath)) {
        fs.unlinkSync(messagesFilePath);
      }

      // Удаляем чат из списка чатов пользователя
      const chatsFilePath = getUserChatsFilePath(userId);
      const chatsData = fs.readFileSync(chatsFilePath, 'utf8');
      const chats = JSON.parse(chatsData);
      
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      fs.writeFileSync(chatsFilePath, JSON.stringify(updatedChats, null, 2));

      return res.status(200).json({ message: 'Чат успешно удален' });
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  // Метод не разрешен
  return res.status(405).json({ message: 'Метод не разрешен' });
} 