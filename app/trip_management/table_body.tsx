"use client";

import React, { useEffect } from "react";

import {
  Card,
  Flex,
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
  // DatePickerValue,
  DateRangePicker,
  DateRangePickerValue,
  Tab,
  TabList,
  TabGroup,
} from '@tremor/react';

const TRIP_UNASSIGNED = 0, TRIP_ASSIGNED = 1, TRIP_COMPLETED = 2;

const colors: { [key: number]: string } = {
  [TRIP_UNASSIGNED]: "badge-outline",
  [TRIP_ASSIGNED]: "badge-secondary",
  [TRIP_COMPLETED]: "badge-primary",
  // [TRIP_UNASSIGNED]: "neutral",
  // [TRIP_ASSIGNED]: "yellow",
  // [TRIP_COMPLETED]: "green",
};

export default function TableBodyComponent({ trips }: any) {
  return (
    <TableBody>
      {trips.map((trip: any) => (
        <TableRow key={trip.id}>
          <TableCell>{trip.id}</TableCell>
          <TableCell>
            <Text>{trip.route}</Text>
          </TableCell>
          <TableCell>
            <Text>{trip.stop}</Text>
          </TableCell>
          <TableCell>
            {/* <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"> */}
            <div className={`badge ${colors[trip.completion]}`}>
            {/* <Badge color={`${colors[trip.completion]}`}> */}
              {trip.completion === TRIP_UNASSIGNED && 'Unassigned'}
              {trip.completion === TRIP_ASSIGNED && 'Assigned'}
              {trip.completion === TRIP_COMPLETED && 'Completed'}
            {/* </Badge> */}
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
            {/* <button className='btn btn-outline btn-sm btn-neutral' onClick={() => alert(trip.date)}>Details</button> */}
            <Button size="md" variant="secondary" onClick={() => alert(trip.date)}>Details</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}