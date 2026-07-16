import { Eye, EyeOff } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

/**
 * Enterprise-grade password input with:
 * - Eye toggle for visibility/masking
 * - Professional styling
 * - Clear error messaging
 * - Accessibility support
 */
export const PasswordInput = ({
  label,
  error,
  hint,
  value,
  onChangeText,
  onBlur,
  placeholder = "Enter password",
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-semibold text-foreground">{label}</Text> : null}
      <View
        className={`flex-row items-center gap-2 rounded-lg border bg-background px-3 ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        <TextInput
          className="flex-1 py-3 text-base text-foreground"
          placeholderTextColor="#a1a1aa"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          editable={true}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          className="p-2"
          accessible={true}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          accessibilityHint={showPassword ? "Mask password text" : "Reveal password text"}
          accessibilityRole="button"
        >
          {showPassword ? (
            <EyeOff size={20} color="#71717a" />
          ) : (
            <Eye size={20} color="#71717a" />
          )}
        </TouchableOpacity>
      </View>
      {error ? (
        <Text className="text-xs text-destructive font-medium">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
};
