'use client'

import { useState } from 'react'
import { Round, Company } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { API_ROUTES } from '@/routes'
import { Spinner } from '@/components/ui/Spinner'

interface AddInvestmentFormProps {
    onSubmit: (data: InvestmentFormData) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export interface InvestmentFormData {
    companyId: string
    round: Round
    amount: number
    valuation: number
    equityPercentage: number
    date: string
}

export const AddInvestmentForm = ({ 
    onSubmit, 
    onCancel, 
    isSubmitting = false 
}: AddInvestmentFormProps) => {
    const { locale } = useParams()
    const t = useTranslations('AddInvestmentForm')

    const { data: companies = [] } = useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const response = await fetch('/api/companies')
            if (!response.ok) throw new Error(t('error'))
            return response.json() as Promise<Company[]>
        },
        initialData: []
    })

    const [formData, setFormData] = useState<InvestmentFormData>({
        companyId: companies[0]?.id || '',
        round: Round.SEED,
        amount: 0,
        valuation: 0,
        equityPercentage: 0,
        date: new Date().toISOString()
    })

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value)
        date.setHours(12)
        const isoString = date.toISOString()
        setFormData({ ...formData, date: isoString })
    }

    const displayDate = formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const submissionData = {
            ...formData,
            amount: Number(formData.amount),
            valuation: Number(formData.valuation),
            equityPercentage: Number(formData.equityPercentage),
        }
        
        onSubmit(submissionData)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{t('title')}</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labels.company')}
                    </label>
                    <select
                        required
                        value={formData.companyId}
                        onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500 
                                 text-gray-900 placeholder-gray-500 
                                 disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isSubmitting}
                    >
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labels.round')}
                    </label>
                    <select
                        value={formData.round}
                        onChange={(e) => setFormData({ ...formData, round: e.target.value as Round })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500
                                 text-gray-900 placeholder-gray-500 
                                 disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isSubmitting}
                    >
                        {Object.values(Round).map(round => (
                            <option key={round} value={round}>
                                {round.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labels.amount')}
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.1"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500
                                 text-gray-900 placeholder-gray-500 
                                 disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isSubmitting}
                        placeholder={t('placeholders.amount')}
                    />
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labels.valuation')}
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.1"
                        value={formData.valuation}
                        onChange={(e) => setFormData({ ...formData, valuation: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500
                                 text-gray-900 placeholder-gray-500 
                                 disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isSubmitting}
                        placeholder={t('placeholders.valuation')}
                    />
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labels.equity')}
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.equityPercentage}
                        onChange={(e) => setFormData({ ...formData, equityPercentage: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500
                                 text-gray-900 placeholder-gray-500 
                                 disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isSubmitting}
                        placeholder={t('placeholders.equity')}
                    />
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labels.date')}
                    </label>
                    <input
                        type="date"
                        required
                        value={displayDate}
                        onChange={handleDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500
                                 text-gray-900 placeholder-gray-500 
                                 disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={isSubmitting}
                    />
                </div>
            </div>
    
            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 
                             hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {t('buttons.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                             transition-colors disabled:bg-blue-400 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Spinner size="sm" />
                            <span>{t('buttons.adding')}</span>
                        </>
                    ) : (
                        t('buttons.add')
                    )}
                </button>
            </div>
        </form>
    )    
}
