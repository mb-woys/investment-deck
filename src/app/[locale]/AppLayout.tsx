'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { ROUTES } from '@/routes'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { signOut } from 'next-auth/react'
import { type Locale } from '@/i18n'

type AppLayoutProps = {
    children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const pathname = usePathname()
    const { locale } = useParams()
    const t = useTranslations('AppLayout.navigation')

    const handleSignOut = async () => {
        await signOut({ callbackUrl: `/${locale}/auth/login` })
    }

    const navigation = [
        { name: t('dashboard'), route: ROUTES.dashboard.route },
        { name: t('companies'), route: ROUTES.companies.route },
        { name: t('investments'), route: ROUTES.investments.route },
        { name: t('reports'), route: ROUTES.reports.route }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-semibold text-blue-600">Contrary</span>
                        </div>

                        <nav className="flex space-x-8">
                            {navigation.map((item) => {
                                const href = item.route({}, locale as Locale)
                                const isActive = pathname.startsWith(href)
                                return (
                                    <Link
                                        key={item.name}
                                        href={href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            isActive
                                                ? 'border-blue-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        <nav className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            {/* <button
                                onClick={handleSignOut}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {t('signOut')}
                            </button> */}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
