import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaXmark } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import ViewTransactionModal from "../../../components/modal/ViewTransactionModal";
import WithdrawalActionModal from "../../../components/modal/WithdrawalActionModal";
import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
} from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { TransactionItem } from "../../../lib/interfaces";

type ActionType = "approve" | "reject";

const Withdrawals: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selected, setSelected] = useState<TransactionItem | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [actionTarget, setActionTarget] = useState<TransactionItem | null>(null);
  const [actionType, setActionType] = useState<ActionType>("approve");

  const { data, isLoading, error } = useAdminWithdrawals(currentPage, itemsPerPage);
  const withdrawals = data?.items ?? [];

  const approveMutation = useApproveWithdrawal();
  const rejectMutation = useRejectWithdrawal();
  const mutation = actionType === "approve" ? approveMutation : rejectMutation;

  const openAction = (item: TransactionItem, type: ActionType) => {
    setActionTarget(item);
    setActionType(type);
  };

  const handleActionSubmit = async (id: number | string, remarks: string) => {
    try {
      if (actionType === "approve") {
        await approveMutation.mutateAsync({
          withdrawalId: Number(id),
          remarks: remarks.trim(),
        });
        toast.success(
          `${actionTarget?.user_name || "User"}'s withdrawal approved`
        );
      } else {
        await rejectMutation.mutateAsync({
          withdrawalId: Number(id),
          remarks: remarks.trim(),
        });
        toast.error(
          `${actionTarget?.user_name || "User"}'s withdrawal rejected`
        );
      }
      setActionTarget(null);
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

  const requestColumns = [
    {
      label: "TRANSACTION ID",
      key: "transaction_id",
      render: (item: TransactionItem) => (
        <span className="font-semibold text-[11px] text-[#0B2D5B]">
          {item.transaction_id}
        </span>
      ),
    },
    {
      label: "USER",
      key: "user_name",
      render: (item: TransactionItem) => (
        <span className="text-[11px] font-medium">{item.user_name || "-"}</span>
      ),
    },
    {
      label: "NETWORK / CRYPTO",
      key: "network",
      render: (item: TransactionItem) => (
        <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-primary/10 text-primary uppercase">
          {item.network || "USDT"}
        </span>
      ),
    },
    {
      label: "AMOUNT",
      key: "amount",
      render: (item: TransactionItem) => (
        <span className="font-semibold text-[11px] text-[#0B2D5B]">
          {item.amount}.00 USDT
        </span>
      ),
    },
    {
      label: "DESTINATION ADDRESS",
      key: "destination_address",
      render: (item: TransactionItem) => (
        <span className="font-mono text-[10.5px] text-gray-600 break-all">
          {item.destination_address || "-"}
        </span>
      ),
    },
    {
      label: "CLEARANCE OTC",
      key: "cto_code",
      render: (item: TransactionItem) => (
        <span className="font-mono text-[10.5px] text-primary font-semibold">
          {item.cto_code || item.otp_code || "—"}
        </span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: TransactionItem) => <StatusBadge status={item.status} />,
    },
    {
      label: "DATE",
      key: "date",
      render: (item: TransactionItem) => (
        <span className="text-[11px] text-[#8190a3]">
          {formatISODateToCustom(item.date)}
        </span>
      ),
    },
    {
      label: "ACTION",
      key: "action",
      render: (item: TransactionItem) => (
        <ActionCell
          canView={true}
          rowId={item.id}
          onView={() => openView(item.id)}
          otherActions={[
            ...(item.status === "pending"
              ? [
                  {
                    name: "Approve",
                    icon: <FaCheck />,
                    tone: "success" as const,
                    action: () => openAction(item, "approve"),
                  },
                  {
                    name: "Reject",
                    icon: <FaXmark />,
                    tone: "danger" as const,
                    action: () => openAction(item, "reject"),
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          Withdrawals Management
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          Review, approve, or reject user funds withdrawal requests.
        </p>
      </div>

      <div className="mt-6">
        <ReusableTable
          isLoading={isLoading}
          error={error}
          data={withdrawals}
          columns={requestColumns}
          currentPage={currentPage}
          totalPages={data?.totalPages ?? 1}
          totalItems={data?.total ?? withdrawals.length}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          hasSerialNo={true}
        />
      </div>

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

      <WithdrawalActionModal
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        withdrawal={actionTarget}
        actionType={actionType}
        onConfirm={handleActionSubmit}
        isSubmitting={mutation.isPending}
      />
    </>
  );
};

export default Withdrawals;
