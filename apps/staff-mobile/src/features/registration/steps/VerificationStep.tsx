import { ShieldCheck } from "lucide-react-native";
import { Controller, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import { type RegistrationFormValues, verificationTypes } from "@/src/features/registration/schema";

const verificationInputConfig: Record<
  RegistrationFormValues["verificationType"],
  { placeholder: string; keyboardType: "numeric" | "default"; hint: string }
> = {
  DATE_OF_BIRTH: {
    placeholder: "e.g. 1990-05-14",
    keyboardType: "default",
    hint: "Enter as YYYY-MM-DD, exactly how it will be checked at payout.",
  },
  NATIONAL_ID_NUMBER: {
    placeholder: "e.g. 12345678",
    keyboardType: "numeric",
    hint: "The beneficiary's national ID or passport number.",
  },
  PIN: {
    placeholder: "e.g. 4821",
    keyboardType: "numeric",
    hint: "A personal PIN the beneficiary or proxy will remember at payout.",
  },
};

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
      <View className="flex-row items-start gap-2 rounded-lg bg-accent/10 p-3">
        <ShieldCheck color="#2563eb" size={18} />
        <Text className="flex-1 text-sm text-foreground">
          This identity information is matched against the finance officer's payment file, so the payout can be
          verified without exposing beneficiaries to blockchain or banking systems.
        </Text>
      </View>

      <Controller
        control={control}
        name="externalReferenceId"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            autoCapitalize="characters"
            error={errors.externalReferenceId?.message}
            label="External reference ID"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="e.g. programme enrollment number"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="verificationType"
        render={({ field: { onChange, value } }) => (
          <Select
            error={errors.verificationType?.message}
            label="Verification method"
            onChange={(next) => onChange(next as RegistrationFormValues["verificationType"])}
            options={[...verificationTypes]}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="verificationValue"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            error={errors.verificationValue?.message}
            hint={config.hint}
            keyboardType={config.keyboardType}
            label="Verification value"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={config.placeholder}
            value={value}
          />
        )}
      />
    </View>
  );
};
