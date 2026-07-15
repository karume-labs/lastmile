"use client";

import { StagnantAlertsTable } from "@/features/stagnant-funds/components/StagnantAlertsTable";
import { ClawbackConfirmationDialog } from "@/features/stagnant-funds/components/ClawbackConfirmationDialog";
import { useState } from "react";

interface ClawbackRecord {
  id: string;
  participantName: string;
  referenceId: string;
  amount: string;
  currency: string;
}

export const StagnantFundsContent = () => {
  const [clawbackTarget, setClawbackTarget] =
    useState<ClawbackRecord | null>(null);
  const [clawbackDialogOpen, setClawbackDialogOpen] = useState(false);

  const handleClawbackSelect = (record: ClawbackRecord) => {
    setClawbackTarget(record);
    setClawbackDialogOpen(true);
  };

  return (
    <>
      <StagnantAlertsTable onClawbackSelect={handleClawbackSelect} />
      <ClawbackConfirmationDialog
        open={clawbackDialogOpen}
        onOpenChange={setClawbackDialogOpen}
        record={clawbackTarget}
      />
    </>
  );
};
