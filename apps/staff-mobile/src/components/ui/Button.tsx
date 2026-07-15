import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-muted",
  outline: "border border-border bg-transparent",
  ghost: "bg-transparent",
  destructive: "bg-destructive",
};

const textVariantClasses: Record<Variant, string> = {
  primary: "text-primary-foreground",
  secondary: "text-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  destructive: "text-destructive-foreground",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 rounded-md",
  md: "px-4 py-3 rounded-lg",
  lg: "px-5 py-4 rounded-lg",
};

const textSizeClasses: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-base",
};

const iconColor: Record<Variant, string> = {
  primary: "#fafafa",
  secondary: "#18181b",
  outline: "#18181b",
  ghost: "#18181b",
  destructive: "#fafafa",
};

export const Button = ({
  children,
  onPress,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`flex-row items-center justify-center gap-2 active:opacity-80 ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? "w-full" : ""
      } ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={iconColor[variant]} size="small" />
      ) : (
        <>
          {Icon ? <Icon color={iconColor[variant]} size={size === "sm" ? 16 : 18} /> : null}
          <View>
            <Text className={`font-medium ${textVariantClasses[variant]} ${textSizeClasses[size]}`}>{children}</Text>
          </View>
        </>
      )}
    </Pressable>
  );
};
