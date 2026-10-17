export interface LoanApplication {
  id: string;
  loan_type: string;
  amount: number;
  tenure_months: number;
  monthly_payment: number;
  interest_rate: number;
  total_repayment: number;
  purpose: string;
  status: "pending" | "approved" | "under_review" | "active" | "completed" | "rejected";
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

const STORAGE_KEY = "pc_bank_loans_v1";

const INITIAL_LOANS: LoanApplication[] = [
  {
    id: "LN-849201",
    loan_type: "Emergency Liquidity Facility",
    amount: 5000,
    tenure_months: 12,
    monthly_payment: 424.58,
    interest_rate: 3.5,
    total_repayment: 5095.0,
    purpose: "Short-term medical emergency bill settlement",
    status: "active",
    created_at: "2026-09-15T09:30:00Z",
  },
  {
    id: "LN-710432",
    loan_type: "Personal Term Loan",
    amount: 2500,
    tenure_months: 6,
    monthly_payment: 422.18,
    interest_rate: 4.5,
    total_repayment: 2533.08,
    purpose: "Home electronic equipment & furniture purchase",
    status: "completed",
    created_at: "2026-06-10T14:15:00Z",
  },
];

export const getStoredLoans = (): LoanApplication[] => {
  if (typeof window === "undefined") return INITIAL_LOANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOANS));
      return INITIAL_LOANS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOANS;
  }
};

export const submitLoanApplicationService = async (payload: {
  loan_type: string;
  amount: number;
  tenure_months: number;
  purpose: string;
  collateral_accepted: boolean;
}): Promise<{ success: boolean; loan: LoanApplication; message: string }> => {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 600));

  const typeConfig = LOAN_TYPES.find((t) => t.label === payload.loan_type) || LOAN_TYPES[0];
  const interest_rate = typeConfig.rate;
  const monthlyRate = interest_rate / 100 / 12;
  const n = payload.tenure_months;

  // Monthly amortized payment
  const monthly_payment =
    monthlyRate === 0
      ? payload.amount / n
      : (payload.amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);

  const total_repayment = monthly_payment * n;

  const newLoan: LoanApplication = {
    id: `LN-${Math.floor(100000 + Math.random() * 900000)}`,
    loan_type: payload.loan_type,
    amount: payload.amount,
    tenure_months: payload.tenure_months,
    monthly_payment: Math.round(monthly_payment * 100) / 100,
    interest_rate,
    total_repayment: Math.round(total_repayment * 100) / 100,
    purpose: payload.purpose,
    status: "under_review",
    created_at: new Date().toISOString(),
  };

  const current = getStoredLoans();
  const updated = [newLoan, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to store loan application", err);
  }

  return {
    success: true,
    loan: newLoan,
    message: "Your loan application has been submitted for underwriting review.",
  };
};
