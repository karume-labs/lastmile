"use client";

import type { Programme } from "@lastmile/types/programmes";
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
  Active: "bg-accent text-accent-foreground",
  Draft: "bg-secondary text-secondary-foreground",
  Completed: "bg-primary text-primary-foreground",
};

interface ProgrammeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programme: Programme | null;
}

export const ProgrammeDetailDialog = ({
  open,
  onOpenChange,
  programme,
}: ProgrammeDetailDialogProps) => {
  if (!programme) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{programme.name}</DialogTitle>
          <DialogDescription>Programme details and configuration.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <DetailRow label="Target Audience" value={programme.targetAudience} />
          <DetailRow label="Target Currency" value={programme.targetCurrency} />
          <DetailRow
            label="Budget"
            value={`${programme.budget.toLocaleString()} ${programme.targetCurrency}`}
          />
          <DetailRow
            label="Start Date"
            value={new Date(programme.startDate).toLocaleDateString()}
          />
          <DetailRow
            label="End Date"
            value={programme.endDate ? new Date(programme.endDate).toLocaleDateString() : "—"}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary" className={STATUS_STYLES[programme.status] || ""}>
              {programme.status}
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
