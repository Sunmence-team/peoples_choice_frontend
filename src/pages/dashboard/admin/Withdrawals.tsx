import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaXmark, FaCircleCheck } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/modal/Modal";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";
import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
  useCompleteWithdrawal,
  useAdminWallets,
} from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { TransactionItem } from "../../../lib/interfaces";

type Target = TransactionItem | null;
type ActionType = "approve" | "reject" | "complete";

const Withdrawals: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selected, setSelected] = useState<TransactionItem | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [actionTarget, setActionTarget] = useState<Target>(null);
  const [actionType, setActionType] = useState<ActionType>("approve");
  const [remarks, setRemarks] = useState("");
  const [payoutWalletId, setPayoutWalletId] = useState<string>("");

  const { data, isLoading, error } = useAdminWithdrawals(currentPage, itemsPerPage);
  const withdrawals = data?.items ?? [];
  const { data: walletsData } = useAdminWallets();
  const companyWallets = walletsData?.items ?? [];

  const approveMutation = useApproveWithdrawal();
  const rejectMutation = useRejectWithdrawal();
  const completeMutation = useCompleteWithdrawal();
  const mutation =
    actionType === "approve"
      ? approveMutation
      : actionType === "reject"
        ? rejectMutation
        : completeMutation;

  const openAction = (item: TransactionItem, type: ActionType) => {
    setActionTarget(item);
    setActionType(type);
    setRemarks("");
    setPayoutWalletId("");
  };

  const runAction = async () => {
    if (!actionTarget) return;
    if (!remarks.trim()) {
      toast.error("Remarks are required");
      return;
    }

    try {
      if (actionType === "approve") {
        await approveMutation.mutateAsync({
          withdrawalId: actionTarget.id,
          remarks: remarks.trim(),
        });
        toast.success(
          `${actionTarget.user_name || "User"}'s withdrawal approved`
        );
      } else if (actionType === "reject") {
        await rejectMutation.mutateAsync({
          withdrawalId: actionTarget.id,
          remarks: remarks.trim(),
        });
        toast.error(
          `${actionTarget.user_name || "User"}'s withdrawal rejected`
        );
      } else {
        if (!payoutWalletId) {
          toast.error("Select a payout wallet");
          return;
        }
        await completeMutation.mutateAsync({
          withdrawalId: actionTarget.id,
          wallet_address_id: Number(payoutWalletId),
          remarks: remarks.trim(),
        });
        toast.success(
          `${actionTarget.user_name || "User"}'s withdrawal completed`
        );
      }
      setActionTarget(null);
      setRemarks("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Action failed"));
    }
  };

  const openView = (id: number) => {
    const found = withdrawals.find((item) => item.id === id);
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
      label: "DESTINATION ADDRESS",
      key: "destination_address",
      render: (item: TransactionItem) => item.destination_address || "-",
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
              : item.status === "approved"
                ? [
                    {
                      name: "Complete",
                      icon: <FaCircleCheck />,
                      tone: "default",
                      action: () => openAction(item, "complete"),
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

  const actionCopy = {
    approve: {
      title: "Approve this withdrawal?",
      body: `Release ${actionTarget?.amount}.00 USDT to ${actionTarget?.user_name || "the user"}'s destination address?`,
      confirm: "Yes, Approve",
      className: "bg-[#05a957] hover:bg-[#04984e]",
      placeholder: "e.g. Queued for payout",
    },
    reject: {
      title: "Reject this withdrawal?",
      body: `Decline the ${actionTarget?.amount}.00 USDT withdrawal request from ${actionTarget?.user_name || "the user"}?`,
      confirm: "Yes, Reject",
      className: "bg-red-500 hover:bg-red-600",
      placeholder: "e.g. Invalid recipient wallet address",
    },
    complete: {
      title: "Complete this withdrawal?",
      body: `Deduct ${actionTarget?.amount}.00 USDT from a company payout wallet and mark as paid.`,
      confirm: "Yes, Complete",
      className: "bg-primary hover:bg-primary/80",
      placeholder: "e.g. Payout broadcasted and confirmed",
    },
  } as const;

  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          Withdrawal Requests
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          Review and approve or reject withdrawal requests.
        </p>
      </div>

      <ReusableTable
        isLoading={isLoading}
        error={error}
        data={withdrawals}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? withdrawals.length}
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
              {actionCopy[actionType].title}
            </h3>
            <p className="mt-1 text-[13px] text-[#8190a3]">
              {actionCopy[actionType].body}
            </p>

            {actionType === "complete" && (
              <div className="mt-5">
                <label className="mb-2 block text-[12px] font-semibold text-[#172b4d]">
                  Payout Wallet
                </label>
                <select
                  value={payoutWalletId}
                  onChange={(e) => setPayoutWalletId(e.target.value)}
                  className="w-full rounded-lg border border-[#dfe8f1] px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">Select company wallet</option>
                  {companyWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.type} — {wallet.address.slice(0, 12)}… (
                      {wallet.balance} USDT)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-5">
              <label className="mb-2 block text-[12px] font-semibold text-[#172b4d]">
                Remarks
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={actionCopy[actionType].placeholder}
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
                className={`rounded-lg py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${actionCopy[actionType].className}`}
              >
                {mutation.isPending
                  ? "Please wait..."
                  : actionCopy[actionType].confirm}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Withdrawals;
