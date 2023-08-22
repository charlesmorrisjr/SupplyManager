import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Retrieve all trips for a specific employee on a specific date
export default async function getEmployeeDetails(req: NextApiRequest, res: NextApiResponse) {
    // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: string) => new Date(new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0]);

  const searchDate = parseDate(String(req.headers.datevalue));
  const employeeID = Number(req.headers.employee_id);

  const allEmployees = await prisma.employees.findMany({
    select: {
      id: true,
      trips: {
        where: {
          date: searchDate,
          employee_id: employeeID
        },
      },
    },
    where: {
      id: employeeID
    }
  });      
  if (allEmployees.length) {
    res.json(allEmployees[0].trips);
  } else {
    res.json(allEmployees);
  }
}