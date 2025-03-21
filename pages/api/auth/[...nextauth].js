import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Путь к файлу с пользователями
const usersFilePath = path.join(process.cwd(), 'data/users.json');

// Получение списка пользователей
const getUsers = () => {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Ошибка при чтении файла пользователей:', error);
    return [];
  }
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Получаем пользователей из файла
        const users = getUsers();
        
        // Ищем пользователя с нужным email
        const user = users.find(user => user.email === credentials.email);
        
        // Если пользователь не найден или пароль неверный
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }
        
        // Возвращаем информацию о пользователе без пароля
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
};

export default NextAuth(authOptions);