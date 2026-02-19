import { UsersOnly } from "@/features/auth/auth-guards";
import React from "react";

async function Page() {
  return (
    <UsersOnly>
      <div>Credentials Page</div>
    </UsersOnly>
  );
}

export default Page;
