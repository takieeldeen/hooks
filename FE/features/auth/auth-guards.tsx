import { getCurrentSession } from "@/api/auth";
import { requireAuth, requireUnauth } from "@/lib/auth-utils";
import { ReactNode, use } from "react";

export async function UsersOnly({ children }: { children: ReactNode }) {
  await requireAuth();
  return children;
}
export async function GuestsOnly({ children }: { children: ReactNode }) {
  await requireUnauth();
  return children;
}

export function useAuth() {
  const session = use(getCurrentSession());
  return { session };
}
