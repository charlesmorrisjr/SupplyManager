import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// algo:
// - Get date from user selection through request headers
// - Convert date to format readable by prisma/database
// - Query database for all trips that match date

export default async function getTrips(req: NextApiRequest, res: NextApiResponse) {
  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: string) => new Date(new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0]);

  const searchDate = parseDate(String(req.headers.datevalue));

  const allTrips = await prisma.trips.findMany({
    include: {
      employees: {
        select: {
          username: true
        }
      },
      trip_details: {
        select: {
          items: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      date: searchDate
    }
  });
  res.json(allTrips)
}