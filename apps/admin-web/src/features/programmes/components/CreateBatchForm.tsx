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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
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
                <Field data-invalid={!!form.formState.errors.programmeName}>
                  <FieldLabel htmlFor={field.name}>Programme Name</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g., Emergency Relief Q4"
                    {...field}
                    aria-invalid={!!form.formState.errors.programmeName}
                  />
                  {form.formState.errors.programmeName && (
                    <FieldError>{form.formState.errors.programmeName.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="targetCurrency"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.targetCurrency}>
                  <FieldLabel htmlFor={field.name}>Target Currency</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.targetCurrency && (
                    <FieldError>{form.formState.errors.targetCurrency.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="batchSize"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.batchSize}>
                  <FieldLabel htmlFor={field.name}>Batch Size</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="Number of participants"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    aria-invalid={!!form.formState.errors.batchSize}
                  />
                  {form.formState.errors.batchSize && (
                    <FieldError>{form.formState.errors.batchSize.message}</FieldError>
                  )}
                </Field>
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
