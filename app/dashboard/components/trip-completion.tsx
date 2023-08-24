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
      <CardHeader>
        <CardTitle>Trip Completion</CardTitle>
        <CardDescription>
          Trip completion for today ({curDate.toLocaleDateString()})
        </CardDescription>
      </CardHeader>
        <CardContent className="">
          <div className="h-[250px]">

          { data ? (
            tripsExist(data) ? (
            <ResponsiveContainer>
              {/* <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}> */}
              <PieChart width={800} height={400}>
                <Pie
                  data={data}
                  cx={160}
                  cy={100}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  nameKey="name"
                  label
                >                  
                  {data.map((entry: any, index: any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36}/>
                <Tooltip />

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