import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaXmark } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import TransferActionModal from "../../../components/modal/TransferActionModal";
import {
  useAdminTransactions,
  useApproveTransfer,
  useRejectTransfer,
} from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { TransactionItem } from "../../../lib/interfaces";

const Transfers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransfer, setSelectedTransfer] =
    useState<TransactionItem | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const { data, isLoading, error } = useAdminTransactions(
    currentPage,
    10,
    statusFilter,
    "transfer",
  );
  const transfers = data?.items ?? [];

  const approveMutation = useApproveTransfer();
  const rejectMutation = useRejectTransfer();

  const handleOpenConfirm = (
    transfer: TransactionItem,
    type: "approve" | "reject",
  ) => {
    setSelectedTransfer(transfer);
    setActionType(type);
    setConfirmModal(true);
  };

  const handleExecute = async () => {
    if (!selectedTransfer) return;
    try {
      if (actionType === "approve") {
        await approveMutation.mutateAsync(selectedTransfer.id);
        toast.success(
          `Wire transfer ${selectedTransfer.transaction_id || ""} completed successfully`
        );
      } else {
        await rejectMutation.mutateAsync(selectedTransfer.id);
        toast.success(
          `Wire transfer rejected. Balance was atomically refunded to sender.`
        );
      }
      setConfirmModal(false);
      setSelectedTransfer(null);
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to ${actionType} transfer`));
    }
  };

  const columns = [
    {
      label: "REFERENCE ID",
      key: "transaction_id",
      render: (item: TransactionItem) => (
        <span className="font-mono font-semibold text-[11px] text-[#0B2D5B]">
          {item.transaction_id || "-"}
        </span>
      ),
    },
    {
      label: "SENDER (USER)",
      key: "user_name",
      render: (item: TransactionItem) => (
        <span className="text-[11px] font-semibold text-gray-800">
          {item.user_name || "-"}
        </span>
      ),
    },
    {
      label: "BENEFICIARY / BANK",
      key: "recipient_name",
      render: (item: TransactionItem) => (
        <div className="flex flex-col">
          <span className="font-medium text-[11px] text-[#172b4d]">
            {item.recipient_name || item.destination_address || "External Wire"}
          </span>
          {item.network && (
            <span className="text-[9.5px] text-gray-400">{item.network}</span>
          )}
        </div>
      ),
    },
    {
      label: "AMOUNT (USD)",
      key: "amount",
      render: (item: TransactionItem) => (
        <span className="font-semibold text-[11px] text-[#0B2D5B]">
          ${Number(item.amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
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
      render: (item: TransactionItem) => (
        <span className="text-[10.5px] text-gray-500">
          {formatISODateToCustom(item.date)}
        </span>
      ),
    },
    {
      label: "ACTIONS",
      key: "action",
      render: (item: TransactionItem) => (
        <ActionCell
          canView={false}
          rowId={Number(item.id)}
          otherActions={
            item.status === "pending"
              ? [
                  {
                    name: "Approve Wire",
                    icon: <FaCheck />,
                    tone: "success",
                    action: () => handleOpenConfirm(item, "approve"),
                  },
                  {
                    name: "Reject & Refund",
                    icon: <FaXmark />,
                    tone: "danger",
                    action: () => handleOpenConfirm(item, "reject"),
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
            Wire & External Transfers Review
          </h1>
          <p className="mt-0.5 text-[15px] text-[#8190a3]">
            Review, authorize, or reject outgoing ACH, SWIFT and international wire transfers.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-[#dfe8f1] bg-[#f8fafc] p-1 text-xs font-semibold">
          {["all", "pending", "completed", "rejected"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`rounded-md px-3 py-1.5 capitalize transition cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <ReusableTable
        isLoading={isLoading}
        error={error}
        data={transfers}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? transfers.length}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
        setItemsPerPage={() => {}}
        hasSerialNo={true}
      />

      {/* Extracted Transfer Action Modal */}
      <TransferActionModal
        isOpen={confirmModal}
        onClose={() => {
          setConfirmModal(false);
          setSelectedTransfer(null);
        }}
        transfer={selectedTransfer}
        actionType={actionType}
        onConfirm={handleExecute}
        isSubmitting={approveMutation.isPending || rejectMutation.isPending}
      />
    </>
  );
};

export default Transfers;
