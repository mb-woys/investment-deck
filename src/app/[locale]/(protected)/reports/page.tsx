import { prisma } from '@/lib/db'
import { ReportsPage } from './ReportsPage'

async function getPortfolioData() {
  const [companies, investments] = await Promise.all([
    prisma.company.findMany({
      include: {
        investments: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.investment.findMany({
      include: {
        company: true,
      },
      orderBy: {
        date: 'desc'
      }
    })
  ])

  return { companies, investments }
}

export default async function Reports() {
  const initialData = await getPortfolioData()
  return <ReportsPage initialData={initialData} />
}