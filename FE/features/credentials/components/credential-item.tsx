import { EntityItem } from "@/components/EntityComponent";
import { Credential } from "@/types/credentials";
import { KeyIcon, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export function CredentialItem({
  credential,
  onRemove,
  isRemoving,
  onEdit,
}: {
  credential: Credential;
  onRemove?: () => void;
  isRemoving?: boolean;
  onEdit?: () => void;
}) {
  return (
    <EntityItem
      title={credential.name}
      subtitle={
        <div className="flex flex-col gap-0.5">
          <span>Type: {credential.type}</span>
          <span className="text-muted-foreground">
            Created at: {format(new Date(credential.createdAt), "PPP")}
          </span>
        </div>
      }
      image={
        <div className="bg-primary/10 p-2 rounded-md">
          <KeyIcon className="size-5 text-primary" />
        </div>
      }
      actions={
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <PencilIcon className="size-4" />
        </Button>
      }
      onRemove={onRemove}
      isRemoving={isRemoving}
    />
  );
}
