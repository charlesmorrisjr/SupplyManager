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
  username: string
  first_name: string
  last_name: string
  name: string
  trips: object
  avgPerformance: number
  casesPicked: number
  totalStandardTime: string
}

// This function converts milliseconds to a time format of HH:MM:SS
// Used for calculating standard time
function convertMillisecondsToTime(ms: number) {
  const MS_PER_HOUR = 1000 * 60 * 60;

  let hours = Math.floor(ms / 1000 / 60 / 60);
  let minutes = Math.floor((ms - (hours * MS_PER_HOUR)) / 1000 / 60);
  let seconds = Math.floor((ms - (hours * MS_PER_HOUR) - (minutes * 1000 * 60)) / 1000);
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return formattedTime;
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
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("username")}</div>
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
      return <div className="text-left font-medium">{row.getValue("first_name")}</div>
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
      return <div className="text-left font-medium">{row.getValue("last_name")}</div>
    },
  },
  {
    accessorKey: "avgPerformance",
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
      return <div className="text-center font-medium">{row.getValue("avgPerformance")}%</div>
    },
  },
  {
    accessorKey: "casesPicked",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cases Picked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("casesPicked")}</div>
    },
  },
  {
    accessorKey: "totalStandardTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Completed Hours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("totalStandardTime")}</div>
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => { 
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => {alert('Details')}}
  //           >
  //             Employee Details
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Assign</DropdownMenuItem>
  //           <DropdownMenuItem>Unassign</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]
