import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import type { Programme } from "@lastmile/types/programmes";
import { useMockOnramp } from "../services/mutations";

interface FundProgrammeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programme: Programme | null;
}

export const FundProgrammeDialog: React.FC<FundProgrammeDialogProps> = ({
  open,
  onOpenChange,
  programme,
}) => {
  const [amountKes, setAmountKes] = useState<string>("");
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState<string>("+254711223344");
  const mockOnramp = useMockOnramp();

  const handleFund = () => {
    if (!programme) return;
    
    const amount = parseFloat(amountKes);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    mockOnramp.mutate(
      {
        programmeId: programme.id,
        amountKes: amount,
        mpesaPhoneNumber,
      },
      {
        onSuccess: (data) => {
          toast.success(`Transaction successful! Hash: ${data.txHash}`);
          onOpenChange(false);
          setAmountKes(""); // Reset
        },
        onError: (err) => {
          toast.error("Failed to process mock onramp.");
          console.error(err);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulate M-Pesa Onramp</DialogTitle>
          <DialogDescription>
            Fund "{programme?.name}" via a simulated M-Pesa push to the Soroban Escrow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (KES)</label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={amountKes}
              onChange={(e) => setAmountKes(e.target.value)}
              disabled={mockOnramp.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">M-Pesa Phone Number</label>
            <Input
              type="text"
              placeholder="+254711223344"
              value={mpesaPhoneNumber}
              onChange={(e) => setMpesaPhoneNumber(e.target.value)}
              disabled={mockOnramp.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mockOnramp.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleFund} disabled={mockOnramp.isPending}>
            {mockOnramp.isPending ? "Processing STK Push..." : "Confirm Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
