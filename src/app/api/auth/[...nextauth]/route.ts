import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";

require("dotenv").config();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { name, password } = credentials as {
          name: string;
          password: string;
        };

        try {
          await connectMongoDB();
          const user = await User.findOne({ name });

          if (!user) {
            return null;
          }

          const validPassword = await bcrypt.compare(password, user.password);

          if (!validPassword) {
            return null;
          }
          return user;
          
        } catch (err) {
          console.log("error ", err);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
