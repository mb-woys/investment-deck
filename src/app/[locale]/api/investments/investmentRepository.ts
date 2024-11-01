import { prisma } from '@/lib/db'
import { Round } from '@prisma/client'

export async function getInvestments(round?: Round, year?: string) {
    const where = {
        ...(round && { round }),
        ...(year && {
            date: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${parseInt(year) + 1}-01-01`)
            }
        })
    }

    return await prisma.investment.findMany({
        where,
        include: {
            company: true,
        },
        orderBy: {
            date: 'desc'
        }
    })
}

export async function createInvestment(data: {
    companyId: string
    round: Round
    amount: number
    valuation: number
    equityPercentage: number
    date: Date
}) {
    return await prisma.investment.create({
        data,
        include: {
            company: true
        }
    })
}
