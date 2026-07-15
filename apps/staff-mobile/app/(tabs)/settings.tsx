import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const SettingsScreen = () => {
  const handleSignOut = () => {
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 gap-6 bg-background px-6 pt-16">
      <Text className="text-2xl font-semibold text-foreground">Settings</Text>

      <View className="gap-1 rounded-lg border border-border p-4">
        <Text className="text-muted-foreground">Signed in as</Text>
        <Text className="text-foreground">Field Staff</Text>
      </View>

      <Pressable className="items-center rounded-md border border-destructive py-3" onPress={handleSignOut}>
        <Text className="font-medium text-destructive">Sign out</Text>
      </Pressable>
    </View>
  );
};

export default SettingsScreen;
