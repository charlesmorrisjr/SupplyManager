"use client";

import React from "react";

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

import { useDateContext } from "@/components/use-date-context";
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

type selectedEmployeeObj = {
  id: number,
  first_name: string,
  last_name: string,
  username: string
  email: string,
}

export default function EmployeeDetailsTable() {
  const { date, setDate } = useDateContext();

  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: any) => new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0];

  // selectedEmployee is used to pass the employee info to this component. setSelectedEmployee is passed to the child component Combobox
  // const [selectedEmployee, setSelectedEmployee] = React.useState<selectedEmployeeObj>({id: 0, first_name: "", last_name: "", username: "", email: ""});
  const {selectedEmployee, setSelectedEmployee} = useEmployee();
  
  // comboValue is used to display the employee username in the Combobox. This state is defined here
  // and passed to Combobox so that the Combobox doesn't lose its value when the table refreshes.
  const [comboValue, setComboValue] = React.useState<string | undefined>(selectedEmployee.username);

  // Fetch data from database using SWR
  const fetcher = async ([url, date, selectedEmployee]: [string, any, any]) =>
  await fetch(url, {
    headers: {
      datevalue: date,
      employee_id: String(selectedEmployee)
    }
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/employee_details', parseDate(date), selectedEmployee.id ], fetcher);

  // // TODO: Starter code for retrieving trip details as required
  // const fetcher = async (url: string) => await fetch(url).then((response) => response.json());
  // const { data, error } = useSWR(() => '/api/trip_details', fetcher);  

  // if (!data || error) {
  //   console.log("No data or error");
  // } else {
  //   console.log(data);
  // }

  // return;

  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>

  return (
    <div className="mt-6"> 
      <Card className="shadow-2xl dark:shadow-lg dark:shadow-gray-800">
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">

            <Combobox onValueChange={setSelectedEmployee} value={comboValue} setValue={setComboValue}/>

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
          
          <Separator />
          
          <div className="flex justify-between space-x-4">
            <div className="flex w-1/2 max-w-full">
            <Card className="grow">
              <CardHeader>
                <CardTitle>Stats</CardTitle>
                <CardDescription>
                  Employee Stats for {date ? format(date, "PPP") : "today"}.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="pb-4">
                  <div className="pb-8">
                    <p className="text-sm font-semibold leading-6">
                      {selectedEmployee.id
                        ? 
                        <>
                          {selectedEmployee.first_name} {selectedEmployee.last_name}
                        </>
                        : 
                          'N/A'
                      }
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {selectedEmployee.id ? selectedEmployee.email : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
            
            <div className="flex w-1/2 max-w-full">
              <Chart trips={data} performance={avgPerformance(data)} />
            </div>
          </div>
          
          <DataTable columns={columns} data={data} />
        </CardContent>
      {/* <CardHeader> */}
            {/* <Separator /> */}
            {/* <CardTitle>Trips <Badge variant='secondary' className='text-xl'>{data && data.length}</Badge></CardTitle> */}
        {/* </CardHeader> */}

      </Card>
    </div>
  )
}