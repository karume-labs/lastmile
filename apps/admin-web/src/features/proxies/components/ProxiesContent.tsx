"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useProxies } from "@/features/proxies/services/queries";
import { DataTableSkeleton } from "@/features/shared/components/table/DataTableSkeleton";
import { Users, UserCheck, UserX } from "lucide-react";

export const ProxiesContent = () => {
  const { data: proxies, isLoading } = useProxies();

  if (isLoading) {
    return <DataTableSkeleton columnCount={4} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {(proxies ?? []).map(
        (proxy: {
          id: string;
          name: string;
          phone: string;
          status: "active" | "suspended";
          participantCount: number;
          location: string;
        }) => (
          <Card key={proxy.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {proxy.name}
              </CardTitle>
              <Badge
                variant="secondary"
                className={
                  proxy.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {proxy.status === "active" ? (
                  <UserCheck className="mr-1 size-3" />
                ) : (
                  <UserX className="mr-1 size-3" />
                )}
                {proxy.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <span>{proxy.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span>{proxy.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Participants:</span>
                <span className="font-medium">{proxy.participantCount}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor={`proxy-toggle-${proxy.id}`} className="text-sm">
                  Active
                </Label>
                <Switch
                  id={`proxy-toggle-${proxy.id}`}
                  checked={proxy.status === "active"}
                />
              </div>
            </CardContent>
          </Card>
        ),
      )}
      {(proxies ?? []).length === 0 && (
        <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
          No proxy agents registered.
        </div>
      )}
    </div>
  );
};
