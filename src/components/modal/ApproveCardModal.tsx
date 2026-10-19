import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import FormattedInput from "../ui/FormattedInput";
import type { AdminCardItem } from "../../services/adminServices";

interface ApproveCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: AdminCardItem | null;
  onConfirm: (id: number | string, spendingLimit: number) => Promise<void>;
  isSubmitting?: boolean;
}

export const ApproveCardModal: React.FC<ApproveCardModalProps> = ({
  isOpen,
  onClose,
  card,
  onConfirm,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      spending_limit: String(card?.spending_limit || "10000"),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      spending_limit: Yup.number()
        .typeError("Please enter a valid spending limit")
        .positive("Spending limit must be greater than 0")
        .required("Spending limit is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!card) return;
      await onConfirm(card.id, Number(values.spending_limit));
      resetForm();
    },
  });

  if (!isOpen || !card) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h3 className="text-[18px] font-bold text-[#0B2D5B]">
          Approve & Issue Debit Card
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Issuing {card.card_type} {card.card_brand.toUpperCase()} card for{" "}
          <strong>{card.card_holder_name}</strong>.
        </p>

        {card.card_type === "physical" && card.delivery_address && (
          <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-secondary text-xs">
            <span className="text-gray-400 text-[10.5px] block font-semibold">
              Physical Delivery Address:
            </span>
            <span className="text-gray-700 font-medium">
              {card.delivery_address}
            </span>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#172b4d]">
              Approved Spending Limit (USD)
            </label>
            <FormattedInput
              name="spending_limit"
              placeholder="e.g. 10,000.00"
              value={formik.values.spending_limit}
              onChange={(e) =>
                formik.setFieldValue("spending_limit", String(e.target.value))
              }
              className="h-9 w-full rounded-md border border-[#dfe8f1] px-3 text-xs outline-none focus:border-primary"
            />
            {formik.touched.spending_limit && formik.errors.spending_limit && (
              <p className="mt-1 text-[11px] text-red-500">
                {formik.errors.spending_limit}
              </p>
            )}
            <p className="text-[10px] text-gray-400 mt-1">
              Card number, CVV, and expiration date will be automatically generated upon approval.
            </p>
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
              className="rounded-lg bg-[#05a957] hover:bg-[#04984e] py-2.5 text-xs font-semibold text-white transition disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || formik.isSubmitting
                ? "Issuing..."
                : "Approve & Issue Card"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ApproveCardModal;
