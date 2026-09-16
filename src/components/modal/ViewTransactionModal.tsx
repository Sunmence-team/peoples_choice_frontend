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
      ? `${transaction.amount}.00 USDT`
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
    { label: "Network", value: transaction.network },
    { label: "Amount", value: amount },
    { label: "Status", value: <StatusBadge status={transaction.status} /> },
    {
      label: "Date & Time",
      value: formatISODateToCustom(transaction.date),
    },
    ...(address
      ? [
          {
            label:
              transaction.type === "deposit"
                ? "Wallet Address"
                : "Destination Address",
            value: address,
          },
        ]
      : []),
    ...("note" in transaction && transaction.note
      ? [{ label: "Note", value: transaction.note }]
      : []),
  ];

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <h3 className="text-[18px] font-bold text-[#0B2D5B]">
          Transaction Details
        </h3>
        <p className="mt-1 text-[12px] text-[#8190a3]">
          Full record of the selected transaction.
        </p>

        <div className="mt-6 grid gap-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 border-b border-[#e3eaf2] pb-3"
            >
              <span className="text-[11px] text-[#8190a3]">{row.label}</span>
              <span className="text-[12px] font-semibold text-[#172b4d] capitalize text-right">
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