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

import { Trips, columns } from "./columns"
import { DataTable } from "./data-table"
import { Combobox } from "./combobox";

import useSWR from 'swr';
import { Separator } from "@/components/ui/separator";

import {Chart} from "./chart";
import { Table } from "@/components/ui/table";

export default function EmployeeDetailsTable() {
  // Sets the date to the current date at midnight to prevent timezone issues
  // when retrieving data from the database
  const curDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [date, setDate] = React.useState<Date | undefined>(curDate);

  // selectedEmployee is used to pass the employee id to the database. setSelectedEmployee is passed to the child component Combobox
  const [selectedEmployee, setSelectedEmployee] = React.useState<number | undefined>(0);
  
  // comboValue is used to display the employee username in the Combobox. This state is defined here
  // and passed to Combobox so that the Combobox doesn't lose its value when the table refreshes.
  const [comboValue, setComboValue] = React.useState<string | undefined>("");

  // Fetch data from database using SWR
  const fetcher = async ([url, date, selectedEmployee]: [string, any, any]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date),
      employee_id: String(selectedEmployee)
    }
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/employee_details', date, selectedEmployee ], fetcher);

  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>
    
  return (
    <div className="mt-6"> 
      <Card>
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
            <div className="flex-1 w-64">
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
                <CardDescription>
                  Employee Stats for {date ? format(date, "PPP") : "today"}.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="pb-4">
                  <div className="pb-8">
                    <p className="text-sm font-semibold leading-6 text-gray-900">John Doe</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">johndoe@supplymanager.com</p>
                  </div>
                  <div className="flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">Performance</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">100%</p>
                  </div>
                </div>
              </CardContent>                    
            </Card>
            </div>
            
            <div className="flex-1 w-64">
              <Chart />
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