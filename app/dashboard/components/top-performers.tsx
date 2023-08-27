"use client";

import React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Skeleton } from "@/components/ui/skeleton";

import useSWR from 'swr';

export function TopPerformers() {
  // const curDate = String(new Date(new Date().setHours(0, 0, 0, 0)));
  const curDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [date, setDate] = React.useState<Date | undefined>(curDate);

  // Fetch data from database using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date)
    }
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/top_performers', date ], fetcher);
  
  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>

  if (data) {
    data.forEach((employee: any) => {
      // Get number of completed trips
      let completedTrips = employee.trips.filter((trip: any) => trip.completion === 2).length;
      
      // Calculate average performance by adding up all performance values and dividing by number of completed trips
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

    // Sort employees by performance
    data.sort((a: any, b: any) => Number(b.performance) - Number(a.performance));
  }

  return (
    <div className="space-y-8">
      {data ? (
        data.slice(0, 5).map((employee: any) => (
          <div key={employee.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`avatars/${(Math.random() * 5 + 1).toFixed(0)}.png`} alt="Avatar" />
              <AvatarFallback>{employee.first_name.slice(0, 1)}{employee.last_name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="ml-2 py-2 space-y-1">
              <p className="text-sm font-medium leading-none">{employee.first_name} {employee.last_name}</p>
            </div>
            <div className="ml-auto font-medium">{employee.performance > 0 ? `${employee.performance}%` : "N/A"}</div>
          </div>
        ))
      ) : (
        [...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="w-[100%] h-9 rounded-full" />
          </div>
        ))
      )}

    </div>
  )
}
