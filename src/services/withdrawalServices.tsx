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

export interface VerifyOtpResponse {
  message: string;
  can_request_otc?: boolean;
  data?: {
    is_otp_verified: boolean;
    expires_at: string;
  };
}

export interface RequestOtcResponse {
  message: string;
  data?: {
    expires_in_minutes: number;
    expires_at: string;
  };
}

export interface SubmitWithdrawalPayload {
  amount: number | string;
  destination_address: string;
  wallet_address_id?: number | string | null;
  crypto_type?: string | null;
  otp_code?: string;
  cto_code?: string;
  otc_code?: string;
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
  status: "pending" | "approved" | "completed" | "rejected";
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
  otc_code?: string;
}

/**
 * Step 1: Request OTP code for withdrawal (Zero email sent; code generated in backend DB)
 */
export const requestWithdrawalOtpService = async (
  payload?: RequestOtpPayload
): Promise<RequestOtpResponse> => {
  const res = await api.post("/withdrawals/request-otp", payload);
  return unwrap(res.data) as RequestOtpResponse;
};

/**
 * Step 2: Verify OTP code provided by admin
 */
export const verifyWithdrawalOtpService = async (
  otpCode: string
): Promise<VerifyOtpResponse> => {
  const res = await api.post("/withdrawals/verify-otp", {
    otp_code: otpCode.trim(),
  });
  return unwrap(res.data) as VerifyOtpResponse;
};

/**
 * Step 3: Request OTC clearance code from admin
 */
export const requestWithdrawalOtcService = async (): Promise<RequestOtcResponse> => {
  const res = await api.post("/withdrawals/request-otc", {});
  return unwrap(res.data) as RequestOtcResponse;
};

/**
 * Step 4: Finalize withdrawal with OTC clearance code
 */
export const submitWithdrawalService = async (
  payload: SubmitWithdrawalPayload
): Promise<SubmitWithdrawalResponse> => {
  const otc = payload.otc_code || payload.cto_code || "";
  const cleanPayload = {
    amount: Number(payload.amount),
    destination_address: payload.destination_address,
    wallet_address_id: payload.wallet_address_id ?? 1,
    crypto_type: payload.crypto_type || "USDT",
    otc_code: otc,
    cto_code: otc,
    ...(payload.otp_code ? { otp_code: payload.otp_code } : {}),
  };

  const res = await api.post("/withdrawals", cleanPayload);
  return unwrap(res.data) as SubmitWithdrawalResponse;
};

export const requestWithdrawalService = async (
  payload: RequestWithdrawalPayload
): Promise<unknown> => {
  const otc = payload.otc_code || payload.cto_code || "";
  const cleanPayload = {
    ...payload,
    otc_code: otc,
    cto_code: otc,
  };
  const res = await api.post("/withdrawals", cleanPayload);
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
