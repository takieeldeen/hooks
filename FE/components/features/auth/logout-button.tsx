"use client";
import { logout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import React from "react";

function LogoutButton() {
  return <Button onClick={async () => await logout()}>Logout</Button>;
}

export default LogoutButton;
