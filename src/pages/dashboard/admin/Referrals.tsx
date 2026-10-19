import React, { useState } from "react";
import { Search } from "lucide-react";
import ReusableTable from "../../../utility/ReusableTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import { useAdminReferrals } from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import type { AdminReferralItem } from "../../../services/adminServices";

const Referrals: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useAdminReferrals({
    page: currentPage,
    per_page: 10,
    status: statusFilter,
    search: search.trim() || undefined,
  });

  const referrals = data?.items ?? [];

  const columns = [
    {
      label: "REFERRER",
      key: "referrer_name",
      render: (item: AdminReferralItem) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[11px] text-[#0B2D5B]">
            {`${item.referrer.first_name} ${item.referrer.last_name}`}
          </span>
          {item.referrer.email && (
            <span className="text-[9.5px] text-gray-400">
              {item.referrer.email}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "REFERRED USER",
      key: "referred_user_name",
      render: (item: AdminReferralItem) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[11px] text-gray-800">
            {`${item.referred.first_name} ${item.referred.last_name}`}
          </span>
          {item.referred.email && (
            <span className="text-[9.5px] text-gray-400">
              {item.referred.email}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "REWARD AMOUNT",
      key: "reward_amount",
      render: (item: AdminReferralItem) => (
        <span className="font-semibold text-[11px] text-green-600">
          $
          {Number(item.reward_amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      label: "REWARD STATUS",
      key: "reward_status",
      render: (item: AdminReferralItem) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
            item.reward_status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {item.reward_status || "Pending"}
        </span>
      ),
    },
    {
      label: "REFERRAL STATUS",
      key: "status",
      render: (item: AdminReferralItem) => <StatusBadge status={item.status} />,
    },
    {
      label: "REGISTRATION DATE",
      key: "created_at",
      render: (item: AdminReferralItem) => (
        <span className="text-[10.5px] text-gray-500">
          {formatISODateToCustom(item.registered_at || item.created_at)}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
            Referral Program Oversight
          </h1>
          <p className="mt-0.5 text-[14px] text-[#8190a3]">
            Track member referrals, registration funnels, KYC verification
            unlocks, and reward disbursements.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            {["all", "registered", "verified", "rewarded"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-primary shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="h-8 pl-8 pr-2.5 rounded-lg border border-[#dfe8f1] bg-white text-xs outline-none focus:border-primary w-40 sm:w-48"
        />
      </div>

      <ReusableTable
        isLoading={isLoading}
        error={error}
        data={referrals}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? referrals.length}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
        setItemsPerPage={() => {}}
        hasSerialNo={true}
      />
    </>
  );
};

export default Referrals;
