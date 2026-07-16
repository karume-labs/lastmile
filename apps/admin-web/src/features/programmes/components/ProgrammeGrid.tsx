"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProgrammes } from "@/features/programmes/services/queries";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";

interface ProgrammeRecord {
  id: string;
  name: string;
  status: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  budget: number;
}

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

export const ProgrammeGrid = () => {
  const { search, setSearch, clearFilters } = useDataTablePagination();

  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const [audienceFilter, setAudienceFilter] = useQueryState(
    "audience",
    parseAsString.withDefault(""),
  );

  const { data: programmesResponse, isLoading } = useProgrammes();

  const handleClearFilters = () => {
    clearFilters();
    setStatusFilter("");
    setAudienceFilter("");
  };

  const columns: ColumnDef<ProgrammeRecord, unknown>[] = [
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

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }

  const rawData = programmesResponse?.data || [];

  const filteredData = rawData.filter((p: ProgrammeRecord) => {
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
