"use client";

import type { StagnantFundItem } from "@lastmile/types/programmes";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInitiateClawback } from "@/features/stagnant-funds/services/mutations";

interface ClawbackConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: StagnantFundItem | null;
}

export const ClawbackConfirmationDialog = ({
  open,
  onOpenChange,
  record,
}: ClawbackConfirmationDialogProps) => {
  const clawbackMutation = useInitiateClawback();

  const handleConfirm = () => {
    if (!record) return;

    clawbackMutation.mutate(record.id, {
      onSuccess: () => {
        toast.success("Clawback initiated", {
          description: `Soroban transaction reversal initiated for ${record.participantName}.`,
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Clawback failed", {
          description: error.message || "An error occurred while initiating the clawback.",
        });
      },
    });
  };

  if (!record) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Confirm Clawback</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <span className="block">
              You are about to initiate a Soroban transaction reversal for the following
              participant. This action is <strong className="text-destructive">irreversible</strong>{" "}
              once confirmed on-chain.
            </span>
            <div className="rounded-md border p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participant:</span>
                <span className="font-medium">{record.participantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference ID:</span>
                <span className="font-mono text-sm">{record.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium text-destructive">
                  {record.amount} {record.currency}
                </span>
              </div>
            </div>
            <span className="block text-sm font-medium">
              Type <strong>CLAWBACK</strong> to confirm this action.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={clawbackMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={clawbackMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {clawbackMutation.isPending ? "Processing..." : "Confirm Clawback"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
