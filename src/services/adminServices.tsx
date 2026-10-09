import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export const getAdminDashboardService = async (): Promise<unknown> => {
  const res = await api.get("/admin/dashboard");
  return unwrap(res.data);
};

export const getAdminUsersService = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<unknown> => {
  const res = await api.get("/admin/user", { params });
  return unwrap(res.data);
};

export const getAdminUserService = async (
  userId: number | string
): Promise<unknown> => {
  const res = await api.get(`/admin/user/${userId}`);
  return unwrap(res.data);
};

export const updateAdminUserBalanceService = async (
  userId: number | string,
  payload: { balance: number; description: string }
): Promise<unknown> => {
  const res = await api.post(`/admin/user/balance/${userId}`, payload);
  return unwrap(res.data);
};

export const updateAdminUserService = async (
  userId: number | string,
  payload: {
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    email: string;
    country: string;
  }
): Promise<unknown> => {
  const res = await api.put(`/admin/user/${userId}`, payload);
  return unwrap(res.data);
};

export const disableAdminUserService = async (
  userId: number | string,
  reason: string
): Promise<unknown> => {
  const res = await api.post(`/admin/user/disable/${userId}`, { reason });
  return unwrap(res.data);
};

export const enableAdminUserService = async (
  userId: number | string
): Promise<unknown> => {
  const res = await api.post(`/admin/user/enable/${userId}`);
  return unwrap(res.data);
};

export const deleteAdminUserService = async (
  userId: number | string
): Promise<unknown> => {
  const res = await api.delete(`/admin/user/${userId}`);
  return unwrap(res.data);
};

export const restoreAdminUserService = async (
  userId: number | string
): Promise<unknown> => {
  const res = await api.post(`/admin/user/restore/${userId}`);
  return unwrap(res.data);
};

export const getAdminWalletsService = async (): Promise<unknown> => {
  const res = await api.get("/admin/wallet");
  return unwrap(res.data);
};

export const createAdminWalletService = async (payload: {
  address: string;
  type: string;
  balance: number;
}): Promise<unknown> => {
  const res = await api.post("/admin/wallet", payload);
  return unwrap(res.data);
};

export const updateAdminWalletService = async (
  walletId: number | string,
  payload: { address: string; type: string; balance: number }
): Promise<unknown> => {
  const res = await api.put(`/admin/wallet/${walletId}`, payload);
  return unwrap(res.data);
};

export const disableAdminWalletService = async (
  walletId: number | string
): Promise<unknown> => {
  const res = await api.post(`/admin/wallet/disable/${walletId}`);
  return unwrap(res.data);
};

export const enableAdminWalletService = async (
  walletId: number | string
): Promise<unknown> => {
  const res = await api.post(`/admin/wallet/enable/${walletId}`);
  return unwrap(res.data);
};

export const deleteAdminWalletService = async (
  walletId: number | string
): Promise<unknown> => {
  const res = await api.delete(`/admin/wallet/${walletId}`);
  return unwrap(res.data);
};

export const restoreAdminWalletService = async (
  walletId: number | string
): Promise<unknown> => {
  const res = await api.post(`/admin/wallet/restore/${walletId}`);
  return unwrap(res.data);
};

export const getAdminDepositsService = async (params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<unknown> => {
  const res = await api.get("/admin/deposits", { params });
  return unwrap(res.data);
};

export const approveDepositService = async (
  depositId: number | string,
  remarks: string
): Promise<unknown> => {
  const res = await api.post(`/admin/deposits/approve/${depositId}`, { remarks });
  return unwrap(res.data);
};

export const rejectDepositService = async (
  depositId: number | string,
  remarks: string
): Promise<unknown> => {
  const res = await api.post(`/admin/deposits/reject/${depositId}`, { remarks });
  return unwrap(res.data);
};

export const getAdminWithdrawalsService = async (params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<unknown> => {
  const res = await api.get("/admin/withdrawals", { params });
  return unwrap(res.data);
};

export const approveWithdrawalService = async (
  withdrawalId: number | string,
  remarks: string
): Promise<unknown> => {
  const res = await api.post(`/admin/withdrawals/approve/${withdrawalId}`, { remarks });
  return unwrap(res.data);
};

export const completeWithdrawalService = async (
  withdrawalId: number | string,
  payload: { wallet_address_id: number | string; remarks: string }
): Promise<unknown> => {
  const res = await api.post(`/admin/withdrawals/complete/${withdrawalId}`, payload);
  return unwrap(res.data);
};

export const rejectWithdrawalService = async (
  withdrawalId: number | string,
  remarks: string
): Promise<unknown> => {
  const res = await api.post(`/admin/withdrawals/reject/${withdrawalId}`, { remarks });
  return unwrap(res.data);
};

export const getAdminTransactionsService = async (params?: {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
}): Promise<unknown> => {
  const res = await api.get("/admin/transactions", { params });
  return unwrap(res.data);
};
