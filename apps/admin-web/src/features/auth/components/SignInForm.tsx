"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthSignInRequest } from "@lastmile/types/auth";
import { AuthSignInSchema } from "@lastmile/validators/auth";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "../services/mutations";

export const SignInForm = () => {
  const signInMutation = useSignIn();
  const form = useForm<AuthSignInRequest>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: AuthSignInRequest) => {
    signInMutation.mutate(data);
  };

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Welcome back to <span className="text-primary">Last</span>
          <span className="text-foreground">Mile</span>
        </h1>
        <p className="text-sm text-muted-foreground px-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            Sign up
          </Link>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={signInMutation.isPending} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.email}>
                  <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                    Email Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="m@example.com"
                    className="bg-muted/50 rounded-xl"
                    {...field}
                    aria-invalid={!!form.formState.errors.email}
                  />
                  {form.formState.errors.email && (
                    <FieldError>{form.formState.errors.email.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.password}>
                  <div className="flex items-center justify-between w-full">
                    <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                      Password
                    </FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="**********"
                    className="bg-muted/50 rounded-xl"
                    {...field}
                    aria-invalid={!!form.formState.errors.password}
                  />
                  {form.formState.errors.password && (
                    <FieldError>{form.formState.errors.password.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl font-medium py-6"
                disabled={signInMutation.isPending}
              >
                Sign in
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
