"use client";

import type { StagnantFundItem } from "@lastmile/types/programmes";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_STYLES: Record<string, string> = {
  stagnant: "bg-secondary text-secondary-foreground",
  "clawed-back": "bg-destructive text-destructive-foreground",
  "under-review": "bg-primary text-primary-foreground",
};

interface StagnantDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: StagnantFundItem | null;
}

export const StagnantDetailDialog = ({ open, onOpenChange, record }: StagnantDetailDialogProps) => {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stagnant Fund Details</DialogTitle>
          <DialogDescription>Details for this stagnant disbursement.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <DetailRow label="Participant" value={record.participantName} />
          <DetailRow label="Programme" value={record.programmeName} />
          <DetailRow label="Reference ID" value={record.referenceId} />
          <DetailRow label="Amount" value={`${record.amount} ${record.currency}`} />
          <DetailRow label="Days Stagnant" value={`${record.daysSinceActivity} days`} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary" className={STATUS_STYLES[record.status]}>
              {record.status === "clawed-back"
                ? "Clawed Back"
                : record.status === "under-review"
                  ? "Under Review"
                  : "Stagnant"}
            </Badge>
          </div>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
