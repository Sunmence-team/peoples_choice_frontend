import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface RequestOtpPayload {
  amount?: number | string;
}

export interface RequestOtpResponse {
  message: string;
  data: {
    expires_in_minutes: number;
    expires_at: string;
  };
}

export interface SubmitWithdrawalPayload {
  amount: number | string;
  destination_address: string;
  wallet_address_id?: number | string | null;
  crypto_type?: string | null;
  otp_code: string;
  cto_code: string;
}

export interface WithdrawalRecord {
  id: number;
  reference_id: string;
  user_id: number;
  wallet_address_id: number | null;
  amount: string;
  fee: string;
  destination_address: string;
  crypto_type: string | null;
  otp_code: string | null;
  cto_code: string | null;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  admin_remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmitWithdrawalResponse {
  message: string;
  data: WithdrawalRecord;
  current_balance: string;
}

export interface RequestWithdrawalPayload {
  amount: number | string;
  destination_address: string;
  wallet_address_id?: number | string | null;
  crypto_type?: string | null;
  otp_code?: string;
  cto_code?: string;
}

export const requestWithdrawalOtpService = async (
  payload?: RequestOtpPayload
): Promise<RequestOtpResponse> => {
  const res = await api.post("/withdrawals/request-otp", payload);
  return unwrap(res.data) as RequestOtpResponse;
};

export const submitWithdrawalService = async (
  payload: SubmitWithdrawalPayload
): Promise<SubmitWithdrawalResponse> => {
  const res = await api.post("/withdrawals", payload);
  return unwrap(res.data) as SubmitWithdrawalResponse;
};

export const requestWithdrawalService = async (
  payload: RequestWithdrawalPayload
): Promise<unknown> => {
  const res = await api.post("/withdrawals", payload);
  return unwrap(res.data);
};

export const getMyWithdrawalsService = async (params?: {
  page?: number;
  per_page?: number;
}): Promise<unknown> => {
  const res = await api.get("/withdrawals", { params });
  return unwrap(res.data);
};

export const getWithdrawalService = async (
  withdrawalId: number | string
): Promise<unknown> => {
  const res = await api.get(`/withdrawals/${withdrawalId}`);
  return unwrap(res.data);
};

