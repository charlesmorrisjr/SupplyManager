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
  
  // // This function converts milliseconds to a time format of HH:MM:SS
  // // Used for calculating standard time
  // const convertMillisecondsToTime = (ms: number) => {
  //   const MS_PER_HOUR = 1000 * 60 * 60;

  //   let hours = Math.floor(ms / 1000 / 60 / 60);
  //   let minutes = Math.floor((ms - (hours * MS_PER_HOUR)) / 1000 / 60);
  //   let seconds = Math.floor((ms - (hours * MS_PER_HOUR) - (minutes * 1000 * 60)) / 1000);
  //   const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  //   return formattedTime;
  // }

  // // Add additional properties to each employee object so the table can sort them properly
  // allEmployees.forEach((employee: any) => {
  //   employee.casesPicked = employee.trips.reduce((total: number, trip: any) => trip.completion ? total + Number(trip.cases_picked) : total, 0);
  //   employee.totalStandardTime = convertMillisecondsToTime(employee.trips.reduce((total: number, trip: any) => trip.completion === 2 ? total + new Date(trip.standard_time).getTime() : total, 0));

  //   // Get number of completed trips
  //   let completedTrips = employee.trips.filter((trip: any) => trip.completion === 2).length;

  //   // Check if employee actually completed any trips
  //   if (completedTrips > 0) {
      
  //     // Calculate average performance by adding up all performance values and dividing by number of completed trips
  //     employee.avgPerformance = (employee.trips.reduce((total: number, trip: any) => {
  //       if (trip.completion === 2) {
  //         return total + Number(trip.performance);
  //       } else {
  //         return total;
  //       }
  //     }, 0) / completedTrips).toFixed(2);
  //   } else {
  //     employee.avgPerformance = 0.00;
  //   }
  // });

  res.json(allEmployees)
}