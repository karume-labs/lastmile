import type { LucideIcon } from "lucide-react-native";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  inputType?: "text" | "name" | "phone" | "number";
  maxLength?: number;
}

/**
 * Enhanced generic input component with:
 * - Professional styling
 * - Input-type-specific handling
 * - Max length enforcement
 * - Clear error messaging
 * - Accessibility support
 */
export const Input = ({
  label,
  error,
  hint,
  icon: Icon,
  inputType = "text",
  maxLength = 500,
  onChangeText,
  ...inputProps
}: InputProps) => {
  // Handle input-type-specific transformations
  const handleChangeText = (text: string) => {
    let processed = text;

    // Input type-specific processing
    switch (inputType) {
      case "name":
        // Name: trim, prevent multiple spaces
        processed = text.replace(/\s+/g, " ").trim();
        break;
      case "phone":
        // Phone: remove non-digits and + symbol
        processed = text.replace(/[^\d+]/g, "");
        break;
      case "number":
        // Number: only digits
        processed = text.replace(/[^\d]/g, "");
        break;
      case "text":
      default:
        // Text: just trim spaces
        processed = text.trim();
    }

    // Enforce max length
    processed = processed.substring(0, maxLength);

    onChangeText?.(processed);
  };

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
          className="flex-1 py-3 text-base text-foreground"
          placeholderTextColor="#a1a1aa"
          maxLength={maxLength}
          onChangeText={handleChangeText}
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
