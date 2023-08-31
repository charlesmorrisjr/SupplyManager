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

  // Function to extract the month and day from a date in the format of MM/DD
  const getMonthDay = (date: Date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // If the day is the last day of the month, set it to 1 for the next month
    if (day === new Date(date.getFullYear(), month, 0).getDate()) {
      day = 1;
      month += 1;
    } else {
      day += 1;
    }
    return `${month}/${day}`;
  }

  chartData.length = 0;
  let tripCountAvg = data.reduce((a: any, b: any) => a + b.trips, 0) / data.length;

  data.forEach((tripCount: any) => {
    chartData.push({
      average: tripCountAvg,
      trips: tripCount.trips,
      uv: tripCount.trips,
      pv: tripCountAvg,
      date: getMonthDay(new Date(tripCount.date))
    });
  });
}

export function WeeklyTrips() {
  const {theme} = useTheme();

  // Makes the custom tick labels for the chart different colors depending on the theme
  const CustomizedAxisTick = (...args: any) => {
    const {  tx, dy, x, y, stroke, payload } = args[0];
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={tx} y={0} dy={dy} textAnchor="end" className="font-medium text-sm" fill={theme === "dark" ? "#DDD" : "#000"}>
          {payload.value}
        </text>
      </g>
    );
  };

  function convertToUTC(dateString: string): string {
    const date = new Date(dateString);
    const utcString = date.toISOString();
    return utcString;
  }
  const curDate = new Date(new Date().setHours(0,0,0,0));
    
  // Fetch chartData from chartDatabase using SWR
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

  let { data, error } = useSWR([ '/api/weekly-trip-count', curDate ], fetcher);
  // let { data, error } = useSWR([ '/api/weekly-trip-count', convertToUTC(String(curDate)) ], fetcher);

  if (data) populateData(data);
  // if (data) console.log(data)

  return (
    <Card className="col-span-6 row-span-full grow max-h-[400px]">
      <CardHeader>
        <CardTitle>Trips This Week</CardTitle>
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
              <XAxis dataKey="date" tick={<CustomizedAxisTick tx={16} dy={16} />} />
              <YAxis type="number" domain={['dataMin', 'auto']} tick={<CustomizedAxisTick tx={0} dy={4} />} />
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
                <Area type="monotone" dataKey="uv" dot={true} stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUv)" />
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