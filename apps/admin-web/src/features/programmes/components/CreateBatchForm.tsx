"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { CreateBatchRequest } from "@lastmile/types/programmes";
import { CreateBatchRequestSchema } from "@lastmile/validators/programmes";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
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
import { useCreateBatch } from "@/features/programmes/services/mutations";

export interface CreateBatchFormProps {
  onSuccess?: () => void;
}

export const CreateBatchForm = ({ onSuccess }: CreateBatchFormProps = {}) => {
  const createBatchMutation = useCreateBatch();
  const form = useForm<CreateBatchRequest>({
    resolver: standardSchemaResolver(CreateBatchRequestSchema),
  });

  const onSubmit = (data: CreateBatchRequest) => {
    createBatchMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Batch</DialogTitle>
        <DialogDescription>Create a new disbursement batch for a programme.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 px-1 py-4">
            <FormField
              control={form.control}
              name="programmeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Emergency Relief Q4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Currency</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batchSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of participants"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createBatchMutation.isPending} className="w-full">
              {createBatchMutation.isPending ? "Creating..." : "Create Batch"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
