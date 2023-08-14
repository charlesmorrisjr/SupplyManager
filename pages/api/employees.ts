import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const allEmployees = await prisma.employees.findMany();
  res.json(allEmployees)
}