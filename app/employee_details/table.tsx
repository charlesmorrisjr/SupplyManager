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
import { ComboboxDemo } from "./combobox";

import useSWR from 'swr';

export default function EmployeeDetailsTable() {
  // Sets the date to the current date at midnight to prevent timezone issues
  // when retrieving data from the database
  const curDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [date, setDate] = React.useState<Date | undefined>(curDate);

  // Fetch data from database using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date),
      employeeid: String(100)
    }
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/employee_details', date ], fetcher);
  
  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>
  if (!data) return <div>Loading ...</div>
    
  return (
    <div className="mt-6">

      <Card>
        <CardHeader>
          <CardTitle>Trips <Badge variant='secondary' className='text-xl'>{data.length}</Badge></CardTitle>
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
        
          <ComboboxDemo />

          <DataTable columns={columns} data={data} />

        </CardContent>
      </Card>
    </div>
  )
}