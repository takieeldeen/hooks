import { requireAuth, requireUnauth } from "@/lib/auth-utils";
import { ReactNode } from "react";

export async function UsersOnly({ children }: { children: ReactNode }) {
  await requireAuth();
  return children;
}
export async function GuestsOnly({ children }: { children: ReactNode }) {
  await requireUnauth();
  return children;
}
