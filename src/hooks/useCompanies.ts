import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES } from '@/routes'
import { CompanyStatus } from '@prisma/client'

interface Company {
    id: string
    name: string
    sector: string
    status: CompanyStatus
    investments: Investment[]
}

interface Investment {
    id: string
    round: string
    amount: number
    valuation: number
    date: string
    equityPercentage: number
}

interface CompanyFilters {
    status?: CompanyStatus
    sector?: string
}

const QUERY_KEYS = {
    companies: ['companies'] as const,
    companyFilters: (filters: CompanyFilters) => [...QUERY_KEYS.companies, filters] as const,
}

export function useCompanies(locale: string, filters: CompanyFilters = {}) {
    const queryParams = new URLSearchParams()
    if (filters.status && filters.status !== 'ALL') queryParams.append('status', filters.status)
    if (filters.sector && filters.sector !== 'ALL') queryParams.append('sector', filters.sector)

    return useQuery({
        queryKey: QUERY_KEYS.companyFilters(filters),
        queryFn: async () => {
            const response = await fetch(`${API_ROUTES.companies.base(locale)}?${queryParams}`)
            if (!response.ok) throw new Error('Failed to fetch companies')
            return response.json() as Promise<Company[]>
        }
    })
}

export function useAddCompany(locale: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<Company, 'id' | 'investments'>) => {
            const response = await fetch(API_ROUTES.companies.base(locale), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!response.ok) throw new Error('Failed to add company')
            return response.json() as Promise<Company>
        },
        onSuccess: () => {
            // Invalidate and refetch companies queries
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companies })
        }
    })
}