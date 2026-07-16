import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
}

export const Input = ({ label, error, hint, icon: Icon, style, ...inputProps }: InputProps) => {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, error ? styles.containerError : styles.containerNormal]}>
        {Icon ? <Icon color={error ? "#ef4444" : "#71717a"} size={20} /> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#a1a1aa"
          {...inputProps}
        />
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
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#09090b",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  containerNormal: {
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
  },
  containerError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#09090b",
  },
  error: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
    color: "#71717a",
  },
});
