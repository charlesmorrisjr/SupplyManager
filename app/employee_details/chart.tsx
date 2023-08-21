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
    data.push({
      baseline: 100.00,
      percentage: trip.performance,
    });
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
          <span className="ml-2 text-muted-foreground float-right">
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
                  style: { fill: "black", opacity: 0.25 },
                }}
                style={
                  {
                    stroke: "black",
                    opacity: 0.25,
                    color: "var(--theme-primary)",
                    // "--theme-primary": `hsl(${
                    //   theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
                    // })`,
                  } as React.CSSProperties
                }
              />
              <Line
                type="monotone"
                dataKey="percentage"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  style: { fill: "black" },
                }}
                style={
                  {
                    stroke: "black",
                    color: "var(--theme-primary)",
                    // "--theme-primary": `hsl(${
                    //   theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
                    // })`,
                  } as React.CSSProperties
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}