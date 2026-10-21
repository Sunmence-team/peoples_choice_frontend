import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboardService,
  getAdminUsersService,
  getAdminUserService,
  updateAdminUserBalanceService,
  updateAdminUserService,
  disableAdminUserService,
  enableAdminUserService,
  deleteAdminUserService,
  restoreAdminUserService,
  getAdminWalletsService,
  createAdminWalletService,
  updateAdminWalletService,
  disableAdminWalletService,
  enableAdminWalletService,
  deleteAdminWalletService,
  restoreAdminWalletService,
  getAdminDepositsService,
  approveDepositService,
  rejectDepositService,
  getAdminWithdrawalsService,
  approveWithdrawalService,
  rejectWithdrawalService,
  getAdminTransactionsService,
  getAdminVerificationsService,
  approveVerificationService,
  rejectVerificationService,
  approveTransferService,
  rejectTransferService,
  getAdminCardsService,
  approveAdminCardService,
  getAdminLoansService,
  disburseAdminLoanService,
  rejectAdminLoanService,
  getAdminReferralsService,
  type AdminVerificationItem,
  type AdminCardItem,
  type AdminLoanItem,
  type AdminReferralItem,
  getAdminUserCtoCodeService,
} from "../services/adminServices";
import { toPaged } from "../helpers/response";
import {
  toAdminTransaction,
  toCompanyWallet,
  type CompanyWallet,
} from "../helpers/mappers";
import type { TransactionItem } from "../lib/interfaces";
import { useUser } from "./useUser";

interface PagedResult<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}

const mapPaged = <T>(
  body: unknown,
  mapper: (value: unknown) => T,
  perPage: number,
): PagedResult<T> => {
  const paged = toPaged<unknown>(body, perPage);
  return { ...paged, items: paged.items.map(mapper) };
};

export const useAdminDashboard = () => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["admin-dashboard"],
    enabled: !!token,
    queryFn: async () => await getAdminDashboardService(),
  });
};

export const useAdminUsers = (page = 1, perPage = 10) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["admin-users", page, perPage],
    enabled: !!token,
    queryFn: () => getAdminUsersService({ page, per_page: perPage }),
  });
};

export const useAdminUser = (userId: number | string | null) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["admin-user", userId],
    enabled: !!token && userId !== null,
    queryFn: async () => getAdminUserService(userId as number | string),
  });
};

export const useAdminUserCtoCode = (userId?: number | string | null) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["admin-user-cto-code", userId],
    enabled: !!token && !!userId,
    queryFn: () => getAdminUserCtoCodeService(userId!),
  });
};

export const useUpdateAdminUserBalance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      balance,
      description,
    }: {
      userId: number | string;
      balance: number;
      description: string;
    }) => updateAdminUserBalanceService(userId, { balance, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number | string;
      payload: Parameters<typeof updateAdminUserService>[1];
    }) => updateAdminUserService(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

const useUserStatusMutation = (
  fn: (userId: number | string, ...rest: never[]) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: number | string }) => fn(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

export const useDisableAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      reason,
    }: {
      userId: number | string;
      reason: string;
    }) => disableAdminUserService(userId, reason),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
};

export const useEnableAdminUser = () =>
  useUserStatusMutation((userId) => enableAdminUserService(userId));

export const useDeleteAdminUser = () =>
  useUserStatusMutation((userId) => deleteAdminUserService(userId));

export const useRestoreAdminUser = () =>
  useUserStatusMutation((userId) => restoreAdminUserService(userId));

export const useAdminWallets = () => {
  const { token } = useUser();
  return useQuery<PagedResult<CompanyWallet>>({
    queryKey: ["admin-wallets"],
    enabled: !!token,
    queryFn: async () =>
      mapPaged(await getAdminWalletsService(), toCompanyWallet, 50),
  });
};

const useWalletMutation = (
  fn: (walletId: number | string, ...rest: never[]) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId }: { walletId: number | string }) => fn(walletId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] }),
  });
};

export const useCreateAdminWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { address: string; type: string; balance: number }) =>
      createAdminWalletService(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] }),
  });
};

export const useUpdateAdminWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      walletId,
      payload,
    }: {
      walletId: number | string;
      payload: { address: string; type: string; balance: number };
    }) => updateAdminWalletService(walletId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] }),
  });
};

export const useDisableAdminWallet = () =>
  useWalletMutation((walletId) => disableAdminWalletService(walletId));

export const useEnableAdminWallet = () =>
  useWalletMutation((walletId) => enableAdminWalletService(walletId));

export const useDeleteAdminWallet = () =>
  useWalletMutation((walletId) => deleteAdminWalletService(walletId));

export const useRestoreAdminWallet = () =>
  useWalletMutation((walletId) => restoreAdminWalletService(walletId));

export const useAdminDeposits = (page = 1, perPage = 10, status?: string) => {
  const { token } = useUser();
  return useQuery<PagedResult<TransactionItem>>({
    queryKey: ["admin-deposits", page, perPage, status ?? "all"],
    enabled: !!token,
    queryFn: async () =>
      mapPaged(
        await getAdminDepositsService({ page, per_page: perPage, status }),
        (value) => toAdminTransaction(value, "deposit"),
        perPage,
      ),
  });
};

