import React from "react";
import type { LoanApplication } from "../../services/loanServices";
import { formatCompactAmount } from "../../helpers/formatterUtility";

interface LoanSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanApplication | null;
}

export const LoanSummaryModal: React.FC<LoanSummaryModalProps> = ({
  isOpen,
  onClose,
  loan,
}) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl border border-secondary animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2.5 mb-3">
          <div>
            <h3 className="text-xs sm:text-[13px] font-bold text-primary">
              Loan Facility Summary
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

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500 text-[10.5px]">
              Principal Amount
            </span>
            <span className="font-bold text-primary">
              {formatCompactAmount(Number(loan.amount))} USD
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500 text-[10.5px]">
              Repayment Duration
            </span>
            <span className="font-medium text-gray-700">
              {loan.tenure_months} Months
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500 text-[10.5px]">Monthly Payment</span>
            <span className="font-bold text-primary">
              {formatCompactAmount(Number(loan.monthly_payment))}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500 text-[10.5px]">Total Repayment</span>
            <span className="font-semibold text-gray-700">
              {formatCompactAmount(Number(loan.total_payable))}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500 text-[10.5px]">
              Remaining balance
            </span>
            <span className="font-semibold text-gray-700">
              {formatCompactAmount(Number(loan.remaining_balance))}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500 text-[10.5px]">Interest Rate</span>
            <span className="font-semibold text-green-600">
              {loan.interest_rate || 5.0}% Fixed
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500 text-[10.5px]">Current Status</span>
            <span className="font-bold capitalize text-primary">
              {loan.status?.replace("_", " ")}
            </span>
          </div>
          {typeof loan.total_paid === "number" && (
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500 text-[10.5px]">Total Repaid</span>
              <span className="font-semibold text-green-600">
                $
                {loan.total_paid.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          <div className="py-1">
            <span className="text-gray-500 text-[10.5px] block mb-0.5">
              Application Purpose:
            </span>
            <p className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-200">
              {loan.purpose}
            </p>
          </div>
          {loan.status === "rejected" && (
            <div className="py-1">
              <span className="text-gray-500 text-[10.5px] block mb-0.5">
                Rejection Reason:
              </span>
              <p className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-200">
                {loan.admin_remarks}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-8.5 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 cursor-pointer"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanSummaryModal;
