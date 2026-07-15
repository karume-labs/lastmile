"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { Button } from "@/components/ui/button";
import { useStagnantFunds } from "@/features/stagnant-funds/services/queries";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

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

export const StagnantAlertsTable = ({
  onClawbackSelect,
}: StagnantAlertsTableProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { state, handlers } = useDataTablePagination();
  const { data: stagnantFunds, isLoading } = useStagnantFunds();

  const columns: ColumnDef<StagnantFundRecord, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
              setSelectedRows((prev) =>
                prev.filter((id) => id !== row.original.id),
              );
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
        return (
          <span className={days > 90 ? "font-bold text-destructive" : ""}>
            {days} days
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

  const filteredData = (stagnantFunds ?? []).filter(
    (f: StagnantFundRecord) =>
      f.participantName.toLowerCase().includes(searchValue.toLowerCase()) ||
      f.referenceId.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      toolbar={
        <div className="flex items-center justify-between">
          <DataToolbar
            searchKey="participantName"
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search stagnant funds..."
          />
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
