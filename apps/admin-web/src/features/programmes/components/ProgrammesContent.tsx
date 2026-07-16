"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BulkUploadZone } from "@/features/registration/components/BulkUploadZone";
import { ProgrammeGrid } from "@/features/programmes/components/ProgrammeGrid";

export const ProgrammesContent: React.FC = () => {
  const [showDisbursementDialog, setShowDisbursementDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Dialog open={showDisbursementDialog} onOpenChange={setShowDisbursementDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="mr-2 size-4" />
            New Disbursement
          </DialogTrigger>
          <DialogContent className="max-w-4xl sm:max-w-4xl md:max-w-5xl lg:max-w-275 w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <DialogHeader>
              <DialogTitle>New Disbursement / Beneficiary Registration</DialogTitle>
              <DialogDescription>
                Upload spreadsheets (CSV or Excel) to bulk register new beneficiaries and initiate a disbursement batch.
              </DialogDescription>
            </DialogHeader>
            <BulkUploadZone
              className="border-0 shadow-none p-0 w-full max-w-none"
              onSuccess={() => setShowDisbursementDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ProgrammeGrid />
    </div>
  );
};
