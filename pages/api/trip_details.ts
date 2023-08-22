import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Retrieve trip details for a specific trip
export default async function getTripDetails(req: NextApiRequest, res: NextApiResponse) {
  const tripID = Number(req.headers.trip_id);
  const tripDetails = await prisma.trips.findMany({
    select: {
      trip_details: {
        select: {
          id: true,
          items: {
            select: {
              name: true,
            },
          },
        },
        where: {
          trip_id: tripID
        },
      },
    },
    where: {
      id: tripID
    }
  });      
  // console.log('fetching trip details for trip id: ' + tripID)
  res.json(tripDetails);
}