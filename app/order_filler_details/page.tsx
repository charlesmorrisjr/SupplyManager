import TripsTable from './table';

export const dynamic = 'force-dynamic';

export default async function EmployeeDetailsPage() {
  // const data = await getData()

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">

      <TripsTable />
    
    </main>
  );
}