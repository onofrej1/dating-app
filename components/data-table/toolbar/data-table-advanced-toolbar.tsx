"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

/*interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
}*/

export function DataTableAdvancedToolbar({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
