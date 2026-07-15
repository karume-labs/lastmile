"use client";

import { AlertTriangle, Clock, DollarSign, Send, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDashboardMetrics } from "@/features/dashboard/services/queries";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, description }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">{change}</span> from last period
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export const DashboardContent = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Disbursed"
          value={isLoading ? "..." : (metrics?.totalDisbursed ?? "$0")}
          change="+12.5%"
          icon={<DollarSign className="size-4 text-muted-foreground" />}
          description="Across all programmes"
        />
        <MetricCard
          title="Active Deliveries"
          value={isLoading ? "..." : (metrics?.activeDeliveries ?? "0")}
          change="+8.2%"
          icon={<Send className="size-4 text-muted-foreground" />}
          description="Currently in transit"
        />
        <MetricCard
          title="Stagnant Funds"
          value={isLoading ? "..." : (metrics?.stagnantFunds ?? "0")}
          change="-3.1%"
          icon={<AlertTriangle className="size-4 text-muted-foreground" />}
          description="Require attention"
        />
        <MetricCard
          title="Active Proxies"
          value={isLoading ? "..." : (metrics?.activeProxies ?? "0")}
          change="+5.0%"
          icon={<Users className="size-4 text-muted-foreground" />}
          description="Authorized proxy agents"
        />
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
                    <div key={`skel-${i}`} className="h-8 animate-pulse rounded bg-muted" />
                  ))}
                </div>
              ) : (
                (metrics?.recentActivity ?? []).map(
                  (activity: { id: string; description: string; time: string }) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <span className="text-sm">{activity.description}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ),
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-4" />
              Pending Syncs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
                    <div key={`skel-${i}`} className="h-8 animate-pulse rounded bg-muted" />
                  ))}
                </div>
              ) : (
                (metrics?.pendingSyncs ?? []).map(
                  (sync: { id: string; participantName: string; status: string }) => (
                    <div
                      key={sync.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <span className="text-sm">{sync.participantName}</span>
                      <span className="text-xs text-muted-foreground">{sync.status}</span>
                    </div>
                  ),
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
