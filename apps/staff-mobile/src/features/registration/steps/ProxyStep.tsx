import { Users } from "lucide-react-native";
import { Controller, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { Input } from "@/src/components/ui/Input";
import { PhoneInput } from "@/src/components/ui/PhoneInput";
import { Select } from "@/src/components/ui/Select";
import { type RegistrationFormValues, proxyRelationships, sanitizeName, sanitizePhoneNumber } from "@/src/features/registration/schema";

/**
 * Proxy information step with professional input handling:
 * - Proxy name, phone, relationship, and ID fields
 * - Input sanitization and validation
 * - Clear context messaging
 */
export const ProxyStep = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  return (
    <View className="gap-5">
      {/* Informational Banner */}
      <View className="flex-row items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 border border-blue-200 dark:border-blue-900">
        <Users color="#2563eb" size={20} />
        <Text className="flex-1 text-sm text-foreground font-medium">
          Since this beneficiary has no phone, funds will be sent to a trusted proxy who will withdraw cash and deliver it.
        </Text>
      </View>

      {/* Proxy Full Name */}
      <Controller
        control={control}
        name="proxyFullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Proxy Full Name"
            autoCapitalize="words"
            error={errors.proxyFullName?.message}
            onBlur={onBlur}
            onChangeText={(text) => onChange(sanitizeName(text))}
            placeholder="e.g. Joseph Ekai"
            value={value}
            hint="Legal name of the proxy/representative"
          />
        )}
      />

      {/* Proxy Phone Number */}
      <Controller
        control={control}
        name="proxyPhoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <PhoneInput
            label="Proxy Phone Number"
            error={errors.proxyPhoneNumber?.message}
            onBlur={onBlur}
            onChangeText={(text) => onChange(sanitizePhoneNumber(text))}
            value={value}
            placeholder="+254 712 345 678"
          />
        )}
      />

      {/* Proxy Relationship */}
      <Controller
        control={control}
        name="proxyRelationship"
        render={({ field: { onChange, value } }) => (
          <Select
            error={errors.proxyRelationship?.message}
            label="Relationship to Beneficiary"
            onChange={onChange}
            options={[...proxyRelationships]}
            value={value}
            hint="How is this proxy related to the beneficiary?"
          />
        )}
      />

      {/* Proxy National ID (Optional) */}
      <Controller
        control={control}
        name="proxyNationalId"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Proxy National ID (Optional)"
            autoCapitalize="characters"
            error={errors.proxyNationalId?.message}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="e.g. 12345-67890-1"
            value={value}
            hint="Recommended for verification purposes"
          />
        )}
      />
    </View>
  );
};
