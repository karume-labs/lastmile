"use client";

import type { Disbursement } from "@lastmile/types/programmes";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRetryDelivery } from "@/features/deliveries/services/mutations";
import { useDeliveries } from "@/features/deliveries/services/queries";
import { PermissionDenied } from "@/features/shared/components/PermissionDenied";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground",
  sent: "bg-primary text-primary-foreground",
  delivered: "bg-accent text-accent-foreground",
  failed: "bg-destructive text-destructive-foreground",
};

const METHOD_STYLES: Record<string, string> = {
  direct: "bg-primary/10 text-primary",
  "proxy-led": "bg-muted text-muted-foreground",
};

interface DeliveryTrackerProps {
  actions?: React.ReactNode;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ actions }) => {
  const { search, setSearch, clearFilters } = useDataTablePagination();
  const retryDelivery = useRetryDelivery();

  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const [methodFilter, setMethodFilter] = useQueryState("method", parseAsString.withDefault(""));

  const { data: deliveriesResponse, isLoading, isError, error } = useDeliveries();

  const columns: ColumnDef<Disbursement, unknown>[] = [
    {
      accessorKey: "referenceId",
      header: "Reference ID",
      cell: ({ row }) => {
        const id = row.getValue("referenceId") as string;
        return (
          <Tooltip>
            <TooltipTrigger>
              <span className="font-mono text-sm cursor-pointer border-b border-dashed">
                {id.slice(0, 8)}...
              </span>
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
        return new Date(row.original.createdAt).toLocaleDateString();
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
                onClick: () =>
                  toast.info(
                    `${record.participantName} — ${record.referenceId} — ${record.amount} ${record.currency} — ${record.status}`,
                  ),
              },
              {
                label: "Retry Delivery",
                onClick: () => {
                  retryDelivery.mutate(record.id, {
                    onSuccess: () => toast.success("Delivery retry initiated"),
                    onError: () => toast.error("Failed to retry delivery"),
                  });
                },
              },
            ]}
          />
        );
      },
    },
  ];

  if (
    isError &&
    ((error as any)?.response?.status === 401 || (error as any)?.response?.status === 403)
  ) {
    return <PermissionDenied />;
  }

  if (isLoading) {
    return <DataTableSkeleton columnCount={8} />;
  }

  const rawData = deliveriesResponse?.data || [];

  const filteredData = rawData.filter((d: Disbursement) => {
    const matchesSearch =
      d.participantName.toLowerCase().includes(search.toLowerCase()) ||
      d.referenceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "" || statusFilter === "all" || d.status === statusFilter;
    const matchesMethod =
      methodFilter === "" || methodFilter === "all" || d.deliveryMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      toolbar={
        <DataToolbar
          actions={actions}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          searchKey="participantName"
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or reference..."
          onClear={() => {
            clearFilters();
            setStatusFilter("");
            setMethodFilter("");
          }}
          filters={
            <>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={(val) => setMethodFilter(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="proxy-led">Proxy-Led</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
      }
      emptyMessage="No deliveries found."
    />
  );
};
