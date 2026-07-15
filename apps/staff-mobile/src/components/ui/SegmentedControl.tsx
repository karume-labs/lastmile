import { Pressable, Text, View } from "react-native";

interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  label?: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-medium text-foreground">{label}</Text> : null}
      <View className="flex-row rounded-lg border border-border bg-muted p-1">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <Pressable
              className={`flex-1 items-center rounded-md py-2.5 ${isActive ? "bg-card" : ""}`}
              key={option.value}
              onPress={() => onChange(option.value)}
            >
              <Text className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
