"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateBatchForm } from "@/features/programmes/components/CreateBatchForm";
import { ProgrammeGrid } from "@/features/programmes/components/ProgrammeGrid";

export const ProgrammesContent: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              New Batch
            </Button>
          </DialogTrigger>
          <CreateBatchForm onSuccess={() => setShowCreateForm(false)} />
        </Dialog>
      </div>
      <ProgrammeGrid />
    </div>
  );
};
