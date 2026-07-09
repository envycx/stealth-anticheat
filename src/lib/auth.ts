import NextAuth, { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { z } from "zod"

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        // Find user by email or username
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: email },
              { username: email }, // Allow login with username
            ],
          },
        })

        if (!user) return null

        // Verify password
        const passwordsMatch = await compare(password, user.passwordHash)

        if (!passwordsMatch) return null

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.avatarUrl,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to JWT on sign in
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? 'user'
        token.twoFactorEnabled = (user as any).twoFactorEnabled ?? false
      }
      return token
    },
    async session({ session, token }) {
      // Add user info to session
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
        (session.user as any).twoFactorEnabled = token.twoFactorEnabled as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to get session in API routes (NextAuth v4 pattern)
export const auth = () => getServerSession(authOptions)
