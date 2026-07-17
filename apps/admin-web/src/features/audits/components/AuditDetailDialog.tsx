"use client";

import type { AuditLog } from "@lastmile/types/audit";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuditDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AuditLog | null;
}

export const AuditDetailDialog = ({ open, onOpenChange, record }: AuditDetailDialogProps) => {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Audit Entry</DialogTitle>
          <DialogDescription>Detailed audit log information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <DetailRow label="Action" value={record.action} />
          <DetailRow label="Actor" value={record.actor} />
          <DetailRow label="Target" value={record.target} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Severity</span>
            <Badge
              variant={
                record.severity === "critical"
                  ? "destructive"
                  : record.severity === "warning"
                    ? "default"
                    : "secondary"
              }
            >
              {record.severity.toUpperCase()}
            </Badge>
          </div>
          <DetailRow label="Timestamp" value={new Date(record.timestamp).toLocaleString()} />
          {record.metadata && (
            <div className="space-y-1.5">
              <span className="text-sm text-muted-foreground">Metadata</span>
              <pre className="text-xs whitespace-pre-wrap rounded-lg bg-muted/50 p-3 overflow-auto">
                {JSON.stringify(record.metadata, null, 2)}
              </pre>
            </div>
          )}
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
