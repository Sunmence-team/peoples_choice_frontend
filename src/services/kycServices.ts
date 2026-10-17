import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export type KYCStatus = "unverified" | "pending" | "verified" | "rejected";

export interface KYCSubmission {
  id?: number | string;
  user_id?: number | string;
  document_type: "passport" | "national_id" | "drivers_license" | "residence_permit";
  document_number: string;
  status: KYCStatus;
  front_image_url?: string;
  back_image_url?: string;
  selfie_image_url?: string;
  rejection_reason?: string | null;
  created_at: string;
}

export interface KYCStatusResponse {
  is_verified: boolean;
  kyc_status: KYCStatus;
  rejection_reason?: string | null;
  latest_submission?: KYCSubmission | null;
}

/**
 * 2.1 Check KYC Status (GET /api/verification/status or /api/verification)
 */
export const getKYCStatusService = async (): Promise<KYCStatusResponse> => {
  const res = await api.get("/verification/status");
  const data = unwrap<KYCStatusResponse>(res.data);
  return {
    is_verified: !!data?.is_verified,
    kyc_status: data?.kyc_status || (data?.is_verified ? "verified" : "unverified"),
    rejection_reason: data?.rejection_reason ?? null,
    latest_submission: data?.latest_submission ?? null,
  };
};

/**
 * 2.2 Submit KYC Documents (POST /api/verification)
 */
export const submitKYCService = async (
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  data?: KYCSubmission;
}> => {
  const res = await api.post("/verification", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const body = res.data as { message?: string; data?: KYCSubmission };
  return {
    success: true,
    message:
      body.message ||
      "Identity verification documents submitted successfully and queued for review",
    data: body.data,
  };
};
