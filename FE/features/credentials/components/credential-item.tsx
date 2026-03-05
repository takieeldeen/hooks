import { EntityItem } from "@/components/EntityComponent";
import { Credential } from "@/types/credentials";
import { PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const getCredentialTypeIcon = (type: string) => {
  switch (type) {
    case "OPENAI":
      return <Icon icon="simple-icons:openai" className="size-3.5" />;
    case "ANTHROPIC":
      return <Icon icon="simple-icons:anthropic" className="size-3.5" />;
    case "GEMINI":
      return <Icon icon="material-icon-theme:gemini-ai" className="size-3.5" />;
    default:
      return <Icon icon="lucide:key-round" className="size-3.5" />;
  }
};

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
          <span className="flex items-center gap-1.5">
            Type: {getCredentialTypeIcon(credential.type)} {credential.type}
          </span>
          <span className="text-muted-foreground">
            Created at: {format(new Date(credential.createdAt), "PPP")}
          </span>
        </div>
      }
      image={
        <div className="bg-primary/10 p-2 rounded-md text-primary">
          {getCredentialTypeIcon(credential.type)}
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
