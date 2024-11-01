'use client'

import { useTranslations } from 'next-intl'
import { 
    CompanyWithInvestments,
    getLatestInvestment, 
    calculateReturnMultiple 
} from '@/hooks/useCompanies'

interface CompanyCardProps {
    company: CompanyWithInvestments
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
    const t = useTranslations('CompaniesPage')
    
    const latestInvestment = getLatestInvestment(company)
    const returnMultiple = calculateReturnMultiple(company)
    const initialInvestment = company.investments[0]

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            {/* Rest of your JSX remains the same */}
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
}