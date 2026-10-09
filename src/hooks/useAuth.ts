import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginService,
  logoutService,
  registerService,
  type AuthResult,
  type RegisterPayload,
} from "../services/authServices";
import { useUser } from "./useUser";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginService(email, password),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerService(payload),
  });
};

export const useLogout = () => {
  const { logout } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logoutService();
    },
    onSettled: () => {
      queryClient.clear();
      logout();
    },
  });
};

export type { AuthResult };
