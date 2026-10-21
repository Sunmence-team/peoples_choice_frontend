import React from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Landmark,
  CreditCard,
  Gift,
} from "lucide-react";
import { ActionCard } from "../../../components/cards/ActionCard";
import ActionCell from "../../../components/ui/ActionCell";
import ReusableTable from "../../../utility/ReusableTable";
import { useUser } from "../../../hooks/useUser";
import {
  useDashboard,
  useTransactionLedger,
} from "../../../hooks/useClientData";
import { useNavigate } from "react-router-dom";
import type { TableColumnProps, Transaction } from "../../../lib/interfaces";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";
import { getBankAccountNumber } from "../../../services/transferServices";
import { Eye, EyeOff } from "lucide-react";
import {
  formatCompactAmount,
  formatISODateToCustom,
} from "../../../helpers/formatterUtility";
import { useKYCStatus } from "../../../hooks/useClientData";
import { MdArrowOutward } from "react-icons/md";

export default function Overview() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { data: kycStatus } = useKYCStatus();
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    data: ledger,
    isLoading: ledgerLoading,
    error: ledgerError,
  } = useTransactionLedger(currentPage, 5);

  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [viewModal, setViewModal] = React.useState(false);
  const [showBalance, setShowBalance] = React.useState(false);

  const balance = stats?.wallet_balance ?? 0;
  const totlaDeposit = stats?.total_deposited ?? 0;
  const totalwithdrawl = stats?.total_withdrawn ?? 0;
  const recentTransactions = ledger?.items ?? [];
  const accountNumber = getBankAccountNumber(user);

  const columns: TableColumnProps<Transaction>[] = [
    {
      label: "DESCRIPTION / BENEFICIARY",
      key: "transaction_id",
      render: (item) => {
        const title =
          item.type === "transfer"
            ? item.recipient_name
              ? `Transfer to ${item.recipient_name}`
              : "Internal Transfer"
            : item.type === "deposit"
              ? "Direct Deposit / Inflow"
              : item.recipient_name
                ? `Wire to ${item.recipient_name}`
                : `External Wire (${item.network || "Payout"})`;

        return (
          <div className="flex flex-col">
            <span className="font-semibold text-[#172b4d] text-[11px] leading-tight">
              {title}
            </span>
            <span className="text-[9px] text-gray-400 font-mono mt-0.5">
              Ref: {item.transaction_id || "-"}
            </span>
          </div>
        );
      },
    },
    {
      label: "TYPE",
      key: "type",
      render: (item) => (
        <span
          className={`px-2 py-0.5 rounded-md font-medium capitalize text-[9.5px] ${
            item.type === "deposit"
              ? "bg-green-100 text-green-700"
              : item.type === "transfer"
                ? "bg-blue-100 text-blue-700"
                : "bg-primary/10 text-primary"
          }`}
        >
          {item.type}
        </span>
      ),
    },
    {
      label: "AMOUNT (USD)",
      key: "amount",
      render: (item) => {
        const raw =
          typeof item.amount === "number"
            ? item.amount
            : parseFloat(String(item.amount).replace(/[^0-9.-]/g, "")) || 0;
        const formatted = raw.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const isPositive = item.type === "deposit";
        return (
          <span
            className={`font-semibold text-[11px] ${
              isPositive ? "text-green-600" : "text-[#172b4d]"
            }`}
          >
            {isPositive ? `+$${formatted}` : `-$${formatted}`}
          </span>
        );
      },
    },
    {
      label: "CHANNEL",
      key: "network",
      render: (item) => {
        const net = item.network || "-";
        if (net === "Internal Transfer" || net === "internal")
          return "PC Bank Instant";
        if (net === "Wire Transfer" || net === "external")
          return "Federal Wire Clearing";
        if (net === "TRC20") return "TRC-20 Clearing Rail";
        if (net === "ERC20") return "ERC-20 Clearing Rail";
        return net;
      },
    },
    {
      label: "DATE",
      key: "date",
      render: (item) => formatISODateToCustom(item.date) || "-",
    },
    {
      label: "STATUS",
      key: "status",
      render: (item) => (
        <span
          className={`px-2 py-0.5 rounded-md font-medium text-[9.5px] capitalize ${
            item.status === "completed" || item.status === "approved"
              ? "bg-green-100 text-green-700"
              : item.status === "pending"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {item.status === "completed" || item.status === "approved"
            ? "Completed"
            : item.status === "pending"
              ? "Pending"
              : item.status}
        </span>
      ),
    },
    {
      label: "Action",
      key: "action",
      render: (item) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id ?? 0)}
          onView={(id) => {
            const row = recentTransactions.find(
              (transactionItem) => Number(transactionItem.id) === id,
            );
            if (row) {
              setSelectedTransaction(row);
              setViewModal(true);
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 sm:mb-5">
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#0B2D5B]">
          Good morning, {user?.first_name}
        </h1>
        <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
          Manage your account funds, transfers, deposits and withdrawals
          securely.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="relative min-h-[130px] sm:min-h-[140px] overflow-hidden rounded-xl bg-[#0B2D5B] p-3.5 sm:p-4 text-white shadow-sm">
          {/* Background decoration */}
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/5 pointer-events-none" />

          {/* Main content */}
          <div className="relative flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* Account Balance */}
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-2.5">
              {/* Header */}
              <div className="flex items-center gap-2 text-[#d9e4f0]">
                <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10">
                  <Landmark size={16} />
                </span>

                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-medium leading-tight text-white/90">
                    Available Account Balance
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#a5c0dc] truncate">
                    Acct: {accountNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBalance((prev) => !prev)}
                  className="shrink-0 cursor-pointer ml-auto p-1 text-white/80 hover:text-white"
                  title={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Balance */}
              <div className="mt-0.5 sm:mt-1 flex items-end gap-1.5">
                <span className="break-all text-[19px] sm:text-[23px] font-bold leading-none tracking-tight">
                  {statsLoading
                    ? "..."
                    : showBalance
                      ? `${formatCompactAmount(Number(balance))}`
                      : "*******"}
                </span>

                <span className="mb-0.5 shrink-0 text-[8.5px] font-semibold text-[#dce8f5]">
                  USD
                </span>
              </div>

              {kycStatus && (
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                  {kycStatus?.is_verified ||
                  kycStatus?.kyc_status === "verified" ? (
                    ""
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/kyc")}
                      className="rounded-sm bg-amber-400/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-200 border border-amber-400/30 hover:bg-amber-400/30 transition cursor-pointer"
                    >
                      Complete KYC
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 pt-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/transfer")}
                  className="w-full sm:w-auto text-center justify-center cursor-pointer rounded-md bg-tertiary px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-white transition hover:opacity-90"
                >
                  Transfer Money
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/deposit")}
                  className="w-full sm:w-auto text-center justify-center cursor-pointer rounded-md border border-white/30 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-white transition hover:bg-white/10"
                >
                  Deposit
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/withdrawl")}
                  className="w-full sm:w-auto text-center justify-center cursor-pointer rounded-md border border-white/30 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-white transition hover:bg-white/10"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/10 lg:h-auto lg:w-px lg:self-stretch" />

            {/* Deposit / Withdrawal Stats */}
            <div className="flex w-full lg:flex-col justify-between gap-3.5 sm:gap-4 lg:w-auto lg:min-w-[240px] lg:pt-2">
              {/* Total Deposited */}
              <div className="flex items-center sm:items-start gap-2.5 sm:gap-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f7ef] text-[#16a34a]">
                  <ArrowDownToLine size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-[#a5c0dc]">
                    Total Inflow / Deposited
                  </p>

                  <p className="mt-0.5 break-words text-[13px] sm:text-[15px] font-bold text-white">
                    {formatCompactAmount(Number(totlaDeposit))}
                    <span></span> USD
                  </p>
                </div>
              </div>

              {/* Total Withdrawn */}
              <div className="flex items-center sm:items-start gap-2.5 sm:gap-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#0B2D5B]">
                  <ArrowUpFromLine size={14} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-[#a5c0dc]">
                    Total Outflow / Withdrawn
                  </p>

                  <p className="mt-0.5 break-words text-[13px] sm:text-[15px] font-bold text-white">
                    {formatCompactAmount(Number(totalwithdrawl))}
                    <span></span>
                    USD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-[#e3eaf2] bg-white p-2.5 sm:p-3 shadow-sm">
          <h2 className="mb-2 text-[10px] sm:text-[11px] font-bold text-[#172b4d]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <ActionCard
              icon={<CreditCard size={13} />}
              title="Loans & Credit"
              description="Instant facility & calculator"
              onClick={() => navigate("/dashboard/loans")}
            />

            <ActionCard
              icon={<Gift size={13} />}
              title="Referral History"
              description="Bonus rewards & invite link"
              onClick={() => navigate("/dashboard/referrals")}
            />

            <ActionCard
              icon={<ArrowUpFromLine size={13} />}
              title="Withdraw Funds"
              description="External wire & payout"
              onClick={() => navigate("/dashboard/withdrawl")}
            />

            <ActionCard
              icon={<BarChart3 size={13} />}
              title="Transaction History"
              description="Statements & activity"
              onClick={() => navigate("/dashboard/transaction-history")}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <h2 className="text-primary font-bold text-sm sm:text-base">
            Recent Transactions
          </h2>

          <button
            type="button"
            className="cursor-pointer flex items-center hover:underline text-[11px] sm:text-xs text-primary font-semibold hover:underline"
            onClick={() => navigate("/dashboard/transaction-history")}
          >
            View all <MdArrowOutward size={13} />
          </button>
        </div>

        <ReusableTable
          isLoading={ledgerLoading}
          error={ledgerError}
          data={recentTransactions}
          columns={columns}
          currentPage={currentPage}
          totalPages={ledger?.totalPages ?? 1}
          totalItems={ledger?.total ?? recentTransactions.length}
          setCurrentPage={setCurrentPage}
          itemsPerPage={5}
          setItemsPerPage={() => {}}
          hasSerialNo={true}
          showPagination={false}
        />
      </div>

      {viewModal && (
        <ViewTransactionModal
          transaction={selectedTransaction}
          onClose={() => {
            setViewModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </>
  );
}
