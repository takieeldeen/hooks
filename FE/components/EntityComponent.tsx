import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import Image from "next/image";
import NO_RESULTS_IMAGE from "@/public/assets/not-found-img.svg";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
    <div className="p-4 md:px-4 md:py-2 h-full ">
      <div className="mx-auto  w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full flex-1  ">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
}

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EntitySearch({
  value,
  onChange,
  placeholder,
}: EntitySearchProps) {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="max-w-[200px] bg-background shadow-none border-border pl-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function EntityPagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) {
  return (
    <div
      className="flex items-center justify-between
  gap-x-2 w-full"
    >
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          onClick={() => {
            onPageChange(Math.max(page - 1, 1));
          }}
          variant="outline"
          size={"sm"}
          disabled={page === 1 || disabled}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size={"sm"}
          disabled={page === totalPages || disabled || totalPages === 0}
          onClick={() => {
            onPageChange(Math.min(page + 1, totalPages));
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

interface StateViewProps {
  message?: string;
}

interface LoadingViewProps extends StateViewProps {
  entity?: string;
}

export const LoadingView = ({ entity, message }: LoadingViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1  flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      {Boolean(message) && (
        <p className="text-sm text-muted-foreground">
          {message || `Loading ${entity}...`}
        </p>
      )}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export function EmptyViews({ message, onNew }: EmptyViewProps) {
  return (
    <Empty className="border border-dashed light:bg-white max-w-lg mx-auto ">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No items</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew}>Add item</Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

interface NotFoundProps extends StateViewProps {
  onReset?: () => void;
}

export function NotFoundView({ message, onReset }: NotFoundProps) {
  return (
    <Empty className="border border-dashed bg-white max-w-lg mx-auto">
      <EmptyHeader>
        <EmptyMedia>
          <Image src={NO_RESULTS_IMAGE} alt="No Results Found" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>Not Found</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onReset && (
        <EmptyContent>
          <Button onClick={onReset}>Reset Filters</Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: ReactNode;
  className?: string;
  isEmpty?: boolean;
  notFound?: boolean;
  notFoundView?: ReactNode;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
  isEmpty,
  notFound,
  notFoundView,
}: EntityListProps<T>) {
  if (isEmpty && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }
  if (notFound && notFoundView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{notFoundView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href?: string;
  title: string;
  subtitle?: ReactNode;
  image?: ReactNode;
  actions?: ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export function EntityItem({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRemoving) return;
    if (onRemove) {
      await onRemove();
    }
  };
  const content = (
    <Card
      className={cn(
        "p-4 shadow-none hover:shadow cursor-pointer",
        isRemoving && "opacity-50 cursor-not-allowed",
        className,
        !href && "cursor-default",
      )}
    >
      <CardContent className="flex flex-row items-center justify-between p-0">
        <div className="flex items-center gap-3">
          {image}
          <div>
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            {!!subtitle && (
              <CardDescription className="text-xs">{subtitle}</CardDescription>
            )}
          </div>
        </div>
        {(!!actions || onRemove) && (
          <div className="flex gap-x-4 items-center">
            {actions}
            {onRemove && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation}
                >
                  <DropdownMenuItem onClick={handleRemove}>
                    <TrashIcon className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} prefetch>
        {content}
      </Link>
    );
  }

  return content;
}
