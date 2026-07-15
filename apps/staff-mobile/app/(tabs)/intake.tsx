import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { enqueueRegistration, registrationSchema, type RegistrationInput } from "@/src/lib/queue";

const IntakeScreen = () => {
  const queryClient = useQueryClient();
  const [lastReferenceId, setLastReferenceId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { fullName: "", proxyPhone: "", location: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const record = await enqueueRegistration(values);
    await queryClient.invalidateQueries({ queryKey: ["registration-queue"] });
    setLastReferenceId(record.referenceId);
    reset();
  });

  return (
    <View className="flex-1 gap-4 bg-background px-6 pt-16">
      <Text className="text-2xl font-semibold text-foreground">Register Participant</Text>
      <Text className="text-muted-foreground">Saved locally and synced when you're back online.</Text>

      {lastReferenceId ? (
        <View className="rounded-md border border-border bg-muted p-3">
          <Text className="text-foreground">Queued as {lastReferenceId}</Text>
        </View>
      ) : null}

      <View className="gap-2">
        <Text className="text-sm text-foreground">Full name</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="rounded-md border border-border px-3 py-2 text-foreground"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.fullName ? <Text className="text-sm text-destructive">{errors.fullName.message}</Text> : null}
      </View>

      <View className="gap-2">
        <Text className="text-sm text-foreground">Proxy phone number</Text>
        <Controller
          control={control}
          name="proxyPhone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="rounded-md border border-border px-3 py-2 text-foreground"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.proxyPhone ? <Text className="text-sm text-destructive">{errors.proxyPhone.message}</Text> : null}
      </View>

      <View className="gap-2">
        <Text className="text-sm text-foreground">Location</Text>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="rounded-md border border-border px-3 py-2 text-foreground"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.location ? <Text className="text-sm text-destructive">{errors.location.message}</Text> : null}
      </View>

      <Pressable
        className="items-center rounded-md bg-primary py-3 disabled:opacity-50"
        disabled={isSubmitting}
        onPress={onSubmit}
      >
        <Text className="font-medium text-primary-foreground">Save to queue</Text>
      </Pressable>
    </View>
  );
};

export default IntakeScreen;
