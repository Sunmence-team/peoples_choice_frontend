export interface ReferralRecord {
  id: string;
  name: string;
  email: string;
  date_joined: string;
  status: "verified" | "funded" | "pending";
  reward_amount: number;
  reward_status: "credited" | "pending";
}

export interface ReferralSummary {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  verifiedReferrals: number;
  totalBonusEarned: number;
  pendingBonus: number;
  bonusPerReferral: number;
}

const STORAGE_KEY = "pc_bank_referrals_v1";

const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: "REF-001",
    name: "Brandon Hayes",
    email: "b.hayes***@gmail.com",
    date_joined: "2026-10-12T11:20:00Z",
    status: "funded",
    reward_amount: 50.0,
    reward_status: "credited",
  },
  {
    id: "REF-002",
    name: "Catherine Wu",
    email: "c.wu99***@yahoo.com",
    date_joined: "2026-10-08T15:45:00Z",
    status: "funded",
    reward_amount: 50.0,
    reward_status: "credited",
  },
  {
    id: "REF-003",
    name: "Marcus Vance",
    email: "m.vance***@outlook.com",
    date_joined: "2026-09-28T09:10:00Z",
    status: "verified",
    reward_amount: 50.0,
    reward_status: "credited",
  },
  {
    id: "REF-004",
    name: "Jessica Alvarez",
    email: "j.alvarez***@gmail.com",
    date_joined: "2026-09-19T18:05:00Z",
    status: "funded",
    reward_amount: 50.0,
    reward_status: "credited",
  },
  {
    id: "REF-005",
    name: "Liam O'Connor",
    email: "liam.oc***@proton.me",
    date_joined: "2026-09-02T13:30:00Z",
    status: "pending",
    reward_amount: 50.0,
    reward_status: "pending",
  },
];

export const getStoredReferrals = (): ReferralRecord[] => {
  if (typeof window === "undefined") return INITIAL_REFERRALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REFERRALS));
      return INITIAL_REFERRALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REFERRALS;
  }
};

export const getReferralSummary = (username?: string, userId?: string | number): ReferralSummary => {
  const referrals = getStoredReferrals();
  const code = (username || (userId ? `PCB-${userId}` : "PC-CLIENT")).toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const origin = typeof window !== "undefined" ? window.location.origin : "https://peopleschoicebank.com";

  const totalReferrals = referrals.length;
  const verifiedReferrals = referrals.filter((r) => r.status === "funded" || r.status === "verified").length;
  const totalBonusEarned = referrals
    .filter((r) => r.reward_status === "credited")
    .reduce((sum, r) => sum + r.reward_amount, 0);
  const pendingBonus = referrals
    .filter((r) => r.reward_status === "pending")
    .reduce((sum, r) => sum + r.reward_amount, 0);

  return {
    referralCode: code,
    referralLink: `${origin}/signup?ref=${code}`,
    totalReferrals,
    verifiedReferrals,
    totalBonusEarned,
    pendingBonus,
    bonusPerReferral: 50.0,
  };
};
