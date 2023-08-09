import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function getTrips(req: any, res: any) {
  const allTrips = await prisma.trips.findMany();
  res.json(allTrips)
}