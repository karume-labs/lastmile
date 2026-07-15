import { Check } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  error?: string;
}

export const Checkbox = ({ checked, onChange, label, error }: CheckboxProps) => {
  return (
    <View className="gap-1.5">
      <Pressable className="flex-row items-start gap-3" onPress={() => onChange(!checked)}>
        <View
          className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
            checked ? "border-primary bg-primary" : "border-border bg-background"
          }`}
        >
          {checked ? <Check color="#fafafa" size={14} /> : null}
        </View>
        <Text className="flex-1 text-sm leading-5 text-foreground">{label}</Text>
      </Pressable>
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
};
