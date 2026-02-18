"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center max-w-md gap-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive animate-pulse">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {/* {error.message || "An unexpected error occurred. Please try again."} */}
            {"An unexpected error occurred. Please try again."}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 font-mono mt-1">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={reset} variant="default" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try again
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
