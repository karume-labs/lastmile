"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBatch } from "@/features/programmes/services/mutations";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";

const batchSchema = z.object({
  programmeName: z.string().min(1, "Programme name is required"),
  targetCurrency: z.string().min(1, "Currency is required"),
  batchSize: z.number().min(1, "Batch size must be at least 1"),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export const CreateBatchForm = () => {
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
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Batch</CardTitle>
        <CardDescription>
          Create a new disbursement batch for a programme.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="programmeName">Programme Name</Label>
            <Input
              id="programmeName"
              placeholder="e.g., Emergency Relief Q4"
              {...register("programmeName")}
            />
            {errors.programmeName && (
              <p className="text-sm text-destructive">
                {errors.programmeName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCurrency">Target Currency</Label>
            <Select
              value={watch("targetCurrency")}
              onValueChange={(value) => { if (value) setValue("targetCurrency", value); }}
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
              <p className="text-sm text-destructive">
                {errors.targetCurrency.message}
              </p>
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
              <p className="text-sm text-destructive">
                {errors.batchSize.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={createBatchMutation.isPending}
            className="w-full"
          >
            {createBatchMutation.isPending ? "Creating..." : "Create Batch"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
