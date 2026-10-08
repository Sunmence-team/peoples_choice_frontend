import React from "react";
import { LuUsersRound, LuWallet } from "react-icons/lu";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { TbReceiptDollar } from "react-icons/tb";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import OverviewCards from "../../../components/cards/OverviewCards";
import ReusableTable from "../../../utility/ReusableTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import {
  adminBalances,
  adminDeposits,
  adminTransactions,
  adminUsers,
  adminWithdrawals,
} from "../../../lib/adminData";
import {
  formatISODateToCustom,
  formatterUtility,
} from "../../../helpers/formatterUtility";

const Overview: React.FC = () => {
  const totalWalletValue = adminBalances.reduce(
    (sum, item) => sum + item.balance,
    0,
  );
  const pendingDeposits = adminDeposits.filter(
    (item) => item.status === "pending",
  );
  const pendingWithdrawals = adminWithdrawals.filter(
    (item) => item.status === "pending",
  );

  const columns = [
    {
      label: "TRANSACTION ID",
      key: "transaction_id",
      render: (item: (typeof adminTransactions)[number]) => (
        <span className="font-semibold">{item.transaction_id}</span>
      ),
    },
    {
      label: "USER",
      key: "user_name",
      render: (item: (typeof adminTransactions)[number]) => item.user_name,
    },
    {
      label: "TYPE",
      key: "type",
      render: (item: (typeof adminTransactions)[number]) => (
        <span
          className={`px-3 py-1 rounded-xl font-medium capitalize ${
            item.type === "deposit"
              ? "bg-green-100 text-green-600"
              : "bg-primary/10 text-primary"
          }`}
        >
          {item.type}
        </span>
      ),
    },
    {
      label: "NETWORK",
      key: "network",
      render: (item: (typeof adminTransactions)[number]) => item.network,
    },
    {
      label: "AMOUNT",
      key: "amount",
      render: (item: (typeof adminTransactions)[number]) => (
        <span className="font-semibold">{item.amount}.00 USDT</span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: (typeof adminTransactions)[number]) => (
        <StatusBadge status={item.status} />
      ),
    },
    {
      label: "DATE & TIME",
      key: "date",
      render: (item: (typeof adminTransactions)[number]) =>
        formatISODateToCustom(item.date),
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          Admin Dashboard
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          Monitor users, wallet balances, deposits and withdrawals.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 mt-6">
        <OverviewCards
          icon={LuUsersRound}
          title="Total Users"
          value={adminUsers.length}
          icon2={HiOutlineArrowTrendingUp}
        />

        <OverviewCards
          icon={LuWallet}
          title="Total Wallet Value"
          value={formatterUtility(totalWalletValue)}
          icon2={HiOutlineArrowTrendingUp}
        />

        <OverviewCards
          icon={IoArrowDown}
          title="Pending Deposits"
          value={pendingDeposits.length}
          icon2={HiOutlineArrowTrendingUp}
        />

        <OverviewCards
          icon={IoArrowUp}
          title="Pending Withdrawals"
          value={pendingWithdrawals.length}
          icon2={HiOutlineArrowTrendingUp}
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-primary font-bold text-xl mb-5">
            Recent Transactions
          </h2>
          <span className="flex items-center gap-1 text-[12px] text-[#8190a3]">
            <TbReceiptDollar size={14} /> {adminTransactions.length} records
          </span>
        </div>

        <ReusableTable
          isLoading={false}
          error={false}
          data={adminTransactions}
          columns={columns}
          currentPage={1}
          totalPages={1}
          totalItems={adminTransactions.length}
          setCurrentPage={() => {}}
          itemsPerPage={10}
          setItemsPerPage={() => {}}
          hasSerialNo={true}
        />
      </div>
    </>
  );
};

export default Overview;