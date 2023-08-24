import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function getTopPerformers(req: NextApiRequest, res: NextApiResponse) {
  // Get current date with time in format YYYY-MM-DDT00:00:00Z
  const searchDate = new Date(new Date().setHours(0,0,0,0))
  
  const allEmployees = await prisma.employees.findMany({
    include: {
      trips: {
        select: {
          completion: true,
          performance: true,
        },
        where: {
          date: searchDate
        }
      }
    },
  });
  res.json(allEmployees)
}