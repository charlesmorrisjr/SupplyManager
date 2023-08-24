'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextProps {
  date: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const curDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [date, setSelectedDate] = useState<Date | undefined>(curDate);

  return (
    <DateContext.Provider value={{ date, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}