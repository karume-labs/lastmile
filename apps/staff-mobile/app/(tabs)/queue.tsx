import { useNetInfo } from "@react-native-community/netinfo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FlatList, Pressable, Text, View } from "react-native";
import { clearQueue, getQueue, removeFromQueue } from "@/src/lib/queue";

const QueueScreen = () => {
  const queryClient = useQueryClient();
  const netInfo = useNetInfo();
  const { data: queue = [] } = useQuery({ queryKey: ["registration-queue"], queryFn: getQueue });

  const isOnline = netInfo.isConnected === true && netInfo.isInternetReachable !== false;

  const handleSync = async () => {
    // apps/api has no registration endpoint yet, so a "sync" just clears the
    // local queue to demonstrate the flow until the backend exists.
    await clearQueue();
    await queryClient.invalidateQueries({ queryKey: ["registration-queue"] });
  };

  const handleRemove = async (referenceId: string) => {
    await removeFromQueue(referenceId);
    await queryClient.invalidateQueries({ queryKey: ["registration-queue"] });
  };

  return (
    <View className="flex-1 gap-4 bg-background px-6 pt-16">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-foreground">Sync Queue</Text>
        <Pressable
          className="rounded-md bg-primary px-3 py-2 disabled:opacity-50"
          disabled={!isOnline || queue.length === 0}
          onPress={handleSync}
        >
          <Text className="font-medium text-primary-foreground">Sync now</Text>
        </Pressable>
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item) => item.referenceId}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={<Text className="text-muted-foreground">No participants queued.</Text>}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between rounded-md border border-border p-3">
            <View>
              <Text className="font-medium text-foreground">{item.fullName}</Text>
              <Text className="text-muted-foreground">{item.referenceId}</Text>
            </View>
            <Pressable onPress={() => handleRemove(item.referenceId)}>
              <Text className="text-destructive">Remove</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default QueueScreen;
