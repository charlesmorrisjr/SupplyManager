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

import { ScrollArea } from "@/components/ui/scroll-area"

import useSWR from 'swr';

export function Combobox({ onValueChange, value, setValue }: { onValueChange: (value: any) => void, value: string | undefined, setValue: (value: string) => void}) {
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
          <div className="flex employee-combobox">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[350px] justify-between"
          >
            {value
              ? data.find((employee: any) => employee.username === value)?.username + " - " + data.find((employee: any) => employee.username === value)?.last_name + ", " + data.find((employee: any) => employee.username === value)?.first_name
              : "Select associate..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
            <Command>
              <CommandInput placeholder="Search employees..." />
              <CommandEmpty>No associate found.</CommandEmpty>
              <ScrollArea className="h-[300px]">

              <CommandGroup>
                {data.map((employee: any) => (
                  <CommandItem
                    key={employee.id}
                    value={employee.username}
                    onSelect={(currentValue) => {
                      // Find the employee id that matches the username, then pass the object to the
                      // onValueChange function to make an API request to the database
                      onValueChange(
                        currentValue === value 
                        ? {id: 0, first_name: "", last_name: "", username: "", email: ""}
                        : data.find((employee: any) => employee.username === currentValue)
                      )          
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
                    {employee.username} - {employee.last_name}, {employee.first_name}
                  </CommandItem>
                ))}
              </CommandGroup>
              </ScrollArea>
            </Command>
        </PopoverContent>
      </Popover>
    )
  } else {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[300px] justify-between">
            Loading...
          </Button>
        </PopoverTrigger>
      </Popover>
    )
  }
}
