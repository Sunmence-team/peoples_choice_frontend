import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2, FileText } from "lucide-react";
import {
  getLoansService,
  submitLoanApplicationService,
  calculateLoanService,
  repayLoanService,
  type LoanApplication,
  type LoanCalculationResult,
} from "../../../services/loanServices";
import { useDashboard } from "../../../hooks/useClientData";
import {
  formatCompactAmount,
  formatISODateToCustom,
} from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import LoanSummaryModal from "../../../components/modal/LoanSummaryModal";
import LoanRepaymentModal from "../../../components/modal/LoanRepaymentModal";
import ActionCell from "../../../components/ui/ActionCell";

const loanApplicationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Enter a valid loan amount")
    .min(500, "Minimum loan amount is $500")
    .max(100000, "Maximum loan amount is $100,000")
    .required("Loan amount is required"),
  tenure_months: Yup.number()
    .typeError("Select tenure duration")
    .min(3, "Minimum duration is 3 months")
    .max(60, "Maximum duration is 60 months")
    .required("Tenure is required"),
  monthly_income: Yup.number()
    .typeError("Enter valid verified income")
    .min(500, "Minimum monthly income is $500")
    .required("Monthly income is required"),
  employment_status: Yup.string()
    .trim()
    .required("Employment status is required"),
  purpose: Yup.string()
    .trim()
    .min(5, "Please describe the loan purpose (at least 5 characters)")
    .required("Purpose is required"),
  collateral_accepted: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and repayment declaration",
  ),
});

const tenureOptions = [3, 6, 12, 24, 36];

