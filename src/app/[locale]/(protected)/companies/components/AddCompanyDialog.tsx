'use client'

import { useState } from 'react'
import { CompanyStatus } from '@prisma/client'
import { Spinner } from '@/components/ui/Spinner'
import { useTranslations } from 'next-intl'

interface AddCompanyDialogProps {
    onClose: () => void
    onSubmit: (company: { name: string; sector: string; status: CompanyStatus }) => void
    isSubmitting?: boolean
}

export const AddCompanyDialog = ({ onClose, onSubmit, isSubmitting = false }: AddCompanyDialogProps) => {
    const t = useTranslations('AddCompanyDialog')
    const [formData, setFormData] = useState({
        name: '',
        sector: '',
        status: CompanyStatus.ACTIVE
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-900">{t('title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labels.companyName')}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                     focus:outline-none focus:ring-1 focus:ring-blue-500 
                                     text-gray-900 placeholder-gray-500 
                                     disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={isSubmitting}
                            placeholder={t('placeholders.companyName')}
                        />
                    </div>
    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labels.sector')}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.sector}
                            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                     focus:outline-none focus:ring-1 focus:ring-blue-500 
                                     text-gray-900 placeholder-gray-500 
                                     disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={isSubmitting}
                            placeholder={t('placeholders.sector')}
                        />
                    </div>
    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labels.status')}
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as CompanyStatus })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                     focus:outline-none focus:ring-1 focus:ring-blue-500
                                     text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={isSubmitting}
                        >
                            {Object.values(CompanyStatus).map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
    
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
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
                                t('buttons.addCompany')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )    
}
