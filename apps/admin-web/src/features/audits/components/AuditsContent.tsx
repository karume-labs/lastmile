"use client";

import type { AuditLog } from "@lastmile/types/audit";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditDetailDialog } from "@/features/audits/components/AuditDetailDialog";
import { useAudits } from "@/features/audits/services/queries";
import { PermissionDenied } from "@/features/shared/components/PermissionDenied";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";

export const AuditsContent = () => {
  const { search, setSearch, clearFilters } = useDataTablePagination();
  const [viewingRecord, setViewingRecord] = useState<AuditLog | null>(null);

  const [severityFilter, setSeverityFilter] = useQueryState(
    "severity",
    parseAsString.withDefault(""),
  );

  const { data: auditsResponse, isLoading, isError, error } = useAudits();

  const columns: ColumnDef<AuditLog, unknown>[] = [
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "actor",
      header: "Actor",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.actor}</span>,
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.target}</span>,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("severity") as string;
        return (
          <Badge
            variant={
              severity === "high" ? "destructive" : severity === "medium" ? "default" : "secondary"
            }
          >
            {severity.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "timestamp",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.original.timestamp).toLocaleDateString();
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
                onClick: () => setViewingRecord(record),
              },
            ]}
          />
        );
      },
    },
  ];

  if (
    isError &&
    axios.isAxiosError(error) &&
    (error.response?.status === 401 || error.response?.status === 403)
  ) {
    return <PermissionDenied />;
  }

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} />;
  }

  const rawData = auditsResponse?.data || [];

  const filteredData = rawData.filter((a: AuditLog) => {
    const matchesSearch =
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.actor.toLowerCase().includes(search.toLowerCase()) ||
      a.target.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity =
      severityFilter === "" || severityFilter === "all" || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            toolbar={
              <DataToolbar
                gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
                searchKey="action"
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search action, actor, or target..."
                onClear={() => {
                  clearFilters();
                  setSeverityFilter("");
                }}
                filters={
                  <Select value={severityFilter} onValueChange={(val) => setSeverityFilter(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
            }
            emptyMessage="No audit entries found."
          />
        </CardContent>
      </Card>

      <AuditDetailDialog
        open={!!viewingRecord}
        onOpenChange={(open) => !open && setViewingRecord(null)}
        record={viewingRecord}
      />
    </>
  );
};
