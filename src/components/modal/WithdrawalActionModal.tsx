import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import type { TransactionItem } from "../../lib/interfaces";

interface WithdrawalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal: TransactionItem | null;
  actionType: "approve" | "reject";
  onConfirm: (id: number | string, remarks: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const WithdrawalActionModal: React.FC<WithdrawalActionModalProps> = ({
  isOpen,
  onClose,
  withdrawal,
  actionType,
  onConfirm,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      remarks: "",
    },
    validationSchema: Yup.object({
      remarks: Yup.string()
        .trim()
        .min(2, "Remarks must be at least 2 characters")
        .required("Remarks are required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!withdrawal) return;
      await onConfirm(withdrawal.id, values.remarks.trim());
      resetForm();
    },
  });

  if (!isOpen || !withdrawal) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h3 className="text-[18px] font-bold text-[#0B2D5B]">
          {actionType === "approve"
            ? "Approve this withdrawal?"
            : "Reject this withdrawal?"}
        </h3>
        <p className="mt-1 text-[13px] text-[#8190a3]">
          {actionType === "approve"
            ? `Release ${withdrawal.amount}.00 USDT to ${withdrawal.user_name || "the user"}'s destination address?`
            : `Decline the ${withdrawal.amount}.00 USDT withdrawal request from ${withdrawal.user_name || "the user"}?`}
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#172b4d]">
              Remarks
            </label>
            <textarea
              rows={3}
              name="remarks"
              value={formik.values.remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={
                actionType === "approve"
                  ? "e.g. Queued for payout"
                  : "e.g. Invalid recipient wallet address"
              }
              className="w-full resize-none rounded-lg border border-[#dfe8f1] px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {formik.touched.remarks && formik.errors.remarks && (
              <p className="mt-1 text-[11px] text-red-500">
                {formik.errors.remarks}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dfe8f1] py-2.5 text-xs font-semibold text-[#52677c] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formik.isSubmitting}
              className={`rounded-lg py-2.5 text-xs font-semibold text-white transition disabled:opacity-60 cursor-pointer ${
                actionType === "approve"
                  ? "bg-[#05a957] hover:bg-[#04984e]"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting || formik.isSubmitting
                ? "Processing..."
                : actionType === "approve"
                  ? "Yes, Approve"
                  : "Yes, Reject"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WithdrawalActionModal;
