"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Line, LineChart, CartesianGrid, Tooltip } from "recharts"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import useSWR from 'swr';

export function WeeklyTrips() {
  const curDate = new Date(new Date().setHours(0,0,0,0));

  // Fetch chartData from chartDatabase using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date)
    }
  }).then((response) => response.json());

  let { data, error } = useSWR([ '/api/weekly-trip-count', curDate ], fetcher);

  // if (data) populateData(data);

  return (
    <Card className="col-span-5 row-span-full grow col-start-4">
      <CardHeader>
        <CardTitle>Weekly Volume</CardTitle>
        <CardDescription>
        Total trips per day for the week of {new Date((new Date(curDate).setDate(curDate.getDate() - 6))).toLocaleDateString()} to {curDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
        <CardContent className="">
          <div className="h-[200px]">

          { data ? (

            <ResponsiveContainer>
              <BarChart data={data}>
                <XAxis
                  dataKey="date"
                  // stroke="#888888 #FFFFFF"
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#555555"
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="trips" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <span className="spinner"></span>
          </div>
        )}
         </div>
        </CardContent>
    </Card>
  )
}