import { DefaultUser } from 'next-auth';
declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & { role: string };
    }
    interface User extends DefaultUser {
        role: string;
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}