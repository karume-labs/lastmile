"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SmsCreateRequest, SmsMessage } from "@lastmile/types/sms";
import { SmsCreateRequestSchema } from "@lastmile/validators/sms";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/features/shared/components/table/DataTable";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { DataToolbar } from "@/features/shared/components/table/DataToolbar";
import { TableMenuActions } from "@/features/shared/components/table/TableMenuActions";
import { useDataTablePagination } from "@/features/shared/hooks/useDataTablePagination";
import { useCreateSms } from "@/features/sms/services/mutations";
import { useSmsMessages } from "@/features/sms/services/queries";

export const SmsContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { search, setSearch, clearFilters } = useDataTablePagination();
  const { data: smsResponse, isLoading } = useSmsMessages();
  const createSms = useCreateSms();

  const form = useForm<SmsCreateRequest>({
    resolver: zodResolver(SmsCreateRequestSchema),
    defaultValues: {
      recipient: "",
      content: "",
    },
  });

  const onSubmit = (values: SmsCreateRequest) => {
    createSms.mutate(values, {
      onSuccess: () => {
        toast.success("SMS queued for sending");
        setIsDialogOpen(false);
        form.reset();
      },
      onError: () => {
        toast.error("Failed to send SMS");
      },
    });
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
                ? "bg-primary text-primary-foreground"
                : status === "failed"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-secondary text-secondary-foreground"
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
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Send SMS
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send SMS Message</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <fieldset disabled={createSms.isPending} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">
                          Recipient Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1234567890"
                            className="bg-muted/50 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">
                          Message Content
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-muted/50 rounded-xl min-h-20"
                            placeholder="Type your message here..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full rounded-xl font-medium py-6"
                      disabled={createSms.isPending}
                    >
                      {createSms.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </fieldset>
              </form>
            </Form>
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
