import api from "../helpers/api";
import { unwrap } from "../helpers/response";

export interface ReferralRecord {
  id: string | number;
  name: string;
  email?: string;
  date_joined?: string;
  registered_at?: string;
  status: "verified" | "funded" | "pending" | "registered";
  reward_amount: number;
  reward_status: "credited" | "pending" | "paid";
}

export interface ReferralSummary {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  verifiedReferrals: number;
  totalBonusEarned: number;
  pendingBonus: number;
  bonusPerReferral: number;
  referrals: ReferralRecord[];
}

export interface ApiReferralResponse {
  referral_code?: string;
  referral_link?: string;
  total_referrals?: number;
  total_earned?: number | string;
  pending_rewards?: number | string;
  referred_users?: Array<{
    id: number | string;
    name: string;
    email?: string;
    status: "verified" | "funded" | "pending" | "registered";
    reward_amount: number | string;
    reward_status: "paid" | "pending" | "credited";
    registered_at?: string;
    date_joined?: string;
  }>;
}

/**
 * 7.2 User Referral Dashboard / Stats (GET /api/user/referrals)
 */
export const fetchReferralStatsService = async (
  username?: string,
  userId?: string | number
): Promise<ReferralSummary> => {
  const defaultCode = (username || (userId ? `PCB-${userId}` : "PCB-VIP100"))
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
  const origin = typeof window !== "undefined" ? window.location.origin : "https://peopleschoicebk.com";

  const res = await api.get("/user/referrals");
  const data = unwrap<ApiReferralResponse>(res.data);

  const refCode = data?.referral_code || defaultCode;
  const refLink = data?.referral_link || `${origin}/register?ref=${refCode}`;

  const records: ReferralRecord[] = (data?.referred_users || []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    date_joined: u.registered_at || u.date_joined,
    status: u.status,
    reward_amount:
      typeof u.reward_amount === "number"
        ? u.reward_amount
        : parseFloat(u.reward_amount) || 0,
    reward_status: u.reward_status === "paid" ? "credited" : "pending",
  }));

  const total = data?.total_referrals ?? records.length;
  const verified = records.filter(
    (r) => r.status === "verified" || r.status === "funded"
  ).length;
  const totalEarned = Number(data?.total_earned) || 0;
  const pending = Number(data?.pending_rewards) || 0;

  return {
    referralCode: refCode,
    referralLink: refLink,
    totalReferrals: total,
    verifiedReferrals: verified,
    totalBonusEarned: totalEarned,
    pendingBonus: pending,
    bonusPerReferral: 50.0,
    referrals: records,
  };
};

export const getReferralSummary = (
  username?: string,
  userId?: string | number
): ReferralSummary => {
  const code = (username || (userId ? `PCB-${userId}` : "PCB-VIP100"))
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
  const origin = typeof window !== "undefined" ? window.location.origin : "https://peopleschoicebk.com";

  return {
    referralCode: code,
    referralLink: `${origin}/register?ref=${code}`,
    totalReferrals: 0,
    verifiedReferrals: 0,
    totalBonusEarned: 0,
    pendingBonus: 0,
    bonusPerReferral: 50.0,
    referrals: [],
  };
};
