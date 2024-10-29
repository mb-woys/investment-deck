import { AppLayout } from '../AppLayout'
import { locales } from '../../../i18n'
import { notFound } from 'next/navigation'

import '../globals.css'

type ProtectedLayoutProps = {
    children: React.ReactNode
    params: { locale: string }
}

export const metadata = {
    title: 'Portfolio',
    description: 'Portfolio',
}

export default function ProtectedLayout({ children, params: { locale } }: ProtectedLayoutProps) {
    if (!locales.includes(locale as any)) notFound()

    return (
        <html lang={locale}>
            <body>
                <AppLayout>{children}</AppLayout>
            </body>
        </html>
    )
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}