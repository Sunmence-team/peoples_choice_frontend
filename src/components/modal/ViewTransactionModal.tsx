import React from "react";
import Modal from "./Modal";
import StatusBadge from "../ui/StatusBadge";
import { formatISODateToCustom } from "../../helpers/formatterUtility";
import type { Transaction, TransactionItem } from "../../lib/interfaces";

type ModalTransaction = Transaction | TransactionItem | null;

interface ViewTransactionModalProps {
  transaction: ModalTransaction;
  isOpen?: boolean;
  onClose: () => void;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({
  transaction,
  isOpen = true,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  const isItem = "user_name" in transaction;
  const address = isItem
    ? transaction.type === "deposit"
      ? transaction.wallet_address
      : transaction.destination_address
    : undefined;
  const amount =
    typeof transaction.amount === "number"
      ? `${transaction.amount}.00 USD`
      : transaction.amount;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Transaction ID", value: transaction.transaction_id },
    ...(isItem
      ? [
          {
            label: "User",
            value: transaction.user_name || "-",
          },
        ]
      : []),
    { label: "Type", value: transaction.type },
    ...("recipient_name" in transaction && transaction.recipient_name
      ? [{ label: "Recipient", value: transaction.recipient_name }]
      : []),
    ...("recipient_account" in transaction && transaction.recipient_account
      ? [{ label: "Destination Account", value: transaction.recipient_account }]
      : []),
    { label: "Channel", value: transaction.network },
    { label: "Amount", value: amount },
    { label: "Status", value: <StatusBadge status={transaction.status} /> },
    {
      label: "Date & Time",
      value: formatISODateToCustom(transaction.date) || transaction.date,
    },
    ...(address
      ? [
          {
            label:
              transaction.type === "deposit"
                ? "Deposit Settlement Address"
                : "Destination Wire Address",
            value: address,
          },
        ]
      : []),
    ...("otp_code" in transaction && transaction.otp_code
      ? [{ label: "Email OTP", value: transaction.otp_code }]
      : []),
    ...("cto_code" in transaction && transaction.cto_code
      ? [{ label: "CTO Code", value: transaction.cto_code }]
      : []),
    ...("note" in transaction && transaction.note
      ? [{ label: "Note", value: transaction.note }]
      : []),
  ];

  return (
    <Modal onClose={onClose}>
      <div className="p-1 sm:p-2">
        <h3 className="text-base sm:text-[18px] font-bold text-[#0B2D5B] leading-tight">
          Bank Transaction Receipt
        </h3>
        <p className="mt-0.5 text-[11px] sm:text-[12px] text-[#8190a3]">
          Official record from People's Choice Bank, N.A.
        </p>

        <div className="mt-4 sm:mt-6 grid gap-2.5 sm:gap-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-[#e3eaf2] pb-2 sm:pb-3"
            >
              <span className="text-[10px] sm:text-[11px] text-[#8190a3] uppercase tracking-wider shrink-0 font-medium">
                {row.label}
              </span>
              <span className="text-[11px] sm:text-[12px] font-semibold text-[#172b4d] capitalize text-left sm:text-right break-all">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ViewTransactionModal;