"use client";

import React from "react";

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
  Badge,
  DatePicker,
} from '@tremor/react';

const TRIP_UNASSIGNED = 0, TRIP_ASSIGNED = 1, TRIP_COMPLETED = 2;

const colors: { [key: number]: string } = {
  // [TRIP_UNASSIGNED]: "badge-outline",
  // [TRIP_ASSIGNED]: "badge-secondary",
  // [TRIP_COMPLETED]: "badge-primary",
  [TRIP_UNASSIGNED]: "neutral",
  [TRIP_ASSIGNED]: "yellow",
  [TRIP_COMPLETED]: "green",
};

type Trip = {
  trip_id: number;
  completion: number;
  orderfiller_id: number;
  weight: number;
  route: number;
  stop: number;
  total_cases: number;
  cases_picked: number;
}

interface Props {
  trips: Trip[];
}

// TODO: Figure out how to allow trips to be passed in as a prop without getting a type error. Remove 'any' types

export default function TripsTable({ trips }: { trips: any }) {
  return (
    <Card className="mt-6">

      <DatePicker className="max-w-sm mx-auto" />

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
                {/* <div className={`badge ${colors[trip.completion]}`}> */}
                <Badge color={`${colors[trip.completion]}`}>
                  {trip.completion === TRIP_UNASSIGNED && 'Unassigned'}
                  {trip.completion === TRIP_ASSIGNED && 'Assigned'}
                  {trip.completion === TRIP_COMPLETED && 'Completed'}
                </Badge>
                {/* </div> */}
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
 );
}

// interface User {
//   id:  number;
//   name: string;
//   value: number;
// };

// export default async function UsersTable({ users }: { users: User[] }) {
//   return (
//     <ul> 
//       {users.map(user => (
//         <>
//         <li key={user.id}>{user.id}</li>
//         <li key={user.name}>{user.name}</li>
//         </>
//       ))}
//     </ul>
//   );
// };
