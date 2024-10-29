import { prisma } from '@/lib/db'
import { CompaniesPage } from './CompaniesPage'

async function getCompanies() {
  const companies = await prisma.company.findMany({
    include: {
      investments: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return companies
}

export default async function Companies() {
  const initialCompanies = await getCompanies()
  
  return <CompaniesPage initialCompanies={initialCompanies} />
}