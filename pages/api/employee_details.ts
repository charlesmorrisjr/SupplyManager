import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function getEmployeeDetails(req: NextApiRequest, res: NextApiResponse) {
  const searchDate = String(req.headers.datevalue);
  const employeeID = Number(req.headers.employeeid);
  console.log(searchDate, employeeID);
  const allTrips = await prisma.trips.findMany({
    where: {
      employee_id: employeeID,
      date: new Date(searchDate)
    }
  });
  res.json(allTrips)
}