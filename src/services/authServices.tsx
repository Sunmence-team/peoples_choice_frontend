import api from "../helpers/api";
import { asDict, pickString, unwrap } from "../helpers/response";
import { toUserProps } from "../helpers/mappers";
import type { UserProps } from "../lib/interfaces";

export interface AuthResult {
  token: string;
  user: UserProps | null;
  role: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  email: string;
  country: string;
  password: string;
  password_confirmation: string;
}

const looksLikeUser = (value: unknown): value is UserProps => {
  const dict = asDict(value);
  if (!dict) return false;
  return (
    typeof dict.email === "string" ||
    typeof dict.username === "string" ||
    typeof dict.id === "number"
  );
};

export const extractToken = (payload: unknown): string => {
  const root = asDict(payload);
  if (!root) return "";
  const nested = asDict(root.data);
  return pickString(root.token, root.access_token, nested?.token, nested?.access_token);
};

const extractUser = (payload: unknown): UserProps | null => {
  const root = asDict(payload);
  if (!root) return null;
  const nested = asDict(root.data);
  const candidates: unknown[] = [root.user, nested?.user, nested, root];
  for (const candidate of candidates) {
    if (looksLikeUser(candidate)) return toUserProps(candidate);
  }
  return null;
};

const extractRole = (payload: unknown, user: UserProps | null, fallback: string): string => {
  const root = asDict(payload) ?? {};
  const nested = asDict(root.data) ?? {};
  const explicit = pickString(root.role, nested.role, user?.role, user?.crm_role);
  if (explicit) return explicit;
  if (user?.is_admin === 1) {
    return "admin";
  }
  return fallback;
};

const buildAuthResult = (payload: unknown, fallbackRole: string): AuthResult => {
  const token = extractToken(payload);
  const user = extractUser(payload);
  const role = extractRole(payload, user, fallbackRole);
  return { token, user, role };
};

export const loginService = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  const res = await api.post("/login", { email, password });
  return buildAuthResult(unwrap(res.data), "client");
};

export const registerService = async (
  payload: RegisterPayload
): Promise<AuthResult | null> => {
  const res = await api.post("/register", payload);
  const result = buildAuthResult(res.data, "client");
  return result.token ? result : null;
};

export const logoutService = async (): Promise<void> => {
  try {
    await api.post("/logout");
  } catch {
    // session cleanup happens locally regardless
  }
};
