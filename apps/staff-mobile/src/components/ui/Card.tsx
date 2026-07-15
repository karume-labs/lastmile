import type { ReactNode } from "react";
import { View } from "react-native";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <View className={`rounded-xl border border-border bg-card p-4 ${className}`}>{children}</View>
);
