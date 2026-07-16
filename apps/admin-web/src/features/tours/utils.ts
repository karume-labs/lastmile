"use client";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startSystemOnboardingTour = () => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    smoothScroll: true,
    allowClose: true,
    steps: [
      {
        element: "#tour-registration",
        popover: {
          title: "Bulk Upload",
          description: "Start here to upload spreadsheets and register participants.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#tour-deliveries",
        popover: {
          title: "Disbursements",
          description: "Trigger SDP payouts from here.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#tour-stagnant-funds",
        popover: {
          title: "Stagnant Funds",
          description: "Monitor and manually claw back unclaimed funds.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#tour-audits",
        popover: {
          title: "Audit Logs",
          description: "View a trace of all system actions.",
          side: "right",
          align: "start",
        },
      },
    ],
  });

  driverObj.drive();
};
