"use client"

import React, {useEffect} from "react"
import { useTheme } from "next-themes"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
// import { themes } from "@/components/ui/themes"

import { useEmployee } from "@/components/employee-context";


const data: any[] = [];

function populateData(trips: any) {
  // Populate data array with performance values from each trip
  data.length = 0;
  let index = 1;

  trips.forEach((trip: any) => {
    if (trip.completion === 2) {
      data.push({
        index,
        id: trip.id,
        performance: trip.performance,
        uv: trip.performance,
      });
      index++;
    }
  });
}

export function Chart({ trips, performance }: { trips: any, performance: any }) {
  const {theme} = useTheme();
  const {selectedEmployee, setSelectedEmployee} = useEmployee();

  // Makes the custom tick labels for the chart different colors depending on the theme
  const CustomizedAxisTick = (...args: any) => {
    const { tx, dy, x, y, stroke, payload } = args[0];
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={tx} y={0} dy={dy} textAnchor="end" className="font-medium" fill={theme === "dark" ? "#DDD" : "#000"}>
          {payload.value}
        </text>
      </g>
    );
  };

  if (trips !== undefined) populateData(trips);
    
  return (
    <Card className="grow">
      <CardHeader>
        <CardTitle>
          Performance
          <span className="ml-2 float-right">
            {performance
              ? <> {performance}% </>
              : "N/A"
            }
          </span>
        </CardTitle>
        <CardDescription>
          Order filler performance for today.
        </CardDescription>
      </CardHeader>
        <CardContent className="p-0 pr-2">
          <div className="h-[230px]">

          { selectedEmployee.id !== 0 ? (
              trips ? 
                data.length > 1 ?
                  <ResponsiveContainer width="97%" height="100%">
                    <AreaChart
                      data={data}
                      height={200}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      
                    <XAxis dataKey="index" domain={[1, "auto"]} tick={<CustomizedAxisTick tx={4} dy={16} />} />
                    <YAxis type="number" domain={[0, 200]} tick={<CustomizedAxisTick tx={0} dy={4} />} />
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
                                      Trip ID
                                    </span>
                                    <span className="font-bold">
                                      {payload[0].payload?.id}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Performance
                                    </span>
                                    <span className="font-bold">
                                      {payload[0].payload?.performance}%
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
                    <span className="text-muted-foreground">Not enough data to display chart.</span>
                    <span className="text-muted-foreground">Associate must have completed 2 or more trips.</span>
                  </div>
              : 
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <span className="spinner"></span>
                </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-muted-foreground">No associate selected.</span>
                <span className="text-muted-foreground">Please select an associate.</span>
              </div>
            )}
          </div>
        </CardContent>
    </Card>
  )
}