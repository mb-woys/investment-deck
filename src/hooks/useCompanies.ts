import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES } from '@/routes'
import { CompanyStatus, Company, Investment } from '@prisma/client'
import { useTranslations } from 'next-intl'

export interface CompanyWithInvestments extends Company {
    investments: Investment[]
}

interface CompanyFilters {
    status?: CompanyStatus
    sector?: string
}

const QUERY_KEYS = {
    companies: ['companies'] as const,
    companyFilters: (filters: CompanyFilters) => [...QUERY_KEYS.companies, filters] as const,
}

export const getLatestInvestment = (company: CompanyWithInvestments) => {
    return company.investments.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
}

export const calculateReturnMultiple = (company: CompanyWithInvestments) => {
    const latestInvestment = getLatestInvestment(company)
    const initialInvestment = company.investments[0]
    if (!latestInvestment || !initialInvestment) return 1

    return latestInvestment.valuation / initialInvestment.valuation
}

export function useCompanies(filters: CompanyFilters = {}) {
    const t = useTranslations('CompaniesPage')

    return useQuery({
        queryKey: QUERY_KEYS.companyFilters(filters),
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters.status && filters.status !== 'ALL') params.append('status', filters.status)
            if (filters.sector && filters.sector !== 'ALL') params.append('sector', filters.sector)
            
            const response = await fetch(`/api/companies?${params}`)
            if (!response.ok) throw new Error(t('errors.fetchError'))
            return response.json() as Promise<CompanyWithInvestments[]>
        }
    })
}

export function useAddCompany() {
    const t = useTranslations('CompaniesPage')
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<Company, 'id' | 'investments'>) => {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!response.ok) throw new Error(t('errors.createCompany'))
            return response.json() as Promise<CompanyWithInvestments>
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companies })
        }
    })
}