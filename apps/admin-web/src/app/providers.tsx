"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { initMockApi } from "@/lib/mockApi";
import { NuqsAdapter } from "nuqs/adapters/next/app";

// Initialize the mock API in the client
if (typeof window !== "undefined") {
  initMockApi();
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NuqsAdapter>
  );
};
