"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Line, LineChart, CartesianGrid, Tooltip, Legend } from "recharts"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Label, LabelList } from "recharts"

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
import { parse } from "path"

let chartData: any = [];

function parseData(data: any) {
  chartData.length = 0;
  
  data.forEach((item: any) => {
    chartData.push({
      date: item.date,
      cases: item.trips._sum.total_cases
    });
  });
}

export function WeeklyCases() {
  const curDate = new Date(new Date().setHours(0,0,0,0));

  // Fetch chartData from chartDatabase using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date)
    }
  }).then((response) => response.json());

  let { data, error } = useSWR([ '/api/weekly-case-count', curDate ], fetcher);

  if (data) parseData(data);
  console.log(chartData)

  return (
    <Card className="col-span-5 row-span-full grow col-start-0">
      <CardHeader>
        <CardTitle>Volume This Week</CardTitle>
        <CardDescription>
        Total cases per day for the week of {new Date((new Date(curDate).setDate(curDate.getDate() - 6))).toLocaleDateString()} to {curDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
        <CardContent className="">
          <div className="h-[300px]">

          { chartData.length > 0 ? (

            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  stroke="#777777"
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#777777"
                  fontSize={14}
                  className="font-semibold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  // label={{ value: 'cases', angle: -90, position: 'insideLeft' }}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="cases" fill="url(#colorUv)" radius={[4, 4, 0, 0]}>
                  <LabelList className="font-medium" dataKey="cases" position="top" />
                </Bar>
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