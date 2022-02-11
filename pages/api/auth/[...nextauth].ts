import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '../../../lib/prisma';

export default NextAuth({
  // pages: {
  //   signIn: '/signin',
  // },
  session: {
    strategy: 'database'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            password: credentials.password
          }
        });
        if (!user) {
          return null;
        }

        return user;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log('user', user);
      // console.log('account', account);
      // console.log('profile', profile);
      // console.log('email', email);
      // console.log('credentials', credentials);
      if (account && account.type === 'oauth' && user) {
        return true;
      }
      if (user && credentials) {
        if (user.emailVerified) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log('session', user, token);
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log('jwt:account', account);
      // console.log('jwt:token', token);
      // console.log('jwt:user', user);
      // console.log('jwt:profile', profile);
      // console.log('jwt:isNewUser', isNewUser);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  }
})