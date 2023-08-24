import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const completionStatus = ["Unassigned", "Assigned", "Completed"];

// Gets total trips per day for the past week
export default async function getTripCompletion(req: NextApiRequest, res: NextApiResponse) {
  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: string) => new Date(new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0]);

  const searchDate = parseDate(String(req.headers.datevalue));

  // console.log(startDate, endDate)

  // const avgPerformance = await prisma.trips.aggregate({
  //   _avg: {
  //     performance: true
  //   },
  //   _count: {
  //     id: true
  //   },
  //   where: {
  //     date: {
  //       gte: startDate,
  //       lte: endDate
  //     }
  //   }
  // });

  let completionCount = [];

  for (let completion = 0; completion <= 2; completion++) {
    completionCount.push({
      value: await prisma.trips.count({    
        where: {
          date: searchDate,
          completion: completion
        }
      }),
      name: completionStatus[completion]
    });
  }
  res.json(completionCount)
}