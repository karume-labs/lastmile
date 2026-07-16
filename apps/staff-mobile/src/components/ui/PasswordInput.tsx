import { Eye, EyeOff } from "lucide-react-native";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

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
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, error ? styles.containerError : styles.containerNormal]}>
        <TextInput
          style={styles.input}
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
          style={styles.eyeButton}
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
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#09090b" },
  container: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  containerNormal: { borderColor: "#e4e4e7", backgroundColor: "#ffffff" },
  containerError: { borderColor: "#ef4444" },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#09090b" },
  eyeButton: { padding: 8 },
  error: { fontSize: 12, color: "#ef4444", fontWeight: "500" },
  hint: { fontSize: 12, color: "#71717a" },
});
