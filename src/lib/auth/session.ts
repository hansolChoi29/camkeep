import { NextAuthOptions } from "next-auth";
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
      async authorize(credentials) {
        // TODO: DB나 Supabase에서 사용자 확인 로직
        // 예시:
        // const user = await db.user.findUnique({ where: { email: credentials.email } })
        // if (user && await bcrypt.compare(credentials.password, user.hashedPassword)) {
        //   return { id: user.id.toString(), name: user.name, email: user.email };
        // }
        // return null;
        throw new Error("authorize 구현 필요");
      },
    }),
  ],

  // 2) 세션 관리 전략 (JWT 또는 데이터베이스)
  session: {
    strategy: "jwt", // jwt 기반 세션
  },

  // 3) 커스텀 로그인 페이지 경로
  pages: {
    signIn: "/auth/login",
  },

  // 4) (옵션) JWT에 사용자 정보를 담거나 세션에 노출할 필드 설정
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
