import { getCurrentSession } from "@/api/auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return session;
};

export const requireUnauth = async () => {
  const session = await getCurrentSession();
  if (session) redirect("/");

  return session;
};
