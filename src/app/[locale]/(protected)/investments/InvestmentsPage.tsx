'use client'

import { useState } from 'react'
import { Round, Investment } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useInvestments, useAddInvestment } from '@/hooks/useInvestments'
import { AddInvestmentForm, type InvestmentFormData } from './components/AddInvestmentForm'
import { Spinner } from '@/components/ui/Spinner'

interface InvestmentsPageProps {
    initialInvestments: Investment[]
}

export const InvestmentsPage = ({ initialInvestments }: InvestmentsPageProps) => {
    const t = useTranslations('InvestmentsPage')
    const [showAddForm, setShowAddForm] = useState(false)
    const [roundFilter, setRoundFilter] = useState<Round | 'ALL'>('ALL')
    const [yearFilter, setYearFilter] = useState<string>('ALL')

    const { 
        data: investments = initialInvestments, 
        isLoading,
        error
    } = useInvestments({
        round: roundFilter !== 'ALL' ? roundFilter : undefined,
        year: yearFilter !== 'ALL' ? yearFilter : undefined
    })
    
    const addInvestment = useAddInvestment()

    const years = ['ALL', ...new Set(investments.map(i => 
        new Date(i.date).getFullYear().toString()
    ))].sort().reverse()

    const handleAddInvestment = async (data: InvestmentFormData) => {
        try {
            await addInvestment.mutateAsync(data)
            setShowAddForm(false)
        } catch (error) {
            console.error('Error adding investment:', error)
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <div className="flex flex-wrap gap-4">
                    <select
                        value={roundFilter}
                        onChange={(e) => setRoundFilter(e.target.value as Round | 'ALL')}
                        className="border rounded-lg px-3 py-2 text-gray-700"
                        disabled={isLoading}
                    >
                        <option value="ALL">{t('filters.allRounds')}</option>
                        {Object.values(Round).map(round => (
                            <option key={round} value={round}>
                                {round.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-gray-700"
                        disabled={isLoading}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button 
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                                 transition-colors disabled:bg-blue-300"
                        disabled={isLoading}
                    >
                        {t('filters.addInvestment')}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                'company',
                                'round',
                                'amount',
                                'valuation',
                                'equity',
                                'date'
                            ].map((headerKey) => (
                                <th 
                                    key={headerKey} 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 
                                             uppercase tracking-wider"
                                >
                                    {t(`tableHeaders.${headerKey}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <Spinner size="md" />
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4">
                                    <div className="text-center text-red-600">
                                        {error instanceof Error ? error.message : t('error')}
                                    </div>
                                </td>
                            </tr>
                        ) : investments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-700">
                                    {t('noInvestments')}
                                </td>
                            </tr>
                        ) : (
                            investments.map((investment) => (
                                <tr key={investment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {investment.company.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold 
                                                       rounded-full bg-blue-100 text-blue-800">
                                            {investment.round.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${investment.amount}M
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${investment.valuation}M
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {investment.equityPercentage}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(investment.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="max-w-2xl w-full">
                        <AddInvestmentForm 
                            onSubmit={handleAddInvestment}
                            onCancel={() => setShowAddForm(false)}
                            isSubmitting={addInvestment.isPending}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
