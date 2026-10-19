import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import FormattedInput from "../ui/FormattedInput";
import type { AdminUser } from "../../lib/interfaces";

interface AdminUserBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirm: (userId: number | string, balance: number, description: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const AdminUserBalanceModal: React.FC<AdminUserBalanceModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      balance: "",
      description: "",
    },
    validationSchema: Yup.object({
      balance: Yup.number()
        .typeError("Please enter a valid amount")
        .required("Amount is required"),
      description: Yup.string()
        .trim()
        .min(3, "Description must be at least 3 characters")
        .required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!user) return;
      await onConfirm(user.id, Number(values.balance), values.description.trim());
      resetForm();
    },
  });

  if (!isOpen || !user) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-4 sm:p-5">
        <h3 className="text-[18px] font-bold text-[#0B2D5B]">
          Update Balance (Hidden Transaction)
        </h3>
        <p className="mt-1 text-[12px] text-[#8190a3]">
          Update ledger balance for {user.first_name} {user.last_name}.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <FormattedInput
                name="balance"
                placeholder="Balance (USD)"
                value={formik.values.balance}
                onChange={(e) =>
                  formik.setFieldValue("balance", String(e.target.value))
                }
                className="h-9 w-full rounded-md border border-[#dfe8f1] px-3 text-[11px] outline-none focus:border-primary"
              />
              {formik.touched.balance && formik.errors.balance && (
                <p className="mt-1 text-[10.5px] text-red-500">
                  {formik.errors.balance}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="description"
                placeholder="Reason / Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-9 w-full rounded-md border border-[#dfe8f1] px-3 text-[11px] outline-none focus:border-primary"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-[10.5px] text-red-500">
                  {formik.errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-3 pt-2">
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
              className="rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || formik.isSubmitting ? "Saving..." : "Save Balance"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminUserBalanceModal;
