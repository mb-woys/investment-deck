// import { NextResponse } from 'next/server'
// import { auth } from '../../auth'
// import { locales } from '@/i18n'

// export async function withAuth(request: Request) {
//     const session = await auth()
//     const pathname = new URL(request.url).pathname
  
//     // Identify locale and check if route is protected
//     const locale = locales.find(locale => pathname.startsWith(`/${locale}/`)) || 'en'
//     const isProtectedRoute = pathname.includes('/(protected)/')
    
//     // Redirect to login if accessing protected route without session
//     if (isProtectedRoute && !session) {
//       return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
//     }
  
//     // Redirect to dashboard if trying to access login page while authenticated
//     if (pathname.includes('/auth/login') && session) {
//       return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
//     }
  
//     return NextResponse.next()
//   }
  