const useDepositAction = (
  fn: (depositId: number | string, remarks: string) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      depositId,
      remarks,
    }: {
      depositId: number | string;
      remarks: string;
    }) => fn(depositId, remarks),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["deposit"] });
      if (variables?.depositId) {
        queryClient.invalidateQueries({
          queryKey: ["deposit", String(variables.depositId)],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["my-deposits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
    },
  });
};

export const useApproveDeposit = () => useDepositAction(approveDepositService);
export const useRejectDeposit = () => useDepositAction(rejectDepositService);

export const useAdminWithdrawals = (
  page = 1,
  perPage = 10,
  status?: string,
) => {
  const { token } = useUser();
  return useQuery<PagedResult<TransactionItem>>({
    queryKey: ["admin-withdrawals", page, perPage, status ?? "all"],
    enabled: !!token,
    queryFn: async () =>
      mapPaged(
        await getAdminWithdrawalsService({ page, per_page: perPage, status }),
        (value) => toAdminTransaction(value, "withdrawal"),
        perPage,
      ),
  });
};

const useWithdrawalRemarksAction = (
  fn: (withdrawalId: number | string, remarks: string) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      withdrawalId,
      remarks,
    }: {
      withdrawalId: number | string;
      remarks: string;
    }) => fn(withdrawalId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    },
  });
};

export const useApproveWithdrawal = () =>
  useWithdrawalRemarksAction(approveWithdrawalService);
export const useRejectWithdrawal = () =>
  useWithdrawalRemarksAction(rejectWithdrawalService);

export const useAdminTransactions = (
  page = 1,
  perPage = 10,
  status?: string,
  type?: string,
) => {
  const { token } = useUser();
  return useQuery<PagedResult<TransactionItem>>({
    queryKey: [
      "admin-transactions",
      page,
      perPage,
      status ?? "all",
      type ?? "all",
    ],
    enabled: !!token,
    queryFn: async () => {
      const body = await getAdminTransactionsService({
        page,
        per_page: perPage,
        status: status && status !== "all" ? status : undefined,
        type: type && type !== "all" ? type : undefined,
      });
      const paged = toPaged<unknown>(body, perPage);
      return {
        ...paged,
        items: paged.items.map((item) => {
          const dict = item as Record<string, unknown> | null;
          const nestedType =
            dict && typeof dict.type === "string"
              ? dict.type.toLowerCase().includes("withdraw")
                ? "withdrawal"
                : "deposit"
              : undefined;
          return toAdminTransaction(item, nestedType);
        }),
      };
    },
  });
};

export const useAdminVerifications = (
  page = 1,
  perPage = 10,
  status?: string,
) => {
  const { token } = useUser();
  return useQuery<PagedResult<AdminVerificationItem>>({
    queryKey: ["admin-verifications", page, perPage, status ?? "all"],
    enabled: !!token,
    queryFn: async () => {
      const body = await getAdminVerificationsService({
        page,
        per_page: perPage,
        status: status && status !== "all" ? status : undefined,
      });
      return toPaged<AdminVerificationItem>(body, perPage);
    },
  });
};

export const useApproveVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => approveVerificationService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useRejectVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      rejection_reason,
    }: {
      id: number | string;
      rejection_reason: string;
    }) => rejectVerificationService(id, rejection_reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useApproveTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => approveTransferService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useRejectTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => rejectTransferService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useAdminCards = (page = 1, perPage = 10, status?: string) => {
  const { token } = useUser();
  return useQuery<PagedResult<AdminCardItem>>({
    queryKey: ["admin-cards", page, perPage, status ?? "all"],
    enabled: !!token,
    queryFn: async () => {
      const body = await getAdminCardsService({
        page,
        per_page: perPage,
        status: status && status !== "all" ? status : undefined,
      });
      return toPaged<AdminCardItem>(body, perPage);
    },
  });
};

export const useApproveAdminCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      spending_limit,
    }: {
      id: number | string;
      spending_limit: number;
    }) => approveAdminCardService(id, spending_limit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cards"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useAdminLoans = (page = 1, perPage = 10, status?: string) => {
  const { token } = useUser();
  return useQuery<PagedResult<AdminLoanItem>>({
    queryKey: ["admin-loans", page, perPage, status ?? "all"],
    enabled: !!token,
    queryFn: async () => {
      const body = await getAdminLoansService({
        page,
        per_page: perPage,
        status: status && status !== "all" ? status : undefined,
      });
      return toPaged<AdminLoanItem>(body, perPage);
    },
  });
};

export const useDisburseAdminLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => disburseAdminLoanService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useRejectAdminLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      rejectAdminLoanService(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useAdminReferrals = (params?: {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}) => {
  const { token } = useUser();
  return useQuery<PagedResult<AdminReferralItem>>({
    queryKey: [
      "admin-referrals",
      params?.page ?? 1,
      params?.per_page ?? 10,
      params?.status ?? "all",
      params?.search ?? "",
    ],
    enabled: !!token,
    queryFn: async () => {
      const body = await getAdminReferralsService({
        ...params,
        status:
          params?.status && params?.status !== "all"
            ? params.status
            : undefined,
      });
      return toPaged<AdminReferralItem>(body, params?.per_page ?? 10);
    },
  });
};
