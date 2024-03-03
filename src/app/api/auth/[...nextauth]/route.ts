import { PrismaAdapter } from '@auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import { prisma } from '@/lib/db/prisma'
import { Adapter } from 'next-auth/adapters'
import GoogeProvider from 'next-auth/providers/google'
import NextAuth from 'next-auth/next'
import { env } from '@/lib/env'
import { mergeAnonymoyusCartIntoUserCart } from '@/lib/db/carts'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogeProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: '1234',
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  events: {
    async signIn({ user }) {
      await mergeAnonymoyusCartIntoUserCart(user.id)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
