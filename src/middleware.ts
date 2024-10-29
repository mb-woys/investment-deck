import { NextRequest } from "next/server"
import createIntlMiddleware from 'next-intl/middleware'

const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    localePrefix: 'always'
})

export default function middleware(request: NextRequest) {
    return intlMiddleware(request)
}

export const config = {
    matcher: [
        '/((?!_next|_vercel|.*\\..*).*)'
    ]
}