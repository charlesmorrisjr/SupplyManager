"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

interface Employee {
  id: number,
  first_name: string,
  last_name: string,
  username: string
  email: string,
}

interface EmployeeContextProps {
  selectedEmployee: Employee;
  setSelectedEmployee: (employee: Employee) => void;
}

const EmployeeContext = createContext<EmployeeContextProps | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>({id: 0, first_name: "", last_name: "", username: "", email: ""});

  return (
    <EmployeeContext.Provider value={{ selectedEmployee, setSelectedEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}
