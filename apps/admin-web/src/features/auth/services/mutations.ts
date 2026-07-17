import { authClient } from "@lastmile/auth/client";
import type { AuthSignInRequest, AuthSignUpRequest } from "@lastmile/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AuthSignInRequest) => {
      const { data: session, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) {
        throw new Error(error.message || "Failed to sign in");
      }
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message || "Failed to sign out");
      }
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AuthSignUpRequest) => {
      const { data: session, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      });
      if (error) {
        throw new Error(error.message || "Failed to sign up");
      }
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
