import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// algo:
// - Get date from user selection through request headers
// - Convert date to format readable by prisma/database
// - Query database for all trips that match date

export default async function getTrips(req: NextApiRequest, res: NextApiResponse) {
  const searchDate = String(req.headers.datevalue);
  const allTrips = await prisma.trips.findMany({
    where: {
      // date: new Date(searchDate)
      date: new Date('08-09-2023')
    }
  });
  res.json(allTrips)
}