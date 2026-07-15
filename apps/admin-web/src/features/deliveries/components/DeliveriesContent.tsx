"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryTracker } from "@/features/deliveries/components/DeliveryTracker";

export const DeliveriesContent = () => {
  return (
    <DeliveryTracker
      actions={
        <Button variant="outline" size="sm">
          <Download className="mr-2 size-4" />
          Export Report
        </Button>
      }
    />
  );
};
