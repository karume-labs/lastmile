import { Users } from "lucide-react-native";
import { Controller, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import { type RegistrationFormValues, proxyRelationships } from "@/src/features/registration/schema";

export const ProxyStep = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  return (
    <View className="gap-5">
      <View className="flex-row items-start gap-2 rounded-lg bg-accent/10 p-3">
        <Users color="#2563eb" size={18} />
        <Text className="flex-1 text-sm text-foreground">
          Since this beneficiary has no phone, funds will be sent to a trusted proxy they've chosen, who withdraws
          the cash and delivers it to them.
        </Text>
      </View>

      <Controller
        control={control}
        name="proxyFullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            autoCapitalize="words"
            error={errors.proxyFullName?.message}
            label="Proxy full name"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="e.g. Joseph Ekai"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="proxyPhoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            error={errors.proxyPhoneNumber?.message}
            keyboardType="phone-pad"
            label="Proxy phone number"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="e.g. +254712345678"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="proxyRelationship"
        render={({ field: { onChange, value } }) => (
          <Select
            error={errors.proxyRelationship?.message}
            label="Relationship to beneficiary"
            onChange={onChange}
            options={[...proxyRelationships]}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="proxyNationalId"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            hint="Optional, but recommended for verification."
            label="Proxy national ID (optional)"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="e.g. 12345678"
            value={value}
          />
        )}
      />
    </View>
  );
};
