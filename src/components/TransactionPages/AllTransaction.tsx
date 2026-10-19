import React from "react";
import ReusableTable from "../../utility/ReusableTable";
import type { TableColumnProps, Transaction } from "../../lib/interfaces";
import ActionCell from "../ui/ActionCell";
import ViewTransactionModal from "../modal/ViewTransactionModal";
import {
  formatISODateToCustom,
} from "../../helpers/formatterUtility";
import { useTransactionLedger } from "../../hooks/useClientData";

interface AllTransactionsTabProps {
  type?: "deposit" | "withdrawal" | "transfer";
}

export default function AllTransactionsTab({
  type,
}: AllTransactionsTabProps = {}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const { data, isLoading, error } = useTransactionLedger(
    currentPage,
    itemsPerPage,
    type,
  );
  const items = data?.items ?? [];

  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [viewModal, setViewModal] = React.useState(false);

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
            <span className="font-semibold text-[#172b4d] text-[11px]">
              {title}
            </span>
            <span className="text-[9px] text-gray-400 font-mono">
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
          className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold capitalize ${item.type === "deposit" ? "bg-green-100 text-green-600" : item.type === "transfer" ? "bg-blue-100 text-blue-600" : "bg-primary/10 text-primary"}`}
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
            className={`font-semibold text-[11px] ${isPositive ? "text-green-600" : "text-[#172b4d]"}`}
          >
            {isPositive ? `${formatted}` : `${formatted}`}
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
          return <span className="text-[11px]">PC Bank Instant</span>;
        if (net === "Wire Transfer" || net === "external")
          return <span className="text-[11px]">Federal Wire Clearing</span>;
        if (net === "TRC20")
          return <span className="text-[11px]">TRC-20 Clearing Rail</span>;
        if (net === "ERC20")
          return <span className="text-[11px]">ERC-20 Clearing Rail</span>;
        return <span className="text-[11px]">{net}</span>;
      },
    },
    {
      label: "DATE",
      key: "date",
      render: (item) => (
        <span className="text-gray-600 text-[11px]">
          {formatISODateToCustom(item.date) || "-"}
        </span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item) => (
        <span
          className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold capitalize ${item.status === "completed" || item.status === "approved" ? "bg-green-100 text-green-600" : item.status === "rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}
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
            const row = items.find(
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
      <div className="space-y-3">
        <ReusableTable
          isLoading={isLoading}
          error={error}
          data={items}
          columns={columns}
          currentPage={currentPage}
          totalPages={data?.totalPages ?? 1}
          totalItems={data?.total ?? items.length}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
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
  );
}
