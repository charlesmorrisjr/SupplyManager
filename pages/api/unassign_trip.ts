import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Unassigns a trip from an employee
export default async function unassignTrip(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const tripID = Number(req.body.trip_id);

    const tripDetails = await prisma.trips.update({
      where: {
        id: tripID
      },
      data: {
        employee_id: null,
        completion: 0
      },
    });      
  
    res.status(200).json(tripDetails);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}