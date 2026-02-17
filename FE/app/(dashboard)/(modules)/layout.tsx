import AppHeader from "@/components/AppHeader";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}

export default Layout;
