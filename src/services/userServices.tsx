import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  country: string;
  email?: string;
}

export const getDashboardService = async (): Promise<unknown> => {
  const res = await api.get("/user/dashboard");
  return unwrap(res.data);
};

export const getTransactionLedgerService = async (
  params?: { page?: number; per_page?: number; type?: string }
): Promise<unknown> => {
  const res = await api.get("/user/transactions", { params });
  return unwrap(res.data);
};
export const updateProfileService = async (
  payload: UpdateProfilePayload
): Promise<unknown> => {
  const res = await api.put("/user", payload);
  return unwrap(res.data);
};

export const deleteAccountService = async (): Promise<unknown> => {
  const res = await api.delete("/user");
  return unwrap(res.data);
};

export const disableAccountService = async (reason: string): Promise<unknown> => {
  const res = await api.post("/user/disable", { reason });
  return unwrap(res.data);
};
