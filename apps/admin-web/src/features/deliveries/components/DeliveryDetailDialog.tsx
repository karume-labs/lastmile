"use client";

import type { Disbursement } from "@lastmile/types/programmes";
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
  pending: "bg-secondary text-secondary-foreground",
  sent: "bg-primary text-primary-foreground",
  delivered: "bg-accent text-accent-foreground",
  failed: "bg-destructive text-destructive-foreground",
};

interface DeliveryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery: Disbursement | null;
}

export const DeliveryDetailDialog = ({
  open,
  onOpenChange,
  delivery,
}: DeliveryDetailDialogProps) => {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delivery Details</DialogTitle>
          <DialogDescription>Disbursement and delivery information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <DetailRow label="Participant" value={delivery.participantName} />
          <DetailRow label="Programme" value={delivery.programmeName} />
          <DetailRow label="Reference ID" value={delivery.referenceId} />
          <DetailRow label="Amount" value={`${delivery.amount} ${delivery.currency}`} />
          <DetailRow
            label="Delivery Method"
            value={delivery.deliveryMethod === "proxy-led" ? "Proxy-Led" : "Direct"}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary" className={STATUS_STYLES[delivery.status]}>
              {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
            </Badge>
          </div>
          {delivery.txHash && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tx Hash</span>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${delivery.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline truncate max-w-[180px]"
              >
                {delivery.txHash.slice(0, 6)}...{delivery.txHash.slice(-4)}
              </a>
            </div>
          )}
          <DetailRow label="Created" value={new Date(delivery.createdAt).toLocaleString()} />
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
