import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { appendExchange } from '../../../lib/fileStore';
import { getModelResponse, normalizeModel } from '../../../lib/chatConfig';
import { checkRateLimit } from '../../../lib/rateLimit';
import { cleanText, ValidationError } from '../../../lib/validation';
import { hasSessionSecret } from '../../../lib/sessionSecret';

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Метод не разрешён' });
  }
  if (!hasSessionSecret()) {
    return res.status(503).json({ error: 'Секрет сеансов не настроен' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  const rate = checkRateLimit(`message:${session.user.id}`, { limit: 30, windowMs: 60 * 1000 });
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({ error: 'Слишком много сообщений. Повторите позже.' });
  }

  try {
    const message = cleanText(req.body?.message, { field: 'Сообщение', min: 1, max: 4000 });
    const model = normalizeModel(req.body?.model);
    const response = getModelResponse(model);
    const chat = await appendExchange(session.user.id, {
      chatId: req.body?.chatId || null,
      model,
      message,
      response,
    });
    return res.status(200).json({ chatId: chat.id, response, simulated: true });
  } catch (error) {
    if (error instanceof ValidationError || /invalid format/.test(error.message)) {
      return res.status(400).json({ error: 'Некорректные данные запроса' });
    }
    if (error.code === 'CHAT_NOT_FOUND') {
      return res.status(404).json({ error: 'Чат не найден' });
    }
    console.error('Ошибка обработки сообщения', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
