'use client'

import { Company, Investment } from '@prisma/client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { LineChart, Line } from 'recharts'
import { calculateMetrics, prepareChartData } from '@/utils/metrics';
import { useTranslations } from 'next-intl'

interface DashboardPageProps {
    initialData: {
        companies: Company[]
        investments: Investment[]
    }
}

export const DashboardPage = ({ initialData }: DashboardPageProps) => {
    const { companies, investments } = initialData
    const t = useTranslations('DashboardPage')

    const metrics = calculateMetrics(companies, investments);
    const chartData = prepareChartData(investments);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-700 text-sm">{t('metrics.portfolioValue')}</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-800">${metrics.portfolioValue}M</p>
                    <p className={`${metrics.ytdGrowth >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                        {metrics.ytdGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.ytdGrowth)}% {t('metrics.ytdGrowth')}
                    </p>
                </div>
    
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-700 text-sm">{t('metrics.activeInvestments')}</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-800">{metrics.activeCompanies}</p>
                    <p className="text-gray-700 mt-1">{t('metrics.roundsCount', { roundsCount: metrics.roundsCount })}</p>
                </div>
    
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-700 text-sm">{t('metrics.latestInvestment')}</h3>
                    {metrics.latestInvestment && (
                        <>
                            <p className="text-2xl font-bold mt-2 text-gray-800">{t('metrics.amount', { amount: metrics.latestInvestment.amount })}</p>
                            <p className="text-gray-700 mt-1">
                                {t('metrics.roundCompany', { round: metrics.latestInvestment.round, company: metrics.latestInvestment.company.name })}
                            </p>
                        </>
                    )}
                </div>
            </div>
    
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-700">{t('charts.portfolioGrowth')}</h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                                type="monotone" 
                                dataKey="totalValuation" 
                                name={t('metrics.portfolioValue')} 
                                stroke="#3b82f6" 
                                fill="#93c5fd" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
    
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-700">{t('recentInvestments')}</h2>
                <div className="space-y-4">
                    {investments.slice(0, 5).map((investment) => (
                        <div
                            key={investment.id}
                            className="flex justify-between items-center p-4 border-b"
                        >
                            <div>
                                <h4 className="font-medium text-gray-700">{investment.company.name}</h4>
                                <p className="text-gray-700">{investment.round}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-800">${investment.amount}M</p>
                                <p className="text-gray-700">
                                    {new Date(investment.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-700">{t('charts.investmentActivity')}</h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                                type="monotone" 
                                dataKey="investmentCount" 
                                name={t('recentInvestments')} 
                                stroke="#3b82f6" 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )       
}
