import type { ReactNode } from "react";
import { Text, View } from "react-native";

type Tone = "neutral" | "success" | "warning" | "destructive" | "accent";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
}

const toneClasses: Record<Tone, { container: string; text: string }> = {
  neutral: { container: "bg-muted", text: "text-muted-foreground" },
  success: { container: "bg-success/15", text: "text-success" },
  warning: { container: "bg-warning/15", text: "text-warning" },
  destructive: { container: "bg-destructive/15", text: "text-destructive" },
  accent: { container: "bg-accent/15", text: "text-accent" },
};

export const Badge = ({ children, tone = "neutral" }: BadgeProps) => {
  const classes = toneClasses[tone];
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${classes.container}`}>
      <Text className={`text-xs font-medium ${classes.text}`}>{children}</Text>
    </View>
  );
};
