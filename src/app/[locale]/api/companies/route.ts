import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCompanies, createCompany } from './companyRepository'

const CompanySchema = z.object({
    name: z.string(),
    sector: z.string(),
    status: z.enum(['ACTIVE', 'ACQUIRED', 'IPO', 'DEFUNCT'])
})

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') as 'ACTIVE' | 'ACQUIRED' | 'IPO' | 'DEFUNCT' | undefined
        const sector = searchParams.get('sector') || undefined

        const companies = await getCompanies(status, sector)
        return NextResponse.json(companies)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch companies' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validation = CompanySchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors },
                { status: 400 }
            )
        }

        const company = await createCompany(validation.data)
        return NextResponse.json(company)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create company' },
            { status: 500 }
        )
    }
}
