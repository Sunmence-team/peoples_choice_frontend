import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import ApproveCardModal from "../../../components/modal/ApproveCardModal";
import {
  useAdminCards,
  useApproveAdminCard,
} from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { AdminCardItem } from "../../../services/adminServices";

const Cards: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCard, setSelectedCard] = useState<AdminCardItem | null>(null);
  const [approveModal, setApproveModal] = useState(false);

  const { data, isLoading, error } = useAdminCards(
    currentPage,
    10,
    statusFilter,
  );
  const cards = data?.items ?? [];

  const approveMutation = useApproveAdminCard();

  const handleOpenApprove = (card: AdminCardItem) => {
    setSelectedCard(card);
    setApproveModal(true);
  };

  const handleConfirmApprove = async (
    id: number | string,
    spendingLimit: number,
  ) => {
    if (!selectedCard) return;

    try {
      await approveMutation.mutateAsync({
        id,
        spending_limit: spendingLimit,
      });
      toast.success(
        `Card approved for ${selectedCard.card_holder_name}! Issued with $${spendingLimit.toLocaleString()} spending limit.`,
      );
      setApproveModal(false);
      setSelectedCard(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to approve card"));
    }
  };

  const columns = [
    {
      label: "CARDHOLDER NAME",
      key: "card_holder_name",
      render: (item: AdminCardItem) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[11px] text-[#0B2D5B]">
            {item.card_holder_name}
          </span>
          {item.user?.email && (
            <span className="text-[9.5px] text-gray-400">
              {item.user.email}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "TYPE",
      key: "card_type",
      render: (item: AdminCardItem) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
            item.card_type === "virtual"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.card_type}
        </span>
      ),
    },
    {
      label: "BRAND / CURRENCY",
      key: "card_brand",
      render: (item: AdminCardItem) => (
        <span className="text-[11px] font-medium text-gray-700 uppercase">
          {item.card_brand} • {item.currency}
        </span>
      ),
    },
    {
      label: "CARD NUMBER",
      key: "masked_card_number",
      render: (item: AdminCardItem) => (
        <span className="font-mono text-[11px] text-gray-700">
          {item.masked_card_number || item.card_number || "Pending Issuance"}
        </span>
      ),
    },
    {
      label: "SPENDING LIMIT",
      key: "spending_limit",
      render: (item: AdminCardItem) => (
        <span className="font-semibold text-[11px] text-gray-800">
          {item.spending_limit
            ? `$${Number(item.spending_limit).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}`
            : "-"}
        </span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: AdminCardItem) => <StatusBadge status={item.status} />,
    },
    {
      label: "REQUEST DATE",
      key: "created_at",
      render: (item: AdminCardItem) => (
        <span className="text-[10.5px] text-gray-500">
          {formatISODateToCustom(item.created_at)}
        </span>
      ),
    },
    ...(cards.some((card) => card.status === "pending")
      ? [
          {
            label: "ACTIONS",
            key: "action",
            render: (item: AdminCardItem) => (
              <ActionCell
                canView={false}
                rowId={Number(item.id)}
                disabled={item.status !== "pending"}
                otherActions={
                  item.status === "pending"
                    ? [
                        {
                          name: "Approve Card",
                          icon: <FaCheck />,
                          tone: "success",
                          action: () => handleOpenApprove(item),
                        },
                      ]
                    : []
                }
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
            Cards Management
          </h1>
          <p className="mt-0.5 text-[15px] text-[#8190a3]">
            Review, approve and issue debit cards requested by account holders.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-[#dfe8f1] bg-[#f8fafc] p-1 text-xs font-semibold">
          {["all", "pending", "active", "frozen"].map((st) => (
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
        data={cards}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? cards.length}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
        setItemsPerPage={() => {}}
        hasSerialNo={true}
      />

      {/* Extracted Approve Card Modal */}
      <ApproveCardModal
        isOpen={approveModal}
        onClose={() => {
          setApproveModal(false);
          setSelectedCard(null);
        }}
        card={selectedCard}
        onConfirm={handleConfirmApprove}
        isSubmitting={approveMutation.isPending}
      />
    </>
  );
};

export default Cards;
