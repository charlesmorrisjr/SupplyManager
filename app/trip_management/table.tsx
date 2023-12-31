"use client";

import { useState } from "react";

import { format } from "date-fns"
import { ArrowBigLeft, ArrowBigRight, Calendar as CalendarIcon } from "lucide-react"

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

import { MobileTableCard } from "./mobile-table-card";

import { useDate } from "@/components/date-context";

import useSWR from 'swr';

function addAdditionalData(data: any) {
  data.forEach((trip: any) => {
    // Check if employees is an object and not null; otherwise, TypeScript will complain
    if (typeof trip.employees === "object" && trip.employees !== null && "username" in trip.employees) {
      trip.employee_username = trip.employees.username;
    }
  })
}

export default function TripsTable() {  
  const { date, setDate } = useDate();
  const [ dataStartIdx, setDataStartIdx ] = useState(0);
  
  let mobileData = [];

  // Parse date to format YYYY-MM-DD and set time to 00:00:00
  // This ensures that the passed in date is the same as the date in the database
  const parseDate = (date: any) => new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0];

  // Fetch data from database using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ 
      datevalue: date
    }),
  }).then((response) => response.json());

  let { data, error } = useSWR([ '/api/trips', parseDate(date) ], fetcher);

  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>

  if (data) addAdditionalData(data);

  // ! (temporary for development)
  if (data) {
    mobileData = data.slice(dataStartIdx, dataStartIdx + 5);
  }
  
  return (
    <>
      <div className="hidden md:block">
        <Card className="p-6 pt-4 shadow-2xl dark:shadow-lg dark:shadow-gray-800">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight">Trip Management <Badge variant='secondary' className='text-xl font-medium'>{data && data.length}</Badge></CardTitle>
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
            <CardTitle className="text-center text-3xl font-bold">Trip Management</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="space-y-6 pt-6">
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

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setDataStartIdx(dataStartIdx >= 5 ? dataStartIdx - 5 : 0)}>
                <ArrowBigLeft className="h-8 w-8" />
              </Button>

              <Button variant="outline" onClick={() => setDataStartIdx(dataStartIdx <= data.length - 6 ? dataStartIdx + 5 : data.length - 6)}>
                <ArrowBigRight className="h-8 w-8" />
              </Button>
            </div>

            <MobileTableCard data={mobileData} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}