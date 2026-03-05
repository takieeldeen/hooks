"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CredentialTypes, CredentialType } from "@/types/credentials";
import { useCreateCredential, useUpdateCredential } from "@/api/credentials";
import { useCallback, useEffect } from "react";

const credentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialTypes),
  value: z.string().min(1, "Value is required"),
});

type CredentialFormValues = z.infer<typeof credentialSchema>;

export function CredentialForm({
  open,
  onClose,
  defaultValues,
}: {
  open: boolean;
  onClose: () => void;
  defaultValues?: { id: string; name: string; type: CredentialType };
}) {
  const { mutateAsync: createCredential, isPending: isCreating } =
    useCreateCredential();
  const { mutateAsync: updateCredential, isPending: isUpdating } =
    useUpdateCredential();
  const isEditMode = !!defaultValues;

  const form = useForm<CredentialFormValues>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      type: defaultValues?.type || CredentialTypes[0],
      value: "",
    },
  });

  // Life Cycle Logic /////////////////////////////////////
  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultValues?.name || "",
        type: defaultValues?.type || CredentialTypes[0],
        value: "",
      });
    }
  }, [open, defaultValues, form]);

  const onSubmit = useCallback(
    async (values: CredentialFormValues) => {
      try {
        if (isEditMode && defaultValues?.id) {
          await updateCredential({
            credentialId: defaultValues.id,
            payload: values,
          });
        } else {
          await createCredential(values);
        }
        onClose();
      } catch {
        // Error is handled in mutation hooks
      }
    },
    [isEditMode, defaultValues, updateCredential, createCredential, onClose],
  );

  const isPending = isCreating || isUpdating;

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="left" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Update Credential" : "Add New Credential"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update your credential details. You will need to re-enter the API key."
              : "Enter your API credentials to connect with AI providers."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4 px-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CredentialTypes?.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type?.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditMode ? "New API Key / Token" : "API Key / Token"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="sk-..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Credential"
                  : "Create Credential"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
