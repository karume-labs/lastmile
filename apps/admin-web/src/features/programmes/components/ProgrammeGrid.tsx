"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { useProgrammes } from "@/features/programmes/services/queries";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import { useState } from "react";

interface ProgrammeRecord {
  id: string;
  name: string;
  batchSize: number;
  disbursed: number;
  pending: number;
  totalAmount: string;
  currency: string;
  status: "active" | "paused" | "completed";
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

export const ProgrammeGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const { state, handlers } = useDataTablePagination();
  const { data: programmes, isLoading } = useProgrammes();

  const columns: ColumnDef<ProgrammeRecord, unknown>[] = [
    {
      accessorKey: "name",
      header: "Programme",
    },
    {
      accessorKey: "batchSize",
      header: "Batch Size",
    },
    {
      accessorKey: "disbursed",
      header: "Disbursed",
    },
    {
      accessorKey: "pending",
      header: "Pending",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <span className="font-medium">
            {record.totalAmount} {record.currency}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="secondary" className={STATUS_STYLES[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt") as string).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <TableMenuActions
            actions={[
              {
                label: "View Details",
                onClick: () => {},
              },
              {
                label: "Edit Programme",
                onClick: () => {},
              },
              {
                label: record.status === "active" ? "Pause" : "Resume",
                onClick: () => {},
              },
            ]}
          />
        );
      },
    },
  ];

  if (isLoading) {
    return <DataTableSkeleton columnCount={8} />;
  }

  const filteredData = (programmes ?? []).filter(
    (p: ProgrammeRecord) =>
      p.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      toolbar={
        <DataToolbar
          searchKey="name"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search programmes..."
        />
      }
      emptyMessage="No programmes found."
    />
  );
};
