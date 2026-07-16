import { BarChart3, ClipboardList, Inbox, Settings } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const activeColor = isDark ? "#60a5fa" : "#3b82f6";
  const inactiveColor = isDark ? "#71717a" : "#9ca3af";
  const borderColor = isDark ? "#27272a" : "#e5e7eb";
  const bgColor = isDark ? "#09090b" : "#ffffff";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          borderTopColor: borderColor,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          backgroundColor: bgColor,
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

