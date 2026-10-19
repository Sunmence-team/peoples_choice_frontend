import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import type { AdminVerificationItem } from "../../services/adminServices";

interface KYCRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: AdminVerificationItem | null;
  onConfirm: (id: number | string, reason: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const KYCRejectModal: React.FC<KYCRejectModalProps> = ({
  isOpen,
  onClose,
  verification,
  onConfirm,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      rejection_reason: "",
    },
    validationSchema: Yup.object({
      rejection_reason: Yup.string()
        .trim()
        .min(5, "Rejection reason must be at least 5 characters")
        .required("Please provide a reason for rejection"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!verification) return;
      await onConfirm(verification.id, values.rejection_reason.trim());
      resetForm();
    },
  });

  if (!isOpen || !verification) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h3 className="text-[18px] font-bold text-red-600">
          Reject KYC Submission
        </h3>
        <p className="mt-1 text-[13px] text-[#8190a3]">
          Decline verification for {verification.user?.name || "the user"}.
          Please provide a clear reason so the user can re-upload compliant documentation.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#172b4d]">
              Rejection Reason
            </label>
            <textarea
              rows={3}
              name="rejection_reason"
              value={formik.values.rejection_reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Document photo blurry, expired, or cropped edges"
              className="w-full resize-none rounded-lg border border-[#dfe8f1] px-3 py-2 text-xs outline-none focus:border-primary"
            />
            {formik.touched.rejection_reason && formik.errors.rejection_reason && (
              <p className="mt-1 text-[11px] text-red-500">
                {formik.errors.rejection_reason}
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
              className="rounded-lg bg-red-600 hover:bg-red-700 py-2.5 text-xs font-semibold text-white transition disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || formik.isSubmitting ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default KYCRejectModal;
