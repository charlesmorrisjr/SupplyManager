"use client";

import React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import useSWR from 'swr';

export function TopPerformers() {
  // const curDate = String(new Date(new Date().setHours(0, 0, 0, 0)));
  const curDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [date, setDate] = React.useState<Date | undefined>(curDate);
  
  // Fetch data from database using SWR
  const fetcher = async ([url]: [string]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date)
    }
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/employees', date ], fetcher);
  
  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>
  if (data) {
    // Get number of completed trips
    data.forEach((employee: any) => {
      let completedTrips = employee.trips.filter((trip: any) => trip.completion === 2).length;
      
      if (completedTrips > 0) {
        employee.performance = (employee.trips.reduce((total: number, trip: any) => {
          if (trip.completion === 2) {
            return total + Number(trip.performance);
          } else {
            return total;
          }
        }, 0) / completedTrips).toFixed(2);
      } else {
        employee.performance = "0";
      }
    });

    data.sort((a: any, b: any) => {
      return Number(b.performance) - Number(a.performance);
    });
  }

  return (
    <div className="space-y-8">
      {data ? (
        data.slice(0, 5).map((employee: any) => (
          <div key={employee.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`/avatars/${employee.id}.png`} alt="Avatar" />
              <AvatarFallback>{employee.first_name.slice(0, 1)}{employee.last_name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{employee.first_name} {employee.last_name}</p>
            </div>
            <div className="ml-auto font-medium">{employee.performance > 0 ? `${employee.performance}%` : "N/A"}</div>
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}

    </div>
  )
}
