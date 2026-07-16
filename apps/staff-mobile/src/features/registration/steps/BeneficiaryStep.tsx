import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { DateField } from "@/src/components/ui/DateField";
import { Input } from "@/src/components/ui/Input";
import { PhoneInput } from "@/src/components/ui/PhoneInput";
import { SegmentedControl } from "@/src/components/ui/SegmentedControl";
import { genders, type RegistrationFormValues, sanitizeName, sanitizePhoneNumber } from "@/src/features/registration/schema";

/**
 * Beneficiary information step with professional input handling:
 * - Name, date, gender, and phone fields
 * - Input sanitization and validation
 * - Conditional rendering for phone vs proxy
 */
export const BeneficiaryStep = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();
  const hasPhone = watch("hasPhone");

  return (
    <View className="gap-5">
      {/* Full Name Input */}
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Full Name"
            autoCapitalize="words"
            error={errors.fullName?.message}
            onBlur={onBlur}
            onChangeText={(text) => onChange(sanitizeName(text))}
            placeholder="e.g. Amina Ekiru"
            value={value}
            hint="Enter the beneficiary's full legal name"
            maxLength={100}
          />
        )}
      />

      {/* Date of Birth Input */}
      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <DateField
            error={errors.dateOfBirth?.message}
            label="Date of Birth"
            onChange={onChange}
            value={value}
            hint="Must be 18 years or older"
          />
        )}
      />

      {/* Gender Selection */}
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <SegmentedControl
            label="Gender"
            onChange={onChange}
            options={[...genders]}
            value={value}
          />
        )}
      />

      {/* Phone Ownership Toggle */}
      <Controller
        control={control}
        name="hasPhone"
        render={({ field: { onChange, value } }) => (
          <SegmentedControl
            label="Does the beneficiary own a mobile phone?"
            onChange={(next) => onChange(next === "yes")}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No — needs a proxy", value: "no" },
            ]}
            value={value ? "yes" : "no"}
          />
        )}
      />

      {/* Conditional Phone Number Input */}
      {hasPhone ? (
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <PhoneInput
              label="Phone Number"
              error={errors.phoneNumber?.message}
              onBlur={onBlur}
              onChangeText={(text) => onChange(sanitizePhoneNumber(text))}
              value={value}
              placeholder="+254 712 345 678"
            />
          )}
        />
      ) : null}
    </View>
  );
};
