"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Trips = {
  id: number
  route: number
  stop: number
  completion: number
  orderfiller_id: number
  weight: number
  cases_picked: number
  total_cases: number
}

export const columns: ColumnDef<Trips>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-right">Trip ID</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("id")}</div>
    },
  },
  {
    accessorKey: "route",
    header: () => <div className="text-right">Trip ID</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("id")}</div>
    },
  },
  {
    accessorKey: "stop",
    header: () => <div className="text-right">Stop</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("stop")}</div>
    },
  },
  {
    accessorKey: "completion",
    header: () => <div className="text-right">Completion</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("completion")}</div>
    },
  },
  {
    accessorKey: "orderfiller_id",
    header: () => <div className="text-right">Order Filler</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("orderfiller_id")}</div>
    },
  },
  {
    accessorKey: "weight",
    header: () => <div className="text-right">Weight</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("weight")}</div>
    },
  },
  {
    accessorKey: "cases_picked",
    header: () => <div className="text-right">Cases Picked/Total Cases</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("cases_picked")}/{row.getValue("total_cases")}</div>
    },
  },
  {
    accessorKey: "total_cases",
    // header: () => <div className="text-right">Cases Picked/Total Cases</div>,
    // cell: ({ row }) => {
    //   return <div className="text-right font-medium">{row.getValue("total_cases")}</div>
    // },
  },
]
