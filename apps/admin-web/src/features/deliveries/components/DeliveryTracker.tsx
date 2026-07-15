"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { useDeliveries } from "@/features/deliveries/services/queries";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeliveryRecord {
  id: string;
  participantName: string;
  referenceId: string;
  programmeName: string;
  amount: string;
  currency: string;
  status: "pending" | "sent" | "delivered" | "failed";
  deliveryMethod: "direct" | "proxy-led";
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const METHOD_STYLES: Record<string, string> = {
  direct: "bg-primary/10 text-primary",
  "proxy-led": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

interface DeliveryTrackerProps {
  actions?: React.ReactNode;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ actions }) => {
  const [searchValue, setSearchValue] = useState("");
  const { state, handlers } = useDataTablePagination();
  const { data: deliveries, isLoading } = useDeliveries();

  const columns: ColumnDef<DeliveryRecord, unknown>[] = [
    {
      accessorKey: "referenceId",
      header: "Reference ID",
      cell: ({ row }) => {
        const id = row.getValue("referenceId") as string;
        return (
          <Tooltip>
            <TooltipTrigger>
              <span className="font-mono text-sm">{id.slice(0, 8)}...</span>
            </TooltipTrigger>
            <TooltipContent>{id}</TooltipContent>
          </Tooltip>
        );
      },
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
      accessorKey: "deliveryMethod",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("deliveryMethod") as string;
        return (
          <Badge variant="secondary" className={METHOD_STYLES[method]}>
            {method === "proxy-led" ? "Proxy-Led" : "Direct"}
          </Badge>
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
      header: "Date",
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
                label: "Retry Delivery",
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

  const filteredData = (deliveries ?? []).filter(
    (d: DeliveryRecord) =>
      d.participantName.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.referenceId.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      toolbar={
        <DataToolbar
          searchKey="participantName"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search by name or reference..."
        />
      }
      emptyMessage="No deliveries found."
    />
  );
};
