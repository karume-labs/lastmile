"use client";

import { Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";
import { triggerDashboardOnboardingTour } from "@/features/tours/components/DashboardOnboardingTour";

const TOURS = [
  {
    id: "system-onboarding",
    title: "System Onboarding",
    description: "A quick walkthrough of the main navigation and platform capabilities.",
    action: () => triggerDashboardOnboardingTour(true),
  },
  {
    id: "bulk-uploads",
    title: "How to execute Bulk Uploads",
    description: "Learn how to prepare and upload your beneficiary spreadsheets.",
    action: () => toast.info("Tour coming soon!"),
  },
  {
    id: "clawback-process",
    title: "The Clawback Process",
    description: "Understand how to reclaim stagnant funds back to the treasury.",
    action: () => toast.info("Tour coming soon!"),
  },
];

const ToursPage = () => {
  return (
    <AdminPanelPageLayout
      title="Tours & Help Center"
      description="Interactive guides to help you navigate and master the LastMile platform."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOURS.map((tour) => (
          <Card key={tour.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tour.title}</CardTitle>
              <CardDescription>{tour.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter>
              <Button onClick={tour.action} className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Start Tour
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AdminPanelPageLayout>
  );
};

export default ToursPage;
