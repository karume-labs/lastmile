"use client";

import type { SmsMessage } from "@lastmile/types/sms";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import { useCreateSms } from "@/features/sms/services/mutations";
import { useSmsMessages } from "@/features/sms/services/queries";

export const SmsContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");

  const { search, setSearch, clearFilters } = useDataTablePagination();
  const { data: smsResponse, isLoading } = useSmsMessages();
  const createSms = useCreateSms();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !content) {
      toast.error("Please fill in both fields.");
      return;
    }

    createSms.mutate(
      { recipient, content },
      {
        onSuccess: () => {
          toast.success("SMS queued for sending");
          setIsDialogOpen(false);
          setRecipient("");
          setContent("");
        },
        onError: () => {
          toast.error("Failed to send SMS");
        },
      },
    );
  };

  const columns: ColumnDef<SmsMessage, unknown>[] = [
    {
      accessorKey: "recipient",
      header: "Recipient",
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => (
        <span className="truncate max-w-75 block" title={row.original.content}>
          {row.original.content}
        </span>
      ),
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
              status === "sent"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : status === "failed"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
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

  const rawData = smsResponse?.data || [];

  const filteredData = rawData.filter((msg: SmsMessage) => {
    const matchesSearch =
      msg.recipient.toLowerCase().includes(search.toLowerCase()) ||
      msg.content.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">SMS Messages</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Send SMS
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send SMS Message</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Recipient Phone Number
                </label>
                <Input
                  placeholder="+1234567890"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Message Content
                </label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type your message here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createSms.isPending}>
                  {createSms.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        toolbar={
          <DataToolbar
            gridClassName="grid grid-cols-1 gap-4"
            searchKey="recipient"
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search recipient or content..."
            onClear={clearFilters}
          />
        }
        emptyMessage="No SMS messages found."
      />
    </div>
  );
};
