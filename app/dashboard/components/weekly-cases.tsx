"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, LabelList, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import useSWR from 'swr';
import { parse } from "path"

let chartData: any = [];

function parseData(data: any) {
  chartData.length = 0;

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
  
  data.forEach((item: any) => {
    chartData.push({
      date: getMonthDay(new Date(item.date)),      
      cases: item.trips._sum.total_cases
      // cases: (item.trips._sum.total_cases / 1000).toFixed(1)
    });
  });
}

function tooltipContent({ active, payload }: any) {
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
              {chartData[chartData.findIndex((item: any) => item.trips === payload[0].payload?.trips)].date}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Cases
            </span>
            <span className="font-bold">
              {payload[0].payload?.cases}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function WeeklyCases() {
  const {theme} = useTheme();
  
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

  let { data, error } = useSWR([ '/api/weekly-case-count', curDate ], fetcher);

  if (data) parseData(data);

  return (
    <Card className="col-span-5 row-span-full grow col-start-0">
      <CardHeader>
        <CardTitle>Volume This Week</CardTitle>
        <CardDescription>
        Total cases per day for the week of {new Date((new Date(curDate).setDate(curDate.getDate() - 6))).toLocaleDateString()} to {curDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
        <CardContent className="pt-4 pr-2 pl-6">
          <div className="hidden md:block h-[300px]">

          { chartData.length > 0 ? (

            <ResponsiveContainer width="97%" height="100%">
              <BarChart 
                data={chartData}
                margin={{ 
                  top: 0, 
                  right: 5, 
                  bottom: 0, 
                  left: 5 
                }}
              >
                <XAxis
                  dataKey="date"
                  stroke={theme === "light" ? "#000" : "#FFF"}
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                />
                {/* <YAxis
                  stroke="#777777"
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  // label={{ value: 'cases', angle: -90, position: 'insideLeft' }}
                /> */}
                {/* <Tooltip /> */}
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="cases" fill="url(#colorUv)" radius={[4, 4, 0, 0]}>
                  <LabelList className="font-medium text-sm" dataKey="cases" position="top"/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <span className="spinner"></span>
          </div>
        )}
         </div>

         {/* Mobile */}
         <div className="h-[300px] md:hidden">
          { chartData.length > 0 ? (

            <ResponsiveContainer width="97%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 5, bottom: 0, left: 5 }}>
                <XAxis
                  dataKey="date"
                  stroke={theme === "light" ? "#000" : "#FFF"}
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                />
                {/* <YAxis
                  stroke="#777777"
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  // label={{ value: 'cases', angle: -90, position: 'insideLeft' }}
                /> */}
                <Tooltip content={tooltipContent} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="cases" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
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