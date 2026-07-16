import type { LucideIcon } from "lucide-react-native";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
}

export const Input = ({ label, error, hint, icon: Icon, ...inputProps }: InputProps) => {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-semibold text-foreground">{label}</Text> : null}
      <View
        className={`flex-row items-center gap-2 rounded-lg border bg-background px-3 ${
          error ? "border-destructive bg-destructive/5" : "border-border"
        }`}
      >
        {Icon ? <Icon color={error ? "#ef4444" : "#71717a"} size={20} /> : null}
        <TextInput
          className="flex-1 py-3 text-base"
          placeholderTextColor="#a1a1aa"
          style={{ color: "#09090b" }}
          {...inputProps}
        />
      </View>
      {error ? (
        <Text className="text-xs text-destructive font-medium">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
};
