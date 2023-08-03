// import { queryBuilder } from '../lib/planetscale';
import prisma from '../../lib/prisma';
import Search from '../search';
import UsersTable from '../table';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Card,
  Title,
} from '@tremor/react';

export const dynamic = 'force-dynamic';

const TRIP_UNASSIGNED = 0, TRIP_ASSIGNED = 1, TRIP_COMPLETED = 2;

export default async function IndexPage({
  // searchParams
// }: {
  // searchParams: { q: string };
}) {
  // const search = searchParams.q ?? '';
  // const users = await queryBuilder
  //   .selectFrom('users')
  //   .select(['id', 'name', 'username', 'email'])
  //   .where('name', 'like', `%${search}%`)
  //   .execute();
  const trips = await prisma.trips.findMany();
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Trips</Title>
      <Text>
        Trip summary for the day.
      </Text>

      {/* <Search /> */}
      <Card className="mt-6">

{/* TODO: Need to place this table into a component! */}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Route</TableHeaderCell>
              <TableHeaderCell>Stop</TableHeaderCell>
              <TableHeaderCell>Completion</TableHeaderCell>
              <TableHeaderCell>Order Filler</TableHeaderCell>
              <TableHeaderCell>Weight</TableHeaderCell>
              <TableHeaderCell>Cases Picked</TableHeaderCell>
              <TableHeaderCell>Total Cases</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip: any) => (
              <TableRow key={trip.trip_id}>
                <TableCell>{trip.trip_id}</TableCell>
                <TableCell>
                  <Text>{trip.route}</Text>
                </TableCell>
                <TableCell>
                  <Text>{trip.stop}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {trip.completion === TRIP_UNASSIGNED && 'Unassigned'}
                    {trip.completion === TRIP_ASSIGNED && 'Assigned'}
                    {trip.completion === TRIP_COMPLETED && 'Completed'}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text>{trip.orderfiller_id}</Text>
                </TableCell>
                <TableCell>
                  <Text>{trip.weight}</Text>
                </TableCell>
                <TableCell>
                  <Text>{trip.cases_picked}</Text>
                </TableCell>
                <TableCell>
                  <Text>{trip.total_cases}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* <ul> 
          {users.map(user => (
            <>
            <li key={user.id}>{user.id}</li>
            <li key={user.name}>{user.name}</li>
            </>
          ))}
        </ul> */}
        {/* <UsersTable users={users} /> */}
      </Card>
    </main>
  );
}
