import { headers } from "next/headers";
import { auth } from "../auth";

export async function requireUser() {
    const hdrs = await headers();     
  const session = await auth.api.getSession({
    headers: hdrs,
  });

   if (!session || !session.user) {
    return null;
  }

  return session.user;
}
