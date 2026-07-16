import { Phone } from "lucide-react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface PhoneInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value: string | undefined;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

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
    let processed = text;
    if (!text.startsWith("+")) {
      processed = text.replace(/[^\d]/g, "");
    } else {
      const plusCount = text.match(/\+/g)?.length || 0;
      if (plusCount > 1) {
        processed = "+" + text.replace(/\D/g, "");
      } else {
        processed = "+" + text.slice(1).replace(/\D/g, "");
      }
    }
    if (processed.startsWith("+")) {
      processed = processed.substring(0, 16);
    } else {
      processed = processed.substring(0, 15);
    }
    onChangeText(processed);
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, error ? styles.containerError : styles.containerNormal]}>
        <Phone size={20} color={error ? "#ef4444" : "#71717a"} />
        <TextInput
          style={styles.input}
          placeholderTextColor="#a1a1aa"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="tel"
          value={value ?? ""}
          onChangeText={handleChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          editable={true}
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
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#09090b" },
  container: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  containerNormal: { borderColor: "#e4e4e7", backgroundColor: "#ffffff" },
  containerError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#09090b" },
  error: { fontSize: 12, color: "#ef4444", fontWeight: "500" },
  hint: { fontSize: 12, color: "#71717a" },
});
