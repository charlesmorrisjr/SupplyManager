"use client"

import React, { PureComponent } from "react"
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Label, LabelList, Legend, Tooltip } from 'recharts';

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

const COLORS = ['#0088FE', '#FFBB28', '#00C49F'];
const gradientIdPrefix = 'pieGradient';

export function TripCompletion() {
  const tripsExist = (data: any) => data[0].value > 0 && data[1].value > 0 && data[2].value > 0;
  
  const curDate = new Date(new Date().setHours(0,0,0,0));

  // Fetch chartData from chartDatabase using SWR
  const fetcher = async ([url, date]: [string, any]) =>
  await fetch(url, {
    headers: {
      datevalue: String(date)
    }
  }).then((response) => response.json());

  let { data, error } = useSWR([ '/api/trip-completion', curDate ], fetcher);

  return (
    <Card className="col-span-3 row-span-full grow">
      <CardHeader className="pb-0">
        <CardTitle>Trip Completion</CardTitle>
        <CardDescription>
          Trip completion for today ({curDate.toLocaleDateString()})
        </CardDescription>
      </CardHeader>
        <CardContent className="p-0 px-6">
          <div className="h-[300px]">

          { data ? (
            tripsExist(data) ? (
            <ResponsiveContainer>
              <PieChart className="mt-4 ml-1">
                <defs>
                  {data.map((entry: any, index: any) => (
                    <linearGradient
                      key={`${gradientIdPrefix}-${index}`}
                      id={`${gradientIdPrefix}-${index}`}
                      x1="0"
                      y1="1"
                      x2="2"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={COLORS[index % COLORS.length]} />
                      <stop offset="100%" stopColor="white" />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {data.map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#${gradientIdPrefix}-${index})`}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={48} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <span className="text-gray-400">No data available</span>
              </div>
            )
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