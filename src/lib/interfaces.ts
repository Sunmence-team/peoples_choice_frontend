import React from "react";
import type { IconType } from "react-icons/lib";

export type OverviewCardsProps = {
  title: string;
  value: string | number;
  icon?: IconType;
  icon2?: IconType;
  className?: string;
};

export interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClassName: string;
}
export type TransactionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export interface Transaction {
  id?: number | string;
  transaction_id: string;
  type: "deposit" | "withdrawal" | "transfer";
  network: string;
  amount: string;
  status: TransactionStatus;
  date: string;
  walletAddress?: string;
  transactionHash?: string;
  recipient_name?: string;
  recipient_account?: string;
  bank_name?: string;
  sender_name?: string;
  note?: string;
  transfer_category?: string;
  fee?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  account_number: string;
  bank_name?: string;
  username?: string;
  avatar_color?: string;
}

export interface InternalTransferPayload {
  recipient_identifier: string;
  recipient_name?: string;
  amount: number | string;
  category?: string;
  note?: string;
}

export interface ExternalWireTransferPayload {
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  swift_bic?: string;
  amount: number | string;
  country?: string;
  note?: string;
  otp_code: string;
  cto_code: string;
}

export interface ExternalCryptoTransferPayload {
  network: string;
  destination_address: string;
  amount: number | string;
  wallet_address_id?: number | string | null;
  otp_code: string;
  cto_code: string;
}

export interface TableColumnProps<T = unknown> {
  label: string | React.ReactNode;
  key?: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  tableHeadingClassName?: string;
}

export interface ReusableTableProps<
  T extends { id?: number | string },
> extends PaginationControlProps {
  columns: TableColumnProps<T>[];
  isLoading: boolean;
  data: T[];
  error: unknown;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  hasSerialNo?: boolean;
  tableType?: string;
  selectable?: boolean;
  selectedRowIds?: Array<number | string>;
  onToggleRowSelection?: (id: number | string) => void;
  onToggleAllRows?: (checked: boolean) => void;
  getRowId?: (item: T, index: number) => number | string | undefined;
  showPagination?: boolean;
}

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  tableType?: string;
}

export interface StatusCardProps {
  type: "success" | "pending" | "failed";
  statusText: string | number;
  icon?: IconType;
}

export interface SearchableInputProps<T> {
  endpoint: string;
  onSelect: (item: T) => void;
  onInputChange?: (value: string) => void;
  displayKey?: keyof T;
  queryParam?: string;
  requestMethod?: "get" | "post";
  label?: string;
  placeholder?: string;
  className?: string;
  inputContClassName?: string;
  dataKey?: string;
  initialValue?: string;
  showIcon?: boolean;
  fetchOnEmpty?: boolean;
  disabled?: boolean;
}

export interface UserProps {
  id: number;
  username: string;
  name?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  balance?: string | number;
  is_admin: number;
  role: string;
  crm_role?: string;
  enabled: number | boolean;
  is_disabled?: boolean;
  is_deleted?: boolean;
  disable_reason?: string | null;
  account_number?: string;
  kyc_status?: string;
  is_verified?: boolean;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankProps {
  name: string;
  code: string;
}

export interface TransactionItem {
  id: number;
  transactionable_id: number;
  reference_id: string;
  transaction_id: string;
  user_name: string;
  type: "deposit" | "withdrawal" | "transfer";
  network: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  wallet_address?: string;
  destination_address?: string;
  note?: string;
  otp_code?: string;
  cto_code?: string;
  recipient_name?: string;
  bank_name?: string;
  account_number?: string;
}

export interface AdminUser extends Partial<UserProps> {
  id: number;
  email: string;
  role: string;
  status?: "active" | "disabled" | "deleted";
  wallet_balance?: number;
  account_number?: string;
  kyc_status?: string;
  is_verified?: boolean;
  created_at: string;
}

export interface WalletBalance {
  id: number;
  username: string;
  full_name: string;
  balance: number;
  currency: string;
  last_updated: string;
}

export interface AdminUserCtoResponse {
  user: UserProps;
  data: {
    id: number;
    user_id: number;
    otp_code: string;
    is_otp_verified: boolean;
    otp_verified_at: string;
    otc_requested_at: string;
    cto_code: string;
    otc_code: string;
    amount: string;
    status: string;
    otp_expires_at: string;
    used_at: string;
    created_at: string;
    updated_at: string;
  };
}

export interface AdminUserCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser;
}
