import type { TransactionStatus } from "../../lib/interfaces";

const statusStyles: Record<TransactionStatus, string> = {
  pending: "bg-amber-100 text-amber-600",
  approved: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
  completed: "bg-[#e3eaf2] text-[#0B2D5B]",
};

const StatusBadge = ({ status }: { status: TransactionStatus }) => (
  <span
    className={`px-3 py-1 rounded-xl font-medium capitalize ${statusStyles[status]}`}
  >
    {status}
  </span>
);

export default StatusBadge;