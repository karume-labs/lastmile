"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (_data: unknown) => {
    setIsLoading(true);
    // TODO: implement sign up
    setTimeout(() => setIsLoading(false), 2000);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <fieldset disabled={isLoading} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs font-bold text-foreground">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className="bg-muted/50 rounded-xl"
                {...register("firstName", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs font-bold text-foreground">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="bg-muted/50 rounded-xl"
                {...register("lastName", { required: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="bg-muted/50 rounded-xl"
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              className="bg-muted/50 rounded-xl"
              {...register("password", { required: true })}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full rounded-xl font-medium py-6"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
