import React, { useState } from "react";
import { toast } from "sonner";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";
import { adminDeposits } from "../../../lib/adminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import type { TransactionItem } from "../../../lib/interfaces";

type Target = TransactionItem | null;

const Deposits: React.FC = () => {
  const [deposits, setDeposits] = useState<TransactionItem[]>(adminDeposits);
  const [selected, setSelected] = useState<TransactionItem | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [approveTarget, setApproveTarget] = useState<Target>(null);
  const [rejectTarget, setRejectTarget] = useState<Target>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approveDeposit = () => {
    if (!approveTarget) return;
    const target = approveTarget;
    setTimeout(() => {
      setDeposits((prev) =>
        prev.map((item) =>
          item.id === target.id ? { ...item, status: "approved" } : item,
        ),
      );
      toast.success(`${target.user_name}'s deposit of ${target.amount} USDT approved`);
      setIsSubmitting(false);
      setApproveTarget(null);
    }, 600);
  };

  const rejectDeposit = () => {
    if (!rejectTarget) return;
    const target = rejectTarget;
    setTimeout(() => {
      setDeposits((prev) =>
        prev.map((item) =>
          item.id === target.id ? { ...item, status: "rejected" } : item,
        ),
      );
      toast.error(`${target.user_name}'s deposit of ${target.amount} USDT rejected`);
      setIsSubmitting(false);
      setRejectTarget(null);
    }, 600);
  };

  const openView = (id: number) => {
    const found = deposits.find((item) => item.id === id);
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
      label: "NETWORK",
      key: "network",
      render: (item: TransactionItem) => (
        <span className="px-3 py-1 rounded-xl font-medium bg-primary/10 text-primary">
          {item.network}
        </span>
      ),
    },
    {
      label: "AMOUNT",
      key: "amount",
      render: (item: TransactionItem) => (
        <span className="font-semibold">{item.amount}.00 USDT</span>
      ),
    },
    {
      label: "WALLET ADDRESS",
      key: "wallet_address",
      render: (item: TransactionItem) => item.wallet_address || "-",
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
        <div className="flex items-center gap-2">
          {item.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => setApproveTarget(item)}
                className="rounded-md bg-green-100 px-3 py-1.5 text-[10px] font-semibold text-green-600 transition hover:bg-green-200 cursor-pointer"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => setRejectTarget(item)}
                className="rounded-md bg-red-100 px-3 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-200 cursor-pointer"
              >
                Reject
              </button>
            </>
          )}
          <ActionCell
            canView={true}
            rowId={Number(item.id)}
            onView={() => openView(item.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          Deposit Requests
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          Review and approve or reject USDT deposit requests.
        </p>
      </div>

      <ReusableTable
        isLoading={false}
        error={false}
        data={deposits}
        columns={columns}
        currentPage={1}
        totalPages={1}
        totalItems={deposits.length}
        setCurrentPage={() => {}}
        itemsPerPage={10}
        setItemsPerPage={() => {}}
        hasSerialNo={true}
      />

      <ViewTransactionModal
        transaction={selected}
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
      />

      <ConfirmDialog
        isOpen={!!approveTarget}
        title="Approve this deposit?"
        message={`Credit ${approveTarget?.amount}.00 USDT to ${approveTarget?.user_name}'s wallet?`}
        confirmText="Yes, Approve"
        onCancel={() => setApproveTarget(null)}
        onConfirm={approveDeposit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!rejectTarget}
        title="Reject this deposit?"
        message={`Decline the ${rejectTarget?.amount}.00 USDT deposit from ${rejectTarget?.user_name}?`}
        confirmText="Yes, Reject"
        onCancel={() => setRejectTarget(null)}
        onConfirm={rejectDeposit}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default Deposits;