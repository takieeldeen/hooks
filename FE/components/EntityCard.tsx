import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | {
      newButtonHref: string;
      onNew?: never;
    }
  | { onNew?: never; newButtonHref?: never }
);

export function EntityHeader({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {!!description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button onClick={onNew} disabled={disabled || isCreating}>
          <PlusIcon className="size-4" />
          {isCreating ? "Creating..." : newButtonLabel}
        </Button>
      )}
      {!onNew && newButtonHref && (
        <Button size="sm" asChild>
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {isCreating ? "Creating..." : newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

type EntityContainerProps = {
  header?: ReactNode;
  search?: ReactNode;
  pagination?: ReactNode;
  children: ReactNode;
};

export function EntityContainer({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto  w-full flex flex-col gap-y-8 ">
        {header}
        <div className="flex flex-col gap-y-4 h-full ">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
}

function EntityCard() {
  return <div>EntityCard</div>;
}

export default EntityCard;
