'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const curDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [date, setDate] = useState<Date | undefined>(curDate);

  return (
    <DateContext.Provider value={{ date, setDate }}>
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