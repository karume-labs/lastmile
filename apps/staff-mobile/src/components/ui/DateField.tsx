import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

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
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-semibold text-foreground">{label}</Text> : null}
      <Pressable
        className={`flex-row items-center gap-2 rounded-lg border bg-background px-3 py-3 ${
          error ? "border-destructive" : "border-border"
        }`}
        onPress={() => setOpen(true)}
      >
        <Calendar color="#71717a" size={18} />
        <Text className={value ? "text-base text-foreground" : "text-base text-muted-foreground"}>
          {value ? formatDisplay(value) : "Select date of birth"}
        </Text>
      </Pressable>
      {error ? (
        <Text className="text-sm text-destructive">{error}</Text>
      ) : hint ? (
        <Text className="text-sm text-muted-foreground">{hint}</Text>
      ) : null}

      {open ? (
        <DateTimePicker
          display={Platform.OS === "ios" ? "inline" : "default"}
          maximumDate={maximumDate}
          mode="date"
          onChange={(event, selected) => {
            setOpen(Platform.OS === "ios");
            if (event.type === "dismissed") {
              setOpen(false);
              return;
            }
            if (selected) {
              onChange(selected.toISOString().slice(0, 10));
            }
            if (Platform.OS === "android") setOpen(false);
          }}
          value={dateValue}
        />
      ) : null}
    </View>
  );
};
