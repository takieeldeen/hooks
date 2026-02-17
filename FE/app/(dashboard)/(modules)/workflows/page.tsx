import { UsersOnly } from "@/components/features/auth/auth-guards";
import React from "react";

async function Page() {
  return (
    <UsersOnly>
      <div>Workflows Page</div>
    </UsersOnly>
  );
}

export default Page;
