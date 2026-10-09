import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaXmark } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/modal/Modal";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";
import { useAdminDeposits, useApproveDeposit, useRejectDeposit } from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { TransactionItem } from "../../../lib/interfaces";

type Target = TransactionItem | null;

const Deposits: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selected, setSelected] = useState<TransactionItem | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [actionTarget, setActionTarget] = useState<Target>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [remarks, setRemarks] = useState("");

  const { data, isLoading, error } = useAdminDeposits(currentPage, itemsPerPage);
  const deposits = data?.items ?? [];

  const approveMutation = useApproveDeposit();
  const rejectMutation = useRejectDeposit();
  const mutation = actionType === "approve" ? approveMutation : rejectMutation;

  const openAction = (item: TransactionItem, type: "approve" | "reject") => {
    setActionTarget(item);
    setActionType(type);
    setRemarks("");
  };

  const runAction = async () => {
    if (!actionTarget) return;
    if (!remarks.trim()) {
      toast.error("Remarks are required");
      return;
    }

    try {
      const vars = { depositId: actionTarget.id, remarks: remarks.trim() };
      if (actionType === "approve") {
        await approveMutation.mutateAsync(vars);
        toast.success(
          `${actionTarget.user_name || "User"}'s deposit of ${actionTarget.amount} USDT approved`
        );
      } else {
        await rejectMutation.mutateAsync(vars);
        toast.error(
          `${actionTarget.user_name || "User"}'s deposit of ${actionTarget.amount} USDT rejected`
        );
      }
      setActionTarget(null);
      setRemarks("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Action failed"));
    }
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
      render: (item: TransactionItem) => item.user_name || "-",
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
        <ActionCell
          canView={true}
          rowId={Number(item.id)}
          onView={() => openView(item.id)}
          otherActions={
            item.status === "pending"
              ? [
                  {
                    name: "Approve",
                    icon: <FaCheck />,
                    tone: "success",
                    action: () => openAction(item, "approve"),
                  },
                  {
                    name: "Reject",
                    icon: <FaXmark />,
                    tone: "danger",
                    action: () => openAction(item, "reject"),
                  },
                ]
              : []
          }
        />
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
        isLoading={isLoading}
        error={error}
        data={deposits}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? deposits.length}
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

      {actionTarget && (
        <Modal onClose={() => setActionTarget(null)}>
          <div className="p-5">
            <h3 className="text-[18px] font-bold text-[#0B2D5B]">
              {actionType === "approve" ? "Approve this deposit?" : "Reject this deposit?"}
            </h3>
            <p className="mt-1 text-[13px] text-[#8190a3]">
              {actionType === "approve"
                ? `Credit ${actionTarget.amount}.00 USDT to ${actionTarget.user_name || "the user"}'s wallet?`
                : `Decline the ${actionTarget.amount}.00 USDT deposit from ${actionTarget.user_name || "the user"}?`}
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-[12px] font-semibold text-[#172b4d]">
                Remarks
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "e.g. Transaction confirmed on blockchain explorer"
                    : "e.g. No matching blockchain transfer found"
                }
                className="w-full resize-none rounded-lg border border-[#dfe8f1] px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActionTarget(null)}
                disabled={mutation.isPending}
                className="rounded-lg border border-[#dfe8f1] py-3 text-sm font-semibold text-[#52677c] transition hover:bg-[#f8fafc] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runAction}
                disabled={mutation.isPending}
                className={`rounded-lg py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
                  actionType === "approve"
                    ? "bg-[#05a957] hover:bg-[#04984e]"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {mutation.isPending
                  ? "Please wait..."
                  : actionType === "approve"
                    ? "Yes, Approve"
                    : "Yes, Reject"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Deposits;
