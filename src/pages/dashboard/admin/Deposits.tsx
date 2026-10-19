import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaXmark } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";
import DepositActionModal from "../../../components/modal/DepositActionModal";
import {
  useAdminDeposits,
  useApproveDeposit,
  useRejectDeposit,
} from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { TransactionItem } from "../../../lib/interfaces";

const Deposits: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selected, setSelected] = useState<TransactionItem | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [actionTarget, setActionTarget] = useState<TransactionItem | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const { data, isLoading, error } = useAdminDeposits(currentPage, itemsPerPage);
  const deposits = data?.items ?? [];

  const approveMutation = useApproveDeposit();
  const rejectMutation = useRejectDeposit();
  const mutation = actionType === "approve" ? approveMutation : rejectMutation;

  const openAction = (item: TransactionItem, type: "approve" | "reject") => {
    setActionTarget(item);
    setActionType(type);
  };

  const handleActionConfirm = async (id: number | string, remarks: string) => {
    if (!actionTarget) return;

    try {
      const vars = { depositId: Number(id), remarks };
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

      {viewModal && selected && (
        <ViewTransactionModal
          transaction={selected}
          isOpen={viewModal}
          onClose={() => {
            setViewModal(false);
            setSelected(null);
          }}
        />
      )}

      {/* Extracted Deposit Action Modal */}
      <DepositActionModal
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        deposit={actionTarget}
        actionType={actionType}
        onConfirm={handleActionConfirm}
        isSubmitting={mutation.isPending}
      />
    </>
  );
};

export default Deposits;
