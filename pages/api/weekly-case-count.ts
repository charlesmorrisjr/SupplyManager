import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Gets total cases per day for the past week
export default async function getWeeklyCases(req: NextApiRequest, res: NextApiResponse) {
  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: string) => new Date(new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0]);

  // Start date is 6 days before the end date (gets the past week)
  const endDate = parseDate(String(req.body.datevalue));
  const startDate = new Date(new Date(endDate).setDate(endDate.getDate() - 6));

  // // Function to extract the month and day from a date in the format of MM/DD
  // const getMonthDay = (date: Date) => {
  //   let month = date.getMonth() + 1;
  //   let day = date.getDate() + 1;
  //   return `${month}/${day}`;
  // }

  let caseCount = [];

  for (let datevalue = startDate; datevalue <= endDate; datevalue.setDate(datevalue.getDate() + 1)) {
    // Make a copy, otherwise the date will be the same for all objects in the array
    let datevalueCopy = String(datevalue)

    caseCount.push({
      trips: await prisma.trips.aggregate({
        _sum: {
          total_cases: true
        },
        where: {
          date: datevalue
        }
      }),
      date: datevalueCopy
    });
  }
  res.json(caseCount)
}