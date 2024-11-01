import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getInvestments, createInvestment } from './investmentRepository'

const InvestmentSchema = z.object({
    companyId: z.string(),
    round: z.enum(['SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C']),
    amount: z.number().positive(),
    valuation: z.number().positive(),
    equityPercentage: z.number().min(0).max(100),
    date: z.string().datetime()
})

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const round = searchParams.get('round') as 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C' | undefined
        const year = searchParams.get('year') || undefined

        const investments = await getInvestments(round, year)
        return NextResponse.json(investments)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch investments' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validation = InvestmentSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors },
                { status: 400 }
            )
        }

        // Convert date string to Date object
        const investmentData = { ...validation.data, date: new Date(validation.data.date) }
        const investment = await createInvestment(investmentData)

        return NextResponse.json(investment)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create investment' },
            { status: 500 }
        )
    }
}
