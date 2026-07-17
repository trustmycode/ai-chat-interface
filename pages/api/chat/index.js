import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createChat, listChats } from '../../../lib/fileStore';
import { normalizeModel } from '../../../lib/chatConfig';
import { cleanText, ValidationError } from '../../../lib/validation';
import { hasSessionSecret } from '../../../lib/sessionSecret';

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };

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
      return res.status(200).json(await listChats(session.user.id));
    }
    if (req.method === 'POST') {
      const title = cleanText(req.body?.title ?? 'Новый чат', { field: 'Название', min: 1, max: 100 });
      const model = normalizeModel(req.body?.model);
      return res.status(201).json(await createChat(session.user.id, { title, model }));
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ message: 'Метод не разрешён' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Ошибка работы со списком чатов', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}
