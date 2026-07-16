"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
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
import { useDisburseProgramme } from "@/features/programmes/services/mutations";
import type { Programme } from "@lastmile/types/programmes";

const DisburseSchema = z.object({
  amountUsdc: z.number().positive("Amount must be greater than 0").max(10000, "Max amount is 10,000 USDC"),
});

type DisburseFormValues = z.infer<typeof DisburseSchema>;

interface DisburseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programme: Programme | null;
  onSuccess?: () => void;
}

export const DisburseDialog = ({ open, onOpenChange, programme, onSuccess }: DisburseDialogProps) => {
  const disburseMutation = useDisburseProgramme();

  const form = useForm<DisburseFormValues>({
    resolver: zodResolver(DisburseSchema as any),
    defaultValues: {
      amountUsdc: 10,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ amountUsdc: 10 });
    }
  }, [open, form]);

  const onSubmit = (values: DisburseFormValues) => {
    if (!programme) return;
    disburseMutation.mutate(
      { programmeId: programme.id, amountUsdc: values.amountUsdc },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Disbursement initiated successfully");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.error || "Failed to initiate disbursement");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trigger Programme Disbursement</DialogTitle>
          <DialogDescription>
            Enter the payout amount in USDC per participant for <strong>{programme?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amountUsdc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USDC)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 10"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={disburseMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={disburseMutation.isPending}>
                {disburseMutation.isPending ? "Disbursing..." : "Disburse Funds"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
