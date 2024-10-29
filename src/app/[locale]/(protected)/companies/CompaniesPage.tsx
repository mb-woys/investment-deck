'use client'

import { useState } from 'react'
import { CompanyStatus } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AddCompanyDialog } from './components/AddCompanyDialog'
import { API_ROUTES } from '@/routes'
import { Spinner } from '@/components/ui/Spinner'

interface Investment {
    id: string
    round: string
    amount: number
    valuation: number
    date: string
    equityPercentage: number
}

interface Company {
    id: string
    name: string
    sector: string
    status: CompanyStatus
    investments: Investment[]
}

export const CompaniesPage = () => {
    const t = useTranslations('CompaniesPage')
    const { locale } = useParams()
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [statusFilter, setStatusFilter] = useState<CompanyStatus | 'ALL'>('ALL')
    const [sectorFilter, setSectorFilter] = useState<string>('ALL')

    const queryClient = useQueryClient()

    const { data: companies = [], isLoading, error } = useQuery({
        queryKey: ['companies', statusFilter, sectorFilter],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (statusFilter !== 'ALL') params.append('status', statusFilter)
            if (sectorFilter !== 'ALL') params.append('sector', sectorFilter)
            
            const response = await fetch(`${API_ROUTES.companies.base(locale as string)}?${params}`)
            if (!response.ok) throw new Error(t('errors.fetchError'))
            return response.json()
        }
    })

    const addCompanyMutation = useMutation({
        mutationFn: async (data: Omit<Company, 'id' | 'investments'>) => {
            const response = await fetch(API_ROUTES.companies.base(locale as string), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!response.ok) throw new Error(t('errors.createCompany'))
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] })
            setShowAddDialog(false)
        }
    })

    const getLatestInvestment = (company: Company) => {
        return company.investments.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]
    }

    const calculateReturnMultiple = (company: Company) => {
        const latestInvestment = getLatestInvestment(company)
        const initialInvestment = company.investments[0]
        if (!latestInvestment || !initialInvestment) return 1

        return latestInvestment.valuation / initialInvestment.valuation
    }

    // Get unique sectors for filter
    const sectors = ['ALL', ...new Set(companies.map(c => c.sector))]

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('header.title')} ({companies.length})</h1>
                <div className="flex flex-wrap gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as CompanyStatus | 'ALL')}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                        disabled={isLoading}
                    >
                        <option value="ALL">{t('filters.allStatuses')}</option>
                        {Object.values(CompanyStatus).map(status => (
                            <option key={status} value={status}>{t(`statuses.${status.toLowerCase()}`)}</option>
                        ))}
                    </select>
                    <select
                        value={sectorFilter}
                        onChange={(e) => setSectorFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                        disabled={isLoading}
                    >
                        {sectors.map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                        ))}
                    </select>
                    <button 
                        onClick={() => setShowAddDialog(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                    >
                        {t('header.addCompany')}
                    </button>
                </div>
            </div>
    
            {isLoading && companies.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error instanceof Error ? error.message : t('errors.fetchError')}</span>
                </div>
            ) : companies.length === 0 ? (
                <div className="text-center py-12 text-gray-700">
                    {t('header.noCompanies')}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => {
                        const latestInvestment = getLatestInvestment(company)
                        const returnMultiple = calculateReturnMultiple(company)
                        const initialInvestment = company.investments[0]
    
                        return (
                            <div key={company.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                                        <p className="text-sm text-gray-700">{company.sector}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        company.status === 'ACQUIRED' ? 'bg-blue-100 text-blue-800' :
                                        company.status === 'IPO' ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {t(`statuses.${company.status.toLowerCase()}`)}
                                    </span>
                                </div>
    
                                <div className="space-y-2">
                                    {initialInvestment && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">{t('filters.initialInvestment')}</span>
                                            <span className="font-medium text-gray-900">${initialInvestment.amount}M</span>
                                        </div>
                                    )}
                                    {latestInvestment && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">{t('filters.currentValuation')}</span>
                                                <span className="font-medium text-gray-900">${latestInvestment.valuation}M</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">{t('filters.latestRound')}</span>
                                                <span className="font-medium text-gray-900">{latestInvestment.round}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
    
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">{t('filters.returnMultiple')}</span>
                                        <span className={`font-semibold ${
                                            returnMultiple > 1 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {returnMultiple.toFixed(1)}x
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
    
            {showAddDialog && (
                <AddCompanyDialog
                    onClose={() => setShowAddDialog(false)}
                    onSubmit={(data) => addCompanyMutation.mutate(data)}
                    isSubmitting={addCompanyMutation.isPending}
                />
            )}
        </div>
    )    
}
