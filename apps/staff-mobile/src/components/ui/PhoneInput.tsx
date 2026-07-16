import { Phone } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";

interface PhoneInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

/**
 * Professional phone input component with:
 * - Phone pad keyboard
 * - Automatic formatting (removes non-digits)
 * - E.164 format support
 * - Phone icon indicator
 * - Clear error messaging
 */
export const PhoneInput = ({
  label,
  error,
  hint,
  value,
  onChangeText,
  onBlur,
  placeholder = "+254 712 345 678",
}: PhoneInputProps) => {
  const handleChangeText = (text: string) => {
    // Remove all non-digit characters except leading +
    let processed = text;

    // If it starts with +, keep it; otherwise remove any +
    if (!text.startsWith("+")) {
      processed = text.replace(/[^\d]/g, "");
    } else {
      // Keep only the first +, remove any others, and strip non-digits after +
      const plusCount = text.match(/\+/g)?.length || 0;
      if (plusCount > 1) {
        processed = "+" + text.replace(/\D/g, "");
      } else {
        processed = "+" + text.slice(1).replace(/\D/g, "");
      }
    }

    // Max 15 digits (E.164 standard)
    if (processed.startsWith("+")) {
      processed = processed.substring(0, 16); // + plus 15 digits
    } else {
      processed = processed.substring(0, 15);
    }

    onChangeText(processed);
  };

  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-semibold text-foreground">{label}</Text> : null}
      <View
        className={`flex-row items-center gap-2 rounded-lg border bg-background px-3 ${
          error ? "border-destructive bg-destructive/5" : "border-border"
        }`}
      >
        <Phone size={20} color={error ? "#ef4444" : "#71717a"} />
        <TextInput
          className="flex-1 py-3 text-base text-foreground"
          placeholderTextColor="#a1a1aa"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="tel"
          value={value}
          onChangeText={handleChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          editable={true}
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
