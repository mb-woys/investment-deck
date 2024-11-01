'use client'

import { useState, useEffect } from 'react'
import { CompanyStatus } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { AddCompanyDialog } from './components/AddCompanyDialog'
import { CompanyCard } from './components/CompanyCard'
import { Spinner } from '@/components/ui/Spinner'
import { useCompanies, useAddCompany } from '@/hooks/useCompanies'

export const CompaniesPage = () => {
    const t = useTranslations('CompaniesPage')

    const [showAddDialog, setShowAddDialog] = useState(false)
    const [statusFilter, setStatusFilter] = useState<CompanyStatus | 'ALL'>('ALL')
    const [sectorFilter, setSectorFilter] = useState<string>('ALL')

    const { data: companies = [], isLoading, error } = useCompanies({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        sector: sectorFilter !== 'ALL' ? sectorFilter : undefined
    })
    
    const addCompanyMutation = useAddCompany()

    const sectors = ['ALL', ...new Set(companies.map(c => c.sector))]

    useEffect(() => {
        setSectorFilter('ALL')
    }, [statusFilter])

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
                    {companies.map((company) => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
                </div>
            )}

            {showAddDialog && (
                <AddCompanyDialog
                    onClose={() => setShowAddDialog(false)}
                    onSubmit={(data) => {
                        addCompanyMutation.mutate(data, {
                            onSuccess: () => setShowAddDialog(false)
                        })
                    }}
                    isSubmitting={addCompanyMutation.isPending}
                />
            )}
        </div>
    )
}
