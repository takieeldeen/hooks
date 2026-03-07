import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DiscordTriggerDialog({ open, onOpenChange }: Props) {
  const { workflowId } = useParams();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/discord-trigger?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy webhook URL to clipboard");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Discord Trigger Configuration</SheetTitle>
          <SheetDescription>
            Use this webhook URL in your Discord bot or server integrations to
            trigger this workflow on messages or events.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4 px-3">
          <div className="space-y-2">
            <Label htmlFor="discord-webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="discord-webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={copyToClipboard} size="icon" variant="outline">
                <CopyIcon />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>
                Go to your Discord Developer Portal at discord.com/developers
              </li>
              <li>Select your application and navigate to Bot</li>
              <li>
                Enable the Message Content Intent under Privileged Gateway
                Intents
              </li>
              <li>
                In your bot code, forward incoming events to the Webhook URL
                above
              </li>
              <li>
                Invite the bot to your server with the required permissions
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables:</h4>
            <ul className="rounded-lg text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{discord.content}}"}
                </code>
                - Message content
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{discord.author}}"}
                </code>
                - Message author username
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{discord.channelId}}"}
                </code>
                - Channel ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{discord.guildId}}"}
                </code>
                - Server (guild) ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json discord}}"}
                </code>
                - Full event payload as JSON
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DiscordTriggerDialog;
