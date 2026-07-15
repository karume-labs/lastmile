"use client";

import { ProgrammeGrid } from "@/features/programmes/components/ProgrammeGrid";
import { CreateBatchForm } from "@/features/programmes/components/CreateBatchForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface ProgrammesContentProps {
  actions?: React.ReactNode;
}

export const ProgrammesContent: React.FC<ProgrammesContentProps> = ({ actions }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="mr-2 size-4" />
          {showCreateForm ? "Close" : "New Batch"}
        </Button>
      </div>
      {showCreateForm && <CreateBatchForm />}
      <ProgrammeGrid />
    </div>
  );
};
