import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
  const users = await prisma.user.findMany();
  console.log(users);
  return (
    <div>
      <h1>USER</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
