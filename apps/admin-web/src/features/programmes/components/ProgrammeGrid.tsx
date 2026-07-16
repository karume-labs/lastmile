"use client";

import type { Programme } from "@lastmile/types/programmes";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProgrammes } from "@/features/programmes/services/queries";
import { PermissionDenied } from "@/features/shared/components/PermissionDenied";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-accent text-accent-foreground",
  Draft: "bg-secondary text-secondary-foreground",
  Completed: "bg-primary text-primary-foreground",
};

export const ProgrammeGrid = () => {
  const { search, setSearch, clearFilters } = useDataTablePagination();

  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const [audienceFilter, setAudienceFilter] = useQueryState(
    "audience",
    parseAsString.withDefault(""),
  );

  const { data: programmesResponse, isLoading, isError, error } = useProgrammes();

  const handleClearFilters = () => {
    clearFilters();
    setStatusFilter("");
    setAudienceFilter("");
  };

  const disburseMutation = useMutation({
    mutationFn: async (payload: { programmeId: string; amountUsdc: number }) => {
      const response = await axios.post("/api/programmes/disburse", payload);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Disbursement initiated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to disburse");
    },
  });

  const columns: ColumnDef<Programme, unknown>[] = [
    {
      accessorKey: "name",
      header: "Programme",
    },
    {
      accessorKey: "targetAudience",
      header: "Target Audience",
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => (
        <span className="font-medium">${row.original.budget.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant="secondary" className={STATUS_STYLES[status] || ""}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
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
                label: "Disburse Batch",
                onClick: () => {
                  if (confirm(`Are you sure you want to disburse to all participants in ${record.name}?`)) {
                    // For demo purposes, we will default amountUsdc to 10
                    disburseMutation.mutate({ programmeId: record.id, amountUsdc: 10 });
                  }
                },
              },
              {
                label: record.status === "Active" ? "Pause" : "Resume",
                onClick: () => {},
              },
              {
                label: "Delete",
                destructive: true,
                onClick: () => {},
              },
            ]}
          />
        );
      },
    },
  ];

  if (isError && ((error as any)?.response?.status === 401 || (error as any)?.response?.status === 403)) {
    return <PermissionDenied />;
  }

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }

  const rawData = programmesResponse?.data || [];

  const filteredData = rawData.filter((p: Programme) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "" || statusFilter === "all" || p.status === statusFilter;
    const matchesAudience =
      audienceFilter === "" || audienceFilter === "all" || p.targetAudience === audienceFilter;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      toolbar={
        <DataToolbar
          gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          searchKey="name"
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search programmes..."
          onClear={handleClearFilters}
          filters={
            <>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={audienceFilter} onValueChange={(val) => setAudienceFilter(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Audiences</SelectItem>
                  <SelectItem value="Families">Families</SelectItem>
                  <SelectItem value="Homeless">Homeless</SelectItem>
                  <SelectItem value="Children">Children</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
      }
      emptyMessage="No programmes found."
    />
  );
};
