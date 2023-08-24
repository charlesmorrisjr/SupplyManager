import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Gets total trips per day for the past week
export default async function getWeeklyPerformance(req: NextApiRequest, res: NextApiResponse) {
  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: string) => new Date(new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0]);

  // Start date is 6 days before the end date (gets the past week)
  const endDate = parseDate(String(req.headers.datevalue));
  const startDate = new Date(new Date(endDate).setDate(endDate.getDate() - 6));

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

  // Function to extract the month and day from a date in the format of MM/DD
  const getMonthDay = (date: Date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${month}/${day}`;
  }

  let tripCount = [];

  for (let datevalue = startDate; datevalue <= endDate; datevalue.setDate(datevalue.getDate() + 1)) {
    tripCount.push({
      trips: await prisma.trips.count({    
        where: {
          date: datevalue
        }
      }),
      date: getMonthDay(datevalue)
    });
  }
  res.json(tripCount)
}