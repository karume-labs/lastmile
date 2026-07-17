import { ShieldAlert } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PermissionDeniedProps {
  message?: string;
}

export const PermissionDenied = ({ message }: PermissionDeniedProps) => {
  return (
    <Card className="border-destructive/40 bg-destructive/5 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 py-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-destructive">
            Access Denied / Insufficient Permission
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {message ||
              "You do not have sufficient permissions to view or interact with this resource. Please check your role privileges or contact a super administrator."}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};
