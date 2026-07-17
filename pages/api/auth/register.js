import bcrypt from 'bcryptjs';
import { createUser } from '../../../lib/fileStore';
import { checkRateLimit } from '../../../lib/rateLimit';
import { cleanText, normalizeEmail, validatePassword, ValidationError } from '../../../lib/validation';

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Метод не разрешён' });
  }

  const address = req.socket.remoteAddress || 'unknown';
  const rate = checkRateLimit(`register:${address}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({ message: 'Слишком много попыток. Повторите позже.' });
  }

  try {
    const name = cleanText(req.body?.name, { field: 'Имя', min: 2, max: 80 });
    const email = normalizeEmail(req.body?.email);
    const password = validatePassword(req.body?.password);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await createUser({ name, email, password: hashedPassword });
    const { password: _, ...safeUser } = user;
    return res.status(201).json(safeUser);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 'DUPLICATE_USER') {
      return res.status(409).json({ message: 'Пользователь с таким адресом уже существует' });
    }
    console.error('Ошибка регистрации', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}
