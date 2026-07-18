import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '../../../lib/fileStore';
import { checkRateLimit } from '../../../lib/rateLimit';
import { hasSessionSecret } from '../../../lib/sessionSecret';
import { normalizeEmail, validatePassword } from '../../../lib/validation';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Пароль',
      credentials: {
        email: { label: 'Адрес почты', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const email = normalizeEmail(credentials?.email);
          const password = validatePassword(credentials?.password);
          const rate = checkRateLimit(`login:${email}`, { limit: 10, windowMs: 15 * 60 * 1000 });
          if (!rate.allowed) return null;

          const user = await findUserByEmail(email);
          if (!user || !(await bcrypt.compare(password, user.password))) return null;
          const { password: _, ...safeUser } = user;
          return safeUser;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
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
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: { signIn: '/login', error: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
};

const nextAuthHandler = NextAuth(authOptions);

export default async function handler(req, res) {
  if (!hasSessionSecret()) {
    return res.status(503).json({ message: 'Секрет сеансов не настроен' });
  }
  return nextAuthHandler(req, res);
}
