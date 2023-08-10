import prisma from '../lib/prisma';
import { getServerSession } from "next-auth/next"
import UsersTable from './trip_management/table';

export const dynamic = 'force-dynamic';

export default async function IndexPage() {
  const session = await getServerSession();
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      
{/* Test code for identifying if user is logged in or not */}
      <div>
        {session ? (
          <p className="text-black text-xl md:text-xl font-black text-center pb-2">
            Welcome! You are logged in.
          </p>
        ) : (
          <p className="text-black text-xl md:text-xl font-black text-center pb-2">
            Please log in
          </p>
        )}
      </div>
    </main>
  );
}
