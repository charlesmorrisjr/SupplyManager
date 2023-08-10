import Search from '../search';
import TripsTable from './table';

export const dynamic = 'force-dynamic';

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     {
//       id: "728ed52e",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//   ]
// }

export default async function TripManagementPage() {
  // const data = await getData()

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">

      <TripsTable />
    
    </main>
  );
}
