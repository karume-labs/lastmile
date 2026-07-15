"use client";

import { useMemo } from "react";

type UserRole = "admin" | "officer" | "viewer";

export const useUserRole = () => {
  const role: UserRole = useMemo(() => {
    return "admin" as UserRole;
  }, []);

  const isAdmin = role === "admin";
  const isOfficer = role === "officer";
  const isViewer = role === "viewer";
  const canPerformActions = isAdmin || isOfficer;
  const canApproveClawbacks = isAdmin;

  return {
    role,
    isAdmin,
    isOfficer,
    isViewer,
    canPerformActions,
    canApproveClawbacks,
  };
};
