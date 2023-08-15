import './globals.css';

import Nav from './nav';
import { Suspense } from 'react';

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
    <html lang="en" className="h-full bg-gray-200">
      <body className="h-full">
        <Suspense>
          <Nav />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
