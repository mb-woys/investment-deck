import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES } from '@/routes'
import { Round } from '@prisma/client'

interface Company {
    id: string
    name: string
}

interface Investment {
    id: string
    companyId: string
    round: Round
    amount: number
    valuation: number
    equityPercentage: number
    date: string
    company: Company
}

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

export function useInvestments(locale: string, filters: InvestmentFilters = {}) {
    const queryParams = new URLSearchParams()
    if (filters.round && filters.round !== 'ALL') queryParams.append('round', filters.round)
    if (filters.year && filters.year !== 'ALL') queryParams.append('year', filters.year)

    return useQuery({
        queryKey: QUERY_KEYS.investmentFilters(filters),
        queryFn: async () => {
            const response = await fetch(`${API_ROUTES.investments.base(locale)}?${queryParams}`)
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to fetch investments')
            }
            return response.json() as Promise<Investment[]>
        }
    })
}

export function useAddInvestment(locale: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: InvestmentFormData) => {
            // Format the data before sending
            const formattedData = {
                ...data,
                amount: Number(data.amount),
                valuation: Number(data.valuation),
                equityPercentage: Number(data.equityPercentage),
                date: new Date(data.date).toISOString() 
            }

            const response = await fetch(API_ROUTES.investments.base(locale), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to add investment')
            }

            return response.json() as Promise<Investment>
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.investments })
        }
    })
}