export default function Loans() {
  const { data: stats } = useDashboard();
  const availableBalance = stats?.balance ?? 0;

  const [activeTab, setActiveTab] = useState<"apply" | "history">("apply");
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loadingLoans, setLoadingLoans] = useState<boolean>(true);

  // Selected loan for view modal & repayment
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(
    null,
  );
  const [repayLoan, setRepayLoan] = useState<LoanApplication | null>(null);
  const [isSubmittingRepay, setIsSubmittingRepay] = useState<boolean>(false);

  // Live calculation result state
  const [calcResult, setCalcResult] = useState<LoanCalculationResult>({
    monthly_payment: 428.04,
    total_payable: 5136.45,
    total_interest: 136.45,
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const loadLoans = async () => {
    setLoadingLoans(true);
    try {
      const data = await getLoansService();
      setLoans(data);
    } catch (err) {
      console.error("Failed to load loans", err);
    } finally {
      setLoadingLoans(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => loadLoans());
  }, []);

  // Fetch calculation whenever amount or tenure changes
  const runCalculation = async (amount: number, tenure: number) => {
    if (!amount || amount < 100 || !tenure) return;
    setIsCalculating(true);
    try {
      const res = await calculateLoanService({
        amount,
        tenure_months: tenure,
        interest_rate: 5.0,
      });
      setCalcResult(res);
    } catch {
      // Fallback calculation is handled inside service
    } finally {
      setIsCalculating(false);
    }
  };

  const handleApplySubmit = async (
    values: {
      amount: number;
      tenure_months: number;
      monthly_income: number;
      employment_status: string;
      purpose: string;
      collateral_accepted: boolean;
    },
    { resetForm }: { resetForm: () => void },
  ) => {
    try {
      const res = await submitLoanApplicationService({
        amount: values.amount,
        tenure_months: values.tenure_months,
        purpose: values.purpose.trim(),
        monthly_income: values.monthly_income,
        employment_status: values.employment_status,
      });

      toast.success(res.message);
      await loadLoans();
      resetForm();
      setActiveTab("history");
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Failed to submit loan request. Please try again.",
        ),
      );
    }
  };

  const handleRepaySubmit = async (amount: number) => {
    if (!repayLoan) return;
    setIsSubmittingRepay(true);
    try {
      const res = await repayLoanService(repayLoan.id, amount);
      toast.success(res.message);
      await loadLoans();
      setRepayLoan(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to process loan repayment"));
    } finally {
      setIsSubmittingRepay(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-4">
        <h1 className="text-base sm:text-lg font-bold text-primary">
          Loans & Credit Facilities
        </h1>
        <p className="hidden md:block mt-0.5 text-xs font-medium text-gray-500">
          Apply for prime rate credit facilities, calculate amortized monthly
          repayments, and review active financing.
        </p>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-secondary bg-white p-3 sm:p-4 shadow-xs">
        <div className="flex gap-2 border-b border-gray-200 pb-2.5 mb-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("apply")}
            className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold cursor-pointer transition shrink-0 ${
              activeTab === "apply"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Apply for a Loan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold cursor-pointer transition shrink-0 ${
              activeTab === "history"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Loan History & Requests ({loans.length})
          </button>
        </div>

        {activeTab === "apply" && (
          <Formik
            initialValues={{
              amount: 5000,
              tenure_months: 12,
              monthly_income: 4500,
              employment_status: "Employed",
              purpose: "",
              collateral_accepted: false,
            }}
            validationSchema={loanApplicationSchema}
            onSubmit={handleApplySubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => {
              return (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-6">
                    {/* Form Side */}
                    <div className="space-y-3.5">
                      {/* Amount */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-semibold text-primary">
                            Loan Principal Amount (USD)
                          </label>
                        </div>

                        <Field
                          type="number"
                          name="amount"
                          min={500}
                          max={100000}
                          step={100}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const val = Number(e.target.value);
                            setFieldValue("amount", val);
                            runCalculation(val, values.tenure_months);
                          }}
                          className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-primary font-semibold outline-none transition focus:border-primary"
                        />
                        <ErrorMessage
                          name="amount"
                          component="div"
                          className="text-red-500 text-[10px] mt-1"
                        />
                      </div>

                      {/* Tenure */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold text-primary">
                          Repayment Duration (Tenure)
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {tenureOptions.map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                setFieldValue("tenure_months", m);
                                runCalculation(values.amount, m);
                              }}
                              className={`h-9 rounded-lg border text-center text-xs font-semibold transition cursor-pointer ${
                                values.tenure_months === m
                                  ? "border-primary bg-primary text-white shadow-xs"
                                  : "border-secondary bg-gray-50 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {m} Mo
                            </button>
                          ))}
                        </div>
                        <ErrorMessage
                          name="tenure_months"
                          component="div"
                          className="text-red-500 text-[10px] mt-1"
                        />
                      </div>

                      {/* Monthly Income & Employment Status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-primary">
                            Monthly Verified Income (USD)
                          </label>
                          <Field
                            type="number"
                            name="monthly_income"
                            min={500}
                            className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-primary font-semibold outline-none transition focus:border-primary"
                          />
                          <ErrorMessage
                            name="monthly_income"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-primary">
                            Employment Status
                          </label>
                          <Field
                            as="select"
                            name="employment_status"
                            className="h-9 w-full rounded-lg border border-secondary bg-white px-2.5 text-xs text-primary font-semibold outline-none transition focus:border-primary cursor-pointer"
                          >
                            <option value="Employed">
                              Employed (Full-Time)
                            </option>
                            <option value="Self-Employed">
                              Self-Employed / Contractor
                            </option>
                            <option value="Business Owner">
                              Business Owner / Partner
                            </option>
                            <option value="Professional">
                              Professional Practitioner
                            </option>
                          </Field>
                          <ErrorMessage
                            name="employment_status"
                            component="div"
                            className="text-red-500 text-[10px] mt-1"
                          />
                        </div>
                      </div>

                      {/* Purpose of Loan */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold text-primary">
                          Purpose / Loan Statement
                        </label>
                        <Field
                          as="textarea"
                          name="purpose"
                          rows={2}
                          placeholder="Briefly state how the funds will be utilized..."
                          className="w-full resize-none rounded-lg border border-secondary bg-white p-2.5 text-xs text-[#243b53] outline-none transition focus:border-primary"
                        />
                        <ErrorMessage
                          name="purpose"
                          component="div"
                          className="text-red-500 text-[10px] mt-1"
                        />
                      </div>

                      {/* Checkbox declaration */}
                      <div>
                        <div className="flex items-start gap-2 pt-1">
                          <Field
                            type="checkbox"
                            name="collateral_accepted"
                            id="collateral_declaration"
                            className="mt-0.5 size-4 rounded border-gray-300 text-primary cursor-pointer"
                          />
                          <label
                            htmlFor="collateral_declaration"
                            className="text-[10px] sm:text-[10.5px] leading-tight text-gray-500 cursor-pointer"
                          >
                            I declare that all information is truthful, and I
                            authorize People's Choice Bank underwriting review
                            for credit evaluation and automated installment
                            deductions.
                          </label>
                        </div>
                        <ErrorMessage
                          name="collateral_accepted"
                          component="div"
                          className="text-red-500 text-[10px] mt-1"
                        />
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-9 sm:h-10 w-full rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Submitting Credit Review...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Loan Application</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Dynamic Real-time Calculator Summary Side */}
                    <div className="rounded-xl border border-[#d9e4f0] bg-[#f8fafc] p-3.5 sm:p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-primary mb-3">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-primary">
                              Loan Repayment Estimate
                            </h3>
                          </div>
                          {isCalculating && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          )}
                        </div>

                        <div className="space-y-2.5 border-b border-gray-200 pb-3 text-xs">
                          <div className="flex justify-between items-center text-gray-500">
                            <span className="text-[11px]">
                              Requested Principal
                            </span>
                            <span className="font-semibold text-primary">
                              $
                              {values.amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-gray-500">
                            <span className="text-[11px]">
                              Annual Interest (APR)
                            </span>
                            <span className="font-semibold text-green-600">
                              5.00% Fixed
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-gray-500">
                            <span className="text-[11px]">Tenure Duration</span>
                            <span className="font-semibold text-primary">
                              {values.tenure_months} Months
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-gray-500">
                            <span className="text-[11px]">
                              Estimated Interest Total
                            </span>
                            <span className="font-semibold text-gray-700">
                              $
                              {calcResult.total_interest.toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="pt-3 space-y-2">
                          <div className="rounded-lg bg-white p-2.5 border border-secondary shadow-xs">
                            <p className="text-[10px] text-gray-400 font-medium">
                              Estimated Monthly Installment
                            </p>
                            <p className="text-base font-bold text-primary mt-0.5">
                              $
                              {calcResult.monthly_payment.toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}{" "}
                              <span className="text-[10px] font-normal text-gray-500">
                                / mo
                              </span>
                            </p>
                          </div>

                          <div className="rounded-lg bg-white p-2.5 border border-secondary shadow-xs">
                            <p className="text-[10px] text-gray-400 font-medium">
                              Total Repayment (Principal + Interest)
                            </p>
                            <p className="text-sm font-bold text-primary mt-0.5">
                              $
                              {calcResult.total_payable.toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg bg-primary/5 p-2.5 border border-primary/10">
                        <div className="flex items-center gap-1.5 text-primary text-[10px] font-semibold">
                          <span>Instant Underwriting Review</span>
                        </div>
                        <p className="text-[9.5px] text-gray-500 mt-1 leading-relaxed">
                          Funds are disbursed directly to your People's Choice
                          Bank balance upon administrator review.
                        </p>
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            {loadingLoans ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">
                  No loan applications on record.
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Apply above to request an instant credit facility.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] font-semibold text-gray-400 uppercase">
                      {/* <th className="py-2 px-2">Loan Reference</th> */}
                      <th className="py-2 px-2">Principal</th>
                      <th className="py-2 px-2">Tenure</th>
                      <th className="py-2 px-2">Monthly Due</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2">Date Applied</th>
                      <th className="py-2 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loans.map((loan) => {
                      const isApproved =
                        loan.status === "approved" || loan.status === "active";
                      const isReview =
                        loan.status === "under_review" ||
                        loan.status === "pending";
                      const isCompleted =
                        loan.status === "completed" || loan.status === "repaid";

                      return (
                        <tr
                          key={loan.id}
                          className="hover:bg-gray-50 transition"
                        >
                          {/* <td className="py-2.5 px-2 font-mono text-[10px] font-semibold text-primary">
                            {loan.id}
                          </td> */}
                          <td className="py-2.5 px-2 font-bold text-primary text-[11px]">
                            {formatCompactAmount(Number(loan.amount))}
                          </td>
                          <td className="py-2.5 px-2 text-gray-500 text-[10.5px]">
                            {loan.tenure_months} Mo
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-gray-700 text-[11px]">
                            {formatCompactAmount(Number(loan.monthly_payment))}
                          </td>
                          <td className="py-2.5 px-2">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold capitalize ${
                                isApproved
                                  ? "bg-blue-100 text-blue-700"
                                  : isCompleted
                                    ? "bg-green-100 text-green-700"
                                    : isReview
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                              }`}
                            >
                              {loan.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-gray-500 text-[10.5px]">
                            {formatISODateToCustom(loan.created_at) ||
                              loan.created_at.slice(0, 10)}
                          </td>
                          <td className="py-2.5 px-2 w-10 space-x-2">
                            <ActionCell
                              rowId={Number(loan.id)}
                              onView={() => setSelectedLoan(loan)}
                              {...(loan.status === "active"
                                ? {
                                    otherActions: [
                                      {
                                        name: "Repay",
                                        action: () => setRepayLoan(loan),
                                      },
                                    ],
                                  }
                                : {})}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extracted Modular Modals */}
      <LoanSummaryModal
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        loan={selectedLoan}
      />

      <LoanRepaymentModal
        isOpen={!!repayLoan}
        onClose={() => setRepayLoan(null)}
        loan={repayLoan}
        availableBalance={availableBalance}
        onSubmit={handleRepaySubmit}
        isLoading={isSubmittingRepay}
      />
    </div>
  );
}
