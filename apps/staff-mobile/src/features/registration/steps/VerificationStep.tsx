import { ShieldCheck } from "lucide-react-native";
import { Controller, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import { type RegistrationFormValues, verificationTypes, sanitizeInput } from "@/src/features/registration/schema";

/**
 * Verification configuration with security-focused input handling
 * - Type-specific keyboard and validation
 * - Sanitization rules
 * - Professional hints and placeholders
 */
const verificationInputConfig: Record<
  RegistrationFormValues["verificationType"],
  {
    placeholder: string;
    keyboardType: "numeric" | "default";
    maxLength: number;
    hint: string;
  }
> = {
  DATE_OF_BIRTH: {
    placeholder: "1990-05-14",
    keyboardType: "default",
    maxLength: 10,
    hint: "Enter as YYYY-MM-DD format (e.g., 1975-03-21). Must match beneficiary's records exactly.",
  },
  NATIONAL_ID_NUMBER: {
    placeholder: "12345678",
    keyboardType: "numeric",
    maxLength: 50,
    hint: "National ID or passport number. Will be verified against payout file.",
  },
  PIN: {
    placeholder: "4821",
    keyboardType: "numeric",
    maxLength: 10,
    hint: "Personal PIN (4-10 digits) that beneficiary will provide at payout for verification.",
  },
};

/**
 * Verification step with security practices:
 * - Input sanitization
 * - Type-specific validation
 * - Clear verification workflow
 * - Security context for field staff
 */
export const VerificationStep = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();
  const verificationType = watch("verificationType");
  const config = verificationInputConfig[verificationType];

  return (
    <View className="gap-5">
      {/* Security Information Banner */}
      <View className="flex-row items-start gap-3 rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-900">
        <ShieldCheck color="#16a34a" size={22} />
        <Text className="flex-1 text-sm text-foreground font-medium leading-5">
          This verification information ensures secure and accurate fund disbursement. It will be matched against the official payment list to prevent fraud.
        </Text>
      </View>

      {/* External Reference ID */}
      <Controller
        control={control}
        name="externalReferenceId"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="External Reference ID"
            autoCapitalize="characters"
            error={errors.externalReferenceId?.message}
            onBlur={onBlur}
            onChangeText={(text) => onChange(sanitizeInput(text))}
            placeholder="e.g. ENROL-2024-0001"
            value={value}
            hint="Beneficiary's enrollment or reference number from the programme database"
          />
        )}
      />

      {/* Verification Method Selection */}
      <Controller
        control={control}
        name="verificationType"
        render={({ field: { onChange, value } }) => (
          <Select
            error={errors.verificationType?.message}
            label="Verification Method"
            onChange={(next) => onChange(next as RegistrationFormValues["verificationType"])}
            options={[...verificationTypes]}
            value={value}
            hint="Choose how this beneficiary will be verified at payout"
          />
        )}
      />

      {/* Verification Value (Dynamic based on type) */}
      <Controller
        control={control}
        name="verificationValue"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Verification Value"
            keyboardType={config.keyboardType}
            error={errors.verificationValue?.message}
            onBlur={onBlur}
            onChangeText={(text) => onChange(sanitizeInput(text))}
            placeholder={config.placeholder}
            value={value}
            hint={config.hint}
          />
        )}
      />
    </View>
  );
};

