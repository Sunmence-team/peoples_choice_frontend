import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface LoanApplication {
  id: string | number;
  amount: number;
  tenure_months: number;
  monthly_payment: number;
  interest_rate: number;
  total_payable: number;
  remaining_balance: number;
  total_paid?: number;
  purpose: string;
  admin_remarks: string;
  monthly_income?: number;
  employment_status?: string;
  status:
    | "pending"
    | "approved"
    | "under_review"
    | "active"
    | "completed"
    | "repaid"
    | "rejected";
  created_at: string;
}

export interface LoanCalculationResult {
  total_interest: number;
  total_payable: number;
  monthly_payment: number;
  amount?: number;
  tenure_months?: number;
  interest_rate?: number;
}

/**
 * 6.3 List User Loans (GET /api/loans)
 */
export const getLoansService = async (): Promise<LoanApplication[]> => {
  const res = await api.get("/loans");
  const data = unwrap<LoanApplication[]>(res.data);
  return Array.isArray(data) ? data : [];
};

/**
 * 6.1 Loan Calculator (POST /api/loans/calculate)
 */
export const calculateLoanService = async (payload: {
  amount: number;
  tenure_months: number;
  interest_rate?: number;
}): Promise<LoanCalculationResult> => {
  const interest_rate = payload.interest_rate ?? 5.0;
  const res = await api.post("/loans/calculate", {
    amount: payload.amount,
    tenure_months: payload.tenure_months,
    interest_rate,
  });
  const data = unwrap<LoanCalculationResult>(res.data);

  if (data && typeof data.monthly_payment === "number") {
    return data;
  }

  // Exact mathematical standard formula fallback
  const monthlyRate = interest_rate / 100 / 12;
  const n = payload.tenure_months;
  const monthly_payment =
    monthlyRate === 0
      ? payload.amount / n
      : (payload.amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);
  const total_payable = monthly_payment * n;
  const total_interest = Math.max(0, total_payable - payload.amount);

  return {
    monthly_payment: Math.round(monthly_payment * 100) / 100,
    total_payable: Math.round(total_payable * 100) / 100,
    total_interest: Math.round(total_interest * 100) / 100,
  };
};

/**
 * 6.2 Submit Loan Application (POST /api/loans/apply)
 */
export const submitLoanApplicationService = async (payload: {
  amount: number;
  tenure_months: number;
  purpose: string;
  monthly_income: number;
  employment_status: string;
}): Promise<{ success: boolean; loan?: LoanApplication; message: string }> => {
  const res = await api.post("/loans/apply", {
    amount: payload.amount,
    tenure_months: payload.tenure_months,
    purpose: payload.purpose,
    monthly_income: payload.monthly_income,
    employment_status: payload.employment_status,
  });

  const body = res.data as { message?: string; data?: LoanApplication };
  return {
    success: true,
    loan: body.data,
    message:
      body.message ||
      "Your loan application has been submitted for underwriting review.",
  };
};

/**
 * 6.4 Make Loan Repayment (POST /api/loans/{id}/repay)
 */
export const repayLoanService = async (
  loanId: string | number,
  amount: number,
): Promise<{ success: boolean; message: string }> => {
  const res = await api.post(`/loans/${loanId}/repay`, { amount });
  const body = res.data as { message?: string };
  return {
    success: true,
    message:
      body.message ||
      `Repayment of $${amount.toFixed(2)} recorded successfully`,
  };
};
