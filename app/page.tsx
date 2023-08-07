// import { queryBuilder } from '../lib/planetscale';
import prisma from '../lib/prisma';
import { getServerSession } from "next-auth/next"
import Search from './search';
import UsersTable from './trip_management/table';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Card,
  Title,
} from '@tremor/react';

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  // searchParams
// }: {
  // searchParams: { q: string };
}) {
  // const search = searchParams.q ?? '';
  // const users = await queryBuilder
  //   .selectFrom('users')
  //   .select(['id', 'name', 'username', 'email'])
  //   .where('name', 'like', `%${search}%`)
  //   .execute();
  const users = await prisma.user.findMany();
  const session = await getServerSession();
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Dashboard</Title>
      
{/* Test code for identifying if user is logged in or not */}
      <div>
        {session ? (
          <>
            <p className="text-black text-xl md:text-xl font-black text-center pb-2">
              Logged in
            </p>
            {/* <Search /> */}
            <Card className="mt-6">

      {/* TODO: Need to place this table into a component! */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Text>{user.name}</Text>
                      </TableCell>
                      <TableCell>
                        <Text>{user.email}</Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* <ul> 
                {users.map(user => (
                  <>
                  <li key={user.id}>{user.id}</li>
                  <li key={user.name}>{user.name}</li>
                  </>
                ))}
              </ul> */}
              {/* <UsersTable users={users} /> */}
            </Card>
          </>
        ) : (
          <p className="text-black text-xl md:text-xl font-black text-center pb-2">
            Please log in
          </p>
        )}
      </div>
    </main>
  );
}
