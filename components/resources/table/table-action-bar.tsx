"use client";

import type { Table } from "@tanstack/react-table";
import { Download, Trash2 } from "lucide-react";
import * as React from "react";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { exportTableToCSV } from "@/lib/export";
import { TableData } from "@/types/resources";
import { remove } from "@/actions/resources";
import { ResourceContext, useContext } from "@/resource-context";
import { useQueryClient } from "@tanstack/react-query";

type Action = 'export' | 'delete';

interface TasksTableActionBarProps {
  table: Table<TableData>;
}

export function TableActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const queryClient = useQueryClient();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const {
    resource: { resource },
  } = useContext(ResourceContext);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  const onDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      const data = rows.map((row) => row.original.id);
      await remove(resource, data);
      table.toggleAllRowsSelected(false);
      queryClient.invalidateQueries({
        queryKey: ["getAll", resource],
      });
    });
  }, [queryClient, resource, rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Export tasks"
          isPending={getIsActionPending("export")}
          onClick={onExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          isPending={getIsActionPending("delete")}
          onClick={onDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
