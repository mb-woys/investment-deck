import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Round, Investment } from '@prisma/client'
import { useTranslations } from 'next-intl'

export interface InvestmentFormData {
    companyId: string
    round: Round
    amount: number
    valuation: number
    equityPercentage: number
    date: string
}

interface InvestmentFilters {
    round?: Round
    year?: string
}

const QUERY_KEYS = {
    investments: ['investments'] as const,
    investmentFilters: (filters: InvestmentFilters) => [...QUERY_KEYS.investments, filters] as const,
}

export function useInvestments(filters: InvestmentFilters = {}) {
    const t = useTranslations('InvestmentsPage')

    return useQuery({
        queryKey: QUERY_KEYS.investmentFilters(filters),
        queryFn: async () => {
            const queryParams = new URLSearchParams()
            if (filters.round && filters.round !== 'ALL') queryParams.append('round', filters.round)
            if (filters.year && filters.year !== 'ALL') queryParams.append('year', filters.year)

            const response = await fetch(`/api/investments?${queryParams}`)
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || t('errors.fetchError'))
            }
            return response.json() as Promise<Investment[]>
        }
    })
}

export function useAddInvestment() {
    const t = useTranslations('InvestmentsPage')
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: InvestmentFormData) => {
            const formattedData = {
                ...data,
                amount: Number(data.amount),
                valuation: Number(data.valuation),
                equityPercentage: Number(data.equityPercentage),
                date: new Date(data.date).toISOString() 
            }

            const response = await fetch('/api/investments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || t('errors.addError'))
            }

            return response.json() as Promise<Investment>
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.investments })
        }
    })
}