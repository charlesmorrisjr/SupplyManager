'use client';

// import { Metadata } from "next"

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { CalendarDateRangePicker } from "./components/date-range-picker"
import { TopPerformers } from "./components/top-performers"
import { WeeklyTrips } from "./components/weekly-trips-line"
import { WeeklyCases } from "./components/weekly-cases"
import { TripCompletion } from "./components/trip-completion"

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <>
      <main className="hidden md:block md:p-10 md:mx-auto md:max-w-7xl">
        <Card className="shadow-2xl dark:shadow-lg dark:shadow-gray-800">
          <CardContent>
            <div className="flex-col md:flex">
              <div className="flex-1 space-y-4">
                <div className="flex items-center p-6 pt-0 justify-between space-y-2">
                  <CardTitle className="mt-10 text-3xl font-bold tracking-tight">Dashboard</CardTitle>
                  <div className="flex items-center space-x-2">
                    {/* <CalendarDateRangePicker /> */}
                    {/* <Button>Download</Button> */}
                  </div>
                </div>
                <div className="space-y-4">
                  <CardContent className="space-y-4">
                    <div className="space-y-4 lg:space-y-0 lg:grid lg:gap-4 lg:grid-cols-8">
                      <TripCompletion />
                      <WeeklyTrips />
                    </div>
                    <div className="lg:grid lg:gap-4 lg:grid-cols-8 space-y-4 lg:space-y-0">
                      <WeeklyCases />

                      <Card className="col-span-3">
                        <CardHeader>
                          <CardTitle>Top Performers</CardTitle>
                          <CardDescription>
                            The highest performing order fillers today
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <TopPerformers />
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Mobile layout */}
      <main className="md:hidden">
        <div className="flex-col md:flex">
          <div className="flex-1 pt-4 space-y-4">
            {/* <CalendarDateRangePicker /> */}
            {/* <Button>Download</Button> */}
            <div className="px-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-3xl font-bold">Dashboard</CardTitle>
                </CardHeader>
              </Card>
              
              <TripCompletion />
              <WeeklyTrips />
              <WeeklyCases />

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>
                    The highest performing order fillers today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopPerformers />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
