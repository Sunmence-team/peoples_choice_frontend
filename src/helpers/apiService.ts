import api from "./api";

export interface DepositRequest {
  network: string;
  amount: string;
  transactionHash: string;
  paymentProof: File;
}

export interface DepositResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const submitDepositService = async (
  data: DepositRequest
): Promise<DepositResponse> => {
  const formData = new FormData();

  formData.append("network", data.network);
  formData.append("amount", data.amount);
  formData.append("transactionHash", data.transactionHash);
  formData.append("paymentProof", data.paymentProof);

  const response = await api.post<DepositResponse>(
    "/api/deposits",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};