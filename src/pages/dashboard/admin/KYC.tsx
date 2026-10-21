import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaXmark } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import KYCDocumentsModal from "../../../components/modal/KYCDocumentsModal";
import KYCRejectModal from "../../../components/modal/KYCRejectModal";
import {
  useAdminVerifications,
  useApproveVerification,
  useRejectVerification,
} from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { AdminVerificationItem } from "../../../services/adminServices";

const KYC: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedVerification, setSelectedVerification] =
    useState<AdminVerificationItem | null>(null);
  const [viewDocsModal, setViewDocsModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const { data, isLoading, error } = useAdminVerifications(
    currentPage,
    10,
    statusFilter,
  );
  const verifications = data?.items ?? [];

  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const handleApprove = async (item: AdminVerificationItem) => {
    try {
      await approveMutation.mutateAsync(item.id);
      toast.success(
        `Verification approved for ${item.user?.name || "User"}. KYC status is now verified.`
      );
      setViewDocsModal(false);
      setSelectedVerification(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to approve verification"));
    }
  };

  const handleOpenReject = (item: AdminVerificationItem) => {
    setSelectedVerification(item);
    setRejectModal(true);
  };

  const handleConfirmReject = async (id: number | string, reason: string) => {
    try {
      await rejectMutation.mutateAsync({
        id,
        rejection_reason: reason.trim(),
      });
      toast.error(
        `Verification rejected for ${selectedVerification?.user?.name || "User"}`
      );
      setRejectModal(false);
      setViewDocsModal(false);
      setSelectedVerification(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to reject verification"));
    }
  };

  const handleOpenDocs = (item: AdminVerificationItem) => {
    setSelectedVerification(item);
    setViewDocsModal(true);
  };

  const columns = [
    {
      label: "USER / ACCOUNT",
      key: "user",
      render: (item: AdminVerificationItem) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[11px] text-[#0B2D5B]">
            {item.user?.name || `${item.user?.first_name} ${item.user?.last_name}`}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {item.user?.email || item.user?.account_number || "-"}
          </span>
        </div>
      ),
    },
    {
      label: "DOCUMENT TYPE",
      key: "document_type",
      render: (item: AdminVerificationItem) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary uppercase">
          {item.document_type?.replace("_", " ")}
        </span>
      ),
    },
    {
      label: "DOCUMENT NUMBER",
      key: "document_number",
      render: (item: AdminVerificationItem) => (
        <span className="font-mono text-[11px] font-semibold text-gray-700">
          {item.document_number}
        </span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: AdminVerificationItem) => (
        <StatusBadge status={item.status} />
      ),
    },
    {
      label: "SUBMISSION DATE",
      key: "created_at",
      render: (item: AdminVerificationItem) => (
        <span className="text-[10.5px] text-gray-500">
          {formatISODateToCustom(item.created_at)}
        </span>
      ),
    },
    {
      label: "ACTIONS",
      key: "action",
      render: (item: AdminVerificationItem) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id)}
          onView={() => handleOpenDocs(item)}
          otherActions={
            item.status === "pending"
              ? [
                  {
                    name: "Approve",
                    icon: <FaCheck />,
                    tone: "success",
                    action: () => handleApprove(item),
                  },
                  {
                    name: "Reject",
                    icon: <FaXmark />,
                    tone: "danger",
                    action: () => handleOpenReject(item),
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
            KYC Verifications
          </h1>
          <p className="mt-0.5 text-[15px] text-[#8190a3]">
            Review and verify submitted government identity documents.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-[#dfe8f1] bg-[#f8fafc] p-1 text-xs font-semibold">
          {["pending", "approved", "rejected", "all"].map((st) => (
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
        data={verifications}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? verifications.length}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
        setItemsPerPage={() => {}}
        hasSerialNo={true}
      />

      {/* Extracted Document Inspection Modal */}
      <KYCDocumentsModal
        isOpen={viewDocsModal}
        onClose={() => setViewDocsModal(false)}
        verification={selectedVerification}
        onApprove={handleApprove}
        onOpenReject={handleOpenReject}
        isApproving={approveMutation.isPending}
      />

      {/* Extracted Reject Modal */}
      <KYCRejectModal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        verification={selectedVerification}
        onConfirm={handleConfirmReject}
        isSubmitting={rejectMutation.isPending}
      />
    </>
  );
};

export default KYC;
