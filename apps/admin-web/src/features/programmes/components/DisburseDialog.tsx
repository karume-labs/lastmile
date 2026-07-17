"use client";

import type { Programme } from "@lastmile/types/programmes";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDisburseProgramme } from "@/features/programmes/services/mutations";

interface DisburseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programme: Programme | null;
  onSuccess?: () => void;
}

export const DisburseDialog = ({
  open,
  onOpenChange,
  programme,
  onSuccess,
}: DisburseDialogProps) => {
  const disburseMutation = useDisburseProgramme();

  useEffect(() => {
    if (open) {
      disburseMutation.reset();
    }
  }, [open, disburseMutation.reset]);

  const handleConfirm = () => {
    if (!programme) return;
    disburseMutation.mutate(
      { programmeId: programme.id },
      {
        onSuccess: (res: { message?: string }) => {
          toast.success(res?.message || "Disbursement initiated successfully");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: Error & { response?: { data?: { error?: string } } }) => {
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
            Are you sure you want to disburse all registered participants for{" "}
            <strong>{programme?.name}</strong>? Each participant will receive their individually
            assigned amount via SMS with an OTP.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={disburseMutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={disburseMutation.isPending}>
            {disburseMutation.isPending ? "Disbursing..." : "Confirm Disbursement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
