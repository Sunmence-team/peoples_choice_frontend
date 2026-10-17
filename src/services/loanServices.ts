import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface LoanApplication {
  id: string | number;
  loan_type: string;
  amount: number;
  tenure_months: number;
  monthly_payment: number;
  interest_rate: number;
  total_repayment: number;
  total_paid?: number;
  purpose: string;
  monthly_income?: number;
  employment_status?: string;
  status: "pending" | "approved" | "under_review" | "active" | "completed" | "repaid" | "rejected";
  created_at: string;
}

export interface LoanTypeOption {
  id: string;
  label: string;
  rate: number;
  min: number;
  max: number;
  description: string;
}

export const LOAN_TYPES: LoanTypeOption[] = [
  {
    id: "personal",
    label: "Personal Term Loan",
    rate: 4.5,
    min: 1000,
    max: 35000,
    description: "Unsecured personal loan for medical, travel or personal expenses with fixed monthly payments.",
  },
  {
    id: "business",
    label: "Business & SME Capital",
    rate: 5.2,
    min: 5000,
    max: 100000,
    description: "Commercial capital injection and inventory financing for registered businesses.",
  },
  {
    id: "emergency",
    label: "Emergency Liquidity Facility",
    rate: 3.5,
    min: 500,
    max: 15000,
    description: "Rapid disbursement credit line for urgent cash obligations with flexible tenures.",
  },
  {
    id: "auto",
    label: "Auto / Vehicle Financing",
    rate: 3.9,
    min: 3000,
    max: 60000,
    description: "Competitive vehicle acquisition facility with streamlined title verification.",
  },
  {
    id: "home",
    label: "Home Improvement Facility",
    rate: 4.2,
    min: 5000,
    max: 120000,
    description: "Financing for property upgrades, green energy installation or renovations.",
  },
];

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
  interest_rate: number;
}): Promise<{
  total_interest: number;
  total_payable: number;
  monthly_payment: number;
}> => {
  const res = await api.post("/loans/calculate", payload);
  const data = unwrap<{
    total_interest: number;
    total_payable: number;
    monthly_payment: number;
  }>(res.data);

  if (data && typeof data.monthly_payment === "number") {
    return data;
  }

  // Exact fallback mathematical standard formula if response is raw
  const monthlyRate = payload.interest_rate / 100 / 12;
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
  loan_type: string;
  amount: number;
  tenure_months: number;
  purpose: string;
  monthly_income: number;
  employment_status: string;
  collateral_accepted: boolean;
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
    message: body.message || "Your loan application has been submitted for underwriting review.",
  };
};

/**
 * 6.4 Make Loan Repayment (POST /api/loans/{id}/repay)
 */
export const repayLoanService = async (
  loanId: string | number,
  amount: number
): Promise<{ success: boolean; message: string }> => {
  const res = await api.post(`/loans/${loanId}/repay`, { amount });
  const body = res.data as { message?: string };
  return {
    success: true,
    message: body.message || `Repayment of $${amount.toFixed(2)} recorded successfully`,
  };
};
