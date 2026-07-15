"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAudits } from "@/features/audits/services/queries";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";

export const AuditsContent = () => {
  const { data: audits, isLoading } = useAudits();

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Audit Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(audits ?? []).map(
            (entry: {
              id: string;
              action: string;
              actor: string;
              target: string;
              timestamp: string;
              severity: "info" | "warning" | "critical";
            }) => (
              <div key={entry.id}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {entry.actor} → {entry.target}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        entry.severity === "critical"
                          ? "bg-red-100 text-red-800"
                          : entry.severity === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {entry.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            ),
          )}
          {(audits ?? []).length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No audit entries found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
