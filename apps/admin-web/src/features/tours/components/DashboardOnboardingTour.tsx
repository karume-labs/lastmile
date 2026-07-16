"use client";

import { useEffect } from "react";
import { startSystemOnboardingTour } from "@/features/tours/utils";

export const DashboardOnboardingTour = () => {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("has-seen-onboarding-tour");
    if (!hasSeenTour) {
      // Small delay to ensure the sidebar has rendered and animated in
      const timer = setTimeout(() => {
        startSystemOnboardingTour();
        localStorage.setItem("has-seen-onboarding-tour", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
};
