import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Check } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DateFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  value: string;
  onChange: (isoDate: string) => void;
  maximumDate?: Date;
}

const formatDisplay = (isoDate: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

export const DateField = ({ label, error, hint, value, onChange, maximumDate = new Date() }: DateFieldProps) => {
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value) : maximumDate;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        style={[styles.pressable, error ? styles.pressableError : styles.pressableNormal]}
        onPress={() => setOpen(true)}
      >
        <Calendar color="#71717a" size={18} />
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ? formatDisplay(value) : "Select date of birth"}
        </Text>
      </Pressable>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}

      {open ? (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={maximumDate}
            mode="date"
            themeVariant={Platform.OS === "ios" ? "dark" : undefined}
            onChange={(event, selected) => {
              if (Platform.OS === "ios") {
                if (event.type === "dismissed") {
                  setOpen(false);
                  return;
                }
                if (selected) {
                  onChange(selected.toISOString().slice(0, 10));
                }
              } else {
                setOpen(false);
                if (event.type !== "dismissed" && selected) {
                  onChange(selected.toISOString().slice(0, 10));
                }
              }
            }}
            value={dateValue}
          />
          {Platform.OS === "ios" ? (
            <TouchableOpacity style={styles.doneButton} onPress={() => setOpen(false)}>
              <Check color="#ffffff" size={16} />
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#09090b" },
  pressable: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
  pressableNormal: { borderColor: "#e4e4e7", backgroundColor: "#ffffff" },
  pressableError: { borderColor: "#ef4444" },
  valueText: { fontSize: 16, color: "#09090b" },
  placeholderText: { fontSize: 16, color: "#a1a1aa" },
  error: { fontSize: 12, color: "#ef4444", fontWeight: "500" },
  hint: { fontSize: 12, color: "#71717a" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#18181b",
  },
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#27272a",
    paddingVertical: 10,
    margin: 8,
    borderRadius: 6,
  },
  doneText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
