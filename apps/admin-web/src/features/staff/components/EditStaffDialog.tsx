"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateStaffSchema } from "@lastmile/validators/staff";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateStaff } from "@/features/staff/services/mutations";
import type { StaffMember } from "@/features/staff/services/queries";

type EditStaffFormValues = z.infer<typeof UpdateStaffSchema>;

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
}

export const EditStaffDialog = ({ open, onOpenChange, staff }: EditStaffDialogProps) => {
  const updateStaffMutation = useUpdateStaff();

  const form = useForm<EditStaffFormValues>({
    resolver: zodResolver(UpdateStaffSchema as any),
    defaultValues: {
      name: "",
      role: "staff",
    },
  });

  useEffect(() => {
    if (staff && open) {
      form.reset({
        name: staff.name ?? "",
        role: staff.role === "admin" || staff.role === "staff" ? staff.role : "staff",
      });
    }
  }, [staff, open, form]);

  const onSubmit = (values: EditStaffFormValues) => {
    if (!staff) return;
    updateStaffMutation.mutate(
      { id: staff.id, ...values },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update role and details for <strong>{staff?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value as "admin" | "staff");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateStaffMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateStaffMutation.isPending}>
                {updateStaffMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
