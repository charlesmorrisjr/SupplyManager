"use client"

import React, { useEffect } from "react";

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

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge";

export type Trips = {
  id: number
  route: number
  stop: number
  completion: number
  weight: number
  performance: number
  cases_picked: number
  total_cases: number
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
    cell: () => { 
      return (
        <DropdownWithDialogItemsSolution2 />
      )
    },
  },
]

function DropdownWithDialogItemsSolution2() {
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              Here are the details:
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit">OK</Button>
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
