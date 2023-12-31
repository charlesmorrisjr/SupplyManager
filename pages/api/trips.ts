import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// algo:
// - Get date from user selection through request headers
// - Convert date to format readable by prisma/database
// - Query database for all trips that match date

export default async function getTrips(req: NextApiRequest, res: NextApiResponse) {
  const searchDate = String(req.body.datevalue);

  const allTrips = await prisma.trips.findMany({
    include: {
      employees: {
        select: {
          username: true
        }
      },
    },
    where: {
      date: new Date(searchDate)
    }
  });
  res.json(allTrips)
}