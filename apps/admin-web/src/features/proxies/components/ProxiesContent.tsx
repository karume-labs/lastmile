"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UserCheck, UserMinus, UserX } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProxies } from "@/features/proxies/services/queries";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";

interface ProxyRecord {
  id: string;
  name: string;
  phone: string;
  status: "active" | "suspended";
  participantCount: number;
  location: string;
  role: string;
}

export const ProxiesContent = () => {
  const { search, setSearch, clearFilters } = useDataTablePagination();

  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const [roleFilter, setRoleFilter] = useQueryState("role", parseAsString.withDefault(""));

  const { data: proxiesResponse, isLoading } = useProxies();

  const columns: ColumnDef<ProxyRecord, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "participantCount",
      header: "Participants",
      cell: ({ row }) => row.original.participantCount,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="secondary"
            className={
              status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }
          >
            {status === "active" ? (
              <UserCheck className="mr-1 size-3" />
            ) : (
              <UserX className="mr-1 size-3" />
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
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
                label: "View Profile",
                onClick: () => {},
              },
              {
                label: record.status === "active" ? "Suspend Access" : "Restore Access",
                destructive: record.status === "active",
                icon:
                  record.status === "active" ? (
                    <UserMinus className="size-4" />
                  ) : (
                    <UserCheck className="size-4" />
                  ),
                onClick: () => {},
              },
            ]}
          />
        );
      },
    },
  ];

  if (isLoading) {
    return <DataTableSkeleton columnCount={7} />;
  }

  const rawData = proxiesResponse?.data || [];

  const filteredData = rawData.filter((p: ProxyRecord) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" || statusFilter === "all" || p.status === statusFilter;
    const matchesRole = roleFilter === "" || roleFilter === "all" || p.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Agents & Proxies</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredData}
          toolbar={
            <DataToolbar
              gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              searchKey="name"
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search name, phone, or location..."
              onClear={() => {
                clearFilters();
                setStatusFilter("");
                setRoleFilter("");
              }}
              filters={
                <>
                  <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Field Agent">Field Agent</SelectItem>
                      <SelectItem value="Distributor">Distributor</SelectItem>
                      <SelectItem value="Volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              }
            />
          }
          emptyMessage="No proxy agents found."
        />
      </CardContent>
    </Card>
  );
};
