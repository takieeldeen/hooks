import React, { ComponentProps, ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ConnectionButtonProps = {
  icon?: ReactNode;
  title?: string;
  link?: string;
} & Omit<ComponentProps<"button">, "children" | "onClick">;
function ConnectionButton({
  className,
  icon,
  title,
  link,
  ...rest
}: ConnectionButtonProps) {
  return (
    <Button
      type="button"
      {...rest}
      className={cn(
        "bg-indigo-600 text-white h-12 hover:bg-indigo-600 hover:brightness-90 transition-all w-full",
        className,
      )}
      onClick={() => {
        window.location.href = link!;
      }}
    >
      {!!icon && icon}
      {!!title && <span>{title}</span>}
    </Button>
  );
}

export default ConnectionButton;
