import React, { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Calculator,
  CheckCircle2,
  Loader2,
  FileText,
} from "lucide-react";
import {
  LOAN_TYPES,
  getStoredLoans,
  submitLoanApplicationService,
  type LoanApplication,
} from "../../../services/loanServices";
import { useDashboard } from "../../../hooks/useClientData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";

export default function Loans() {
  const { data: stats } = useDashboard();
  const availableBalance = stats?.balance ?? 0;

  const [activeTab, setActiveTab] = useState<"apply" | "history">("apply");
  const [loans, setLoans] = useState<LoanApplication[]>(() => getStoredLoans());

  // Form state
  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0].label);
  const [amount, setAmount] = useState<number>(5000);
  const [tenure, setTenure] = useState<number>(12);
  const [purpose, setPurpose] = useState<string>("");
  const [collateralAccepted, setCollateralAccepted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Selected loan for view modal
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);

  const currentTypeConfig =
    LOAN_TYPES.find((t) => t.label === selectedType) || LOAN_TYPES[0];
  const rate = currentTypeConfig.rate;

  // Realtime repayment calculation
  const monthlyRate = rate / 100 / 12;
  const calculatedMonthlyPayment =
    monthlyRate === 0
      ? amount / tenure
      : (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1);
  const calculatedTotalRepayment = calculatedMonthlyPayment * tenure;
  const calculatedTotalInterest = Math.max(0, calculatedTotalRepayment - amount);

  // Quick amount selections
  const quickAmounts = [1000, 2500, 5000, 10000, 25000];
  const tenureOptions = [3, 6, 12, 24, 36];

  // Aggregated stats
  const activeLoans = loans.filter((l) => l.status === "active" || l.status === "approved");
  const totalBorrowed = activeLoans.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount < currentTypeConfig.min || amount > currentTypeConfig.max) {
      toast.error(
        `Amount for ${currentTypeConfig.label} must be between $${currentTypeConfig.min.toLocaleString()} and $${currentTypeConfig.max.toLocaleString()}`
      );
      return;
    }

    if (!purpose.trim()) {
      toast.error("Please provide the intended purpose for this loan facility");
      return;
    }

    if (!collateralAccepted) {
      toast.error("Please accept the credit underwriting terms and repayment declaration");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitLoanApplicationService({
        loan_type: selectedType,
        amount,
        tenure_months: tenure,
        purpose: purpose.trim(),
        collateral_accepted: collateralAccepted,
      });

      toast.success(res.message);
      setLoans(getStoredLoans());
      setPurpose("");
      setCollateralAccepted(false);
      setActiveTab("history");
    } catch {
      toast.error("Failed to submit loan request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Title only (No description paragraph as instructed) */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-base sm:text-lg font-bold text-primary">
          Loans & Credit Facilities
        </h1>
      </div>

      {/* Top Banking Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <div className="rounded-xl border border-secondary bg-white p-3 sm:p-3.5 shadow-xs">
          <p className="text-[10px] sm:text-[10.5px] font-semibold text-gray-400">
            Active Loan Principal
          </p>
          <p className="mt-1 text-sm sm:text-base font-bold text-primary">
            ${totalBorrowed.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[9px] text-gray-400">
            {activeLoans.length} active {activeLoans.length === 1 ? "facility" : "facilities"}
          </span>
        </div>

        <div className="rounded-xl border border-secondary bg-white p-3 sm:p-3.5 shadow-xs">
          <p className="text-[10px] sm:text-[10.5px] font-semibold text-gray-400">
            Credit Eligibility Limit
          </p>
          <p className="mt-1 text-sm sm:text-base font-bold text-primary">
            $100,000.00
          </p>
          <span className="text-[9px] text-green-600 font-medium">
            Pre-approved tier
          </span>
        </div>

        <div className="rounded-xl border border-secondary bg-white p-3 sm:p-3.5 shadow-xs">
          <p className="text-[10px] sm:text-[10.5px] font-semibold text-gray-400">
            Base Fixed APR
          </p>
          <p className="mt-1 text-sm sm:text-base font-bold text-primary">
            3.50% - 5.20%
          </p>
          <span className="text-[9px] text-gray-400">
            Competitive prime rate
          </span>
        </div>

        <div className="rounded-xl border border-secondary bg-white p-3 sm:p-3.5 shadow-xs">
          <p className="text-[10px] sm:text-[10.5px] font-semibold text-gray-400">
            Account Balance
          </p>
          <p className="mt-1 text-sm sm:text-base font-bold text-primary">
            ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[9px] text-gray-400">
            Disbursement target
          </span>
        </div>
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

        {/* Tab 1: Apply for Loan */}
        {activeTab === "apply" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-6">
              {/* Form Side */}
              <div className="space-y-3.5">
                {/* Loan Type */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-primary">
                    Select Loan Facility Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LOAN_TYPES.map((type) => {
                      const isSelected = selectedType === type.label;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setSelectedType(type.label);
                            if (amount > type.max) setAmount(type.max);
                            if (amount < type.min) setAmount(type.min);
                          }}
                          className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                              : "border-secondary bg-white text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-primary">
                              {type.label}
                            </span>
                            <span className="text-[10px] font-semibold text-green-600">
                              {type.rate}% APR
                            </span>
                          </div>
                          <p className="text-[9.5px] text-gray-500 mt-1 line-clamp-2">
                            {type.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-primary">
                      Loan Principal Amount (USD)
                    </label>
                    <span className="text-[10px] text-gray-400">
                      Min: ${currentTypeConfig.min.toLocaleString()} • Max: ${currentTypeConfig.max.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="number"
                    min={currentTypeConfig.min}
                    max={currentTypeConfig.max}
                    step={100}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-primary font-semibold outline-none transition focus:border-primary"
                  />

                  {/* Quick selection pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {quickAmounts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setAmount(q)}
                        className={`rounded-md px-2 py-1 text-[10px] font-semibold border transition cursor-pointer ${
                          amount === q
                            ? "border-primary bg-primary text-white"
                            : "border-secondary bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        ${q.toLocaleString()}
                      </button>
                    ))}
                  </div>
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
                        onClick={() => setTenure(m)}
                        className={`h-9 rounded-lg border text-center text-xs font-semibold transition cursor-pointer ${
                          tenure === m
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-secondary bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {m} Mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purpose of Loan */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-primary">
                    Purpose / Loan Statement
                  </label>
                  <textarea
                    rows={2}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Briefly state how the funds will be utilized..."
                    required
                    className="w-full resize-none rounded-lg border border-secondary bg-white p-2.5 text-xs text-[#243b53] outline-none transition focus:border-primary"
                  />
                </div>

                {/* Checkbox declaration */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="collateral_declaration"
                    checked={collateralAccepted}
                    onChange={(e) => setCollateralAccepted(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-gray-300 text-primary cursor-pointer"
                  />
                  <label
                    htmlFor="collateral_declaration"
                    className="text-[10px] sm:text-[10.5px] leading-tight text-gray-500 cursor-pointer"
                  >
                    I declare that all information is truthful, and I authorize People's Choice Bank underwriting review for credit evaluation and automated installment deductions.
                  </label>
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
                      <ShieldCheck className="h-4 w-4" />
                      <span>Submit Loan Application</span>
                    </>
                  )}
                </button>
              </div>

              {/* Calculator Summary Side */}
              <div className="rounded-xl border border-[#d9e4f0] bg-[#f8fafc] p-3.5 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-primary mb-3">
                    <Calculator className="h-4 w-4 text-tertiary" />
                    <h3 className="text-xs font-bold text-primary">
                      Loan Repayment Estimate
                    </h3>
                  </div>

                  <div className="space-y-2.5 border-b border-gray-200 pb-3 text-xs">
                    <div className="flex justify-between items-center text-gray-500">
                      <span className="text-[11px]">Requested Principal</span>
                      <span className="font-semibold text-primary">
                        ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-500">
                      <span className="text-[11px]">Annual Interest (APR)</span>
                      <span className="font-semibold text-green-600">
                        {rate}% Fixed
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-500">
                      <span className="text-[11px]">Tenure Duration</span>
                      <span className="font-semibold text-primary">
                        {tenure} Months
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-500">
                      <span className="text-[11px]">Estimated Interest Total</span>
                      <span className="font-semibold text-gray-700">
                        ${calculatedTotalInterest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                        ${calculatedMonthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                        <span className="text-[10px] font-normal text-gray-500">/ mo</span>
                      </p>
                    </div>

                    <div className="rounded-lg bg-white p-2.5 border border-secondary shadow-xs">
                      <p className="text-[10px] text-gray-400 font-medium">
                        Total Repayment (Principal + Interest)
                      </p>
                      <p className="text-sm font-bold text-primary mt-0.5">
                        ${calculatedTotalRepayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-primary/5 p-2.5 border border-primary/10">
                  <div className="flex items-center gap-1.5 text-primary text-[10px] font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-tertiary" />
                    <span>Instant Automated Decision</span>
                  </div>
                  <p className="text-[9.5px] text-gray-500 mt-1 leading-relaxed">
                    Funds are disbursed directly to your People's Choice Bank checking balance upon final compliance review.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Loan History */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {loans.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">No loan applications on record.</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Apply above to request an instant credit facility.</p>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] font-semibold text-gray-400 uppercase">
                      <th className="py-2 px-2">Loan Reference</th>
                      <th className="py-2 px-2">Facility Type</th>
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
                      const isApproved = loan.status === "approved" || loan.status === "active";
                      const isReview = loan.status === "under_review" || loan.status === "pending";
                      const isCompleted = loan.status === "completed";

                      return (
                        <tr key={loan.id} className="hover:bg-gray-50 transition">
                          <td className="py-2.5 px-2 font-mono text-[10px] font-semibold text-primary">
                            {loan.id}
                          </td>
                          <td className="py-2.5 px-2 font-medium text-[#172b4d] text-[11px]">
                            {loan.loan_type}
                          </td>
                          <td className="py-2.5 px-2 font-bold text-primary text-[11px]">
                            ${loan.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-2 text-gray-500 text-[10.5px]">
                            {loan.tenure_months} Mo
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-gray-700 text-[11px]">
                            ${loan.monthly_payment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                            {formatISODateToCustom(loan.created_at) || loan.created_at.slice(0, 10)}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedLoan(loan)}
                              className="text-[10px] font-semibold text-primary hover:text-blue-700 cursor-pointer underline"
                            >
                              Details
                            </button>
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

      {/* Loan Details Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl border border-secondary animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <div>
                <h3 className="text-xs sm:text-[13px] font-bold text-primary">
                  Loan Facility Summary
                </h3>
                <span className="font-mono text-[9px] text-gray-400">
                  Ref: {selectedLoan.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 text-[10.5px]">Facility Type</span>
                <span className="font-semibold text-primary">{selectedLoan.loan_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 text-[10.5px]">Principal Amount</span>
                <span className="font-bold text-primary">
                  ${selectedLoan.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 text-[10.5px]">Repayment Duration</span>
                <span className="font-medium text-gray-700">{selectedLoan.tenure_months} Months</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 text-[10.5px]">Monthly Payment</span>
                <span className="font-bold text-primary">
                  ${selectedLoan.monthly_payment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 text-[10.5px]">Total Repayment</span>
                <span className="font-semibold text-gray-700">
                  ${selectedLoan.total_repayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 text-[10.5px]">Interest Rate</span>
                <span className="font-semibold text-green-600">{selectedLoan.interest_rate}% Fixed</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 text-[10.5px]">Current Status</span>
                <span className="font-bold capitalize text-primary">
                  {selectedLoan.status.replace("_", " ")}
                </span>
              </div>
              <div className="py-1">
                <span className="text-gray-500 text-[10.5px] block mb-0.5">Application Purpose:</span>
                <p className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  {selectedLoan.purpose || "General banking liquidity"}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="w-full h-8.5 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
