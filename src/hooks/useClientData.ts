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
  getStoredBalanceAdjustment,
  getStoredInternalTransfers,
  submitInternalTransferService,
} from "../services/transferServices";
import type { InternalTransferPayload } from "../lib/interfaces";

export const useDashboard = () => {
  const { token } = useUser();
  return useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    enabled: !!token,
    queryFn: async () => {
      const stats = toDashboardStats(await getDashboardService());
      const deduction = getStoredBalanceAdjustment();
      const adjustedBalance = Math.max(0, stats.balance - deduction);
      return {
        ...stats,
        balance: adjustedBalance,
        totalWithdrawn: stats.totalWithdrawn + deduction,
      };
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
      const localTransfers = getStoredInternalTransfers();

      let combined: Transaction[] = [];
      if (type === "transfer") {
        combined = [...localTransfers, ...serverItems.filter((i) => i.type === "transfer")];
      } else if (type === "deposit") {
        combined = serverItems.filter((i) => i.type === "deposit");
      } else if (type === "withdrawal") {
        combined = serverItems.filter((i) => i.type === "withdrawal");
      } else {
        combined = [...localTransfers, ...serverItems];
      }

      // Sort by date descending
      combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const total = (paged.total || serverItems.length) + (type !== "deposit" && type !== "withdrawal" ? localTransfers.length : 0);
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      return {
        ...paged,
        total,
        totalPages,
        items: combined.slice((page - 1) * perPage, page * perPage),
      };
    },
  });
};

export const useInternalTransfer = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  return useMutation({
    mutationFn: (payload: InternalTransferPayload) =>
      submitInternalTransferService(payload, user),
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
