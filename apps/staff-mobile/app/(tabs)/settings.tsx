import Constants from "expo-constants";
import { router } from "expo-router";
import { LogOut, Wifi, WifiOff } from "lucide-react-native";
import { Text, View } from "react-native";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useRegistrationQueue } from "@/src/hooks/useRegistrationQueue";

const SettingsScreen = () => {
  const { isOnline } = useNetworkStatus();
  const { stats } = useRegistrationQueue();

  const handleSignOut = () => {
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 gap-6 bg-background px-6 pt-16">
      <Text className="text-2xl font-semibold text-foreground">Settings</Text>

      <Card className="gap-1">
        <Text className="text-sm text-muted-foreground">Signed in as</Text>
        <Text className="text-base font-medium text-foreground">Field Staff</Text>
      </Card>

      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-muted-foreground">Connection</Text>
          <Badge tone={isOnline ? "success" : "warning"}>
            <View className="flex-row items-center gap-1">
              {isOnline ? <Wifi color="#16a34a" size={12} /> : <WifiOff color="#b45309" size={12} />}
              <Text className={`text-xs font-medium ${isOnline ? "text-success" : "text-warning"}`}>
                {isOnline ? " Online" : " Offline"}
              </Text>
            </View>
          </Badge>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-muted-foreground">Registrations on this device</Text>
          <Text className="text-sm font-medium text-foreground">{stats.total}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-muted-foreground">Awaiting sync</Text>
          <Text className="text-sm font-medium text-foreground">{stats.pending + stats.syncing + stats.failed}</Text>
        </View>
      </Card>

      <Button icon={LogOut} onPress={handleSignOut} variant="outline">
        Sign out
      </Button>

      <Text className="text-center text-xs text-muted-foreground">
        LastMile Staff v{Constants.expoConfig?.version ?? "0.1.0"}
      </Text>
    </View>
  );
};

export default SettingsScreen;
