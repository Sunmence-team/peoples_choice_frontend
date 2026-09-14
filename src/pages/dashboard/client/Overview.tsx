import React from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  ChevronDown,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { IoMdArrowForward } from "react-icons/io";
import { ActionCard } from '../../../components/cards/ActionCard';
import ActionCell from '../../../components/ui/ActionCell';
import ReusableTable from '../../../utility/ReusableTable';
import { formatISODateToCustom } from '../../../helpers/formatterUtility';
import { assets } from '../../../assets/assets';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { transactions } from '../../../lib/data';

export default function Overview() {

  const [selectedTransaction, setSelectedTransaction] = React.useState<any>(null)
  const [viewModal, setViewModal] = React.useState(false)

  const { user } = useUser();

  const navigate = useNavigate()

  const balance = 2450
  const percentage = 2.4
  const totlaDeposit = 2750
  const totalwithdrawl = 5200

  const columns = [
    {
      label: "TRANSACTION ID",
      key: "transaction_id",
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <img
            src={assets.ether}
            alt="ehterium logo"
            width="8%"
          />
          {item.transaction_id || "-"}
        </div>
      ),
    },
    {
      label: "TYPE",
      key: "type",
      render: (item: any) => (
        <span className={`px-3 py-1 rounded-xl font-medium ${item.type === "deposit" ? "bg-green-100 text-green-500" : item.type === "withdrawl" ? "bg-primary/10 text-primary" : "bg-gray-100 text-black"}`}>
          {item.type}
        </span>
      )
    },
    {
      label: "AMOUNT (USDT)",
      key: "amount",
      render: (item: any) => item.amount || "-",
    },
    {
      label: "NETWORK",
      key: "network",
      render: (item: any) => item.network || "-",
    },
    {
      label: "DATE & TIME",
      key: "date & time",
      render: (item: any) => (formatISODateToCustom(`${item.date} | ${item.time}`)) || "-",
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: any) => (
        <span className={`px-3 py-1 rounded-xl font-medium ${item.status === "completed" ? "bg-green-100 text-green-500" : item.status === "pending" ? "bg-gray-100 text-black" : "bg-primary/10 text-primary"}`}>
          {item.status}
        </span>
      )
    },
    {
      label: "Action",
      key: "action",
      render: (item: any) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id)}
          onView={() => {
            setSelectedTransaction(item);
            setViewModal(true);
          }}
        />
      )
    },
  ];

  return (
    <>

      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          Good morning, {user?.first_name}
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          Manage your funds, deposits and withdrawals securely.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]'>
        <div className="relative min-h-[140px] overflow-hidden flex gap-6  rounded-xl bg-[#0B2D5B] p-4 text-white shadow-sm border-r-white">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/[0.03]" />

          <div className=' flex flex-col gap-3'>
            <div className="flex items-center gap-1.5 text-[8px] text-[#d9e4f0]">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10">
                <Wallet size={20} />
              </span>
              <p className='text-[14px]'>Available Wallet Balance</p>
              <ChevronDown size={20} />
            </div>

            <div className="mt-2 flex items-end gap-1.5">
              <span className="text-[30px] font-bold leading-none tracking-[-1px]">
                {balance}.00
              </span>
              <span className="mb-0.5 text-[9px] font-semibold text-[#dce8f5]">
                USDT
              </span>
            </div>

            <div className='flex items-center gap-4'>
              <div className="mt-2 flex items-center gap-1 text-[8px] text-[#35d27d]">
                <span>↗</span>
                <span>+{percentage} this week</span>
              </div>

              <p className="mt-1 text-[8px] text-[#b9cadc]">
                ≈ ${balance}.00
              </p>

            </div>


            <div className=" flex gap-2">
              <button className="rounded-md bg-[#16a34a] px-3 py-2 text-[8px] font-semibold text-white">
                Deposit USDT
              </button>

              <button className="rounded-md border border-white/30 px-3 py-1.5 text-[8px] font-semibold text-white">
                Withdraw
              </button>
            </div>

          </div>

          <div className=" border-l border-white/10 pl-5 mt-5">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f7ef] text-[#16a34a]">
                <ArrowDownToLine size={18} />
              </div>

              <div>
                <p className="text-[14px] text-[#8794a5]">
                  Total Deposited
                </p>
                <p className="mt-1 text-[20px] font-bold">
                  ${totlaDeposit}.00 USDT
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4fb] text-[#0B2D5B]">
                <ArrowUpFromLine size={18} />
              </div>

              <div>
                <p className="text-[14px] text-[#8794a5]">
                  Total Withdrawn
                </p>
                <p className="mt-1 text-[20px] font-bold">
                  ${totalwithdrawl}.00 USDT
                </p>
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
            />

            <ActionCard
              icon={<ArrowUpFromLine size={13} />}
              title="Withdraw Funds"
              description="Request a withdrawal"
            />

            <ActionCard
              icon={<BarChart3 size={13} />}
              title="Transaction History"
              description="Track your activity"
            />

            <ActionCard
              icon={<UserRound size={13} />}
              title="Manage Profile"
              description="Update your details"
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

    </>
  )
}
