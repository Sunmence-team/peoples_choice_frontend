import React from "react";
import ReusableTable from "../../utility/ReusableTable";
import type { TableColumnProps, Transaction } from "../../lib/interfaces";
import ActionCell from "../ui/ActionCell";
import ViewTransactionModal from "../modal/ViewTransactionModal";
import {
  formatISODateToCustom,
  formatterUtility,
  formatUnderScores,
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
  const items: Transaction[] = data?.data?.data ?? [];

  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [viewModal, setViewModal] = React.useState(false);

  const columns: TableColumnProps<Transaction>[] = [
    {
      label: "DESCRIPTION / BENEFICIARY",
      key: "transaction_id",
      render: (item) => {
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-[#172b4d] text-[11px]">
              {item.description.length > 25
                ? `${item.description.slice(0, 25)}...`
                : item.description}
            </span>
            <span className="text-[9px] text-gray-400 font-mono">
              Ref: {item.reference_id || "-"}
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
          className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold capitalize ${item.type === "deposit" ? "bg-green-100 text-green-600" : item.type.includes("transfer") ? "bg-blue-100 text-blue-600" : "bg-primary/10 text-primary"}`}
        >
          {formatUnderScores(item.type)}
        </span>
      ),
    },
    {
      label: "AMOUNT (USD)",
      key: "amount",
      render: (item) => {
        const isPositive =
          item.type === "deposit" ||
          item.type === "transfer_in" ||
          item.type.includes("bonus");
        return (
          <span
            className={`font-semibold text-[11px] ${isPositive ? "text-green-600" : "text-[#172b4d]"}`}
          >
            {isPositive
              ? `+${formatterUtility(Number(`${item.amount}`))}`
              : `-${formatterUtility(Number(`${item.amount}`))}`}
          </span>
        );
      },
    },
    {
      label: "CHANNEL",
      key: "network",
      render: (item) => {
        const type = item.type;
        const tType = item.transactionable?.type;

        if (type.includes("bonus"))
          return (
            <span className="text-[11px] capitalize">Bonus</span>
          );
        if (type === "withdrawal" || type === "deposit")
          return <span className="text-[11px]">USD Clearing</span>;

        return <span className="text-[11px] capitalize">{tType} Transfer</span>;
      },
    },
    {
      label: "DATE",
      key: "date",
      render: (item) => (
        <span className="text-gray-600 text-[11px]">
          {formatISODateToCustom(item.transactionable.created_at) || "-"}
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
