import { prisma } from '@/lib/db'
import { CompanyStatus } from '@prisma/client'

export async function getCompanies(status?: CompanyStatus, sector?: string) {
    const where = {
        ...(status && { status }),
        ...(sector && { sector })
    }

    return await prisma.company.findMany({
        where,
        include: {
            investments: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function createCompany(data: { name: string; sector: string; status: CompanyStatus }) {
    return await prisma.company.create({
        data,
        include: {
            investments: true
        }
    })
}
