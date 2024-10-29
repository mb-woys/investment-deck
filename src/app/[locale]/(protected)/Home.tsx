'use client'

import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'

const Home: FC = () => {
    const t = useTranslations('home')

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t('title')}
                    </h1>
                </div>
                <div className="mt-4">
                    <p className="text-lg text-gray-500">
                        {t('description')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home