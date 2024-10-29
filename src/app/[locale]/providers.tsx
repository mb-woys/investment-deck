'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useState } from 'react'
import type { AbstractIntlMessages } from 'next-intl'

interface ProvidersProps {
    messages: AbstractIntlMessages;
    locale: string
    children: ReactNode
}

export const Providers = ({ messages, locale, children }: ProvidersProps) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </NextIntlClientProvider>
    )
}