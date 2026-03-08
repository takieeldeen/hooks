import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";

function PublicPortalLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}

export default PublicPortalLayout;
