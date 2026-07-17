import { cookies } from "next/headers";

const COOKIE_NAME = "manju_admin";

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "1";
}
