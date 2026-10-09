import React, { useState } from "react";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";
import { useAdminTransactions } from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import type { TransactionItem, TransactionStatus } from "../../../lib/interfaces";

type Filter = "all" | TransactionStatus;

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selected, setSelected] = useState<TransactionItem | null>(null);
  const [viewModal, setViewModal] = useState(false);

  const { data, isLoading, error } = useAdminTransactions(
    currentPage,
    itemsPerPage,
    filter === "all" ? undefined : filter
  );

  const items = data?.items ?? [];

  const openView = (id: number) => {
    const found = items.find((item) => item.id === id);
    if (found) {
      setSelected(found);
      setViewModal(true);
    }
  };

  const columns = [
    {
      label: "TRANSACTION ID",
      key: "transaction_id",
      render: (item: TransactionItem) => (
        <span className="font-semibold">{item.transaction_id}</span>
      ),
    },
    {
      label: "USER",
      key: "user_name",
      render: (item: TransactionItem) => item.user_name,
    },
    {
      label: "TYPE",
      key: "type",
      render: (item: TransactionItem) => (
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
      render: (item: TransactionItem) => item.network,
    },
    {
      label: "AMOUNT",
      key: "amount",
      render: (item: TransactionItem) => (
        <span className="font-semibold">{item.amount}.00 USDT</span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: TransactionItem) => <StatusBadge status={item.status} />,
    },
    {
      label: "DATE & TIME",
      key: "date",
      render: (item: TransactionItem) => formatISODateToCustom(item.date),
    },
    {
      label: "ACTION",
      key: "action",
      render: (item: TransactionItem) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id)}
          onView={() => openView(item.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          All Transactions
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          View every deposit and withdrawal record on the platform.
        </p>
      </div>

      <div className="mt-6 flex w-fit gap-2 rounded-lg p-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md px-4 py-2 text-[11px] font-medium cursor-pointer transition ${
              filter === f.value
                ? "bg-[#073b68] text-white shadow-sm"
                : "text-[#66809c] hover:text-[#073b68] bg-[#eef5fc]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

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

      <ViewTransactionModal
        transaction={selected}
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
      />
    </>
  );
};

export default Transactions;