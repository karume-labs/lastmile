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
import { useUnblockParticipant } from "@/features/registration/services/mutations";
import { type Participant, useParticipants } from "@/features/registration/services/queries";
import { PermissionDenied } from "@/features/shared/components/PermissionDenied";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";

export const ParticipantsContent = () => {
  const unblockMutation = useUnblockParticipant();
  const { search, setSearch, clearFilters } = useDataTablePagination();

  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault(""));

  const { data: participantsResponse, isLoading, isError, error } = useParticipants();

  const columns: ColumnDef<Participant, unknown>[] = [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.fullName}</span>,
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "referenceId",
      header: "Reference ID",
      cell: ({ row }) => <Badge variant="outline">{row.original.referenceId}</Badge>,
    },
    {
      accessorKey: "failedAttempts",
      header: "Failed Attempts",
      cell: ({ row }) => {
        const attempts = row.original.failedAttempts;
        return (
          <Badge variant={attempts >= 3 ? "destructive" : attempts > 0 ? "secondary" : "outline"}>
            {attempts}
          </Badge>
        );
      },
    },
    {
      accessorKey: "ussdBlocked",
      header: "Status",
      cell: ({ row }) => {
        const { ussdBlocked, lockoutUntil } = row.original;
        const now = new Date();
        const isLockedOut = lockoutUntil && new Date(lockoutUntil) > now;

        if (ussdBlocked) {
          return <Badge variant="destructive">Blocked</Badge>;
        }
        if (isLockedOut) {
          return (
            <Badge variant="secondary" className="text-yellow-600 border-yellow-600">
              Locked Out
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Active
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const participant = row.original;
        return (
          <TableMenuActions
            actions={[
              {
                label: "Unblock Participant",
                requiresConfirm: true,
                confirmTitle: "Restore USSD access?",
                confirmDescription: `Are you sure you want to restore USSD access for ${participant.fullName}?`,
                onClick: () => unblockMutation.mutate(participant.id),
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

  const rawData = participantsResponse?.data ?? [];

  const filteredData = rawData.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceId.toLowerCase().includes(search.toLowerCase());

    const now = new Date();
    const isLockedOut = p.lockoutUntil && new Date(p.lockoutUntil) > now;
    const matchesStatus =
      statusFilter === "" ||
      statusFilter === "all" ||
      (statusFilter === "active" && !p.ussdBlocked && !isLockedOut) ||
      (statusFilter === "blocked" && p.ussdBlocked) ||
      (statusFilter === "locked_out" && isLockedOut && !p.ussdBlocked);

    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredData}
          toolbar={
            <DataToolbar
              gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
              searchKey="fullName"
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search name, phone, or reference..."
              onClear={() => {
                clearFilters();
                setStatusFilter("");
              }}
              filters={
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="locked_out">Locked Out</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
          }
          emptyMessage="No participants found."
        />
      </CardContent>
    </Card>
  );
};
