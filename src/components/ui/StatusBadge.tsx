import React from "react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  verified: "bg-green-100 text-green-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-[#e3eaf2] text-[#0B2D5B]",
  rewarded: "bg-blue-100 text-blue-700",
  repaid: "bg-indigo-100 text-indigo-700",
  registered: "bg-gray-100 text-gray-700",
  frozen: "bg-blue-100 text-blue-600",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-500",
  used: "bg-green-100 text-green-700",
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`px-2.5 py-0.5 rounded-md font-semibold text-[10.5px] capitalize ${
      statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-600"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;