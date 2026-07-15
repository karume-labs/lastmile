import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { DateField } from "@/src/components/ui/DateField";
import { Input } from "@/src/components/ui/Input";
import { SegmentedControl } from "@/src/components/ui/SegmentedControl";
import { genders, type RegistrationFormValues } from "@/src/features/registration/schema";

export const BeneficiaryStep = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();
  const hasPhone = watch("hasPhone");

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            autoCapitalize="words"
            error={errors.fullName?.message}
            label="Full name"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="e.g. Amina Ekiru"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <DateField error={errors.dateOfBirth?.message} label="Date of birth" onChange={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <SegmentedControl label="Gender" onChange={onChange} options={[...genders]} value={value} />
        )}
      />

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

      {hasPhone ? (
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              error={errors.phoneNumber?.message}
              keyboardType="phone-pad"
              label="Phone number"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="e.g. +254712345678"
              value={value}
            />
          )}
        />
      ) : null}
    </View>
  );
};
