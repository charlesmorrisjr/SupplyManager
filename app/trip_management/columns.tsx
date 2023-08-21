"use client"

import React, { useEffect } from "react";
import useSWR from 'swr';

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuDialogItem,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Separator } from "@/components/ui/separator"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge";

export type Trips = {
  id: number
  route: number
  stop: number
  completion: number
  // employee_id: number
  employees: object
  weight: number
  cases_picked: number
  total_cases: number
  standard_time: string
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

export const columns: ColumnDef<Trips>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trip ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("id")}</div>
    },
  },
  {
    accessorKey: "route",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Route
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("route")}</div>
    },
  },
  {
    accessorKey: "stop",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stop
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("stop")}</div>
    },
  },
  // {
  //   accessorKey: "employee_id",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Employee ID
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     return <div className="text-center font-medium">{row.getValue("employee_id")}</div>
  //   },
  // },
  {
    accessorKey: "employees",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Employee Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const employees = row.getValue("employees");

      // Check if employees is an object and not null; otherwise, TypeScript will complain
      if (typeof employees === "object" && employees !== null && "username" in employees) {
        let username = String(employees.username);  
        return <div className="text-center font-medium">{username}</div>
      }
    },
  },
  {
    accessorKey: "weight",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Weight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("weight")} lbs</div>
    },
  },
  {
    accessorKey: "standard_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Standard Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{convertMillisecondsToTime(new Date(row.getValue("standard_time")).getTime())}</div>
    },
  },
  {
    accessorKey: "completion",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Completion
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          { row.getValue("completion") === 0 
            ? 
              <Badge variant='outline'>Unassigned</Badge> 
            : 
              row.getValue("completion") === 1 
              ? 
              <Badge variant='secondary'>Assigned</Badge> 
              : 
              <Badge>Completed</Badge>  
          }
        </div>
      )
    },
  },
  {
    // This column is hidden. The output combined with the 'Total Cases' column
    accessorKey: "cases_picked",
  },
  {
    accessorKey: "total_cases",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cases Picked/Total Cases
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    cell: ({ row }) => {
      let cases_picked: number = row.getValue("cases_picked");
      let total_cases: number = row.getValue("total_cases");
      return (
        <>
          <div className="text-right font-medium">{cases_picked}/{total_cases}</div>  
          <Progress style={{ height: '0.7rem' }} value={(cases_picked / total_cases) * 100} />
        </>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => { 
      return (
        <DropdownWithDialogItemsSolution tripID={row.getValue("id")} />
      )
    },
  },
]

function DropdownWithDialogItemsSolution({ tripID }: { tripID: string }) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const dropdownTriggerRef: any = React.useRef(null);
  const focusRef: any = React.useRef(null);

  function handleDialogItemSelect() {
    focusRef.current = dropdownTriggerRef.current;
  }

  function handleDialogItemOpenChange(open: boolean) {
    setHasOpenDialog(open);
    if (open === false) {
      setDropdownOpen(false);
      document.body.style.pointerEvents = ""; // Fix to re-enable pointer events
    }
  }

  const fetcher = async ([url, id]: [string, string]) =>
  await fetch(url, {
    headers: {
      trip_id: id,
    }
  }).then((response) => response.json());

  let { data, error } = useSWR([ '/api/trip_details', tripID ], fetcher);

  if (data && !error) {

    return (
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          sideOffset={15}
          hidden={hasOpenDialog}
          onCloseAutoFocus={(event) => {
            if (focusRef.current) {
              focusRef.current.focus();
              focusRef.current = null;
              event.preventDefault();
            }
          }}
        >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuDialogItem 
            trigger="Trip Details"
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
          >
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle className="pb-4">Trip Details: {tripID}</DialogTitle>
                <Separator />
                <DialogDescription className="self-center pt-4">
                  {data && data[0].trip_details.length ? (
                    <TripDetailsTable data={data} />
                  ) : (
                    <div>
                      <p>No items.</p>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogTrigger>
                  <Button type="submit">OK</Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </DropdownMenuDialogItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuDialogItem 
            trigger="Assign Trip"
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Assign Trip</DialogTitle>
                <DialogDescription>
                  Are you sure you want to assign this trip to this employee?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </DropdownMenuDialogItem>
          <DropdownMenuDialogItem
            trigger="Unassign Trip"
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Unassign Trip</DialogTitle>
                <DialogDescription>
                  Are you sure you want to unassign this trip from this employee?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </DropdownMenuDialogItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}

export function TripDetailsTable({ data }: { data: any[] }) {
  return (
    <ScrollArea className="h-[600px] w-[625px] rounded-md border p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-bold">Case No.</TableHead>
            <TableHead className="text-right font-bold">Item Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data[0].trip_details.map((pickedCase: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell className="font-medium text-right">{pickedCase.items.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}