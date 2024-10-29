import { PrismaClient, CompanyStatus, Round } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clean existing data
    await prisma.investment.deleteMany({})
    await prisma.company.deleteMany({})

    // Tech Companies
    const replit = await prisma.company.create({
        data: {
            name: 'Replit',
            sector: 'Developer Tools',
            status: CompanyStatus.ACTIVE,
        },
    })

    const anduril = await prisma.company.create({
        data: {
            name: 'Anduril',
            sector: 'Defense Technology',
            status: CompanyStatus.ACTIVE,
        },
    })

    const stytch = await prisma.company.create({
        data: {
            name: 'Stytch',
            sector: 'Authentication & Security',
            status: CompanyStatus.ACTIVE,
        },
    })

    const armada = await prisma.company.create({
        data: {
            name: 'Armada',
            sector: 'Logistics & Automation',
            status: CompanyStatus.ACTIVE,
        },
    })

    const zepto = await prisma.company.create({
        data: {
            name: 'Zepto',
            sector: 'Quick Commerce',
            status: CompanyStatus.ACTIVE,
        },
    })

    const ramp = await prisma.company.create({
        data: {
            name: 'Ramp',
            sector: 'FinTech',
            status: CompanyStatus.ACTIVE,
        },
    })

    // Create investments with realistic numbers and multiple rounds
    const investments = [
        // Replit Investments
        {
            companyId: replit.id,
            round: Round.SEED,
            amount: 1.5,
            valuation: 15.0,
            equityPercentage: 10,
            date: new Date('2022-01-15'),
        },
        {
            companyId: replit.id,
            round: Round.SERIES_A,
            amount: 5.0,
            valuation: 50.0,
            equityPercentage: 10,
            date: new Date('2022-08-20'),
        },
        {
            companyId: replit.id,
            round: Round.SERIES_B,
            amount: 15.0,
            valuation: 150.0,
            equityPercentage: 10,
            date: new Date('2023-04-10'),
        },

        // Anduril Investments
        {
            companyId: anduril.id,
            round: Round.SERIES_A,
            amount: 10.0,
            valuation: 100.0,
            equityPercentage: 10,
            date: new Date('2022-03-01'),
        },
        {
            companyId: anduril.id,
            round: Round.SERIES_B,
            amount: 30.0,
            valuation: 300.0,
            equityPercentage: 10,
            date: new Date('2023-02-15'),
        },

        // Stytch Investments
        {
            companyId: stytch.id,
            round: Round.SEED,
            amount: 2.0,
            valuation: 20.0,
            equityPercentage: 10,
            date: new Date('2022-06-10'),
        },
        {
            companyId: stytch.id,
            round: Round.SERIES_A,
            amount: 8.0,
            valuation: 80.0,
            equityPercentage: 10,
            date: new Date('2023-05-20'),
        },

        // Armada Investments
        {
            companyId: armada.id,
            round: Round.SEED,
            amount: 1.8,
            valuation: 18.0,
            equityPercentage: 10,
            date: new Date('2023-01-05'),
        },
        {
            companyId: armada.id,
            round: Round.SERIES_A,
            amount: 7.0,
            valuation: 70.0,
            equityPercentage: 10,
            date: new Date('2023-09-15'),
        },

        // Zepto Investments
        {
            companyId: zepto.id,
            round: Round.SERIES_A,
            amount: 12.0,
            valuation: 120.0,
            equityPercentage: 10,
            date: new Date('2022-11-30'),
        },
        {
            companyId: zepto.id,
            round: Round.SERIES_B,
            amount: 25.0,
            valuation: 250.0,
            equityPercentage: 10,
            date: new Date('2023-08-01'),
        },

        // Ramp Investments
        {
            companyId: ramp.id,
            round: Round.SEED,
            amount: 3.0,
            valuation: 30.0,
            equityPercentage: 10,
            date: new Date('2022-04-20'),
        },
        {
            companyId: ramp.id,
            round: Round.SERIES_A,
            amount: 10.0,
            valuation: 100.0,
            equityPercentage: 10,
            date: new Date('2023-03-10'),
        },
        {
            companyId: ramp.id,
            round: Round.SERIES_B,
            amount: 20.0,
            valuation: 200.0,
            equityPercentage: 10,
            date: new Date('2024-01-15'),
        },
    ]

    for (const investment of investments) {
        await prisma.investment.create({
            data: investment,
        })
    }

    console.log(`Seed data created successfully:
    - ${await prisma.company.count()} companies
    - ${await prisma.investment.count()} investments`
    )
}

main()
    .catch((e) => {
        console.error('Error seeding data:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })