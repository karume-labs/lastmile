import { Mail } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";

interface EmailInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

/**
 * Professional email input component with:
 * - Proper email keyboard
 * - Email icon indicator
 * - Automatic lowercase conversion
 * - Clear error messaging
 */
export const EmailInput = ({
  label,
  error,
  hint,
  value,
  onChangeText,
  onBlur,
  placeholder = "Enter email address",
}: EmailInputProps) => {
  const handleChangeText = (text: string) => {
    // Auto-convert to lowercase for email
    onChangeText(text.toLowerCase().trim());
  };

  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-semibold text-foreground">{label}</Text> : null}
      <View
        className={`flex-row items-center gap-2 rounded-lg border bg-background px-3 ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        <Mail size={20} color={error ? "#ef4444" : "#71717a"} />
        <TextInput
          className="flex-1 py-3 text-base text-foreground"
          placeholderTextColor="#a1a1aa"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
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
