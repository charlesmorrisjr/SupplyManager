"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

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

import { ClipLoader } from "react-spinners"

import useSWR from 'swr';

import { useDate } from "@/components/date-context"

const chartData: any[] = [];

function populateData(data: any) {
  // Populate chartData array with trips values from each trip
  chartData.length = 0;
  let tripCountAvg = (data.reduce((a: number, b: number) => a + b, 0) / data.length).toFixed(0);

  data.forEach((tripCount: number) => {
    chartData.push({
      average: tripCountAvg,
      trips: tripCount,
    });
  });
}

export function Chart() {
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

  return (
    <Card className="col-span-6 row-span-full grow">
      <CardHeader>
        <CardTitle>Weekly Volume</CardTitle>
        <CardDescription>
        Total trips per day for the week of {new Date((new Date(curDate).setDate(curDate.getDate() - 6))).toLocaleDateString()} to {curDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
        <CardContent className="">
          <div className="h-[200px]">

          { data ? (

           chartData.length > 1 ?
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{
                  top: 50,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload !== undefined && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Average
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Trips
                              </span>
                              <span className="font-bold">
                                {payload[1].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return null
                  }}
                />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="average"
                  activeDot={{
                    r: 6,
                    style: { fill: "hsl(var(--text-muted-foreground))", opacity: 0.3 },
                  }}
                  style={
                    {
                      stroke: "hsl(var(--muted-foreground))",
                      opacity: 0.3,
                    } as React.CSSProperties
                  }
                />
                <Line
                  type="monotone"
                  dataKey="trips"
                  strokeWidth={2}
                  activeDot={{
                    r: 8,
                    style: { fill: "hsl(var(--primary))" },
                  }}
                  style={
                    {
                      stroke: "hsl(var(--primary))",
                    } as React.CSSProperties
                  }
                />
              </LineChart>
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