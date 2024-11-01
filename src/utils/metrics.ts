import { Company, Investment, CompanyStatus } from '@prisma/client';

export const calculateMetrics = (companies: Company[], investments: Investment[]) => {
    const portfolioValue = companies.reduce((total, company) => {
        const latestInvestment = company.investments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return total + (latestInvestment?.valuation || 0);
    }, 0);

    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const startValue = companies.reduce((total, company) => {
        const investmentAtStart = company.investments
            .filter(inv => new Date(inv.date) < startOfYear)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return total + (investmentAtStart?.valuation || 0);
    }, 0);

    const ytdGrowth = startValue ? ((portfolioValue - startValue) / startValue) * 100 : 0;
    const latestInvestment = investments[0];
    const activeCompanies = companies.filter(c => c.status === CompanyStatus.ACTIVE).length;
    const roundsCount = new Set(investments.map(i => i.round)).size;

    return {
        portfolioValue: Number(portfolioValue.toFixed(1)),
        ytdGrowth: Number(ytdGrowth.toFixed(1)),
        activeCompanies,
        roundsCount,
        latestInvestment
    };
};

export const prepareChartData = (investments: Investment[]) => {
    const monthlyData = investments.reduce((acc, inv) => {
        const date = new Date(inv.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
            acc[monthKey] = {
                month: monthKey,
                totalInvestment: 0,
                totalValuation: 0,
                investmentCount: 0
            };
        }
        
        acc[monthKey].totalInvestment += inv.amount;
        acc[monthKey].totalValuation += inv.valuation;
        acc[monthKey].investmentCount++;
        
        return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};
