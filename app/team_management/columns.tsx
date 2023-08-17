"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { start } from "repl"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Employees = {
  id: number
  first_name: string
  last_name: string
  name: string
  trips: object
}

export const columns: ColumnDef<Employees>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("id")}</div>
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("first_name")}</div>
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("last_name")}</div>
    },
  },
  {
    accessorKey: "trips",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Performance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const trips: any[] = row.getValue("trips");

      // Check if employee actually worked on any trips
      if (trips.length > 0) {
        let avg_performance = (trips.reduce((total, trip) => {
          let actual_time = (new Date(trip.end_time)).getTime() - (new Date(trip.start_time)).getTime();
          let standard_time = (new Date(trip.standard_time)).getTime();
          let performance = (standard_time / actual_time) * 100;
          console.log(performance, row.getValue("id"));
          return total + Number(performance);
        }, 0) / trips.length).toFixed(2);
        
        return <div className="text-center font-medium">{avg_performance}%</div>
      }
      return <div className="text-center font-medium">N/A</div>
    },
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
              Employee Details
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
