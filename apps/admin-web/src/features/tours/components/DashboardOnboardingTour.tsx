"use client";

import { useEffect } from "react";
import { startSystemOnboardingTour } from "@/features/tours/utils";

export const triggerDashboardOnboardingTour = (force = true) => {
  if (force || !localStorage.getItem("has-seen-onboarding-tour")) {
    startSystemOnboardingTour();
    if (!force) {
      localStorage.setItem("has-seen-onboarding-tour", "true");
    }
  }
};

export const DashboardOnboardingTour = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerDashboardOnboardingTour(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return null;
};
