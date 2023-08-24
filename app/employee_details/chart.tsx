"use client"

import * as React from "react"
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
  const { theme: mode } = useTheme()
  // const [config] = useConfig()

  // const theme = themes.find((theme) => theme.name === config.theme)

  if (trips === undefined) return;

  populateData(trips);

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
          Employee Performance for today.
        </CardDescription>
      </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[200px]">

          { data.length > 1 ?
            <ResponsiveContainer>
              <AreaChart
                data={data}
                height={300}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
              <XAxis dataKey="index" domain={[1, "auto"]} />
              <YAxis type="number" domain={[0, 200]} />
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
                <Area type="monotone" dataKey="uv" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          :
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-muted-foreground">Not enough data to display chart.</span>
              <span className="text-muted-foreground">Employee must have completed 2 or more trips.</span>
            </div>
          }
         </div>
        </CardContent>
    </Card>
  )
}