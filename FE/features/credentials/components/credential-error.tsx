import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";

export function CredentialsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-y-4">
      <AlertCircleIcon className="size-12 text-destructive" />
      <div className="text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">
          Failed to load credentials. Please try again.
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      )}
    </div>
  );
}
