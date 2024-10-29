import defaultLocale from '@/i18n'
import { Providers } from './providers'
import { getMessages } from 'next-intl/server'
import './globals.css'

interface RootLayoutProps {
    children: React.ReactNode
    params: { locale: string }
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
    const locale = params.locale ?? defaultLocale

    const messages = await getMessages({ locale })

    return (
        <html lang={locale}>
            <body>
                <Providers locale={locale} messages={messages}>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
