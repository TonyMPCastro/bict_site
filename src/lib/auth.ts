import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@bict.com" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obrigatórios");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { permissoes: true }
        });

        if (!user) {
          throw new Error("Credenciais inválidas");
        }

        if (!user.ativo) {
          throw new Error("Sua conta está inativa. Entre em contato com a administração.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.senha);

        if (!isPasswordValid) {
          throw new Error("Credenciais inválidas");
        }

        // Atualizar ultimoAcesso no banco de dados
        try {
          await db.user.update({
            where: { id: user.id },
            data: { ultimoAcesso: new Date() }
          });
        } catch (e) {
          console.error("Erro ao atualizar último acesso:", e);
        }

        const permissoesList = user.permissoes.map((p) => p.permissao);

        return {
          id: user.id,
          email: user.email,
          name: user.nome,
          role: user.role,
          permissoes: permissoesList
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissoes = user.permissoes || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissoes = (token.permissoes as string[]) || [];
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
};
