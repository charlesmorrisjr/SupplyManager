import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"

export function MobileTableCard({ data }: any) {
  return (
    data.map((trip: any) => (
      <Card key={trip.id} className="my-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Trip ID: {trip.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p><span className="font-bold">Order Filler:</span> {trip.employee_username}</p>
            <p><span className="font-bold">Standard Time:</span> {trip.standard_time}</p>
            <p><span className="font-bold">Completion:</span> {trip.completion}</p>
            <p><span className="font-bold">Cases Picked/Total:</span> {trip.cases_picked}/{trip.total_cases}</p>
          </div>
          <Progress value={(trip.cases_picked / trip.total_cases) * 100} />
        </CardContent>
      </Card>
    ))
  );
}