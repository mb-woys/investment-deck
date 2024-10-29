import { prisma } from '@/lib/db'
import { DashboardPage } from './DashboardPage'

async function getDashboardData() {
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

export default async function Dashboard() {
  const initialData = await getDashboardData()
  return <DashboardPage initialData={initialData} />
}