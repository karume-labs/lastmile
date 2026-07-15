import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  value: string | undefined;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export const Select = ({ label, placeholder = "Select an option", error, value, options, onChange }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-medium text-foreground">{label}</Text> : null}
      <Pressable
        className={`flex-row items-center justify-between rounded-lg border bg-background px-3 py-3 ${
          error ? "border-destructive" : "border-border"
        }`}
        onPress={() => setOpen(true)}
      >
        <Text className={selected ? "text-base text-foreground" : "text-base text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown color="#71717a" size={18} />
      </Pressable>
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}

      <Modal animationType="slide" onRequestClose={() => setOpen(false)} transparent visible={open}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <SafeAreaView className="rounded-t-2xl bg-card" edges={["bottom"]}>
            <View className="border-b border-border px-4 py-3">
              <Text className="text-center text-base font-semibold text-foreground">
                {label ?? "Select an option"}
              </Text>
            </View>
            <ScrollView className="max-h-96">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    className="flex-row items-center justify-between border-b border-border px-4 py-3.5"
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <View className="flex-1">
                      <Text className="text-base text-foreground">{option.label}</Text>
                      {option.description ? (
                        <Text className="text-sm text-muted-foreground">{option.description}</Text>
                      ) : null}
                    </View>
                    {isSelected ? <Check color="#2563eb" size={18} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </View>
  );
};
