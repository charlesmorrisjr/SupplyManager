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
import { Skeleton } from "@/components/ui/skeleton"
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

import UnassignTripDialog from "./unassign-trip";

export type Trips = {
  id: number
  route: number
  stop: number
  completion: number
  weight: number
  performance: number
  cases_picked: number
  total_cases: number
  employee_id: number
}

enum Completion {
  Unassigned = 0,
  Assigned = 1,
  Completed = 2,
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
    accessorKey: "performance",
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
      return (
        <>
          {row.getValue("performance") !== null &&
            <div className="text-center font-medium">
              {row.getValue("performance")}%
            </div>
          }
        </>
      )
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
    // This column is hidden. It's used to pass the employee ID to the unassign trip dialog component
    accessorKey: "employee_id",
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
        <DropdownDialog tripID={row.getValue("id")} completion={row.getValue("completion")} casesPicked={row.getValue("cases_picked")} employeeID={row.getValue("employee_id")} />
      )
    },
  },
]

function DropdownDialog({ tripID, completion, casesPicked, employeeID }: { tripID: string, completion: number, casesPicked: number, employeeID: number }) {
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
              <DialogTitle>Trip Details: {tripID}</DialogTitle>
              <TripDetailsTable tripID={tripID} />
            </DialogHeader>
            <DialogFooter>
              <DialogTrigger>
                <Button type="submit">OK</Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </DropdownMenuDialogItem>
        
        {/* If the trip is assigned, show the 'Unassign Trip' button */}
        {completion === Completion.Assigned && (            
          <>
            <DropdownMenuSeparator />

            <DropdownMenuDialogItem
              trigger="Unassign Trip"
              onSelect={handleDialogItemSelect}
              onOpenChange={handleDialogItemOpenChange}
            >
              <UnassignTripDialog tripID={tripID} casesPicked={casesPicked} employeeID={employeeID} />
            </DropdownMenuDialogItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TripDetailsTable({ tripID }: { tripID: string }) {
  const fetcher = async ([url, id]: [string, string]) =>
  await fetch(url, {
    headers: {
      trip_id: id,
    }
  }).then((response) => response.json());

  let { data, error } = useSWR([ '/api/trip_details', tripID ], fetcher);

  // Used to display skeleton rows while data is loading
  const skeletonRows = Array.from({ length: 8 }, (_, i) => i)
  
  return (
    <div className="self-center pt-4">
      <ScrollArea className="h-[600px] w-[625px] rounded-md border p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] font-bold">Case No.</TableHead>
              <TableHead className="text-right font-bold">Item Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              !error ? (
                data[0].trip_details.map((pickedCase: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-right">{pickedCase.items.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center font-medium">
                    Error loading data
                  </TableCell>
                </TableRow>
              )
            ) : (
              skeletonRows.map((key) => (
                <TableRow key={key}>
                  <TableCell colSpan={columns.length} className="h-24 text-center font-medium">
                    <Skeleton className="w-[100%] h-[30px] rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
