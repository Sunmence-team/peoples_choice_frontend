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
  completeWithdrawalService,
  rejectWithdrawalService,
  getAdminTransactionsService,
} from "../services/adminServices";
import { toPaged } from "../helpers/response";
import {
  toAdminTransaction,
  toAdminUser,
  toCompanyWallet,
  toDashboardStats,
  type CompanyWallet,
  type DashboardStats,
} from "../helpers/mappers";
import type { AdminUser, TransactionItem } from "../lib/interfaces";
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
  perPage: number
): PagedResult<T> => {
  const paged = toPaged<unknown>(body, perPage);
  return { ...paged, items: paged.items.map(mapper) };
};

export const useAdminDashboard = () => {
  const { token } = useUser();
  return useQuery<DashboardStats>({
    queryKey: ["admin-dashboard"],
    enabled: !!token,
    queryFn: async () => toDashboardStats(await getAdminDashboardService()),
  });
};

export const useAdminUsers = (page = 1, perPage = 10) => {
  const { token } = useUser();
  return useQuery<PagedResult<AdminUser>>({
    queryKey: ["admin-users", page, perPage],
    enabled: !!token,
    queryFn: async () =>
      mapPaged(await getAdminUsersService({ page, per_page: perPage }), toAdminUser, perPage),
  });
};

export const useAdminUser = (userId: number | string | null) => {
  const { token } = useUser();
  return useQuery<AdminUser>({
    queryKey: ["admin-user", userId],
    enabled: !!token && userId !== null,
    queryFn: async () => toAdminUser(await getAdminUserService(userId as number | string)),
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
  fn: (userId: number | string, ...rest: never[]) => Promise<unknown>
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
    mutationFn: ({ userId, reason }: { userId: number | string; reason: string }) =>
      disableAdminUserService(userId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
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
  fn: (walletId: number | string, ...rest: never[]) => Promise<unknown>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId }: { walletId: number | string }) => fn(walletId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-wallets"] }),
  });
};

export const useCreateAdminWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { address: string; type: string; balance: number }) =>
      createAdminWalletService(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-wallets"] }),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-wallets"] }),
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
        perPage
      ),
  });
};

const useDepositAction = (
  fn: (depositId: number | string, remarks: string) => Promise<unknown>
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    },
  });
};

export const useApproveDeposit = () => useDepositAction(approveDepositService);
export const useRejectDeposit = () => useDepositAction(rejectDepositService);

export const useAdminWithdrawals = (page = 1, perPage = 10, status?: string) => {
  const { token } = useUser();
  return useQuery<PagedResult<TransactionItem>>({
    queryKey: ["admin-withdrawals", page, perPage, status ?? "all"],
    enabled: !!token,
    queryFn: async () =>
      mapPaged(
        await getAdminWithdrawalsService({ page, per_page: perPage, status }),
        (value) => toAdminTransaction(value, "withdrawal"),
        perPage
      ),
  });
};

const useWithdrawalRemarksAction = (
  fn: (withdrawalId: number | string, remarks: string) => Promise<unknown>
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

export const useCompleteWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      withdrawalId,
      wallet_address_id,
      remarks,
    }: {
      withdrawalId: number | string;
      wallet_address_id: number | string;
      remarks: string;
    }) => completeWithdrawalService(withdrawalId, { wallet_address_id, remarks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    },
  });
};

export const useAdminTransactions = (
  page = 1,
  perPage = 10,
  status?: string
) => {
  const { token } = useUser();
  return useQuery<PagedResult<TransactionItem>>({
    queryKey: ["admin-transactions", page, perPage, status ?? "all"],
    enabled: !!token,
    queryFn: async () => {
      const body = await getAdminTransactionsService({
        page,
        per_page: perPage,
        status,
      });
      const paged = toPaged<unknown>(body, perPage);
      return {
        ...paged,
        items: paged.items.map((item) => {
          const dict = item as Record<string, unknown> | null;
          const nestedType =
            dict && typeof dict.type === "string"
              ? (dict.type.toLowerCase().includes("withdraw")
                  ? "withdrawal"
                  : "deposit")
              : undefined;
          return toAdminTransaction(item, nestedType);
        }),
      };
    },
  });
};
