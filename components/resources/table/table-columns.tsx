"use client";

import type { ColumnDef, ColumnMeta } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { resources } from "@/resources";
import { TableData } from "@/types/resources";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from "lucide-react";
import { DataTableRowAction } from "@/types/data-table";
import { QueryClient } from "@tanstack/react-query";
import { getOptions } from "@/actions/resources";

interface GetColumnsProps {
  resource: string;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TableData> | null>
  >;
  queryClient: QueryClient;
}

export async function getColumns({
  resource: resourceName,
  setRowAction,
  queryClient,
}: GetColumnsProps): Promise<ColumnDef<TableData>[]> {
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    throw new Error("Resource not found");
  }

  const selectRowColumn: ColumnDef<TableData> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const actionColumn: ColumnDef<TableData> = {
    id: "actions",
    cell: function Cell(props) {
      const { row } = props;

      return (
        <div className="flex items-center gap-1">
          <Edit
            className="cursor-pointer"
            size={16}
            onClick={() => setRowAction({ row, variant: "update" })}
          />
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={() => setRowAction({ row, variant: "delete" })}
          />
        </div>
      );
    },
    /*cell: function Cell(props) {
      const { row } = props;
      const customActions = resource.list.find(
        (field) => field.name === "actions"
      );

      const EditMenuItem = (
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, variant: "update" })}
        >
          Edit
        </DropdownMenuItem>
      );

      const DeleteMenuItem = (
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, variant: "delete" })}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      );

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {resource.canEditItem === null ||
              (resource.canEditItem !== false && EditMenuItem)}
            {customActions?.render!(props, queryClient )}

            {resource.canRemoveItem === null ||
              (resource.canRemoveItem !== false && (
                <>
                  <DropdownMenuSeparator />
                  {DeleteMenuItem}
                </>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },*/
    size: 40,
  };

  const columns = await Promise.all(
    resource.list
      .filter((field) => field.name !== "actions")
      .map(async (field) => {
        const column = {
          id: field.name,
          accessorKey: field.name,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={field.header} />
          ),
          enableSorting:
            field.enableSort === undefined ? true : field.enableSort,
          enableHiding:
            field.enableHide === undefined ? true : field.enableHide,
          enableColumnFilter: !!field.enableColumnFilter,
        } as ColumnDef<TableData>;

        if (field.filter) {
          const filter = field.filter;
          const meta: ColumnMeta<TableData, unknown> = filter;
          meta.variant = filter.type;

          if (filter.type === 'select' || filter.type === 'multiSelect') {
            const optionsData = await queryClient.fetchQuery({
              queryKey: ["getOptions", filter.resource],
              queryFn: () => getOptions(filter.resource!),
            });
            const options = optionsData.map((option) => ({
              label: filter.renderOption
                ? filter.renderOption(option)
                : option.label,
              value: option.value,
            }));
            meta.options = options;
          }
          column.meta = meta;
        }

        if (field.render) {
          column.cell = (props) => {
            return field.render!(props, queryClient);
          };
        }
        return column;
      })
  );

  return [selectRowColumn, ...columns, actionColumn];
}
