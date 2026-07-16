import AsyncStorage from "@react-native-async-storage/async-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native";
import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
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

const FORM_STORAGE_KEY = "lastmile.registration-form.v1";

type StepKey = "beneficiary" | "verification" | "location" | "proxy" | "consent" | "review";

const STEP_META: Record<StepKey, { label: string; Component: ComponentType }> = {
  beneficiary: { label: "Beneficiary", Component: BeneficiaryStep },
  verification: { label: "Verification", Component: VerificationStep },
  location: { label: "Location", Component: LocationStep },
  proxy: { label: "Proxy", Component: ProxyStep },
  consent: { label: "Photo & Consent", Component: PhotoConsentStep },
  review: { label: "Review", Component: ReviewStep },
};

const IntakeScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: defaultRegistrationValues,
    mode: "onTouched",
  });

  const hasPhone = form.watch("hasPhone");
  const scrollRef = useRef<ScrollView>(null);
  const formRef = useRef(form);
  formRef.current = form;

  // Restore saved form on mount
  useEffect(() => {
    AsyncStorage.getItem(FORM_STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as RegistrationFormValues;
          formRef.current.reset(saved, { keepDefaultValues: false });
        } catch { /* ignore corrupt data */ }
      }
    });
  }, []);

  // Save form on unmount (tab switch)
  useEffect(() => {
    return () => {
      const values = formRef.current.getValues();
      AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
    };
  }, []);

  // Reset conditional fields when hasPhone toggles
  useEffect(() => {
    if (hasPhone) {
      form.setValue("proxyFullName", undefined);
      form.setValue("proxyPhoneNumber", undefined);
      form.setValue("proxyRelationship", undefined);
      form.setValue("proxyNationalId", undefined);
    } else {
      form.setValue("phoneNumber", undefined);
    }
  }, [hasPhone]);

  const clearSavedForm = useCallback(async () => {
    await AsyncStorage.removeItem(FORM_STORAGE_KEY);
  }, []);

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
    const fields = stepFields[currentStepKey] as unknown as (keyof RegistrationFormValues)[];
    const valid = await form.trigger(fields);
    if (valid) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
    }
  };

  const goBack = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const onSubmit = () => {
    setSubmitting(true);
    let cancelled = false;

    setTimeout(async () => {
      const currentForm = formRef.current;

      try {
        const values = currentForm.getValues();
        const result = registrationFormSchema.safeParse(values);

        if (!result.success) {
          const errorSet = new Set<string>();
          for (const issue of result.error.issues) {
            if (issue.path.length > 0) {
              errorSet.add(String(issue.path[0]));
            }
          }

          const errorFieldNames = [...errorSet] as (keyof RegistrationFormValues)[];
          currentForm.trigger(errorFieldNames);

          const firstIssue = result.error.issues[0];
          const message = firstIssue?.message ?? "Please fix the errors in the form and try again.";

          if (!cancelled) {
            for (let i = 0; i < steps.length; i++) {
              const stepKey = steps[i];
              if (stepKey === "review") continue;
              const stepFieldList = stepFields[stepKey] as unknown as string[];
              const hasError = stepFieldList.some((f) => errorSet.has(f));
              if (hasError) {
                scrollRef.current?.scrollTo({ y: 0, animated: false });
                setStepIndex(i);
                setSubmitting(false);
                Alert.alert("Incomplete form", message);
                return;
              }
            }

            setSubmitting(false);
            Alert.alert("Incomplete form", message);
          }
          return;
        }

        const record = await enqueueRegistration(values);
        await queryClient.invalidateQueries({ queryKey: REGISTRATION_QUEUE_KEY });
        await clearSavedForm();

        if (!cancelled) {
          setSubmitting(false);
          Alert.alert("Registration saved", `Queued as ${record.referenceId}. It will sync when online.`, [
            { text: "OK", onPress: () => router.replace("/") },
          ]);
        }

        if (isOnline) {
          syncPendingRegistrations().finally(() => {
            queryClient.invalidateQueries({ queryKey: REGISTRATION_QUEUE_KEY });
          });
        }
      } catch (error) {
        if (!cancelled) {
          setSubmitting(false);
          Alert.alert("Save failed", "Failed to save registration. Please try again.");
        }
      }
    }, 0);
  };

  const handleReset = () => {
    form.reset(defaultRegistrationValues);
    setStepIndex(0);
    clearSavedForm();
  };

  return (
    <FormProvider {...form}>
      <View style={intakeStyles.root}>
        <View style={intakeStyles.header}>
          <Text style={intakeStyles.headerTitle}>Register participant</Text>
          <ProgressBar step={stepIndex + 1} stepLabel={stepLabel} totalSteps={steps.length} />
        </View>

        <ScrollView
          ref={scrollRef}
          style={intakeStyles.scroll}
          contentContainerStyle={intakeStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
        >
          <StepComponent />
        </ScrollView>

        <View style={intakeStyles.footer}>
          {!isFirstStep ? (
            <View style={intakeStyles.footerButtonWrapper}>
              <Button icon={ArrowLeft} onPress={goBack} variant="outline">
                Back
              </Button>
            </View>
          ) : null}
          <View style={intakeStyles.footerButtonWrapper}>
            {isLastStep ? (
              <Button icon={Check} loading={submitting} onPress={onSubmit}>
                Save to queue
              </Button>
            ) : (
              <Button icon={ArrowRight} onPress={goNext}>
                Next
              </Button>
            )}
          </View>
        </View>
      </View>
    </FormProvider>
  );
};

const intakeStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 64,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#09090b",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  footerButtonWrapper: {
    flex: 1,
  },
});

export default IntakeScreen;
