import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { clearSyncedRecords, type QueuedRegistration, removeRecord, type SyncStatus } from "@/src/features/registration/queue";
import { syncPendingRegistrations } from "@/src/features/registration/sync";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { REGISTRATION_QUEUE_KEY, useRegistrationQueue } from "@/src/hooks/useRegistrationQueue";

const statusMeta: Record<SyncStatus, { label: string; tone: "neutral" | "success" | "warning" | "destructive" | "accent"; icon: typeof Clock }> = {
  pending: { label: "Pending", tone: "warning", icon: Clock },
  syncing: { label: "Syncing…", tone: "accent", icon: RefreshCw },
  synced: { label: "Synced", tone: "success", icon: CheckCircle2 },
  failed: { label: "Failed", tone: "destructive", icon: AlertCircle },
};

interface QueueRowProps {
  item: QueuedRegistration;
  onRemove: (id: string) => void;
}

const QueueRow = ({ item, onRemove }: QueueRowProps) => {
  const meta = statusMeta[item.syncStatus];
  return (
    <Card className="gap-2">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-0.5">
          <Text className="font-medium text-foreground">{item.fullName}</Text>
          <Text className="text-sm text-muted-foreground">{item.referenceId}</Text>
        </View>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </View>
      {item.syncStatus === "failed" && item.syncError ? (
        <Text className="text-sm text-destructive">{item.syncError}</Text>
      ) : null}
      <View className="flex-row items-center justify-between pt-1">
        <Text className="text-xs text-muted-foreground">Queued {new Date(item.queuedAt).toLocaleString()}</Text>
        {item.syncStatus !== "syncing" ? (
          <Button icon={Trash2} onPress={() => onRemove(item.id)} size="sm" variant="ghost">
            Remove
          </Button>
        ) : null}
      </View>
    </Card>
  );
};

const QueueScreen = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();
  const { queue, stats, isFetching } = useRegistrationQueue();
  const [syncing, setSyncing] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: REGISTRATION_QUEUE_KEY });

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      await syncPendingRegistrations();
    } finally {
      setSyncing(false);
      refresh();
    }
  };

  const handleRemove = async (id: string) => {
    await removeRecord(id);
    refresh();
  };

  const handleClearSynced = async () => {
    await clearSyncedRecords();
    refresh();
  };

  return (
    <View className="flex-1 gap-4 bg-background px-6 pt-16">
      <View className="gap-1">
        <Text className="text-2xl font-semibold text-foreground">Sync Queue</Text>
        <Text className="text-muted-foreground">
          {stats.pending + stats.syncing} pending · {stats.synced} synced · {stats.failed} failed
        </Text>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            icon={RefreshCw}
            loading={syncing}
            onPress={handleSyncAll}
            disabled={!isOnline || stats.pending + stats.failed === 0}
          >
            Sync now
          </Button>
        </View>
        {stats.synced > 0 ? (
          <Button onPress={handleClearSynced} variant="outline">
            Clear synced
          </Button>
        ) : null}
      </View>

      {!isOnline ? (
        <Text className="text-sm text-warning">You're offline — records will sync automatically when you're back.</Text>
      ) : null}

      <FlatList
        contentContainerClassName="gap-2 pb-6"
        data={queue}
        ItemSeparatorComponent={() => <View className="h-2" />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Card>
            <Text className="text-center text-muted-foreground">No participants queued.</Text>
          </Card>
        }
        refreshControl={<RefreshControl onRefresh={refresh} refreshing={isFetching} />}
        renderItem={({ item }) => <QueueRow item={item} onRemove={handleRemove} />}
      />
    </View>
  );
};

export default QueueScreen;
