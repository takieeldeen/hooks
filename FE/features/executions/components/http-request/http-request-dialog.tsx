import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useMemo } from "react";
import z from "zod";
import { HttpRequestNodeData } from "./HttpRequestNode";
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

const formSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  endpoint: z.url({ message: "Please enter a valid URL" }),
  body: z.string().optional(),
});

function HttpRequestDialog({
  open,
  onOpenChange,
  nodeData,
  nodeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: HttpRequestNodeData;
  nodeId: string;
}) {
  const { updateNodeData } = useReactFlow();
  const defaultValues = useMemo(
    () => ({
      method: nodeData?.method || "GET",
      endpoint: nodeData?.endpoint || "",
      body: nodeData?.body || "",
    }),
    [nodeData?.body, nodeData?.endpoint, nodeData?.method],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;
  const method = watch("method");
  const hasBody = ["POST", "PUT", "PATCH"].includes(method);
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateNodeData(nodeId, data);
    onOpenChange(false);
  };
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings of the HTTP request Node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
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
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The HTTP method to use for this request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Static URL or use {"{{variables}}"} for simple values or{" "}
                    {"{{json variable}}"} to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hasBody && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={
                          '{\n "userId": "{{httpResponse.data.id}}",\n "name": "{{httpResponse.data.name}}",\n"items": {{json httpResponse.data.items}}\n}'
                        }
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default HttpRequestDialog;
