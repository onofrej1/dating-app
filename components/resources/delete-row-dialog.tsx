"use client";

import type { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TableData } from "@/types/resources";
import { remove } from "@/actions/resources";
import { ResourceContext, useContext } from "@/resource-context";

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  row: Row<TableData>["original"];
  onSuccess?: () => void;
}

export function DeleteRowDialog({
  row,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const {
    resource: { resource },
  } = useContext(ResourceContext);

  function onDelete() {
    startDeleteTransition(async () => {
      await remove(resource, [row.id]);
      /*const { error } = await remove(resource, [row.id]);
      if (error) {
        toast.error(error);
        return;
      }*/

      props.onOpenChange?.(false);
      toast.success("Row deleted");
      onSuccess?.();
    });
  }

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash className="mr-2 size-4" aria-hidden="true" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
