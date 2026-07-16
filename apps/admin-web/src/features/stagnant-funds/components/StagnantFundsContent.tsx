"use client";

import type { StagnantFundItem } from "@lastmile/types/programmes";
import { useState } from "react";
import { ClawbackConfirmationDialog } from "@/features/stagnant-funds/components/ClawbackConfirmationDialog";
import { StagnantAlertsTable } from "@/features/stagnant-funds/components/StagnantAlertsTable";

export const StagnantFundsContent = () => {
  const [clawbackTarget, setClawbackTarget] = useState<StagnantFundItem | null>(null);
  const [clawbackDialogOpen, setClawbackDialogOpen] = useState(false);

  const handleClawbackSelect = (record: StagnantFundItem) => {
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
