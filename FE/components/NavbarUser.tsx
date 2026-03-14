"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetCurrentSession } from "@/api/auth";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function NavbarUser() {
  const { session, isLoading } = useGetCurrentSession();
  if (isLoading)
    return (
      <div className="flex flex-row gap-2 items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  if (!session) {
    return (
      <div className="hidden md:flex space-x-4">
        <Link href="/login">
          <Button
            size="sm"
            className="bg-neutral-800 border border-neutral-600 text-white hover:bg-neutral-900"
          >
            Sign in
          </Button>
        </Link>

        <Link href="/signup">
          <Button
            size="sm"
            className="bg-indigo-800 border border-indigo-600 text-white hover:bg-indigo-700"
          >
            Try Hooks
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-1">
      <Link href="/workflows">
        <Button
          size="sm"
          className="bg-indigo-700 text-white border border-indigo-500 hover:bg-indigo-600"
        >
          Dashboard
        </Button>
      </Link>
      <div className="flex items-center gap-x-3 pl-2">
        <Avatar className="h-7 w-7 cursor-pointer ring-offset-2 ring-offset-background transition-all hover:ring-2 hover:ring-primary">
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
