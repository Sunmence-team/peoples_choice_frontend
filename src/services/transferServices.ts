import api from "../helpers/api";
import { unwrap } from "../helpers/response";

/**
 * Returns user account number or derives bank account number from user ID
 */
export const getBankAccountNumber = (
  user?: { id?: number | string; account_number?: string } | null,
): string => {
  if (user?.account_number) return user.account_number;
  if (!user?.id) return "3081000001";
  const paddedId = String(user.id).padStart(4, "0");
  return `308100${paddedId}`;
};

export interface BankCountry {
  name: string;
  iso_code: string;
  currency: string;
  calling_code: string;
}

export interface BankItem {
  name: string;
  code: string;
  slug?: string;
  currency?: string;
  type?: string;
  active?: boolean;
}

export interface RecipientLookupResult {
  valid: boolean;
  name: string;
  accountNumber: string;
  id?: number;
  username?: string;
  message?: string;
}

export interface InternalTransferPayload {
  recipient_account: string;
  amount: number;
  notes?: string;
}

export interface InternalTransferResponse {
  message: string;
  data?: {
    id: number;
    reference_id: string;
    user_id: number;
    recipient_id: number;
    type: string;
    amount: string;
    status: string;
    notes?: string;
  };
  current_balance?: string | number;
}

export interface ExternalWirePayload {
  amount: number;
  bank_name: string;
  bank_code: string;
  bank_country: string;
  recipient_account_number: string;
  recipient_name: string;
  routing_number?: string;
  swift_bic?: string;
  notes?: string;
}

export interface ExternalWireResponse {
  message: string;
  data?: {
    id?: number;
    reference_id?: string;
    amount?: string | number;
    status?: string;
    [key: string]: unknown;
  };
  current_balance?: string | number;
}

/**
 * 1.1 Live Online Country Lookup (GET /api/banks/countries)
 */
export const getSupportedCountriesService = async (): Promise<
  BankCountry[]
> => {
  const res = await api.get("/banks/countries");
  const data = unwrap<BankCountry[]>(res.data);
  return Array.isArray(data) ? data : [];
};

/**
 * 1.2 Live Online Bank Lookup by Country (GET /api/banks?country={iso}&search={query})
 */
export const getBanksByCountryService = async (
  country: string,
  search?: string,
): Promise<BankItem[]> => {
  const params: Record<string, string> = { country: country.toLowerCase() };
  if (search && search.trim()) params.search = search.trim();
  const res = await api.get("/banks", { params });
  const data = unwrap<BankItem[]>(res.data);
  return Array.isArray(data) ? data : [];
};

/**
 * 3.1 Live Recipient Lookup via Backend (POST /api/transfers/lookup)
 * Accepts 10-digit account number, username, or email
 */
export const lookupRecipientService = async (
  account: string,
): Promise<RecipientLookupResult> => {
  const clean = account.trim();
  if (!clean) {
    return { valid: false, name: "", accountNumber: "" };
  }

  const res = await api.post("/transfers/lookup", { account: clean });
  const body = res.data as {
    message?: string;
    data?: {
      id: number;
      name: string;
      username: string;
      account_number: string;
    };
  };

  const recipient = body?.data;
  if (recipient && recipient.account_number) {
    return {
      valid: true,
      id: recipient.id,
      name: recipient.name,
      username: recipient.username,
      accountNumber: recipient.account_number,
      message: body.message,
    };
  }

  return {
    valid: false,
    name: "",
    accountNumber: "",
    message: body?.message || "Recipient account not found",
  };
};

/**
 * 3.2 Execute an internal money transfer (POST /api/transfers/internal)
 */
export const submitInternalTransferService = async (
  payload: InternalTransferPayload,
): Promise<InternalTransferResponse> => {
  const res = await api.post("/transfers/internal", payload);
  return res.data;
};

/**
 * 3.3 Outside Bank Transfer (Wire / ACH) (POST /api/transfers/external)
 */
export const submitExternalWireTransferService = async (
  payload: ExternalWirePayload,
): Promise<ExternalWireResponse> => {
  const res = await api.post("/transfers/external", payload);
  return res.data;
};
