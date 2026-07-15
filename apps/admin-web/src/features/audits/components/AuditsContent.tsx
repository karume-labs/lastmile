"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAudits } from "@/features/audits/services/queries";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState, parseAsString } from "nuqs";
import type { ColumnDef } from "@tanstack/react-table";

interface AuditRecord {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
}

export const AuditsContent = () => {
  const { search, setSearch, clearFilters } = useDataTablePagination();
  
  const [severityFilter, setSeverityFilter] = useQueryState(
    "severity",
    parseAsString.withDefault("")
  );

  const { data: auditsResponse, isLoading } = useAudits();

  const columns: ColumnDef<AuditRecord, unknown>[] = [
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
        const severity = row.original.severity;
        return (
          <Badge
            variant="secondary"
            className={
              severity === "critical"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                : severity === "warning"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            }
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "timestamp",
      header: "Date",
      cell: ({ row }) => new Date(row.original.timestamp).toLocaleString(),
    },
    {
      id: "actions",
      cell: () => {
        return (
          <TableMenuActions
            actions={[
              {
                label: "View Details",
                onClick: () => {},
              },
            ]}
          />
        );
      },
    },
  ];

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} />;
  }

  const rawData = auditsResponse?.data || [];
  
  const filteredData = rawData.filter((a: AuditRecord) => {
    const matchesSearch = 
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.actor.toLowerCase().includes(search.toLowerCase()) ||
      a.target.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === "" || severityFilter === "all" || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
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
                  <SelectTrigger className="w-37.5">
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
  );
};
