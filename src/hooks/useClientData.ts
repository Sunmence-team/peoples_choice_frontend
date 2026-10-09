import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDashboardService,
  getTransactionLedgerService,
  updateProfileService,
  deleteAccountService,
  disableAccountService,
  type UpdateProfilePayload,
} from "../services/userServices";
import {
  getMyDepositsService,
  submitDepositService,
  type SubmitDepositPayload,
} from "../services/depositServices";
import { getWalletsService } from "../services/walletServices";
import {
  getMyWithdrawalsService,
  requestWithdrawalService,
  type RequestWithdrawalPayload,
} from "../services/withdrawalServices";
import { toPaged, toArray } from "../helpers/response";
import {
  toClientTransaction,
  toDashboardStats,
  toWalletAddress,
  type DashboardStats,
  type WalletAddress,
} from "../helpers/mappers";
import type { Transaction } from "../lib/interfaces";
import { useUser } from "./useUser";

export const useDashboard = () => {
  const { token } = useUser();
  return useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    enabled: !!token,
    queryFn: async () => toDashboardStats(await getDashboardService()),
  });
};

export const useTransactionLedger = (
  page = 1,
  perPage = 10,
  type?: "deposit" | "withdrawal"
) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["ledger", page, perPage, type ?? "all"],
    enabled: !!token,
    queryFn: async (): Promise<{
      items: Transaction[];
      total: number;
      currentPage: number;
      totalPages: number;
      perPage: number;
    }> => {
      const body = await getTransactionLedgerService({
        page,
        per_page: perPage,
        type,
      });
      const paged = toPaged<unknown>(body, perPage);
      return { ...paged, items: paged.items.map((item) => toClientTransaction(item)) };
    },
  });
};

export const useWallets = () => {
  const { token } = useUser();
  return useQuery<WalletAddress[]>({
    queryKey: ["wallets"],
    enabled: !!token,
    queryFn: async () => toArray(await getWalletsService()).map(toWalletAddress),
  });
};

export const useMyDeposits = (page = 1, perPage = 10) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["my-deposits", page, perPage],
    enabled: !!token,
    queryFn: async () => {
      const body = await getMyDepositsService({ page, per_page: perPage });
      const paged = toPaged<unknown>(body, perPage);
      return {
        ...paged,
        items: paged.items.map((item) => toClientTransaction(item, "deposit")),
      };
    },
  });
};

export const useSubmitDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitDepositPayload) => submitDepositService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-deposits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
    },
  });
};

export const useMyWithdrawals = (page = 1, perPage = 10) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["my-withdrawals", page, perPage],
    enabled: !!token,
    queryFn: async () => {
      const body = await getMyWithdrawalsService({ page, per_page: perPage });
      const paged = toPaged<unknown>(body, perPage);
      return {
        ...paged,
        items: paged.items.map((item) => toClientTransaction(item, "withdrawal")),
      };
    },
  });
};

export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestWithdrawalPayload) => requestWithdrawalService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
    },
  });
};

export const useUpdateProfile = () => {
  const { token, refreshUser } = useUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileService(payload),
    onSuccess: async () => {
      if (token) await refreshUser(token);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteAccount = () => {
  const { logout } = useUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAccountService(),
    onSettled: () => {
      queryClient.clear();
      logout();
    },
  });
};

export const useDisableAccount = () => {
  const { logout } = useUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => disableAccountService(reason),
    onSettled: () => {
      queryClient.clear();
      logout();
    },
  });
};
