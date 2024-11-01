'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/routes'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useLocalizedNavigation } from '@/hooks/useLocalizedNavigation'

type AppLayoutProps = {
    children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const pathname = usePathname()
    const t = useTranslations('AppLayout.navigation')
    const { navigate } = useLocalizedNavigation()

    const navigation = [
        { name: t('dashboard'), route: () => navigate(ROUTES.dashboard.route) },
        { name: t('companies'), route: () => navigate(ROUTES.companies.route) },
        { name: t('investments'), route: () => navigate(ROUTES.investments.route) },
        { name: t('reports'), route: () => navigate(ROUTES.reports.route) }
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
                                const isActive = pathname.includes(item.name.toLowerCase())
                                return (
                                    <button
                                        key={item.name}
                                        onClick={item.route}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            isActive
                                                ? 'border-blue-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                )
                            })}
                        </nav>

                        <nav className="flex items-center">
                            <LanguageSwitcher />
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