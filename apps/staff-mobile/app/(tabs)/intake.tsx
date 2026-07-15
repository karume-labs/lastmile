import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Button } from "@/src/components/ui/Button";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { enqueueRegistration } from "@/src/features/registration/queue";
import {
  defaultRegistrationValues,
  registrationFormSchema,
  type RegistrationFormValues,
  stepFields,
} from "@/src/features/registration/schema";
import { BeneficiaryStep } from "@/src/features/registration/steps/BeneficiaryStep";
import { LocationStep } from "@/src/features/registration/steps/LocationStep";
import { PhotoConsentStep } from "@/src/features/registration/steps/PhotoConsentStep";
import { ProxyStep } from "@/src/features/registration/steps/ProxyStep";
import { ReviewStep } from "@/src/features/registration/steps/ReviewStep";
import { VerificationStep } from "@/src/features/registration/steps/VerificationStep";
import { syncPendingRegistrations } from "@/src/features/registration/sync";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { REGISTRATION_QUEUE_KEY } from "@/src/hooks/useRegistrationQueue";

type StepKey = "beneficiary" | "verification" | "location" | "proxy" | "consent" | "review";

const STEP_META: Record<StepKey, { label: string; Component: ComponentType }> = {
  beneficiary: { label: "Beneficiary", Component: BeneficiaryStep },
  verification: { label: "Verification", Component: VerificationStep },
  location: { label: "Location", Component: LocationStep },
  proxy: { label: "Proxy", Component: ProxyStep },
  consent: { label: "Photo & Consent", Component: PhotoConsentStep },
  review: { label: "Review", Component: ReviewStep },
};

interface SuccessViewProps {
  referenceId: string;
  onDone: () => void;
}

const SuccessView = ({ referenceId, onDone }: SuccessViewProps) => (
  <View className="flex-1 items-center justify-center gap-4 bg-background px-8">
    <View className="h-16 w-16 items-center justify-center rounded-full bg-success/15">
      <Check color="#16a34a" size={32} />
    </View>
    <Text className="text-xl font-semibold text-foreground">Registration saved</Text>
    <Text className="text-center text-muted-foreground">
      Queued as {referenceId}. It will sync to the admin dashboard automatically once you're back online.
    </Text>
    <Button onPress={onDone}>Register another participant</Button>
  </View>
);

const IntakeScreen = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();
  const [stepIndex, setStepIndex] = useState(0);
  const [lastReferenceId, setLastReferenceId] = useState<string | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: defaultRegistrationValues,
    mode: "onBlur",
  });

  const hasPhone = form.watch("hasPhone");

  const steps = useMemo<StepKey[]>(() => {
    const order: StepKey[] = ["beneficiary", "verification", "location"];
    if (!hasPhone) order.push("proxy");
    order.push("consent", "review");
    return order;
  }, [hasPhone]);

  const currentStepKey = steps[Math.min(stepIndex, steps.length - 1)];
  const { Component: StepComponent, label: stepLabel } = STEP_META[currentStepKey];
  const isLastStep = stepIndex === steps.length - 1;
  const isFirstStep = stepIndex === 0;

  const goNext = async () => {
    if (currentStepKey === "review") return;
    const valid = await form.trigger(stepFields[currentStepKey]);
    if (valid) setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  const onSubmit = form.handleSubmit(async (values) => {
    const record = await enqueueRegistration(values);
    await queryClient.invalidateQueries({ queryKey: REGISTRATION_QUEUE_KEY });
    setLastReferenceId(record.referenceId);
    if (isOnline) {
      syncPendingRegistrations().finally(() => {
        queryClient.invalidateQueries({ queryKey: REGISTRATION_QUEUE_KEY });
      });
    }
  });

  const handleReset = () => {
    form.reset(defaultRegistrationValues);
    setStepIndex(0);
    setLastReferenceId(null);
  };

  if (lastReferenceId) {
    return <SuccessView onDone={handleReset} referenceId={lastReferenceId} />;
  }

  return (
    <FormProvider {...form}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-background"
        keyboardVerticalOffset={90}
      >
        <View className="gap-4 border-b border-border px-6 pb-4 pt-16">
          <Text className="text-2xl font-semibold text-foreground">Register participant</Text>
          <ProgressBar step={stepIndex + 1} stepLabel={stepLabel} totalSteps={steps.length} />
        </View>

        <ScrollView className="flex-1 px-6 py-6" keyboardShouldPersistTaps="handled">
          <StepComponent />
        </ScrollView>

        <View className="flex-row gap-3 border-t border-border px-6 py-4">
          {!isFirstStep ? (
            <Button icon={ArrowLeft} onPress={goBack} variant="outline">
              Back
            </Button>
          ) : null}
          <View className="flex-1">
            {isLastStep ? (
              <Button icon={Check} loading={form.formState.isSubmitting} onPress={onSubmit}>
                Save to queue
              </Button>
            ) : (
              <Button icon={ArrowRight} onPress={goNext}>
                Next
              </Button>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default IntakeScreen;
