import prisma from '../../lib/prisma';
import Search from '../search';
import TripsTable from './table';

export const dynamic = 'force-dynamic';

export default async function TripManagementPage() {
  const allTrips = await prisma.trips.findMany();
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">

      <div className="stats shadow">
        
        <div className="stat">
          <div className="stat-title text-gray-100">Trips</div>
          <div className="stat-value text-gray-100">{allTrips.length}</div>
        </div>
        
      </div>

      <TripsTable trips={allTrips} />
    
    </main>
  );
}
