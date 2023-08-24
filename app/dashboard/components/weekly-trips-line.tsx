"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Area, AreaChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"

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

import { useDate } from "@/components/date-context"

const chartData: any[] = [];

function populateData(data: any) {
  // Populate chartData array with trips values from each trip
  chartData.length = 0;
  let tripCountAvg = data.reduce((a: any, b: any) => a + b.trips, 0) / data.length;

  data.forEach((tripCount: any) => {
    chartData.push({
      average: tripCountAvg,
      trips: tripCount.trips,
      uv: tripCount.trips,
      pv: tripCountAvg,
      date: tripCount.date
    });
  });
}

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

  if (data) populateData(data);
  // if (data) console.log(data)

  return (
    <Card className="col-span-6 row-span-full grow max-h-[400px]">
      <CardHeader>
        <CardTitle>Weekly Volume</CardTitle>
        <CardDescription>
        Total trips per day for the week of {new Date((new Date(curDate).setDate(curDate.getDate() - 6))).toLocaleDateString()} to {curDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
        <CardContent className="">
          <div className="h-[300px]">

          { data ? (

           chartData.length > 1 ?
            <ResponsiveContainer height='100%'>
              <AreaChart
                data={chartData}
                height={300}
                width={500}
                margin={{
                  top: 0,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
              <XAxis dataKey="date"/>
              <YAxis type="number" domain={['auto', 'auto']} />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload !== undefined && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold">
                                {/* Use value of `trips` property to look up corresponding date */}
                                {chartData[chartData.findIndex(item => item.trips === payload[0].payload?.trips)].date}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Trips
                              </span>
                              <span className="font-bold">
                                {payload[0].payload?.trips}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return null
                  }}
                />
                <Area type="monotone" dataKey="uv" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          :
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-muted-foreground">Not enough chartData to display chart.</span>
            </div>
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