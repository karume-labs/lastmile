import type {
  AuthSignInRequest,
  AuthSignInResponse,
  AuthSignUpRequest,
} from "@lastmile/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AuthSignInRequest) => {
      const response = await apiClient.post<AuthSignInResponse>("/auth/sign-in", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/admin/dashboard");
    },
  });
};

export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/auth/sign-out");
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/sign-in");
    },
  });
};

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AuthSignUpRequest) => {
      const response = await apiClient.post<AuthSignInResponse>("/auth/sign-up", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/admin/dashboard");
    },
  });
};
