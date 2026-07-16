"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthSignInRequest } from "@lastmile/types/auth";
import { AuthSignInSchema } from "@lastmile/validators/auth";
import { Loader2 } from "lucide-react";
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
import { useSignIn } from "@/features/auth/services/mutations";

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
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={signInMutation.isPending} className="space-y-5">
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
                  <div className="flex items-center justify-between w-full">
                    <FormLabel className="text-xs font-bold text-foreground">Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**********"
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
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
