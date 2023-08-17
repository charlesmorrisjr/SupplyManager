import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function getEmployees(req: NextApiRequest, res: NextApiResponse) {
  const searchDate = String(req.headers.datevalue);
  const allEmployees = await prisma.employees.findMany({
    include: {
      trips: {
        select: {
          completion: true,
          start_time: true,
          end_time: true,
          standard_time: true,
        },
        where: {
          date: new Date(searchDate)
          // date: new Date('08-16-2023')
        }
      }
    },
  });
  res.json(allEmployees)
}