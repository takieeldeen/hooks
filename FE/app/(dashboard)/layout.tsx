import AppSidebar from "@/components/AppSidebar";
import UserBar from "@/components/UserBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">
        <UserBar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
