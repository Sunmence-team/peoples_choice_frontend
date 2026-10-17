import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface BankCard {
  id: number | string;
  card_type: "virtual" | "physical";
  card_brand: "visa" | "mastercard";
  card_number: string;
  masked_card_number: string;
  card_holder_name: string;
  expiration_month: string;
  expiration_year: string;
  cvv: string;
  status: "active" | "frozen" | "pending";
  currency: string;
  spending_limit: number;
  billing_address: string;
  delivery_address?: string | null;
  created_at: string;
}

export interface RequestCardPayload {
  card_type: "virtual" | "physical";
  card_brand: "visa" | "mastercard";
  currency: string;
  card_holder_name: string;
  billing_address: string;
  delivery_address?: string | null;
}

export interface CardActionResponse {
  message: string;
  status?: "active" | "frozen";
  data?: {
    id?: number | string;
    status?: "active" | "frozen";
    [key: string]: unknown;
  };
}

/**
 * 5.3 List Cards (GET /api/cards)
 */
export const getCardsService = async (): Promise<BankCard[]> => {
  const res = await api.get("/cards");
  const data = unwrap<BankCard[]>(res.data);
  return Array.isArray(data) ? data : [];
};

/**
 * 5.1 Request a new card (POST /api/cards/request)
 */
export const requestCardService = async (
  payload: RequestCardPayload
): Promise<{ message: string; data?: BankCard; card?: BankCard }> => {
  const res = await api.post("/cards/request", payload);
  const body = res.data as { message: string; data?: BankCard };
  return {
    message: body.message || "Card request submitted successfully and queued for approval",
    data: body.data,
    card: body.data,
  };
};

/**
 * 5.3 Freeze / Unfreeze Card (POST /api/cards/{id}/freeze)
 */
export const freezeCardService = async (
  cardId: number | string
): Promise<CardActionResponse> => {
  const res = await api.post(`/cards/${cardId}/freeze`);
  const body = res.data as CardActionResponse;
  const status = body.status || body.data?.status || "frozen";
  return {
    message: body.message || `Card ${status === "frozen" ? "frozen" : "unfrozen"} successfully`,
    status,
    data: body.data,
  };
};

/**
 * 5.3 Set 4-Digit Card PIN (POST /api/cards/{id}/pin)
 */
export const setCardPinService = async (
  cardId: number | string,
  pin: string
): Promise<{ message: string }> => {
  const res = await api.post(`/cards/${cardId}/pin`, { pin });
  const body = res.data as { message: string };
  return {
    message: body.message || "Card PIN updated successfully",
  };
};
