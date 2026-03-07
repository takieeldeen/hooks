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

function SlackTriggerDialog({ open, onOpenChange }: Props) {
  const { workflowId } = useParams() as any;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/slack-trigger?workflowId=${workflowId}`;

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
          <SheetTitle>Slack Trigger Configuration</SheetTitle>
          <SheetDescription>
            Use this webhook URL in your Slack app to trigger this workflow on
            new messages or events.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4 px-3">
          <div className="space-y-2">
            <Label htmlFor="slack-webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="slack-webhook-url"
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
              <li>Go to your Slack App settings at api.slack.com/apps</li>
              <li>Navigate to Event Subscriptions</li>
              <li>Enable Events and paste the Webhook URL above</li>
              <li>
                Subscribe to the bot events you need (e.g., message.channels)
              </li>
              <li>Save Changes and reinstall the app to your workspace</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables:</h4>
            <ul className="rounded-lg text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{slack.text}}"}
                </code>
                - Message text
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{slack.user}}"}
                </code>
                - Sender user ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{slack.channel}}"}
                </code>
                - Channel ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{slack.timestamp}}"}
                </code>
                - Message timestamp
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json slack}}"}
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

export default SlackTriggerDialog;
