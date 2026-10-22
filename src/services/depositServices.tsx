import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface SubmitDepositPayload {
  wallet_address_id: number | string;
  amount: string | number;
  proof_image: File;
}

export interface DepositWalletAddress {
  id?: number | string;
  address?: string;
  type?: string;
  balance?: string | number;
  is_deleted?: boolean;
  is_disabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepositDetail {
  id: number | string;
  reference_id: string;
  user_id?: number | string;
  wallet_address_id?: number | string;
  amount: string | number;
  proof_image?: string;
  proof_image_url?: string;
  status: string;
  remarks?: string;
  note?: string;
  admin_remarks?: string;
  created_at: string;
  updated_at?: string;
  wallet_address?: DepositWalletAddress;
  [key: string]: unknown;
}

export const submitDepositService = async (
  payload: SubmitDepositPayload,
): Promise<DepositDetail> => {
  const formData = new FormData();
  formData.append("wallet_address_id", String(payload.wallet_address_id));
  formData.append("amount", String(payload.amount));
  formData.append("proof_image", payload.proof_image);

  const res = await api.post("/deposits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res.data) as DepositDetail;
};

export const getMyDepositsService = async (params?: {
  page?: number;
  per_page?: number;
}) => {
  const res = await api.get("/deposits", { params });
  return res.data;
};

export const getDepositService = async (
  depositId: number | string,
): Promise<DepositDetail> => {
  const res = await api.get(`/deposits/${depositId}`);
  return unwrap(res.data) as DepositDetail;
};
