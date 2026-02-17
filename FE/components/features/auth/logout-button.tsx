"use client";
import { logout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await logout();
        router.refresh();
      }}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
