"use client";

import React, {useState, useEffect} from "react";

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

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

import { Trips, columns } from "./columns"
import { DataTable } from "./data-table"
import { Combobox } from "./combobox";

import useSWR from 'swr';
import { Separator } from "@/components/ui/separator";

import {Chart} from "./chart";

import { useDate } from "@/components/date-context";
import { useEmployee } from "@/components/employee-context";

function avgPerformance(trips: Trips[]) {
  // Get number of completed trips
  let completedTrips = (trips || []).filter(trip => trip.completion === 2).length;

  // Check if employee actually completed any trips
  if (completedTrips > 0) {
    // Calculate average performance by adding up all performance values and dividing by number of completed trips
    let avg_performance = (trips.reduce((total, trip) => {
      if (trip.completion === 2) {
        return total + Number(trip.performance);
      } else {
        return total;
      }
    }, 0) / completedTrips).toFixed(2);
    
    return avg_performance;
  }
  return 0;
}

function parseData(data: any) {
  data.forEach((trip: any) => trip.performance = Number(trip.performance));
}

// This function converts milliseconds to a time format of HH:MM:SS
// Used for calculating standard time
function convertMillisecondsToTime(ms: number) {
  const MS_PER_HOUR = 1000 * 60 * 60;

  let hours = Math.floor(ms / 1000 / 60 / 60);
  let minutes = Math.floor((ms - (hours * MS_PER_HOUR)) / 1000 / 60);
  let seconds = Math.floor((ms - (hours * MS_PER_HOUR) - (minutes * 1000 * 60)) / 1000);
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return formattedTime;
}

export default function EmployeeDetailsTable() {
  const { date, setDate } = useDate();

  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: any) => new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0];

  // selectedEmployee is used to pass the employee info to this component. setSelectedEmployee is passed to the child component Combobox
  const {selectedEmployee, setSelectedEmployee} = useEmployee();
  
  // comboValue is used to display the employee username in the Combobox. This state is defined here
  // and passed to Combobox so that the Combobox doesn't lose its value when the table refreshes.
  const [comboValue, setComboValue] = React.useState<string | undefined>(selectedEmployee.username);

  // Fetch data from database using SWR
  const fetcher = async ([url, date, selectedEmployee]: [string, any, any]) =>
  await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      datevalue: date,
      employee_id: String(selectedEmployee)
    }),
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/employee_details', parseDate(date), selectedEmployee.id ], fetcher);

  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>

  if (data) parseData(data);

  return (
    <>
      <main className="hidden md:block"> 
        <Card className="p-6 pt-4 shadow-2xl dark:shadow-lg dark:shadow-gray-800">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Order Filler Details</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <div className="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">

              <Combobox onValueChange={setSelectedEmployee} value={comboValue} setValue={setComboValue}/>

              <div className="lg:hidden md:flex calendar-popover">
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
            </div>          
            
            <Separator />
            
            <div className="md:flex md:justify-between md:space-x-4 space-y-4 md:space-y-0">
              <div className="md:flex md:w-1/4 max-w-full summary-card">
              <Card className="grow">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                {selectedEmployee.id ?
                  <div className="pb-4">
                    <div className="pb-8">
                      <h3 className="text-lg font-semibold leading-6">
                        {selectedEmployee.id
                          ? 
                          <>
                            {selectedEmployee.first_name} {selectedEmployee.last_name}
                          </>
                          : 
                            'N/A'
                        }
                      </h3>
                      <p className="mt-1 pb-6 truncate text-sm leading-5 text-gray-500">
                        {selectedEmployee.id ? selectedEmployee.email : 'N/A'}
                      </p>
                      <p className="text-sm font-medium pb-2 leading-6">
                        Completed Hours: {data ? convertMillisecondsToTime(data.reduce((total: number, trip: any) => trip.completion === 2 ? total + (new Date(trip.standard_time).getTime()) : total, 0)) : '00:00:00'}
                      </p>
                      <p className="text-sm font-medium leading-6">
                        Cases Picked Today: {data ? data.reduce((total: number, trip: any) => trip.completion ? total + Number(trip.cases_picked) : total, 0) : 0}
                      </p>
                    </div>
                  </div>
                  :
                  <div className="pb-4">
                    <div className="pb-8">
                      <h3 className="text-md font-medium leading-6">
                        Please select an associate.
                      </h3>
                    </div>
                  </div>
                }
                </CardContent>
              </Card>
              </div>
              
              <div className="md:flex md:w-1/2 max-w-full">
                <Chart trips={data} performance={avgPerformance(data)} />
              </div>

              <div className="hidden w-1/4 lg:flex h-[340px]">
                <Card className="m-0 p-0">
                  <CardContent className="p-2">
                    <Calendar
                      mode="single"
                      required
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-0"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="table-container">
              <DataTable columns={columns} data={data} />
            </div>
          </CardContent>
        {/* <CardHeader> */}
              {/* <Separator /> */}
              {/* <CardTitle>Trips <Badge variant='secondary' className='text-xl'>{data && data.length}</Badge></CardTitle> */}
          {/* </CardHeader> */}

        </Card>
      </main>

      {/* Mobile */}
      <main className="md:hidden space-y-4"> 
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">Order Filler Details</CardTitle>
          </CardHeader>
        </Card>

        <div className="flex flex-col space-y-4">
          <Card>
            <CardContent className="pt-6">

              <div className="flex justify-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
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

                  <Combobox onValueChange={setSelectedEmployee} value={comboValue} setValue={setComboValue}/>
                </div>
              </div>          
            </CardContent>
          </Card>

          <div className="md:flex md:justify-between md:space-x-4 space-y-4 md:space-y-0">
            <div className="md:flex md:w-1/4 max-w-full summary-card">
            <Card className="grow">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
              {selectedEmployee.id ?
                <div className="pb-4">
                  <div className="pb-8">
                    <h3 className="text-lg font-semibold leading-6">
                      {selectedEmployee.id
                        ? 
                        <>
                          {selectedEmployee.first_name} {selectedEmployee.last_name}
                        </>
                        : 
                          'N/A'
                      }
                    </h3>
                    <p className="mt-1 pb-6 truncate text-sm leading-5 text-gray-500">
                      {selectedEmployee.id ? selectedEmployee.email : 'N/A'}
                    </p>
                    <p className="text-sm font-medium pb-2 leading-6">
                      Completed Hours: {data ? convertMillisecondsToTime(data.reduce((total: number, trip: any) => trip.completion === 2 ? total + (new Date(trip.standard_time).getTime()) : total, 0)) : '00:00:00'}
                    </p>
                    <p className="text-sm font-medium leading-6">
                      Cases Picked Today: {data ? data.reduce((total: number, trip: any) => trip.completion ? total + Number(trip.cases_picked) : total, 0) : 0}
                    </p>
                  </div>
                </div>
                :
                <div className="pb-4">
                  <div className="pb-8">
                    <h3 className="text-md font-medium leading-6">
                      Please select an associate.
                    </h3>
                  </div>
                </div>
              }
              </CardContent>
            </Card>
            </div>
            
            <div className="md:flex md:w-1/2 max-w-full">
              <Chart trips={data} performance={avgPerformance(data)} />
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </div>
        {/* <CardHeader> */}
            {/* <Separator /> */}
            {/* <CardTitle>Trips <Badge variant='secondary' className='text-xl'>{data && data.length}</Badge></CardTitle> */}
        {/* </CardHeader> */}

      </main>
    </>
  )
}