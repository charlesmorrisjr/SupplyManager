import React from "react";

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

// export default async function UsersTable({ users }: { users: User[] }) {
//   return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Username</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <Text>{user.name}</Text>
            </TableCell>
            <TableCell>
              <Text>{user.value}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
//   );
// }

interface User {
  id:  number;
  name: string;
  value: number;
};

export default async function UsersTable({ users }: { users: User[] }) {
  return (
    <ul> 
      {users.map(user => (
        <>
        <li key={user.id}>{user.id}</li>
        <li key={user.name}>{user.name}</li>
        </>
      ))}
    </ul>
  );
};
