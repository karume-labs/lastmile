import { useNetInfo } from "@react-native-community/netinfo";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { getQueue } from "@/src/lib/queue";

const DashboardScreen = () => {
  const netInfo = useNetInfo();
  const { data: queue = [] } = useQuery({ queryKey: ["registration-queue"], queryFn: getQueue });

  const isOnline = netInfo.isConnected === true && netInfo.isInternetReachable !== false;

  return (
    <View className="flex-1 gap-6 bg-background px-6 pt-16">
      <View>
        <Text className="text-2xl font-semibold text-foreground">Dashboard</Text>
        <View className="mt-2 flex-row items-center gap-2">
          <View className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-primary" : "bg-destructive"}`} />
          <Text className="text-muted-foreground">{isOnline ? "Online" : "Offline"}</Text>
        </View>
      </View>

      <View className="rounded-lg border border-border p-4">
        <Text className="text-muted-foreground">Pending sync</Text>
        <Text className="text-3xl font-semibold text-foreground">{queue.length}</Text>
        <Text className="text-muted-foreground">participant{queue.length === 1 ? "" : "s"} queued</Text>
      </View>

      <Pressable
        className="items-center rounded-md bg-primary px-4 py-3"
        onPress={() => router.push("/(tabs)/intake")}
      >
        <Text className="font-medium text-primary-foreground">Register a participant</Text>
      </Pressable>
    </View>
  );
};

export default DashboardScreen;
