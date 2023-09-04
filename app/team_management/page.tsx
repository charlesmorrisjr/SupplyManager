import TeamTable from './table';

export const dynamic = 'force-dynamic';

export default async function TeamManagementPage() {

  return (
    <main className="px-2 py-4 md:p-10 mx-auto max-w-7xl">

      <TeamTable />
    
    </main>
  );
}
