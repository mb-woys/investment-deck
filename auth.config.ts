// import type { NextAuthConfig } from "next-auth"
// import Credentials from "next-auth/providers/credentials"

// export default {
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const { email, password } = credentials as { email: string; password: string }

//         if (email === "admin@contrary.com" && password === "password123") {
//           return {
//             id: "1",
//             email: "admin@contrary.com",
//             name: "Admin User",
//             role: "ADMIN"
//           }
//         }
//         return null
//       }
//     })
//   ],
//   pages: {
//     signIn: '/auth/login'
//   },
//   callbacks: {
//     async authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user
//       const isProtectedRoute = nextUrl.pathname.includes('/(protected)/')
      
//       // Restrict access to protected routes only if logged in
//       if (isProtectedRoute) {
//         return isLoggedIn
//       }
//       return true // Allow access to non-protected routes
//     }
//   }  
// } satisfies NextAuthConfig