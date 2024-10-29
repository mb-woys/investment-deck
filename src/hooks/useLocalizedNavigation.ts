'use client'

import { useParams, useRouter } from 'next/navigation'
import { type Locale } from '@/i18n'

export const useLocalizedNavigation = () => {
    const router = useRouter()
    const { locale } = useParams()

    const navigate = (route: (params?: any, locale?: Locale) => string) => {
        const path = route({}, locale as Locale)
        router.push(path)
    }

    return { navigate }
}