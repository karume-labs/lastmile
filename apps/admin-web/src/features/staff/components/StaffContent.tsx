"use client";

import type { ColumnDef } from "@tanstack/react-table";
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
import { PermissionDenied } from "@/features/shared/components/PermissionDenied";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import { type StaffMember, useStaff } from "@/features/staff/services/queries";

export const StaffContent = () => {
  const { search, setSearch, clearFilters } = useDataTablePagination();

  const [roleFilter, setRoleFilter] = useQueryState("role", parseAsString.withDefault(""));
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const { data: staffResponse, isLoading, isError, error } = useStaff();

  const columns: ColumnDef<StaffMember, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role ?? "staff";
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "banned",
      header: "Status",
      cell: ({ row }) => {
        const banned = row.original.banned;
        return (
          <Badge
            variant="outline"
            className={banned ? "text-destructive border-destructive" : "text-accent border-accent"}
          >
            {banned ? "Banned" : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <TableMenuActions
            actions={[
              {
                label: "Edit Staff",
                onClick: () => {},
              },
              {
                label: member.banned ? "Unban User" : "Ban User",
                destructive: !member.banned,
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
    return <DataTableSkeleton columnCount={5} />;
  }

  const rawData = staffResponse?.data ?? [];

  const filteredData = rawData.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "" || roleFilter === "all" || s.role === roleFilter;
    const matchesStatus =
      statusFilter === "" ||
      statusFilter === "all" ||
      (statusFilter === "active" && !s.banned) ||
      (statusFilter === "banned" && s.banned);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
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
              searchPlaceholder="Search name or email..."
              onClear={() => {
                clearFilters();
                setRoleFilter("");
                setStatusFilter("");
              }}
              filters={
                <>
                  <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              }
            />
          }
          emptyMessage="No staff members found."
        />
      </CardContent>
    </Card>
  );
};

