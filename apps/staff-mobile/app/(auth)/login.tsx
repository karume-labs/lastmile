import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // @lastmile/auth's Better Auth backend isn't wired up yet (packages/db has no
  // generated auth schema), so this navigates straight through for now.
  const onSubmit = handleSubmit(() => {
    router.replace("/(tabs)");
  });

  return (
    <View className="flex-1 justify-center gap-4 bg-background px-6">
      <View className="gap-1">
        <Text className="text-2xl font-semibold text-foreground">LastMile Staff</Text>
        <Text className="text-muted-foreground">Sign in to register participants.</Text>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-foreground">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="rounded-md border border-border px-3 py-2 text-foreground"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email ? <Text className="text-sm text-destructive">{errors.email.message}</Text> : null}
      </View>

      <View className="gap-2">
        <Text className="text-sm text-foreground">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="rounded-md border border-border px-3 py-2 text-foreground"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password ? <Text className="text-sm text-destructive">{errors.password.message}</Text> : null}
      </View>

      <Pressable
        className="items-center rounded-md bg-primary py-3 disabled:opacity-50"
        disabled={isSubmitting}
        onPress={onSubmit}
      >
        <Text className="font-medium text-primary-foreground">Sign In</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
