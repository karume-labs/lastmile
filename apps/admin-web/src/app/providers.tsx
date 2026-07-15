"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { initMockApi } from "@/lib/mockApi";
import { queryClient } from "@/lib/query-client";

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
