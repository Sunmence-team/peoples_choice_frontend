import React from "react";
import OverviewCards from "../../../components/cards/OverviewCards";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { formatISODateToCustom, formatterUtility } from "../../../helpers/formatterUtility";
import { useUser } from "../../../hooks/useUser";
import { FaHourglassHalf } from "react-icons/fa";
import {
  IoArrowDown,
  IoArrowUp,
  IoWalletOutline
} from "react-icons/io5";
import {
  ArrowUpRight,
  Download,
  FileDown,
  LockKeyhole,
  Plus,
  Shield,
} from "lucide-react";
import ActionCard from "../../../components/cards/ActionCard";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";

const Overview: React.FC = () => {

  const [selectedTransaction, setSelectedTransaction] = React.useState<any[]>(null)
  const [viewModal, setViewModal] = React.useState(false)

  const { user } = useUser();

  const columns = [
    {
      label: "TRANSACTION ID",
      key: "transaction_id",
      render: (item: any) => item.transaction_id || "-",
    },
    {
      label: "TYPE",
      key: "type",
      render: (item: any) => item.type || "-",
    },
    {
      label: "AMOUNT (USDT)",
      key: "phone",
      render: (item: any) => item.amount || "-",
    },
    {
      label: "NETWORK",
      key: "orders",
      render: (item: any) => item.network || "-",
    },
    {
      label: "DATE & TIME",
      key: "total_spent",
      render: (item: any) => (formatISODateToCustom(`${item.date} | ${item.time}`)) || "-",
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: any) => (
        <span className={`px-3 py-1 rounded-xl font-medium ${item.status === "completed" ? "bg-green-100 text-green-500" : item.status === "pending" ? "bg-gray-100 text-black" : "bg-primary/10 text-primary"}`}>
          {item.statused}
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

  const data = [
    {
      transaction_id: ""
    }
  ]

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">
            Welcome <span className="capitalize">{user?.role}</span>
          </h2>
          <p className="text-sm text-gray-500">
            Here is an overview of your wallet activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
        <OverviewCards
          icon={IoWalletOutline}
          title="Total Wallet Ballance"
          value={formatterUtility(0)}
          icon2={HiOutlineArrowTrendingUp}
          className="bg-primary border"
        />

        <OverviewCards
          icon={IoArrowDown}
          title="Total Deposit"
          value={formatterUtility(0)}
          icon2={HiOutlineArrowTrendingUp}
        />

        <OverviewCards
          icon={IoArrowUp}
          title="Total Withdral"
          value={formatterUtility(0)}
          icon2={HiOutlineArrowTrendingUp}
        />

        <OverviewCards
          icon={FaHourglassHalf}
          title="Pending Transaction"
          value={formatterUtility(0)}
          icon2={HiOutlineArrowTrendingUp}
        />
      </div>

      {/* Header */}
      <div className="mb-4 flex items-start justify-between mt-6">
        <div>
          <h2 className="text-[20px] font-semibold leading-none text-[#07152E]">
            Quick Action
          </h2>

          <p className="mt-1 text-[12px] text-[#687084]">
            Execute institutional-grade deposits, withdrawals, and ledger controls.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Deposit */}
        <ActionCard
          title="Deposit USDT"
          description="Add funds using TRC-20 or ERC-20 networks with instant receipt submission and automated settlement."
          buttonText="Deposit Now"
          icon={Plus}
          badge="0.00% Instant Fee"
          dark
          buttonIcon={ArrowUpRight}
        />

        {/* Withdrawal */}
        <ActionCard
          title="Withdraw Funds"
          description="Submit manual withdrawal request to your verified whitelisted destination address under high security protocol."
          buttonText="Request Payout"
          icon={ArrowUpRight}
          badge="Tier 2 Limit"
          buttonIcon={ArrowUpRight}
        />

        {/* Statement */}
        <ActionCard
          title="Download Statement"
          description="Generate official bank-stamped accounting statements for fiscal audits, tax reconciliation, and corporate filings."
          buttonText="Export Records"
          icon={Download}
          badge="CSV / PDF"
          buttonIcon={FileDown}
        />

        {/* Security */}
        <ActionCard
          title="Security Settings"
          description="Manage multi-signature approval rules, configure hardware tokens, and whitelist counterparty recipient addresses."
          buttonText="Vault Preferences"
          icon={Shield}
          badge="Shield Armed"
          badgeIcon={Shield}
          buttonIcon={LockKeyhole}
        />
      </div>

      <div>
        <h2>Recent Transactions</h2>

        <ReusableTable
          isLoading={false}
          error={error}
          data={null}
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

      {
        viewModal && (
          <ViewTransactionModal />
        )
      }
    </div>
  );
};

export default Overview;
