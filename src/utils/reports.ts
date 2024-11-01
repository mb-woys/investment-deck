import { Company, Investment, Round } from '@prisma/client';

export const calculateMetrics = (data: { companies: Company[], investments: Investment[] }) => {
    const portfolioValue = data.companies.reduce((total, company) => {
        const latestInvestment = company.investments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return total + (latestInvestment?.valuation || 0);
    }, 0);

    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const startValue = data.companies.reduce((total, company) => {
        const investmentAtStart = company.investments
            .filter(inv => new Date(inv.date) < startOfYear)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return total + (investmentAtStart?.valuation || 0);
    }, 0);

    const ytdGrowth = startValue ? ((portfolioValue - startValue) / startValue) * 100 : 0;

    const roundTotals = data.investments.reduce((acc, inv) => {
        acc[inv.round] = (acc[inv.round] || 0) + inv.amount;
        return acc;
    }, {} as Record<Round, number>);

    const totalInvestment = Object.values(roundTotals).reduce((a, b) => a + b, 0);

    const roundDistribution = Object.entries(roundTotals).map(([round, amount]) => ({
        name: round,
        percentage: Math.round((amount / totalInvestment) * 100)
    }));

    const returnMultiples = data.companies.map(company => {
        const sortedInvestments = company.investments
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const initialInvestment = sortedInvestments[0];
        const latestInvestment = sortedInvestments[sortedInvestments.length - 1];

        return {
            name: company.name,
            multiple: initialInvestment && latestInvestment
                ? Number((latestInvestment.valuation / initialInvestment.valuation).toFixed(1))
                : 1.0
        };
    }).sort((a, b) => b.multiple - a.multiple);

    const years = [...new Set(data.investments.map(inv =>
        new Date(inv.date).getFullYear()
    ))].sort((a, b) => b - a);

    const yearlyPerformance = years.map(year => {
        const yearInvestments = data.investments.filter(inv =>
            new Date(inv.date).getFullYear() === year
        );

        const totalInvestments = yearInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const endValue = yearInvestments.reduce((sum, inv) => sum + inv.valuation, 0);
        const performance = totalInvestments ? ((endValue - totalInvestments) / totalInvestments) * 100 : 0;

        return {
            year,
            investments: Number(totalInvestments.toFixed(1)),
            returns: Number(endValue.toFixed(1)),
            performance: Number(performance.toFixed(1))
        };
    });

    return {
        portfolioValue: Number(portfolioValue.toFixed(1)),
        ytdGrowth: Number(ytdGrowth.toFixed(1)),
        activeCompanies: data.companies.filter(c => c.status === 'ACTIVE').length,
        roundDistribution,
        returnMultiples,
        yearlyPerformance
    };
};
