import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

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
        const round = searchParams.get('round')
        const year = searchParams.get('year')

        const where = {
            ...(round && { round }),
            ...(year && { 
                date: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${parseInt(year) + 1}-01-01`)
                }
            })
        }

        const investments = await prisma.investment.findMany({
            where,
            include: {
                company: true,
            },
            orderBy: {
                date: 'desc'
            }
        })

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
        console.log('Received investment data:', body) // Debug log

        const validation = InvestmentSchema.safeParse(body)

        if (!validation.success) {
            console.error('Validation error:', validation.error.errors) // Debug log
            return NextResponse.json(
                { error: validation.error.errors },
                { status: 400 }
            )
        }

        // Parse date string to Date object for Prisma
        const investment = await prisma.investment.create({
            data: {
                ...validation.data,
                date: new Date(validation.data.date)
            },
            include: {
                company: true
            }
        })

        return NextResponse.json(investment)
    } catch (error) {
        console.error('Server error creating investment:', error) // Debug log
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create investment' },
            { status: 500 }
        )
    }
}