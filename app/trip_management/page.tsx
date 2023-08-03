import prisma from '../../lib/prisma';
import Search from '../search';
import UsersTable from '../table';

import {
  Card,
  Title,
  Text,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Button,
} from "@tremor/react";

const TRIP_UNASSIGNED = 0, TRIP_ASSIGNED = 1, TRIP_COMPLETED = 2;

const colors: { [key: number]: string } = {
  [TRIP_UNASSIGNED]: "badge-outline",
  [TRIP_ASSIGNED]: "badge-secondary",
  [TRIP_COMPLETED]: "badge-primary",
};

export const dynamic = 'force-dynamic';

export default async function TripManagementPage() {
  const trips = await prisma.trips.findMany();
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">

      <div className="stats shadow">
        
        <div className="stat">
          <div className="stat-title text-gray-100">Trips</div>
          <div className="stat-value text-gray-100">{trips.length}</div>
        </div>
        
      </div>

{/* TODO: Add date selector widget here */}

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
              <TableHeaderCell>Cases Picked/Total Cases</TableHeaderCell>
              <TableHeaderCell>Trip Details</TableHeaderCell>
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
                  {/* <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"> */}
                  <div className={`badge ${colors[trip.completion]}`}>
                    {trip.completion === TRIP_UNASSIGNED && 'Unassigned'}
                    {trip.completion === TRIP_ASSIGNED && 'Assigned'}
                    {trip.completion === TRIP_COMPLETED && 'Completed'}
                  </div>
                  {/* </span> */}
                </TableCell>
                <TableCell>
                  <Text>{trip.orderfiller_id}</Text>
                </TableCell>
                <TableCell>
                  <Text>{trip.weight}</Text>
                </TableCell>
                <TableCell>
                  <Text>{trip.cases_picked}/{trip.total_cases}</Text>
                  {trip.completion !== TRIP_COMPLETED ?
                    <progress className="progress progress-warning w-40" value={String(trip.cases_picked)} max={String(trip.total_cases)}></progress>
                  : 
                    <progress className="progress progress-success w-40" value={String(trip.cases_picked)} max={String(trip.total_cases)}></progress>
                  }
                </TableCell>
                <TableCell>
                  <button className='btn btn-outline btn-sm btn-neutral'>Details</button>
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
