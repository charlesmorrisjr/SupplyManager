"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import useSWR from 'swr';

export function Combobox({ onValueChange, value, setValue }: { onValueChange: (value: number) => void, value: string | undefined, setValue: (value: string) => void}) {
  const [open, setOpen] = React.useState(false)

  // Fetch data from database using SWR
  const fetcher = async (url: string) => await fetch(url).then((response) => response.json());
  const { data, error } = useSWR('/api/employee_list', fetcher);
  
  // * Uncomment the following line to have the table refresh every second
  // const { data, error } = useSWR([ '/api/trips', dateValue ], fetcher, { refreshInterval: 1000 });
  if (error) return <div>An error occurred.</div>

  if (data) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? data.find((employee: any) => employee.username === value)?.username
              : "Select employee..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search employees..." />
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {data.map((employee: any) => (
                <CommandItem
                  key={employee.id}
                  value={employee.username}
                  onSelect={(currentValue) => {
                    // Find the employee id that matches the username, then pass it to the
                    // onValueChange function to make an API request to the database
                    onValueChange(currentValue === value ? 0 : data.find((employee: any) => employee.username === currentValue)?.id)
                    
                    setValue(currentValue === value ? "" : currentValue)                  
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === employee.username ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {/* {employee.username} - {employee.last_name}, {employee.first_name} */}
                  {employee.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  } else {
    console.log("Loading...")
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            Loading...
          </Button>
        </PopoverTrigger>
      </Popover>
    )
  }
}
