"use client";

import type { Programme } from "@lastmile/types/programmes";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DisburseDialog } from "@/features/programmes/components/DisburseDialog";
import {
  useDeleteProgramme,
  useToggleProgrammeStatus,
} from "@/features/programmes/services/mutations";
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
  const [disburseConfirmTarget, setDisburseConfirmTarget] = useState<Programme | null>(null);
  const { search, setSearch, clearFilters } = useDataTablePagination();
  const toggleStatus = useToggleProgrammeStatus();
  const deleteProgramme = useDeleteProgramme();

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
                onClick: () =>
                  toast.info(
                    `${record.name} — ${record.targetAudience} — Budget: $${record.budget.toLocaleString()} — Status: ${record.status}`,
                  ),
              },
              {
                label: "Edit Programme",
                onClick: () => toast.info("Edit functionality coming soon"),
              },
              {
                label: "Disburse Batch",
                onClick: () => {
                  setDisburseConfirmTarget(record);
                },
              },
              {
                label: record.status === "Active" ? "Pause" : "Resume",
                onClick: () => {
                  const newStatus = record.status === "Active" ? "Draft" : "Active";
                  toggleStatus.mutate(
                    { programmeId: record.id, status: newStatus },
                    {
                      onSuccess: () =>
                        toast.success(`Programme ${newStatus === "Active" ? "resumed" : "paused"}`),
                      onError: () => toast.error("Failed to update programme status"),
                    },
                  );
                },
              },
              {
                label: "Delete",
                destructive: true,
                requiresConfirm: true,
                confirmTitle: "Delete this programme?",
                confirmDescription: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
                onClick: () => {
                  deleteProgramme.mutate(record.id, {
                    onSuccess: () => toast.success("Programme deleted"),
                    onError: () => toast.error("Failed to delete programme"),
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
    <>
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

      <DisburseDialog
        open={!!disburseConfirmTarget}
        onOpenChange={(open) => !open && setDisburseConfirmTarget(null)}
        programme={disburseConfirmTarget}
      />
    </>
  );
};
