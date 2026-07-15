import { WifiOff } from "lucide-react-native";
import { useFormContext } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { verificationTypes } from "@/src/features/registration/schema";
import type { RegistrationFormValues } from "@/src/features/registration/schema";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";

const Row = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between gap-3 py-1.5">
    <Text className="text-sm text-muted-foreground">{label}</Text>
    <Text className="flex-1 text-right text-sm font-medium text-foreground">{value || "—"}</Text>
  </View>
);

export const ReviewStep = () => {
  const { watch } = useFormContext<RegistrationFormValues>();
  const values = watch();
  const { isOnline } = useNetworkStatus();
  const verificationLabel = verificationTypes.find((type) => type.value === values.verificationType)?.label ?? "";

  return (
    <View className="gap-4">
      <Card>
        <Text className="mb-2 text-sm font-semibold text-foreground">Beneficiary</Text>
        {values.photoUri ? (
          <Image className="mb-3 h-16 w-16 rounded-lg" source={{ uri: values.photoUri }} />
        ) : null}
        <Row label="Full name" value={values.fullName} />
        <Row label="Date of birth" value={values.dateOfBirth} />
        <Row label="Gender" value={values.gender} />
        <Row label="Phone" value={values.hasPhone ? (values.phoneNumber ?? "") : "No phone — see proxy"} />
      </Card>

      <Card>
        <Text className="mb-2 text-sm font-semibold text-foreground">Verification</Text>
        <Row label="External reference ID" value={values.externalReferenceId} />
        <Row label="Method" value={verificationLabel} />
        <Row label="Value" value={values.verificationValue} />
      </Card>

      <Card>
        <Text className="mb-2 text-sm font-semibold text-foreground">Location & programme</Text>
        <Row label="Location" value={values.locationLabel} />
        <Row label="GPS" value={values.coordinates ? "Captured" : "Not captured"} />
        <Row label="Programme" value={values.programmeName} />
      </Card>

      {!values.hasPhone ? (
        <Card>
          <Text className="mb-2 text-sm font-semibold text-foreground">Proxy</Text>
          <Row label="Full name" value={values.proxyFullName ?? ""} />
          <Row label="Phone" value={values.proxyPhoneNumber ?? ""} />
          <Row label="Relationship" value={values.proxyRelationship ?? ""} />
        </Card>
      ) : null}

      {!isOnline ? (
        <View className="flex-row items-center gap-2 rounded-lg bg-warning/10 p-3">
          <WifiOff color="#b45309" size={18} />
          <Text className="flex-1 text-sm text-foreground">
            You're offline. This registration will be saved on this device and sent automatically once you're back
            online.
          </Text>
        </View>
      ) : null}
    </View>
  );
};
