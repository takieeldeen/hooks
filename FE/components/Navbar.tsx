"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import LOGO_IMAGE from "@/public/logo/dark.png";

export default function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* logo */}
        <Link href="/" className="text-xl font-bold">
          <Image src={LOGO_IMAGE} priority alt="Hooks Logo" height={36} />
        </Link>

        {/* desktop links */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/features">
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about">About</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* desktop auth */}
        <div className="hidden md:flex space-x-4">
          <Link href="/login">
            <Button
              size="sm"
              className="bg-neutral-800 border border-neutral-600 text-white hover:bg-neutral-900 transition-all duration-300"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="bg-indigo-800 border border-indigo-600 text-white hover:bg-indigo-700 transition-all"
            >
              Try Hooks
            </Button>{" "}
          </Link>
        </div>

        {/* mobile hamburger (opens sheet) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-md inline-flex items-center justify-center hover:bg-accent"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="px-4">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/features" className="hover:underline">
                  Features
                </Link>
                <Link href="/docs" className="hover:underline">
                  Docs
                </Link>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
                <hr />
                <Link href="/login">
                  <Button size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
