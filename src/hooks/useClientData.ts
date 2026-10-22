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
import { toArray } from "../helpers/response";
import { toWalletAddress, type WalletAddress } from "../helpers/mappers";
import { useUser } from "./useUser";

import {
  submitInternalTransferService,
  type InternalTransferPayload,
} from "../services/transferServices";
import {
  getKYCStatusService,
  type KYCStatusResponse,
} from "../services/kycServices";

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
  return useQuery({
    queryKey: ["dashboard"],
    enabled: !!token,
    queryFn: async () => {
      return await getDashboardService();
    },
  });
};

export const useTransactionLedger = (
  page = 1,
  perPage = 10,
  type?: "deposit" | "withdrawal" | "transfer",
) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["ledger", page, perPage, type ?? "all"],
    enabled: !!token,
    queryFn: () =>
      getTransactionLedgerService({
        page,
        per_page: perPage,
        type: type,
      }),
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
    queryFn: async () =>
      toArray(await getWalletsService()).map(toWalletAddress),
  });
};

export const useMyDeposits = (page = 1, perPage = 10) => {
  const { token } = useUser();
  return useQuery({
    queryKey: ["my-deposits", page, perPage],
    enabled: !!token,
    queryFn: () => getMyDepositsService({ page, per_page: perPage }),
  });
};

export const useDeposit = (depositId: number | string | null | undefined) => {
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
    mutationFn: (payload: SubmitDepositPayload) =>
      submitDepositService(payload),
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
    queryFn: () => getMyWithdrawalsService({ page, per_page: perPage }),
  });
};

export const useRequestWithdrawalOtp = () => {
  return useMutation({
    mutationFn: (payload?: RequestOtpPayload) =>
      requestWithdrawalOtpService(payload),
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
    mutationFn: (payload: SubmitWithdrawalPayload) =>
      submitWithdrawalService(payload),
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
    mutationFn: (payload: RequestWithdrawalPayload) =>
      requestWithdrawalService(payload),
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
    mutationFn: (payload: UpdateProfilePayload) =>
      updateProfileService(payload),
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
