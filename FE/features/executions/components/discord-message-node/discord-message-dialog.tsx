import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Activity, useEffect, useMemo } from "react";
import z from "zod";
import { DiscordMessageNodeData } from "./discord-message-node";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { useUpdateWorkflow } from "@/api/workflows";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useGetMyAppConnections,
  useGetServerChannels,
  useGetServers,
} from "@/api/appConnections";
import ConnectionButton from "@/components/connection-button/base-connection-button";
import { Icon } from "@iconify/react";
import { endpoints } from "@/api/axios";

const formSchema = z.object({
  connectionId: z.string().min(1, "Please select a connection"),
  serverId: z.string().min(1, "Please select a server"),
  channelId: z.string().min(1, "Please select a channel"),
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    ),
  message: z
    .string()
    .min(1, "Please enter the message you want to send")
    .max(2000, "Discord messages can't exceed 2000 characters"),
});

function GeminiDialog({
  open,
  onOpenChange,
  nodeData,
  nodeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: DiscordMessageNodeData;
  nodeId: string;
}) {
  const { workflowId } = useParams() as any;
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const { mutateAsync: updateWorkflow, isPending: isUpdating } =
    useUpdateWorkflow();
  const { data: connections, isPending: isLoadingConnections } =
    useGetMyAppConnections("DISCORD");
  const hasConnections = Boolean(connections?.length);
  const defaultValues = useMemo(
    () => ({
      connectionId: nodeData?.connectionId || "",
      serverId: nodeData?.serverId || "",
      channelId: nodeData?.channelId || "",
      variableName: nodeData?.variableName,
      message: nodeData?.message || "",
    }),
    [
      nodeData?.channelId,
      nodeData?.connectionId,
      nodeData?.serverId,
      nodeData?.message,
      nodeData?.variableName,
    ],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const selectedConnectionId =
    form?.watch("connectionId") || nodeData?.connectionId;

  const { data: servers, isPending: isLoadingServers } =
    useGetServers(selectedConnectionId);
  const botInstalled = servers?.find(
    (server) => form?.watch("serverId") === server.id,
  )?.botInstalled;

  const selectedServerId = form?.watch("serverId") || nodeData?.serverId;

  const { data: channels, isPending: isLoadingChannels } =
    useGetServerChannels(selectedServerId);

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

  useEffect(() => {
    if (open && connections?.length && !form.getValues("connectionId")) {
      form.setValue("connectionId", connections[0].id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [open, connections, form]);

  useEffect(() => {
    if (open && servers?.length && !form.getValues("serverId")) {
      form.setValue("serverId", servers[0].id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [open, servers, form]);

  useEffect(() => {
    if (open && channels?.length && !form.getValues("channelId")) {
      // Only set channel if we actually have text/voice channels to pick from
      const defaultChannel =
        channels.find((c) => c.type === 0 || c.type === 2) || channels[0];
      form.setValue("channelId", defaultChannel.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [open, channels, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="dark:bg-neutral-900">
        <SheetHeader>
          <SheetTitle>Discord Message Configuration</SheetTitle>
          <SheetDescription>
            Configure the message you want to send through discord
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 mt-4 px-3"
          >
            <Activity mode={hasConnections ? "hidden" : "visible"}>
              <ConnectionButton
                icon={
                  <Icon
                    icon="streamline-logos:discord-logo-2-block"
                    className="size-6"
                  />
                }
                title="Connect to Discord"
                className="mb-3"
                link={`${process.env.NEXT_PUBLIC_API_URL}${endpoints.integrations.discord.callback(workflowId)}`}
              />
            </Activity>
            <Activity mode={hasConnections ? "visible" : "hidden"}>
              <FormField
                control={form.control}
                name="connectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Account</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingConnections}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Discord Account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {connections?.map((connection) => (
                          <SelectItem key={connection.id} value={connection.id}>
                            {connection.externalName || connection.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the Discord account to use
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Activity>
            <Activity mode={hasConnections ? "visible" : "hidden"}>
              <FormField
                control={form.control}
                name="serverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Server</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingServers || !selectedConnectionId}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Discord Server" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {servers?.map((server) => (
                          <SelectItem key={server.id} value={server.id}>
                            {server.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the Discord server to send the message to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Activity>
            <Activity
              mode={hasConnections && botInstalled ? "visible" : "hidden"}
            >
              <FormField
                control={form.control}
                name="channelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Channel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingChannels || !selectedServerId}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Discord Channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {channels
                          ?.filter(
                            (channel) =>
                              channel.type === 0 || channel.type === 2,
                          ) // Typically 0=text, 2=voice (for text in voice chat)
                          .map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              {channel.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the Discord channel to send the message to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>
                    <FormControl>
                      <Input placeholder="discordMessage" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use this name to reference the result in other nodes:{" "}
                      {`{{${field.value || "discordMessage"}.message}}`}
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
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Message"
                        {...field}
                        className="h-36"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the message you want to send in discord
                      {`(You can use variables inside this messages from other nodes.)`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Activity>
            <Activity
              mode={
                !botInstalled && !!form?.watch()?.serverId
                  ? "visible"
                  : "hidden"
              }
            >
              <ConnectionButton
                title='Invite "Hooks" Bot to this server'
                icon={<Icon icon="fluent:bot-48-filled" className="size-6" />}
                link={`${process.env.NEXT_PUBLIC_API_URL}${endpoints.integrations.discord.installBot(workflowId)}`}
              />
            </Activity>
            <Activity mode={hasConnections ? "visible" : "hidden"}>
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
            </Activity>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default GeminiDialog;
