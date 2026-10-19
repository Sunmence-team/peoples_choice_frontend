import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import type { AdminUser } from "../../lib/interfaces";

interface AdminUserDisableModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirm: (userId: number | string, reason: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const AdminUserDisableModal: React.FC<AdminUserDisableModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string()
        .trim()
        .min(5, "Reason must be at least 5 characters")
        .required("Reason for disabling is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!user) return;
      await onConfirm(user.id, values.reason.trim());
      resetForm();
    },
  });

  if (!isOpen || !user) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-4 sm:p-5">
        <h3 className="text-[18px] font-bold text-amber-600">
          Disable User Account
        </h3>
        <p className="mt-1 text-[12px] text-[#8190a3]">
          Suspending account access for {user.first_name} {user.last_name}.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#172b4d]">
              Suspension Reason
            </label>
            <textarea
              rows={3}
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Account locked pending KYC documents update"
              className="w-full resize-none rounded-lg border border-[#dfe8f1] px-3 py-2 text-xs outline-none focus:border-primary"
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="mt-1 text-[10.5px] text-red-500">
                {formik.errors.reason}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dfe8f1] px-4 py-2 text-[12px] font-semibold text-[#52677c] transition hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formik.isSubmitting}
              className="rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-[12px] font-semibold text-white transition disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || formik.isSubmitting ? "Disabling..." : "Confirm Disable"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminUserDisableModal;
