import { EmptyViews } from "@/components/EntityComponent";

export function CredentialsEmpty({ onNew }: { onNew?: () => void }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <EmptyViews
        message="You haven't added any credentials yet. Credentials allow you to connect to various services."
        onNew={onNew}
      />
    </div>
  );
}
