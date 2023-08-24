import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Retrieve all trips for a specific employee on a specific date
export default async function getEmployeeDetails(req: NextApiRequest, res: NextApiResponse) {
  const searchDate = String(req.headers.datevalue);
  const employeeID = Number(req.headers.employee_id);

  const allEmployees = await prisma.employees.findMany({
    select: {
      id: true,
      trips: {
        where: {
          date: new Date(searchDate),
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