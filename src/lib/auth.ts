import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("AUTH: Missing credentials");
            return null;
          }
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            console.log("AUTH: User not found:", credentials.email);
            return null;
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log("AUTH: Invalid password for", credentials.email);
            return null;
          }
          console.log("AUTH: Success for", user.email);
          return { id: user.id, email: user.email, name: user.name || "", role: user.role };
        } catch (e: any) {
          console.error("AUTH ERROR:", e.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = (user as any).role; token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { (session.user as any).role = token.role; (session.user as any).id = token.id; }
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "oniii-secret-change-in-production",
};
