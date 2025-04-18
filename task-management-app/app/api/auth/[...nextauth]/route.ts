import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/user';
import { JWT } from 'next-auth/jwt';
import { Session, DefaultSession } from 'next-auth';

// Расширение типа для User в NextAuth
declare module "next-auth" {
  interface User {
    isDemoUser?: boolean;
  }
  
  interface Session {
    user: {
      id: string;
      isDemoUser?: boolean;
    } & DefaultSession["user"]
  }
}

// Расширение типа для JWT в NextAuth
declare module "next-auth/jwt" {
  interface JWT {
    isDemoUser?: boolean;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Check if credentials are valid
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          await connectToDatabase();

          // Find user by email
          const user = await User.findOne({ email: credentials.email });

          // Check if user exists and password matches
          if (!user || !user.password) {
            throw new Error('User not found');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || '',
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
    // Демо-провайдер для входа без регистрации
    CredentialsProvider({
      id: 'demo',
      name: 'Demo',
      credentials: {},
      async authorize() {
        // Создаем демо-пользователя с фиксированными данными
        return {
          id: 'demo-user-id',
          name: 'Demo User',
          email: 'demo@example.com',
          image: '',
          isDemoUser: true,
        };
      },
    }),
    // Add more providers here as needed (Google, GitHub, etc.)
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Сохраняем признак демо-пользователя
        if (user.isDemoUser) {
          token.isDemoUser = true;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Добавляем признак демо-пользователя в сессию
        if (token.isDemoUser) {
          session.user.isDemoUser = true;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    // error: '/auth/error',
    // signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 