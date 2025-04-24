import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // 1) 로그인·회원가입에 사용할 인증 제공자(provider)
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "이메일", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      // credentials 매개변수를 사용하지 않지만, NextAuth 타입에 필요하므로
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials) {
        // TODO: DB나 Supabase에서 사용자 확인 로직 구현
        throw new Error("authorize 구현 필요");
      },
    }),
  ],

  // 2) 세션 관리 전략 (JWT)
  session: {
    strategy: "jwt",
  },

  // 3) 커스텀 로그인 페이지 경로
  pages: {
    signIn: "/auth/login",
  },

  // 4) JWT·세션 콜백 설정
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as Session["user"];
      return session;
    },
  },

  // 5) 시크릿
  secret: process.env.NEXTAUTH_SECRET,
};
