import { getCurrentSession } from "@/api/auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const session = await getCurrentSession();
  console.log(session, "triggered");
  if (!session) redirect("/login");

  return session;
};

export const requireUnauth = async () => {
  const session = await getCurrentSession();
  console.log(session, "triggered");

  if (session) redirect("/");

  return session;
};
