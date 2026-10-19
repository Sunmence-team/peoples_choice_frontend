import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import type { LoanApplication } from "../../services/loanServices";
import { formatCompactAmount } from "../../helpers/formatterUtility";

interface LoanRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanApplication | null;
  availableBalance: number;
  onSubmit: (amount: number) => Promise<void>;
  isLoading: boolean;
}

export const LoanRepaymentModal: React.FC<LoanRepaymentModalProps> = ({
  isOpen,
  onClose,
  loan,
  availableBalance,
  onSubmit,
  isLoading,
}) => {
  if (!isOpen || !loan) return null;

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Repayment amount must be a number")
      .positive("Amount must be greater than zero")
      .max(
        availableBalance,
        `Cannot exceed available balance ($${availableBalance.toLocaleString()})`,
      )
      .required("Repayment amount is required"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl border border-secondary animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
          <div>
            <h3 className="text-xs sm:text-[13px] font-bold text-primary">
              Make Loan Repayment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <div className="rounded-lg bg-gray-50 p-2.5 border border-secondary text-xs space-y-1 mb-3">
          <div className="flex justify-between">
            <span className="text-gray-400 text-[10.5px]">
              Monthly Installment
            </span>
            <span className="font-bold text-primary">
              {formatCompactAmount(Number(loan.monthly_payment))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-[10.5px]">
              Remaining Balance
            </span>
            <span className="font-semibold text-gray-700">
              {formatCompactAmount(Number(loan.remaining_balance))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-[10.5px]">
              Available Account Balance
            </span>
            <span className="font-semibold text-green-600">
              $
              {availableBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <Formik
          initialValues={{
            amount:
              Number(loan.monthly_payment) ||
              Number(loan.remaining_balance) ||
              0,
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {
            await onSubmit(Number(values.amount));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Repayment Amount (USD)
                </label>
                <Field
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  placeholder={`Recommended: ${loan.monthly_payment}`}
                  className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs font-semibold text-primary outline-none focus:border-primary transition"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading || isSubmitting}
                  className="flex-1 h-9 rounded-lg border border-secondary text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="flex-1 h-9 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isLoading || isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  <span>Confirm Repayment</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoanRepaymentModal;
