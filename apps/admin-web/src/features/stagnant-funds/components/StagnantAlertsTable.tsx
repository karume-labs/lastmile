"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import { useStagnantFunds } from "@/features/stagnant-funds/services/queries";

interface StagnantFundRecord {
  id: string;
  participantName: string;
  referenceId: string;
  programmeName: string;
  amount: string;
  currency: string;
  status: "stagnant" | "clawed-back" | "under-review";
  lastActivityDate: string;
  daysSinceActivity: number;
}

const STATUS_STYLES: Record<string, string> = {
  stagnant: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "clawed-back": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "under-review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

interface StagnantAlertsTableProps {
  onClawbackSelect?: (record: StagnantFundRecord) => void;
}

export const StagnantAlertsTable = ({ onClawbackSelect }: StagnantAlertsTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { search, setSearch, clearFilters } = useDataTablePagination();
  const { data: stagnantFundsResponse, isLoading } = useStagnantFunds();

  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const columns: ColumnDef<StagnantFundRecord, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              setSelectedRows((prev) => [...prev, row.original.id]);
            } else {
              setSelectedRows((prev) => prev.filter((id) => id !== row.original.id));
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "referenceId",
      header: "Reference ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {(row.getValue("referenceId") as string).slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "participantName",
      header: "Participant",
    },
    {
      accessorKey: "programmeName",
      header: "Programme",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <span className="font-medium">
            {record.amount} {record.currency}
          </span>
        );
      },
    },
    {
      accessorKey: "daysSinceActivity",
      header: "Days Stagnant",
      cell: ({ row }) => {
        const days = row.getValue("daysSinceActivity") as number;
        return <span className={days > 90 ? "font-bold text-destructive" : ""}>{days} days</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="secondary" className={STATUS_STYLES[status]}>
            {status === "clawed-back"
              ? "Clawed Back"
              : status === "under-review"
                ? "Under Review"
                : "Stagnant"}
          </Badge>
        );
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
                label: "Initiate Clawback",
                icon: <AlertTriangle className="size-4" />,
                onClick: () => onClawbackSelect?.(record),
                destructive: true,
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

  const rawData = stagnantFundsResponse?.data || [];

  const filteredData = rawData.filter((f: StagnantFundRecord) => {
    const matchesSearch =
      f.participantName.toLowerCase().includes(search.toLowerCase()) ||
      f.referenceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "" || statusFilter === "all" || f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      toolbar={
        <div className="flex items-center justify-between gap-4 w-full flex-wrap">
          <div className="flex-1">
            <DataToolbar
              searchKey="participantName"
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search stagnant funds..."
              onClear={() => {
                clearFilters();
                setStatusFilter("");
              }}
              filters={
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                  <SelectTrigger className="w-37.5">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="stagnant">Stagnant</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="clawed-back">Clawed Back</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
          </div>
          {selectedRows.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const firstSelected = filteredData.find(
                  (f: StagnantFundRecord) => f.id === selectedRows[0],
                );
                if (firstSelected) {
                  onClawbackSelect?.(firstSelected);
                }
              }}
            >
              <AlertTriangle className="mr-2 size-4" />
              Clawback Selected ({selectedRows.length})
            </Button>
          )}
        </div>
      }
      emptyMessage="No stagnant funds found."
    />
  );
};
