import {
  asDict,
  pickNumber,
  pickString,
  type Dict,
} from "./response";
import type {
  AdminUser,
  Transaction,
  TransactionItem,
  TransactionStatus,
  UserProps,
} from "../lib/interfaces";

const isTruthyFlag = (value: unknown): boolean =>
  value === true || value === 1 || value === "1";

export const toUserProps = (value: unknown): UserProps => {
  const raw = asDict(value) ?? {};
  const firstName = pickString(raw.first_name);
  const lastName = pickString(raw.last_name);
  const isAdmin = isTruthyFlag(raw.is_admin);
  const disabled = isTruthyFlag(raw.is_disabled) || isTruthyFlag(raw.disabled);
  const deleted = isTruthyFlag(raw.is_deleted) || isTruthyFlag(raw.deleted);
  const enabled =
    raw.enabled === undefined || raw.enabled === null
      ? disabled || deleted
        ? 0
        : 1
      : isTruthyFlag(raw.enabled)
        ? 1
        : 0;
  const fullName =
    pickString(raw.full_name, raw.name) ||
    `${firstName} ${lastName}`.trim() ||
    pickString(raw.username, raw.email);
  const role =
    pickString(raw.role, raw.crm_role) || (isAdmin ? "admin" : "client");

  return {
    id: pickNumber(raw.id),
    username: pickString(raw.username, raw.email),
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    email: pickString(raw.email),
    phone: pickString(raw.phone) || undefined,
    country: pickString(raw.country) || undefined,
    balance: (raw.balance as string | number) ?? 0,
    is_admin: isAdmin ? 1 : 0,
    role,
    crm_role: pickString(raw.crm_role) || undefined,
    enabled,
    is_disabled: disabled,
    is_deleted: deleted,
    disable_reason: (raw.disable_reason as string | null) ?? null,
    email_verified_at: (raw.email_verified_at as string | null) ?? null,
    created_at: pickString(raw.created_at),
    updated_at: pickString(raw.updated_at),
  };
};

const VALID_STATUSES: string[] = [
  "pending",
  "approved",
  "rejected",
  "completed",
];

export const normalizeStatus = (
  value: unknown,
  fallback: TransactionStatus = "pending"
): TransactionStatus => {
  const status = pickString(value).toLowerCase();
  if (VALID_STATUSES.includes(status)) return status as TransactionStatus;
  if (["success", "successful", "confirmed", "paid", "credited", "complete"].includes(status)) {
    return "completed";
  }
  if (["processing", "in_review", "review", "awaiting", "submitted", "new"].includes(status)) {
    return "pending";
  }
  if (["declined", "failed", "cancelled", "canceled", "void"].includes(status)) {
    return "rejected";
  }
  return fallback;
};

const normalizeType = (
  value: unknown,
  fallback: "deposit" | "withdrawal" = "deposit"
): "deposit" | "withdrawal" => {
  const type = pickString(value).toLowerCase();
  if (type.includes("withdraw")) return "withdrawal";
  if (type.includes("deposit")) return "deposit";
  return fallback;
};

const signedAmount = (raw: Dict, fallbackType: "deposit" | "withdrawal"): string => {
  const amount = pickNumber(raw.amount, raw.credit, raw.debit);
  const suffix = pickString(raw.currency, raw.symbol) || "USDT";
  const prefix = amount < 0 ? "" : fallbackType === "deposit" ? "+" : "-";
  const abs = Math.abs(amount);
  return `${prefix}${abs} ${suffix}`.trim();
};

export const toClientTransaction = (
  value: unknown,
  fallbackType?: "deposit" | "withdrawal"
): Transaction => {
  const raw = asDict(value) ?? {};
  const type = normalizeType(raw.type ?? raw.transaction_type, fallbackType);
  const addressRel = asDict(raw.wallet_address);
  return {
    id: pickNumber(raw.id) || pickString(raw.id),
    transaction_id:
      pickString(raw.transaction_id, raw.reference_id, raw.reference, raw.ref, raw.id) ||
      `TXN-${pickNumber(raw.id)}`,
    type,
    network: pickString(
      raw.network,
      raw.crypto_type,
      raw.chain,
      addressRel?.type,
      raw.currency,
      "USDT"
    ),
    amount: signedAmount(raw, type),
    status: normalizeStatus(raw.status, raw.status === null ? "pending" : undefined),
    date: pickString(raw.date, raw.created_at, raw.updated_at, raw.submitted_at),
    walletAddress:
      pickString(raw.wallet_address, raw.address, raw.destination_address, addressRel?.address) ||
      undefined,
    transactionHash:
      pickString(raw.transaction_hash, raw.transactionHash, raw.tx_hash, raw.hash) || undefined,
  };
};

