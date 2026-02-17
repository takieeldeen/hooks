"use client";
import { logout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function LogoutButton() {
  const router = useRouter();
  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await logout();
    router.refresh();
  };
  return <Button onClick={handleLogout}>Logout</Button>;
}

export default LogoutButton;
