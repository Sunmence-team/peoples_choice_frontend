import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface RequestWithdrawalPayload {
  amount: number | string;
  destination_address: string;
  wallet_address_id: number | string;
  crypto_type: string;
}

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
