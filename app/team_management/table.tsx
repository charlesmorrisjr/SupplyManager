"use client";

import React, { useEffect } from "react";

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Employees, columns } from "./columns"
import { DataTable } from "./data-table"

import { useDate } from "@/components/date-context";

import useSWR from 'swr';

function addAdditionalProperties(data: any) {
  // This function converts milliseconds to a time format of HH:MM:SS
  // Used for calculating standard time
  const convertMillisecondsToTime = (ms: number) => {
    const MS_PER_HOUR = 1000 * 60 * 60;

    let hours = Math.floor(ms / 1000 / 60 / 60);
    let minutes = Math.floor((ms - (hours * MS_PER_HOUR)) / 1000 / 60);
    let seconds = Math.floor((ms - (hours * MS_PER_HOUR) - (minutes * 1000 * 60)) / 1000);
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
  }

  // Add additional properties to each employee object so the table can sort them properly
  data.forEach((employee: any) => {
    employee.casesPicked = employee.trips.reduce((total: number, trip: any) => trip.completion ? total + Number(trip.cases_picked) : total, 0);
    employee.totalStandardTime = convertMillisecondsToTime(employee.trips.reduce((total: number, trip: any) => trip.completion === 2 ? total + new Date(trip.standard_time).getTime() : total, 0));

    // Get number of completed trips
    let completedTrips = employee.trips.filter((trip: any) => trip.completion === 2).length;

    // Check if employee actually completed any trips
    if (completedTrips > 0) {
      
      // Calculate average performance by adding up all performance values and dividing by number of completed trips
      employee.avgPerformance = (employee.trips.reduce((total: number, trip: any) => {
        if (trip.completion === 2) {
          return total + Number(trip.performance);
        } else {
          return total;
        }
      }, 0) / completedTrips).toFixed(2);
    } else {
      employee.avgPerformance = 0;
    }
  });
}

export default function TeamTable() {
  const { date, setDate } = useDate();

  // Fetch data from database using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      datevalue: String(date)
    })
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/employees', date ], fetcher);
  
  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>

  if (data) addAdditionalProperties(data);

  return (
    <>
      <div className="hidden md:block">
        <Card className="p-6 pt-4 shadow-2xl dark:shadow-lg dark:shadow-gray-800">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight">Team Management <Badge variant='secondary' className='text-xl font-medium'>{data && data.length}</Badge></CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <div className="flex items-center justify-center">

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="font-medium">{date ? format(date, "PPP") : "Pick a date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    required
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <DataTable columns={columns} data={data} />

          </CardContent>
        </Card>
      </div>
      
      {/* Mobile */}
      <div className="md:hidden space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">Team Management</CardTitle>
          </CardHeader>
        </Card>

        <div className="flex flex-col space-y-4">


          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="font-medium">{date ? format(date, "PPP") : "Pick a date"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      required
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}