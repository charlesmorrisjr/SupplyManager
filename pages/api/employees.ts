import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function getEmployees(req: NextApiRequest, res: NextApiResponse) {
  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: string) => new Date(new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0]);

  const searchDate = parseDate(String(req.headers.datevalue));

  const allEmployees = await prisma.employees.findMany({
    include: {
      trips: {
        select: {
          completion: true,
          start_time: true,
          end_time: true,
          standard_time: true,
          performance: true,
          cases_picked: true,
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