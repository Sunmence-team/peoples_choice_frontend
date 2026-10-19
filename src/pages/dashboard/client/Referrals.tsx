import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users,
  Copy,
  Check,
  CheckCircle2,
  DollarSign,
  Clock,
  Loader2,
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import {
  fetchReferralStatsService,
  type ReferralRecord,
  type ReferralSummary,
} from "../../../services/referralServices";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import OverviewCards from "../../../components/cards/OverviewCards";

export default function Referrals() {
  const { user } = useUser();
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [search, setSearch] = useState("");

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchReferralStatsService(user?.username, user?.id)
      .then((res) => {
        setSummary(res);
        setReferrals(res.referrals || []);
      })
      .catch((err) => {
        console.error("Failed to load referrals", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user?.username, user?.id]);

  const handleCopyCode = async () => {
    if (!summary?.referralCode) return;
    try {
      await navigator.clipboard.writeText(summary.referralCode);
      setCopiedCode(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleCopyLink = async () => {
    if (!summary?.referralLink) return;
    try {
      await navigator.clipboard.writeText(summary.referralLink);
      setCopiedLink(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-4">
        <h1 className="text-base sm:text-lg font-bold text-primary">
          Referral Program & History
        </h1>
        <p className="hidden md:block mt-0.5 text-xs font-medium text-gray-500">
          Earn a cash award for every verified friend who registers and funds
          their People's Choice Bank account.
        </p>
      </div>

      {/* Top Stat Cards using Reusable OverviewCards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <OverviewCards
          title="Total Invites"
          value={isLoading ? "..." : (summary?.totalReferrals ?? 0)}
          icon={Users}
          className="mt-0"
        />
        <OverviewCards
          title="Active / Verified"
          value={isLoading ? "..." : (summary?.verifiedReferrals ?? 0)}
          icon={CheckCircle2}
          className="mt-0"
        />
        <OverviewCards
          title="Total Bonus Earned"
          value={
            isLoading
              ? "..."
              : `$${(summary?.totalBonusEarned ?? 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}`
          }
          icon={DollarSign}
          className="mt-0"
        />
        <OverviewCards
          title="Pending Bonus"
          value={
            isLoading
              ? "..."
              : `$${(summary?.pendingBonus ?? 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}`
          }
          icon={Clock}
          className="mt-0"
        />
      </div>

      {/* Referral Link & Explainer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-5 mb-4 sm:mb-5">
        {/* Link Share Box */}
        <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-primary mb-2">
              <h2 className="text-xs sm:text-[13px] font-bold text-primary">
                Your Exclusive Referral Link
              </h2>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-gray-500 mb-3 leading-relaxed">
              Earn a <strong className="text-primary">cash bonus</strong>{" "}
              credited directly to your checking account for every friend who
              opens and funds an account.
            </p>

            {/* Referral Link input */}
            <div className="mb-3">
              <label className="block text-[10.5px] font-semibold text-gray-500 mb-1">
                Direct Invitation URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={
                    !isLoading
                      ? `https://peopleschoicebk.com/signup?ref=${summary?.referralCode}`
                      : "Loading..."
                  }
                  className="h-9 w-full rounded-lg border border-secondary bg-gray-50 px-3 text-xs text-gray-700 font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={!summary}
                  className="h-9 px-3.5 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-[10.5px] font-semibold text-gray-500 mb-1">
                Your Referral Code
              </label>
              <div className="flex gap-2">
                <div className="h-9 px-3 flex items-center rounded-lg border border-secondary bg-gray-50 text-xs font-mono font-bold text-primary tracking-wider min-w-[140px]">
                  {summary?.referralCode || "..."}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  disabled={!summary}
                  className="h-9 px-3 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary/5 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Program Explainer */}
        <div className="rounded-xl border border-[#d9e4f0] bg-[#f8fafc] p-3.5 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-primary mb-3">
              <h2 className="text-xs sm:text-[13px] font-bold text-primary">
                How People's Choice Bank Referrals Work
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  1
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#172b4d]">
                    Send your referral link
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    Share your unique link or code with colleagues and friends.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  2
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#172b4d]">
                    Friend registers & funds
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    They open an account and deposit their initial checking
                    funds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary text-[10px] font-bold text-white">
                  3
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#172b4d]">
                    Both receive cash bonus
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    Your cash award is credited automatically to your USD
                    balance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 rounded-lg bg-white p-2 border border-secondary text-center text-[10px] text-gray-500">
            No limit on the number of friends you can invite.
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="rounded-xl border border-secondary bg-white p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs sm:text-[13px] font-bold text-primary">
              Referral Activity
            </h2>
          </div>

          {/* Search filter */}
          {/* <div className="w-full sm:w-60">
            <input
              type="text"
              placeholder="Search invitees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-lg border border-secondary bg-gray-50 px-3 text-[11px] text-primary outline-none focus:border-primary transition"
            />
          </div> */}
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs font-semibold">
              No referrals found matching your query.
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Share your link above to start earning referral rewards.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] font-semibold text-gray-400 uppercase">
                  <th className="py-2 px-2">Invitee Name</th>
                  {/* <th className="py-2 px-2">Contact / Email</th> */}
                  <th className="py-2 px-2">Date Joined</th>
                  <th className="py-2 px-2">Account Status</th>
                  <th className="py-2 px-2">Reward Bonus</th>
                  <th className="py-2 px-2 text-right">Reward Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {referrals.map((item) => {
                  const isFunded = item.status === "funded";
                  const isVerified = item.status === "verified";
                  const isCredited = item.reward_status === "credited";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="py-2.5 px-2 font-semibold text-[#172b4d] text-[11px]">
                        {item.name}
                      </td>
                      {/* <td className="py-2.5 px-2 font-mono text-[10.5px] text-gray-500">
                        {item.email || "—"}
                      </td> */}
                      <td className="py-2.5 px-2 text-gray-500 text-[10.5px]">
                        {item.date_joined
                          ? formatISODateToCustom(item.date_joined) ||
                            item.date_joined.slice(0, 10)
                          : "—"}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold capitalize ${
                            isFunded
                              ? "bg-green-100 text-green-700"
                              : isVerified
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-bold text-green-600 text-[11px]">
                        +${item.reward_amount.toFixed(2)} USD
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold capitalize ${
                            isCredited
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isCredited ? "Credited" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
