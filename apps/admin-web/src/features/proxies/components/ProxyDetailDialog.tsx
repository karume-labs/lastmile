"use client";

import type { Proxy as ProxyRecord } from "@lastmile/types/identity";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProxyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proxy: ProxyRecord | null;
}

export const ProxyDetailDialog = ({ open, onOpenChange, proxy }: ProxyDetailDialogProps) => {
  if (!proxy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{proxy.name}</DialogTitle>
          <DialogDescription>Field agent profile and details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <DetailRow label="Role" value={proxy.role} />
          <DetailRow label="Phone" value={proxy.phone} />
          <DetailRow label="Location" value={proxy.location} />
          <DetailRow label="Participants" value={String(proxy.participantCount)} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              variant="secondary"
              className={
                proxy.status === "active"
                  ? "bg-accent text-accent-foreground"
                  : "bg-destructive text-destructive-foreground"
              }
            >
              {proxy.status.charAt(0).toUpperCase() + proxy.status.slice(1)}
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
