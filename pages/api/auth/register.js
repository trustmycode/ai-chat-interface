import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// В реальном приложении нужна база данных
// Для демо-версии будем хранить пользователей в JSON файле
const usersFilePath = path.join(process.cwd(), 'data/users.json');

// Проверяем и создаем директорию data, если она не существует
const ensureDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Создаем файл пользователей, если он не существует
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
  }
};

// Получение списка пользователей
const getUsers = () => {
  ensureDirectory();
  const usersData = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(usersData);
};

// Сохранение списка пользователей
const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  try {
    const { name, email, password } = req.body;

    // Проверка обязательных полей
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    // Получаем текущих пользователей
    const users = getUsers();

    // Проверяем, существует ли пользователь с таким email
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Добавляем пользователя в список
    users.push(newUser);
    saveUsers(users);

    // Возвращаем успешный ответ без пароля
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
} 