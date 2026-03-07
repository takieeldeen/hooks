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
import { AnthropicNodeData } from "./anthropic-node";
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
import { useGetCredentialsByType } from "@/api/credentials";

export const ANTHROPIC_AVAILABLE_MODELS = [
  "claude-3-5-sonnet-20240620",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
] as const;

const formSchema = z.object({
  credentialId: z.string().min(1, "Please choose an API key"),
  model: z.enum(ANTHROPIC_AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User Prompt is Required"),

  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    ),
});

function AnthropicDialog({
  open,
  onOpenChange,
  nodeData,
  nodeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: AnthropicNodeData;
  nodeId: string;
}) {
  const { workflowId } = useParams();
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const { mutateAsync: updateWorkflow, isPending: isUpdating } =
    useUpdateWorkflow();

  const { data: credentials, isPending: isLoadingCredentials } =
    useGetCredentialsByType("ANTHROPIC");

  const defaultValues = useMemo(
    () => ({
      credentialId: nodeData?.credentialId || "",

      model: nodeData?.model || ANTHROPIC_AVAILABLE_MODELS[0],
      systemPrompt: nodeData?.systemPrompt || "",
      userPrompt: nodeData?.userPrompt || "",
      variableName: nodeData?.variableName || "",
    }),
    [
      nodeData?.credentialId,
      nodeData?.model,
      nodeData?.systemPrompt,
      nodeData?.userPrompt,
      nodeData?.variableName,
    ],
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

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="dark:bg-neutral-900">
        <SheetHeader>
          <SheetTitle>Anthropic Configuration</SheetTitle>
          <SheetDescription>
            Configure the AI model and prompts for this node.
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
                    <Input placeholder="anthropic_result" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${field.value || "anthropic_result"}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Api Key</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        isLoading={isLoadingCredentials}
                        isEmpty={
                          !isLoadingCredentials &&
                          (credentials?.content?.length ?? 0) === 0
                        }
                        className="w-full"
                      >
                        <SelectValue placeholder="Select an API Key" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(credentials?.content ?? []).map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          {credential.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the api key for your agent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ANTHROPIC_AVAILABLE_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the agent you want to use for the prompt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a helpful assistant"
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sets the behavior of the assistant. Use {"{{variables}}"}{" "}
                    for simple values or
                    {"{{json variable}}"} to stringify objects
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[80px] font-mono text-sm"
                      placeholder={
                        "Summarize this text: {{json httpResponse.data}}"
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    The prompt to send to the AI. Use {"{{variables}} "}
                    for simple values or {"{{json variables}}"} to stringify
                    objects
                  </FormDescription>
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

export default AnthropicDialog;
