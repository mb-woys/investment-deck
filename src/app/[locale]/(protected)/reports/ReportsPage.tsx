'use client'

import { useMemo, useState } from 'react'
import { Company, Investment } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { calculateMetrics } from '@/utils/reports'

interface ReportsPageProps {
    initialData: {
        companies: Company[]
        investments: Investment[]
    }
}

export const ReportsPage = ({ initialData }: ReportsPageProps) => {
    const t = useTranslations('ReportsPage')

    const metrics = useMemo(() => calculateMetrics(initialData), [initialData]);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm text-gray-700">{t('summary.portfolioValue')}</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-900">${metrics.portfolioValue}M</p>
                    <p className={`text-sm ${metrics.ytdGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metrics.ytdGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.ytdGrowth)}% {t('summary.ytdGrowth')}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm text-gray-700">{t('summary.activeCompanies')}</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-900">{metrics.activeCompanies}</p>
                    <p className="text-gray-700 text-sm">{t('summary.currentPortfolio')}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm text-gray-700">{t('summary.totalInvestments')}</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-900">
                        ${metrics.yearlyPerformance.reduce((sum, year) => sum + year.investments, 0)}M
                    </p>
                    <p className="text-gray-700 text-sm">{t('summary.allTime')}</p>
                </div>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('distribution.investmentByRound')}</h3>
                    <div className="space-y-4">
                        {metrics.roundDistribution.map((round) => (
                            <div key={round.name}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-900">{round.name}</span>
                                    <span className="text-sm font-medium text-gray-900">{round.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${round.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('distribution.returnMultiple')}</h3>
                    <div className="space-y-3">
                        {metrics.returnMultiples.map((company) => (
                            <div key={company.name} className="flex justify-between items-center">
                                <span className="text-sm text-gray-900">{company.name}</span>
                                <span className={`font-medium ${
                                    company.multiple >= 1 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {company.multiple}x
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('performance.title')}</h3>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-sm font-medium text-gray-700 pb-3">{t('performance.year')}</th>
                            <th className="text-left text-sm font-medium text-gray-700 pb-3">{t('performance.investments')}</th>
                            <th className="text-left text-sm font-medium text-gray-700 pb-3">{t('performance.returns')}</th>
                            <th className="text-left text-sm font-medium text-gray-700 pb-3">{t('performance.performance')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.yearlyPerformance.map((year) => (
                            <tr key={year.year}>
                                <td className="py-3 text-gray-900">{year.year}</td>
                                <td className="py-3 text-gray-900">${year.investments}M</td>
                                <td className="py-3 text-gray-900">${year.returns}M</td>
                                <td className="py-3">
                                    <span className={`${
                                        year.performance >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {year.performance >= 0 ? '↑' : '↓'} {Math.abs(year.performance)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
