// import { queryBuilder } from '../lib/planetscale';
import prisma from '../lib/prisma';
import Search from './search';
import UsersTable from './table';

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
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  // const users = await queryBuilder
  //   .selectFrom('users')
  //   .select(['id', 'name', 'username', 'email'])
  //   .where('name', 'like', `%${search}%`)
  //   .execute();
  const users = await prisma.user.findMany();
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>
        A list of users retrieved from a PostgreSQL database (Neon).
      </Text>
      <Search />
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
    </main>
  );
}
