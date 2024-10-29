import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  
  interface Session {
    user: User & {
      role?: string
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string
  }
}