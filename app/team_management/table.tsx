"use client";

import React, { useEffect } from "react";

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

import { Users, columns } from "./columns"
import { DataTable } from "./data-table"

import useSWR from 'swr';

export default function TeamTable() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  // Fetch data from database using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date)
    }
  }).then((response) => response.json());

  const { data, error } = useSWR([ '/api/users', date ], fetcher);
  
  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>
  if (!data) return <div>Loading ...</div>

  return (
    <div className="mt-6">

      <div>
        <div>Users</div>
        <div color="gray">{data.length}</div>
      </div>

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
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <DataTable columns={columns} data={data} />
    </div>
  )
}