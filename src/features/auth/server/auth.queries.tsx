import { cookies } from "next/headers";
import { cache } from "react";
import { validateSessionAndGetUser } from "./use-cases/session";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const user = await validateSessionAndGetUser(sessionToken);
  return user;
});
