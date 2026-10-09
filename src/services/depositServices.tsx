import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface SubmitDepositPayload {
  wallet_address_id: number | string;
  amount: string | number;
  proof_image: File;
}

export const submitDepositService = async (
  payload: SubmitDepositPayload
): Promise<unknown> => {
  const formData = new FormData();
  formData.append("wallet_address_id", String(payload.wallet_address_id));
  formData.append("amount", String(payload.amount));
  formData.append("proof_image", payload.proof_image);

  const res = await api.post("/deposits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res.data);
};

export const getMyDepositsService = async (params?: {
  page?: number;
  per_page?: number;
}): Promise<unknown> => {
  const res = await api.get("/deposits", { params });
  return unwrap(res.data);
};

export const getDepositService = async (
  depositId: number | string
): Promise<unknown> => {
  const res = await api.get(`/deposits/${depositId}`);
  return unwrap(res.data);
};
