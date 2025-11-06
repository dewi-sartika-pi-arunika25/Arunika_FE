import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get server-side session using NextAuth
 * Use this in Server Components or API routes
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

