import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function getEmployeeDetails(req: NextApiRequest, res: NextApiResponse) {
  const searchDate = String(req.headers.datevalue);
  const employeeID = Number(req.headers.employee_id);
  console.log(searchDate, employeeID);
  // const allTrips = await prisma.trips.findMany({
  //   where: {
  //     date: new Date(searchDate),
  //     employee_id: 100
  //   },
  // });
  // res.json(allTrips)
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
  // console.log(allEmployees[0].trips);
  if (allEmployees.length) {
    res.json(allEmployees[0].trips);
  } else {
    res.json(allEmployees);
  }
}