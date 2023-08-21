"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

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

  trips.forEach((trip: any) => {
    if (trip.completion === 2) {
      data.push({
        baseline: 100.00,
        percentage: trip.performance,
      });
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
    <Card>
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
              <LineChart
                data={data}
                margin={{
                  top: 100,
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
                                Baseline
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}%
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Trip
                              </span>
                              <span className="font-bold">
                                {payload[1].value}%
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
                  dataKey="baseline"
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
                  dataKey="percentage"
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
              <span className="text-muted-foreground">Not enough data to display chart.</span>
            </div>
          }
         </div>
        </CardContent>
    </Card>
  )
}