"use client";

import type { SmsMessage } from "@lastmile/types/sms";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SmsDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: SmsMessage | null;
}

export const SmsDetailDialog = ({ open, onOpenChange, message }: SmsDetailDialogProps) => {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SMS Details</DialogTitle>
          <DialogDescription>Full message information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <DetailRow label="Recipient" value={message.recipient} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              variant="secondary"
              className={
                message.status === "sent"
                  ? "bg-primary text-primary-foreground"
                  : message.status === "failed"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-secondary-foreground"
              }
            >
              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </Badge>
          </div>
          <DetailRow label="Sent At" value={new Date(message.createdAt).toLocaleString()} />
          <div className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Message Content</span>
            <p className="text-sm whitespace-pre-wrap rounded-lg bg-muted/50 p-3">
              {message.content}
            </p>
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
