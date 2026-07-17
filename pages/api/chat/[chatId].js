import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { deleteChat, getChat } from '../../../lib/fileStore';
import { hasSessionSecret } from '../../../lib/sessionSecret';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!hasSessionSecret()) {
    return res.status(503).json({ message: 'Секрет сеансов не настроен' });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  try {
    if (req.method === 'GET') {
      const chat = await getChat(session.user.id, req.query.chatId);
      return chat
        ? res.status(200).json(chat)
        : res.status(404).json({ message: 'Чат не найден' });
    }
    if (req.method === 'DELETE') {
      const deleted = await deleteChat(session.user.id, req.query.chatId);
      return deleted
        ? res.status(200).json({ message: 'Чат удалён' })
        : res.status(404).json({ message: 'Чат не найден' });
    }
    res.setHeader('Allow', 'GET, DELETE');
    return res.status(405).json({ message: 'Метод не разрешён' });
  } catch (error) {
    if (/invalid format/.test(error.message)) {
      return res.status(400).json({ message: 'Некорректный идентификатор чата' });
    }
    console.error('Ошибка работы с чатом', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}
