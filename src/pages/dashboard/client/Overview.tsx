import React from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  UserRound,
  Wallet,
} from "lucide-react";
import { IoMdArrowForward } from "react-icons/io";
import { ActionCard } from '../../../components/cards/ActionCard';
import ActionCell from '../../../components/ui/ActionCell';
import ReusableTable from '../../../utility/ReusableTable';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { transactions } from '../../../lib/data';
import type { TableColumnProps, Transaction } from '../../../lib/interfaces';
import ViewTransactionModal from '../../../components/modal/ViewTransactionModal';
import { GoArrowUpRight } from "react-icons/go";
import { Eye, EyeOff } from "lucide-react";

export default function Overview() {

  const { user } = useUser();
  const navigate = useNavigate();

  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [viewModal, setViewModal] = React.useState(false);
  const [showBalance, setShowBalance] = React.useState(false);

  const balance = 2450
  const percentage = 2.4
  const totlaDeposit = 2750
  const totalwithdrawl = 5200

  const columns: TableColumnProps<Transaction>[] = [
    {
      label: "TRANSACTION ID",
      key: "transaction_id",
      render: (item) => item.transaction_id || "-"
    },
    {
      label: "TYPE",
      key: "type",
      render: (item) => (
        <span className={`px-3 py-1 rounded-xl font-medium ${item.type === "deposit" ? "bg-green-100 text-green-500" : item.type === "withdrawal" ? "bg-primary/10 text-primary" : "bg-gray-100 text-black"}`}>
          {item.type}
        </span>
      )
    },
    {
      label: "AMOUNT (USDT)",
      key: "amount",
      render: (item) => item.amount || "-",
    },
    {
      label: "NETWORK",
      key: "network",
      render: (item) => item.network || "-",
    },
    {
      label: "DATE",
      key: "date",
      render: (item) => item.date || "-",
    },
    {
      label: "STATUS",
      key: "status",
      render: (item) => (
        <span className={`px-3 py-1 rounded-xl font-medium ${item.status === "completed" ? "bg-green-100 text-green-500" : item.status === "pending" ? "bg-gray-100 text-black" : "bg-primary/10 text-primary"}`}>
          {item.status}
        </span>
      )
    },
    {
      label: "Action",
      key: "action",
      render: (item) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id ?? 0)}
          onView={(id) => {
            const row = transactions.find((transactionItem) => Number(transactionItem.id) === id);
            if (row) {
              setSelectedTransaction(row);
              setViewModal(true);
            }
          }}
        />
      )
    },
  ];

  return (
    <>

      <div className='mb-6'>
        <h1 className="text-2xl font-bold tracking-[-0.4px] text-[#0B2D5B]">
          Good morning, {user?.first_name}
        </h1>
        <p className="mt-0.5 text-[15px] text-gray-500">
          Manage your funds, deposits and withdrawals securely.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]'>
        <div className="relative min-h-[140px] overflow-hidden rounded-xl bg-[#0B2D5B] p-4 text-white shadow-sm">
          {/* Background decoration */}
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/5" />

          {/* Main content */}
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* Wallet Balance */}
            <div className="flex min-w-0 flex-1 flex-col gap-3">

              {/* Header */}
              <div className="flex items-center gap-2 text-[#d9e4f0]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10">
                  <Wallet size={20} />
                </span>

                <p className="text-[12px] sm:text-[13px]">
                  Available Wallet Balance
                </p>

                <button
                  onClick={() => setShowBalance((prev) => !prev)}
                  className="shrink-0 cursor-pointer"
                >
                  {showBalance ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Balance */}
              <div className="mt-2 flex items-end gap-1.5">
                <span className="break-all text-[26px] font-bold leading-none tracking-[-1px] sm:text-[30px]">
                  {showBalance ? balance.toLocaleString() : "*******"}
                </span>

                <span className="mb-0.5 shrink-0 text-[9px] font-semibold text-[#dce8f5]">
                  USDT
                </span>
              </div>

              {/* Weekly + USD */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div className="flex items-center gap-1 text-[12px] text-tetiary sm:text-[13px]">
                  <GoArrowUpRight size={15} />
                  <span>+{percentage.toLocaleString()} this week</span>
                </div>

                <p className="text-[12px] text-[#b9cadc] sm:text-[13px]">
                  ≈ ${balance}.00
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate("/dashboard/deposit")}
                  className="cursor-pointer rounded-md bg-tetiary px-3 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
                >
                  Deposit USDT
                </button>

                <button
                  onClick={() => navigate("/dashboard/withdrawl")}
                  className="cursor-pointer rounded-md border border-white/30 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-white/10"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/10 lg:h-auto lg:w-px lg:self-stretch" />

            {/* Deposit / Withdrawal Stats */}
            <div className="flex w-full flex-col gap-5 lg:w-auto lg:min-w-[280px] lg:pt-5">

              {/* Total Deposited */}
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f7ef] text-[#16a34a]">
                  <ArrowDownToLine size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] text-[#8794a5] sm:text-[14px]">
                    Total Deposited
                  </p>

                  <p className="mt-1 break-words text-[18px] font-bold sm:text-[20px]">
                    ${totlaDeposit.toLocaleString()}.00 USDT
                  </p>
                </div>
              </div>

              {/* Total Withdrawn */}
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#0B2D5B]">
                  <ArrowUpFromLine size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] text-[#8794a5] sm:text-[14px]">
                    Total Withdrawn
                  </p>

                  <p className="mt-1 break-words text-[18px] font-bold sm:text-[20px]">
                    ${totalwithdrawl.toLocaleString()}.00 USDT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-[#e3eaf2] bg-white p-3.5 shadow-sm">
          <h2 className="mb-2.5 text-[11px] font-bold text-[#172b4d]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <ActionCard
              icon={<ArrowDownToLine size={13} />}
              title="Deposit USDT"
              description="Fund your wallet"
              onClick={() => navigate('/dashboard/deposit')}
            />

            <ActionCard
              icon={<ArrowUpFromLine size={13} />}
              title="Withdraw Funds"
              description="Request a withdrawal"
              onClick={() => navigate('/dashboard/withdrawl')}
            />

            <ActionCard
              icon={<BarChart3 size={13} />}
              title="Transaction History"
              description="Track your activity"

              onClick={() => navigate('/dashboard/transaction-history')}
            />

            <ActionCard
              icon={<UserRound size={13} />}
              title="Manage Profile"
              description="Update your details"
              onClick={() => navigate('/dashboard/profile')}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className='flex justify-between'>
          <h2 className="text-primary font-bold text-xl mb-5">
            Recent Transactions
          </h2>

          <button className='cursor-pointer flex items-center gap-1' onClick={() => navigate('/dashboard/transaction-history')} >
            View all <IoMdArrowForward size={14} />
          </button>

        </div>

        <ReusableTable
          isLoading={false}
          error={false}
          data={transactions}
          columns={columns}
          currentPage={1}
          totalPages={5}
          totalItems={50}
          setCurrentPage={() => { }}
          itemsPerPage={10}
          setItemsPerPage={() => { }}
          hasSerialNo={true}
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
  )
}
