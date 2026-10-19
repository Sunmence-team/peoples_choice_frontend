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
}) => {
  const res = await api.get("/admin/user", { params });
  return res.data.data;
};

export const getAdminUserService = async (userId: number | string) => {
  const res = await api.get(`/admin/user/${userId}`);
  return res.data;
};

export const updateAdminUserBalanceService = async (
  userId: number | string,
  payload: { balance: number; description: string },
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
  },
): Promise<unknown> => {
  const res = await api.put(`/admin/user/${userId}`, payload);
  return unwrap(res.data);
};

export const disableAdminUserService = async (
  userId: number | string,
  reason: string,
): Promise<unknown> => {
  const res = await api.post(`/admin/user/disable/${userId}`, { reason });
  return unwrap(res.data);
};

export const enableAdminUserService = async (
  userId: number | string,
): Promise<unknown> => {
  const res = await api.post(`/admin/user/enable/${userId}`);
  return unwrap(res.data);
};

export const deleteAdminUserService = async (
  userId: number | string,
): Promise<unknown> => {
  const res = await api.delete(`/admin/user/${userId}`);
  return unwrap(res.data);
};

export const restoreAdminUserService = async (
  userId: number | string,
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
  payload: { address: string; type: string; balance: number },
): Promise<unknown> => {
  const res = await api.put(`/admin/wallet/${walletId}`, payload);
  return unwrap(res.data);
};

export const disableAdminWalletService = async (
  walletId: number | string,
): Promise<unknown> => {
  const res = await api.post(`/admin/wallet/disable/${walletId}`);
  return unwrap(res.data);
};

export const enableAdminWalletService = async (
  walletId: number | string,
): Promise<unknown> => {
  const res = await api.post(`/admin/wallet/enable/${walletId}`);
  return unwrap(res.data);
};

export const deleteAdminWalletService = async (
  walletId: number | string,
): Promise<unknown> => {
  const res = await api.delete(`/admin/wallet/${walletId}`);
  return unwrap(res.data);
};

export const restoreAdminWalletService = async (
  walletId: number | string,
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
  remarks: string,
): Promise<unknown> => {
  const res = await api.post(`/admin/deposits/approve/${depositId}`, {
    remarks,
  });
  return unwrap(res.data);
};

export const rejectDepositService = async (
  depositId: number | string,
  remarks: string,
): Promise<unknown> => {
  const res = await api.post(`/admin/deposits/reject/${depositId}`, {
    remarks,
  });
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
  remarks: string,
): Promise<unknown> => {
  const res = await api.post(`/admin/withdrawals/approve/${withdrawalId}`, {
    remarks,
  });
  return unwrap(res.data);
};

export const rejectWithdrawalService = async (
  withdrawalId: number | string,
  remarks: string,
): Promise<unknown> => {
  const res = await api.post(`/admin/withdrawals/reject/${withdrawalId}`, {
    remarks,
  });
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

export interface AdminVerificationItem {
  id: number | string;
  user_id: number | string;
  user?: {
    id: number | string;
    name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    username?: string;
    account_number?: string;
  };
  document_type:
    | "passport"
    | "national_id"
    | "drivers_license"
    | "residence_permit";
  document_number: string;
  status: "pending" | "verified" | "rejected";
  front_image_url: string;
  back_image_url?: string;
  selfie_image_url?: string;
  rejection_reason?: string | null;
  created_at: string;
  updated_at?: string;
}

export const getAdminVerificationsService = async (params?: {
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<unknown> => {
  const res = await api.get("/admin/verifications", { params });
  return unwrap(res.data);
};

export const approveVerificationService = async (
  id: number | string,
): Promise<unknown> => {
  const res = await api.post(`/admin/verifications/${id}/approve`);
  return unwrap(res.data);
};

export const rejectVerificationService = async (
  id: number | string,
  rejection_reason: string,
): Promise<unknown> => {
  const res = await api.post(`/admin/verifications/${id}/reject`, {
    rejection_reason,
  });
  return unwrap(res.data);
};

export const approveTransferService = async (
  id: number | string,
): Promise<unknown> => {
  const res = await api.post(`/admin/transfers/${id}/approve`);
  return unwrap(res.data);
};

export const rejectTransferService = async (
  id: number | string,
): Promise<unknown> => {
  const res = await api.post(`/admin/transfers/${id}/reject`);
  return unwrap(res.data);
};

export interface AdminCardItem {
  id: number | string;
  user_id: number | string;
  user?: {
    id: number | string;
    name: string;
    email: string;
  };
  card_type: "virtual" | "physical";
  card_brand: string;
  currency: string;
  card_holder_name: string;
  card_number?: string;
  masked_card_number?: string;
  billing_address: string;
  delivery_address?: string | null;
  spending_limit?: number | string;
  status: "pending" | "active" | "frozen" | "rejected";
  created_at: string;
}

export const getAdminCardsService = async (params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<unknown> => {
  const res = await api.get("/admin/cards", { params });
  return unwrap(res.data);
};

export const approveAdminCardService = async (
  id: number | string,
  spending_limit: number,
): Promise<unknown> => {
  const res = await api.post(`/admin/cards/${id}/approve`, {
    spending_limit,
  });
  return unwrap(res.data);
};

export interface AdminLoanItem {
  id: number | string;
  user_id: number | string;
  user?: {
    id: number | string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  amount: number | string;
  tenure_months: number;
  interest_rate?: number;
  total_payable?: number | string;
  monthly_payment?: number | string;
  purpose: string;
  monthly_income?: number | string;
  employment_status?: string;
  status: "pending" | "active" | "rejected" | "repaid";
  created_at: string;
}

export const getAdminLoansService = async (params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<unknown> => {
  const res = await api.get("/admin/loans", { params });
  return unwrap(res.data);
};

export const disburseAdminLoanService = async (
  id: number | string,
): Promise<unknown> => {
  const res = await api.post(`/admin/loans/${id}/disburse`);
  return unwrap(res.data);
};

export const rejectAdminLoanService = async (
  id: number | string,
  reason?: string,
): Promise<unknown> => {
  const res = await api.post(`/admin/loans/${id}/reject`, {
    admin_remarks: reason,
  });
  return unwrap(res.data);
};

export interface AdminReferralItem {
  id: number | string;
  referrer_id: number | string;
  referrer_name?: string;
  referrer_email?: string;
  referred_user_id: number | string;
  referred_user_name?: string;
  referred_user_email?: string;
  status: "registered" | "verified" | "rewarded";
  reward_amount: number | string;
  reward_status?: "pending" | "paid";
  created_at: string;
  registered_at?: string;
}

export const getAdminReferralsService = async (params?: {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<unknown> => {
  const res = await api.get("/admin/referrals", { params });
  return unwrap(res.data);
};
