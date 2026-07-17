"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/services/mutations";

export const SignOutButton = () => {
  const signOutMutation = useSignOut();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOutMutation.mutate()}
      disabled={signOutMutation.isPending}
    >
      <LogOut className="size-4" />
      <span className="sr-only">Sign out</span>
    </Button>
  );
};
