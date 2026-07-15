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
      {label ? <Text className="text-sm font-medium text-foreground">{label}</Text> : null}
      <View
        className={`flex-row items-center gap-2 rounded-lg border bg-background px-3 ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        {Icon ? <Icon color="#71717a" size={18} /> : null}
        <TextInput
          className="flex-1 py-3 text-base text-foreground"
          placeholderTextColor="#a1a1aa"
          {...inputProps}
        />
      </View>
      {error ? (
        <Text className="text-sm text-destructive">{error}</Text>
      ) : hint ? (
        <Text className="text-sm text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
};
