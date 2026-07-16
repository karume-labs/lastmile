"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthSignUpRequest } from "@lastmile/types/auth";
import { AuthSignUpSchema } from "@lastmile/validators/auth";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/features/auth/services/mutations";

export const SignUpForm = () => {
  const signUpMutation = useSignUp();
  const form = useForm<AuthSignUpRequest>({
    resolver: zodResolver(AuthSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: AuthSignUpRequest) => {
    signUpMutation.mutate(data);
  };

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-xl font-bold mb-2">
          Welcome to <span className="text-primary">Last</span>
          <span className="text-foreground">Mile</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            Sign in
          </Link>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={signUpMutation.isPending} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" className="bg-muted/50 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" className="bg-muted/50 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      className="bg-muted/50 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      className="bg-muted/50 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl font-medium py-6"
                disabled={signUpMutation.isPending}
              >
                Create Account
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
