import AuthLayout from "@/components/features/auth/auth-layout";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

export default Layout;
