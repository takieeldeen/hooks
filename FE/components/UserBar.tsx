"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Settings, Sun } from "lucide-react";
import Notifications from "./Notifications";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function UserBar() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex h-16 items-center justify-end gap-x-1 px-6 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 dark:bg-neutral-900">
      {/* Settings Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Settings className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-4" align="end">
          <PopoverHeader className="mb-4">
            <PopoverTitle className="text-lg">Settings</PopoverTitle>
          </PopoverHeader>
          <div className="grid gap-4">
            {/* Language Switch */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="language-switch">Switch to Arabic</Label>
                <span className="text-xs text-muted-foreground">
                  Change the interface language
                </span>
              </div>
              <Switch id="language-switch" />
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="theme-switch">Dark Mode</Label>
                <span className="text-xs text-muted-foreground">
                  Toggle between light and dark theme
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="theme-switch"
                  checked={resolvedTheme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Notifications */}
      <Notifications />

      {/* User Profile */}
      <div className="flex items-center gap-x-3 pl-2">
        <Avatar className="h-9 w-9 cursor-pointer ring-offset-2 ring-offset-background transition-all hover:ring-2 hover:ring-primary">
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default UserBar;
