import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useEffect, useMemo } from "react";
import z from "zod";
import { SlackMessageNodeData } from "./slack-message-node";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { useUpdateWorkflow } from "@/api/workflows";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    ),
  webhookUrl: z.string().min(1, "Please enter the webhook url"),
  message: z
    .string()
    .min(1, "Please enter the message you want to send")
    .max(2000, "Discord messages can't exceed 2000 characters"),
});

function SlackDialog({
  open,
  onOpenChange,
  nodeData,
  nodeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: SlackMessageNodeData;
  nodeId: string;
}) {
  const { workflowId } = useParams();
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const { mutateAsync: updateWorkflow, isPending: isUpdating } =
    useUpdateWorkflow();
  const defaultValues = useMemo(
    () => ({
      variableName: nodeData?.variableName,
      webhookUrl: nodeData?.webhookUrl || "",
      message: nodeData?.message || "",
    }),
    [nodeData?.message, nodeData?.variableName, nodeData?.webhookUrl],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    updateNodeData(nodeId, data);

    const nodes = getNodes();
    const edges = getEdges();

    const updatedNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node,
    );
    try {
      await updateWorkflow({ id: workflowId, nodes: updatedNodes, edges });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Life Cycle hooks
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="dark:bg-neutral-900">
        <SheetHeader>
          <SheetTitle>Slack Message Configuration</SheetTitle>
          <SheetDescription>
            Configure the message you want to send through slack
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 mt-4 px-3"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="slackMessage" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${field.value || "slackMessage"}.message}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://hooks.slack.com/api/webhooks/...."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from Slack: Worksace Settings &rarr; Workflows
                    &rarr; Webhooks
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Message"
                      {...field}
                      className="h-36"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the message you want to send in slack
                    {`(You can use variables inside this messages from other nodes.)`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="mt-4 px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUpdating}>
                {isSubmitting || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default SlackDialog;
