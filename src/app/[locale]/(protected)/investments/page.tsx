import { prisma } from '@/lib/db'
import { InvestmentsPage } from './InvestmentsPage'

async function getInvestments() {
  const investments = await prisma.investment.findMany({
    include: {
      company: true,
    },
    orderBy: {
      date: 'desc'
    }
  })
  return investments
}

export default async function Investments() {
  const initialInvestments = await getInvestments()
  return <InvestmentsPage initialInvestments={initialInvestments} />
}