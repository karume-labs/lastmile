import { BarChart3, ClipboardList, Inbox, Settings } from "lucide-react-native";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "hsl(var(--accent))",
        tabBarInactiveTintColor: "hsl(var(--muted-foreground))",
        tabBarStyle: {
          borderTopColor: "hsl(var(--border))",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          backgroundColor: "hsl(var(--background))",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} strokeWidth={2} />,
          tabBarLabel: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="intake"
        options={{
          title: "Register",
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} strokeWidth={2} />,
          tabBarLabel: "Register",
        }}
      />

      <Tabs.Screen
        name="queue"
        options={{
          title: "Queue",
          tabBarIcon: ({ color, size }) => <Inbox size={size} color={color} strokeWidth={2} />,
          tabBarLabel: "Queue",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} strokeWidth={2} />,
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

