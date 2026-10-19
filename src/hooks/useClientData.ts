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
  getDepositService,
  submitDepositService,
  type SubmitDepositPayload,
  type DepositDetail,
} from "../services/depositServices";
import { getWalletsService } from "../services/walletServices";
import {
  getMyWithdrawalsService,
  requestWithdrawalService,
  requestWithdrawalOtpService,
  verifyWithdrawalOtpService,
  requestWithdrawalOtcService,
  submitWithdrawalService,
  type RequestWithdrawalPayload,
  type RequestOtpPayload,
  type SubmitWithdrawalPayload,
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

import {
  submitInternalTransferService,
  type InternalTransferPayload,
} from "../services/transferServices";
import { getKYCStatusService, type KYCStatusResponse } from "../services/kycServices";

export const useKYCStatus = () => {
  const { token } = useUser();
  return useQuery<KYCStatusResponse>({
    queryKey: ["kyc-status"],
    enabled: !!token,
    queryFn: () => getKYCStatusService(),
    staleTime: 30000,
  });
};

export const useDashboard = () => {
  const { token } = useUser();
  return useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    enabled: !!token,
    queryFn: async () => {
      return toDashboardStats(await getDashboardService());
    },
  });
};

export const useTransactionLedger = (
  page = 1,
  perPage = 10,
  type?: "deposit" | "withdrawal" | "transfer"
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
      const serverType = type === "transfer" ? undefined : type;
      const body = await getTransactionLedgerService({
        page,
        per_page: perPage,
        type: serverType,
      });
      const paged = toPaged<unknown>(body, perPage);
      const serverItems = paged.items.map((item) => toClientTransaction(item));

      let filtered = serverItems;
      if (type === "transfer") {
        filtered = serverItems.filter((i) => i.type === "transfer");
      } else if (type === "deposit") {
        filtered = serverItems.filter((i) => i.type === "deposit");
      } else if (type === "withdrawal") {
        filtered = serverItems.filter((i) => i.type === "withdrawal");
      }

      return {
        ...paged,
        total: paged.total || filtered.length,
        items: filtered,
      };
    },
  });
};

export const useInternalTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InternalTransferPayload) =>
      submitInternalTransferService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
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

export const useDeposit = (
  depositId: number | string | null | undefined
) => {
  const { token } = useUser();
  return useQuery<DepositDetail>({
    queryKey: ["deposit", depositId ? String(depositId) : null],
    enabled: !!token && !!depositId,
    queryFn: async () => {
      return await getDepositService(depositId!);
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status?.toLowerCase();
      return status === "pending" ? 5000 : false;
    },
  });
};

export const useSubmitDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitDepositPayload) => submitDepositService(payload),
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.setQueryData(["deposit", String(data.id)], data);
      }
      queryClient.invalidateQueries({ queryKey: ["deposit"] });
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

export const useRequestWithdrawalOtp = () => {
  return useMutation({
    mutationFn: (payload?: RequestOtpPayload) => requestWithdrawalOtpService(payload),
  });
};

export const useVerifyWithdrawalOtp = () => {
  return useMutation({
    mutationFn: (otpCode: string) => verifyWithdrawalOtpService(otpCode),
  });
};

export const useRequestWithdrawalOtc = () => {
  return useMutation({
    mutationFn: () => requestWithdrawalOtcService(),
  });
};

export const useSubmitWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitWithdrawalPayload) => submitWithdrawalService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
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
