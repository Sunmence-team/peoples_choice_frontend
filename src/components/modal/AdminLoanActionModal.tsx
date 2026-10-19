import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import type { AdminLoanItem } from "../../services/adminServices";

interface AdminLoanActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: AdminLoanItem | null;
  actionType: "disburse" | "reject";
  onConfirm: (id: number | string, reason?: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const AdminLoanActionModal: React.FC<AdminLoanActionModalProps> = ({
  isOpen,
  onClose,
  loan,
  actionType,
  onConfirm,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object({
      reason:
        actionType === "reject"
          ? Yup.string().trim().min(3, "Reason must be at least 3 characters")
          : Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!loan) return;
      await onConfirm(loan.id, values.reason.trim() || undefined);
      resetForm();
    },
  });

  if (!isOpen || !loan) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h3 className="text-[18px] font-bold text-[#0B2D5B]">
          {actionType === "disburse"
            ? "Disburse Approved Loan Funds?"
            : "Reject Loan Application?"}
        </h3>

        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          {actionType === "disburse"
            ? `You are about to disburse $${Number(loan.amount).toLocaleString()} to ${loan.user?.name || "the borrower"}. The amount will be atomically credited to their wallet balance.`
            : `Decline loan application of $${Number(loan.amount).toLocaleString()} from ${loan.user?.name || "the applicant"}.`}
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
          {actionType === "reject" && (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#172b4d]">
                Reason (Optional)
              </label>
              <textarea
                rows={2}
                name="reason"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Insufficient monthly income or high risk rating"
                className="w-full resize-none rounded-lg border border-[#dfe8f1] px-3 py-2 text-xs outline-none focus:border-primary"
              />
              {formik.touched.reason && formik.errors.reason && (
                <p className="mt-1 text-[11px] text-red-500">
                  {formik.errors.reason}
                </p>
              )}
            </div>
          )}

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
                actionType === "disburse"
                  ? "bg-[#05a957] hover:bg-[#04984e]"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting || formik.isSubmitting
                ? "Processing..."
                : actionType === "disburse"
                  ? "Yes, Disburse Funds"
                  : "Yes, Reject Loan"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminLoanActionModal;
