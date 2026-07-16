"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBatch } from "@/features/programmes/services/mutations";

const batchSchema = z.object({
  programmeName: z.string().min(1, "Programme name is required"),
  targetCurrency: z.string().min(1, "Currency is required"),
  batchSize: z.number().min(1, "Batch size must be at least 1"),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export interface CreateBatchFormProps {
  onSuccess?: () => void;
}

export const CreateBatchForm = ({ onSuccess }: CreateBatchFormProps = {}) => {
  const createBatchMutation = useCreateBatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BatchFormValues>({
    resolver: standardSchemaResolver(batchSchema),
  });

  const onSubmit = (data: BatchFormValues) => {
    createBatchMutation.mutate(data, {
      onSuccess: () => {
        reset();
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 px-1 py-4">
          <div className="space-y-2">
            <Label htmlFor="programmeName">Programme Name</Label>
            <Input
              id="programmeName"
              placeholder="e.g., Emergency Relief Q4"
              {...register("programmeName")}
            />
            {errors.programmeName && (
              <p className="text-sm text-destructive">{errors.programmeName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCurrency">Target Currency</Label>
            <Select
              value={watch("targetCurrency")}
              onValueChange={(value) => {
                if (value) setValue("targetCurrency", value);
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
            {errors.targetCurrency && (
              <p className="text-sm text-destructive">{errors.targetCurrency.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="batchSize">Batch Size</Label>
            <Input
              id="batchSize"
              type="number"
              placeholder="Number of participants"
              {...register("batchSize", { valueAsNumber: true })}
            />
            {errors.batchSize && (
              <p className="text-sm text-destructive">{errors.batchSize.message}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={createBatchMutation.isPending} className="w-full">
            {createBatchMutation.isPending ? "Creating..." : "Create Batch"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
