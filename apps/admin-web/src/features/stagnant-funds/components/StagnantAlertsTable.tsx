"use client";

import type { StagnantFundItem } from "@lastmile/types/programmes";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
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

const STATUS_STYLES: Record<string, string> = {
  stagnant: "bg-secondary text-secondary-foreground",
  "clawed-back": "bg-destructive text-destructive-foreground",
  "under-review": "bg-primary text-primary-foreground",
};

interface StagnantAlertsTableProps {
  onClawbackSelect?: (record: StagnantFundItem) => void;
}

export const StagnantAlertsTable = ({ onClawbackSelect }: StagnantAlertsTableProps) => {
  const { search, setSearch, clearFilters } = useDataTablePagination();
  const { data: stagnantFundsResponse, isLoading } = useStagnantFunds();

  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const columns: ColumnDef<StagnantFundItem, unknown>[] = [
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

  const filteredData = rawData.filter((f: StagnantFundItem) => {
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
        <DataToolbar
          gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
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
              <SelectTrigger className="w-full">
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
      }
      emptyMessage="No stagnant funds found."
    />
  );
};
