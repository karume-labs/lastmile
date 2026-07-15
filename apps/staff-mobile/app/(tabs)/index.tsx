import { router } from "expo-router";
import { AlertCircle, CheckCircle2, Clock, UserPlus, Users, Wifi, WifiOff } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import type { SyncStatus } from "@/src/features/registration/queue";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useRegistrationQueue } from "@/src/hooks/useRegistrationQueue";

const statusMeta: Record<SyncStatus, { label: string; tone: "neutral" | "success" | "warning" | "destructive" | "accent" }> = {
  pending: { label: "Pending", tone: "warning" },
  syncing: { label: "Syncing", tone: "accent" },
  synced: { label: "Synced", tone: "success" },
  failed: { label: "Failed", tone: "destructive" },
};

interface StatCardProps {
  label: string;
  value: number;
  icon: typeof Clock;
  tone: "neutral" | "warning" | "success" | "destructive";
}

const StatCard = ({ label, value, icon: Icon, tone }: StatCardProps) => {
  const toneColor = { neutral: "#71717a", warning: "#b45309", success: "#16a34a", destructive: "#dc2626" }[tone];
  return (
    <Card className="flex-1 gap-2">
      <Icon color={toneColor} size={18} />
      <Text className="text-2xl font-semibold text-foreground">{value}</Text>
      <Text className="text-sm text-muted-foreground">{label}</Text>
    </Card>
  );
};

const DashboardScreen = () => {
  const { isOnline } = useNetworkStatus();
  const { queue, stats } = useRegistrationQueue();
  const recent = queue.slice(0, 5);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 px-6 pb-10 pt-16">
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">LastMile Registrar</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-foreground">Dashboard</Text>
          <Badge tone={isOnline ? "success" : "warning"}>
            <View className="flex-row items-center gap-1">
              {isOnline ? <Wifi color="#16a34a" size={12} /> : <WifiOff color="#b45309" size={12} />}
              <Text className={`text-xs font-medium ${isOnline ? "text-success" : "text-warning"}`}>
                {isOnline ? " Online" : " Offline"}
              </Text>
            </View>
          </Badge>
        </View>
      </View>

      <View className="flex-row gap-3">
        <StatCard icon={Users} label="Total registered" tone="neutral" value={stats.total} />
        <StatCard icon={Clock} label="Pending sync" tone="warning" value={stats.pending + stats.syncing} />
      </View>
      <View className="flex-row gap-3">
        <StatCard icon={CheckCircle2} label="Synced" tone="success" value={stats.synced} />
        <StatCard icon={AlertCircle} label="Failed" tone="destructive" value={stats.failed} />
      </View>

      <Button icon={UserPlus} onPress={() => router.push("/(tabs)/intake")} size="lg">
        Register a participant
      </Button>

      <View className="gap-3">
        <Text className="text-base font-semibold text-foreground">Recent registrations</Text>
        {recent.length === 0 ? (
          <Card>
            <Text className="text-center text-muted-foreground">No participants registered yet.</Text>
          </Card>
        ) : (
          <View className="gap-2">
            {recent.map((item) => (
              <Card className="flex-row items-center justify-between" key={item.id}>
                <View className="flex-1 gap-0.5">
                  <Text className="font-medium text-foreground">{item.fullName}</Text>
                  <Text className="text-sm text-muted-foreground">{item.referenceId}</Text>
                </View>
                <Badge tone={statusMeta[item.syncStatus].tone}>{statusMeta[item.syncStatus].label}</Badge>
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
