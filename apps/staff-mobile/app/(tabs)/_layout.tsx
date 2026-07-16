import { BarChart3, Inbox, QrCode, Settings } from "lucide-react-native";
import { Tabs } from "expo-router";

/**
 * Professional bottom navigation with:
 * - Modern, meaningful icons
 * - Color-coded for visual hierarchy
 * - Accessibility labels
 * - Responsive design
 */
const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          borderTopColor: "#e5e7eb",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          backgroundColor: "#ffffff",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      {/* Dashboard - Analytics Overview */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} strokeWidth={2} />,
          tabBarLabel: "Dashboard",
        }}
      />

      {/* Intake - Registration */}
      <Tabs.Screen
        name="intake"
        options={{
          title: "Register",
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} strokeWidth={2} />,
          tabBarLabel: "Register",
        }}
      />

      {/* Queue - Pending Registrations */}
      <Tabs.Screen
        name="queue"
        options={{
          title: "Queue",
          tabBarIcon: ({ color, size }) => <Inbox size={size} color={color} strokeWidth={2} />,
          tabBarLabel: "Queue",
        }}
      />

      {/* Settings - App Configuration */}
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

