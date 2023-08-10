"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "../../@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../@/components/ui/dropdown-menu"


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
    // This column is hidden. The output combined with the 'Cases Picked' column
    accessorKey: "total_cases",
  },
  {
    id: "actions",
    cell: ({ row }) => { 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {alert('Details')}}
            >
              Trip Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Assign</DropdownMenuItem>
            <DropdownMenuItem>Unassign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
