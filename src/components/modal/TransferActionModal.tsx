import React from "react";
import Modal from "./Modal";
import type { TransactionItem } from "../../lib/interfaces";

interface TransferActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: TransactionItem | null;
  actionType: "approve" | "reject";
  onConfirm: () => Promise<void>;
  isSubmitting?: boolean;
}

export const TransferActionModal: React.FC<TransferActionModalProps> = ({
  isOpen,
  onClose,
  transfer,
  actionType,
  onConfirm,
  isSubmitting,
}) => {
  if (!isOpen || !transfer) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h3 className="text-[18px] font-bold text-[#0B2D5B]">
          {actionType === "approve"
            ? "Approve & Complete Wire Transfer?"
            : "Reject & Refund Wire Transfer?"}
        </h3>

        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          {actionType === "approve"
            ? `Release transfer of $${Number(transfer.amount).toFixed(2)} to ${transfer.recipient_name || "the recipient"} and mark as completed.`
            : `Decline this wire transfer. The held amount of $${Number(transfer.amount).toFixed(2)} will be atomically refunded back into ${transfer.user_name || "the sender"}'s wallet balance.`}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#dfe8f1] py-2.5 text-xs font-semibold text-[#52677c] hover:bg-[#f8fafc] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`rounded-lg py-2.5 text-xs font-semibold text-white transition disabled:opacity-60 cursor-pointer ${
              actionType === "approve"
                ? "bg-[#05a957] hover:bg-[#04984e]"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : actionType === "approve"
                ? "Yes, Approve Transfer"
                : "Yes, Reject & Refund"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferActionModal;
