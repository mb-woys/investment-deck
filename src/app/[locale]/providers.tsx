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
    const now = new Date()

    return (
        <NextIntlClientProvider 
            messages={messages} 
            locale={locale}
            timeZone="UTC"
            now={now}
            formats={{
                dateTime: {
                    short: {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }
                }
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </NextIntlClientProvider>
    )
}