export const toAdminTransaction = (
  value: unknown,
  fallbackType?: "deposit" | "withdrawal"
): TransactionItem => {
  const raw = asDict(value) ?? {};
  const type = normalizeType(raw.type ?? raw.transaction_type, fallbackType);
  const amount = pickNumber(raw.amount);
  const user = asDict(raw.user);
  const addressRel = asDict(raw.wallet_address);
  const userName =
    pickString(raw.user_name, raw.full_name, raw.username) ||
    `${pickString(user?.first_name, user?.firstname)} ${pickString(user?.last_name, user?.lastname)}`.trim() ||
    pickString(user?.email, raw.email);
  return {
    id: pickNumber(raw.id),
    transaction_id:
      pickString(raw.transaction_id, raw.reference_id, raw.reference, raw.ref) ||
      `${type === "deposit" ? "DEP" : "WDR"}-${pickNumber(raw.id)}`,
    user_name: userName,
    type,
    network: pickString(
      raw.network,
      raw.crypto_type,
      raw.chain,
      addressRel?.type,
      raw.currency,
      "USDT"
    ),
    amount,
    status: normalizeStatus(raw.status),
    date: pickString(raw.date, raw.created_at, raw.updated_at),
    wallet_address:
      pickString(raw.wallet_address, raw.address, raw.source_address, addressRel?.address) ||
      undefined,
    destination_address:
      pickString(raw.destination_address, raw.to_address, raw.recipient_address, addressRel?.address) ||
      undefined,
    note:
      pickString(raw.note, raw.remarks, raw.remark, raw.reason, raw.admin_remarks) ||
      undefined,
  };
};

export const toAdminUser = (value: unknown): AdminUser => {
  const raw = asDict(value) ?? {};
  const enabled = raw.enabled;
  const statusRaw = pickString(raw.status).toLowerCase();
  const status: AdminUser["status"] =
    statusRaw === "deleted" || raw.deleted_at
      ? "deleted"
      : statusRaw === "disabled" || statusRaw === "inactive" || enabled === 0 || enabled === false
        ? "disabled"
        : "active";
  const firstName = pickString(raw.first_name);
  const lastName = pickString(raw.last_name);
  return {
    id: pickNumber(raw.id),
    username: pickString(raw.username, raw.email),
    full_name: pickString(raw.full_name, `${firstName} ${lastName}`.trim(), raw.username),
    email: pickString(raw.email),
    phone: pickString(raw.phone),
    country: pickString(raw.country),
    role: pickString(raw.role, raw.is_admin === 1 ? "admin" : "client") || "client",
    status,
    wallet_balance: pickNumber(raw.wallet_balance, raw.balance),
    created_at: pickString(raw.created_at, raw.date),
  };
};

export interface CompanyWallet {
  id: number;
  address: string;
  type: string;
  balance: number;
  status: "active" | "disabled";
  created_at?: string;
}

export const toCompanyWallet = (value: unknown): CompanyWallet => {
  const raw = asDict(value) ?? {};
  const statusRaw = pickString(raw.status).toLowerCase();
  const enabled = raw.enabled;
  return {
    id: pickNumber(raw.id),
    address: pickString(raw.address, raw.wallet_address),
    type: pickString(raw.type, raw.network, raw.crypto_type, "USDT"),
    balance: pickNumber(raw.balance, raw.wallet_balance),
    status:
      statusRaw === "disabled" || enabled === 0 || enabled === false
        ? "disabled"
        : "active",
    created_at: pickString(raw.created_at) || undefined,
  };
};

export interface WalletAddress {
  id: number;
  address: string;
  type: string;
  label?: string;
}

export const toWalletAddress = (value: unknown): WalletAddress => {
  const raw = asDict(value) ?? {};
  return {
    id: pickNumber(raw.id),
    address: pickString(raw.address, raw.wallet_address),
    type: pickString(raw.type, raw.network, raw.crypto_type, raw.currency, "USDT"),
    label: pickString(raw.label, raw.name) || undefined,
  };
};

export interface DashboardStats {
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalUsers?: number;
  raw: Dict | null;
}

export const toDashboardStats = (value: unknown): DashboardStats => {
  const raw = asDict(value) ?? {};
  const wallet = asDict(raw.wallet) ?? asDict(raw.balance);
  return {
    balance: pickNumber(
      raw.balance,
      raw.wallet_balance,
      raw.total_balance,
      raw.available_balance,
      wallet?.balance
    ),
    totalDeposited: pickNumber(
      raw.total_deposits,
      raw.total_deposit,
      raw.deposits_total,
      raw.total_deposited,
      raw.deposit_total
    ),
    totalWithdrawn: pickNumber(
      raw.total_withdrawals,
      raw.total_withdrawal,
      raw.withdrawals_total,
      raw.total_withdrawn,
      raw.withdrawal_total
    ),
    pendingDeposits: pickNumber(raw.pending_deposits, raw.deposits_pending),
    pendingWithdrawals: pickNumber(raw.pending_withdrawals, raw.withdrawals_pending),
    totalUsers: pickNumber(raw.total_users, raw.users_count) || undefined,
    raw,
  };
};
