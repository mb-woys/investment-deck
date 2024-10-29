// import NextAuth from "next-auth"
// import authConfig from "./auth.config"

// export const {
//   auth,
//   signIn,
//   signOut,
//   handlers: { GET, POST }
// } = NextAuth({
//   ...authConfig,
//   pages: {
//     signIn: "/auth/login"
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role
//       }
//       return session
//     }
//   }
// })