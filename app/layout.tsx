import './globals.css';

import Nav from './nav';
import React, { Suspense } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"

import { DateProvider } from '@/components/date-context';
import { EmployeeProvider } from '@/components/employee-context';

export const metadata = {
  title: 'Supply Manager',
  description:
    'A supply chain and logistics management software'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-300 dark:bg-background">
        <ThemeProvider attribute="class" defaultTheme="light">
          <Suspense>
            <Nav />
          </Suspense>
          <DateProvider>
            <EmployeeProvider>
              {children}
            </EmployeeProvider>
          </DateProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}