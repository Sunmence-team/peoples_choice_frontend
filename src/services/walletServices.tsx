import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export const getWalletsService = async (): Promise<unknown> => {
  const res = await api.get("/wallet");
  return unwrap(res.data);
};
