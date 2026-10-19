import React, { useState } from "react";
import { toast } from "sonner";
import { FaCheck, FaXmark } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import StatusBadge from "../../../components/ui/StatusBadge";
import AdminLoanActionModal from "../../../components/modal/AdminLoanActionModal";
import {
  useAdminLoans,
  useDisburseAdminLoan,
  useRejectAdminLoan,
} from "../../../hooks/useAdminData";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { AdminLoanItem } from "../../../services/adminServices";

const Loans: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLoan, setSelectedLoan] = useState<AdminLoanItem | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"disburse" | "reject">(
    "disburse",
  );

  const { data, isLoading, error } = useAdminLoans(
    currentPage,
    10,
    statusFilter,
  );
  const loans = data?.items ?? [];

  const disburseMutation = useDisburseAdminLoan();
  const rejectMutation = useRejectAdminLoan();

  const handleOpenAction = (
    loan: AdminLoanItem,
    type: "disburse" | "reject",
  ) => {
    setSelectedLoan(loan);
    setActionType(type);
    setConfirmModal(true);
  };

  const handleExecute = async (id: number | string, reason?: string) => {
    if (!selectedLoan) return;

    try {
      if (actionType === "disburse") {
        await disburseMutation.mutateAsync(id);
        toast.success(
          `Loan disbursed successfully! $${Number(selectedLoan.amount).toLocaleString()} credited to borrower wallet.`,
        );
      } else {
        await rejectMutation.mutateAsync({
          id,
          reason,
        });
        toast.error(`Loan application rejected.`);
      }
      setConfirmModal(false);
      setSelectedLoan(null);
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to ${actionType} loan`));
    }
  };

  const columns = [
    {
      label: "BORROWER",
      key: "user",
      render: (item: AdminLoanItem) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[11px] text-[#0B2D5B]">
            {item.user?.first_name
              ? `${item.user?.first_name} ${item.user?.last_name}`
              : item.user?.name || `User #${item.user_id}`}
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
      label: "AMOUNT",
      key: "amount",
      render: (item: AdminLoanItem) => (
        <span className="font-semibold text-[11px] text-[#0B2D5B]">
          $
          {Number(item.amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      label: "TENURE",
      key: "tenure_months",
      render: (item: AdminLoanItem) => (
        <span className="text-[11px] font-medium text-gray-700">
          {item.tenure_months} Months
        </span>
      ),
    },
    {
      label: "MONTHLY / TOTAL",
      key: "monthly_payment",
      render: (item: AdminLoanItem) => (
        <div className="flex flex-col text-[10.5px]">
          <span className="font-semibold text-gray-800">
            {item.monthly_payment
              ? `$${Number(item.monthly_payment).toFixed(2)}/mo`
              : "-"}
          </span>
          <span className="text-[9.5px] text-gray-400">
            Total:{" "}
            {item.total_payable
              ? `$${Number(item.total_payable).toFixed(2)}`
              : "-"}
          </span>
        </div>
      ),
    },
    {
      label: "PURPOSE & INCOME",
      key: "purpose",
      render: (item: AdminLoanItem) => (
        <div className="flex flex-col max-w-[200px]">
          <span className="text-[11px] font-medium text-[#172b4d] truncate">
            {item.purpose}
          </span>
          <span className="text-[9.5px] text-gray-400">
            {item.employment_status || "Employed"} • Income: $
            {Number(item.monthly_income || 0).toLocaleString()}/mo
          </span>
        </div>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: AdminLoanItem) => <StatusBadge status={item.status} />,
    },
    {
      label: "APPLIED DATE",
      key: "created_at",
      render: (item: AdminLoanItem) => (
        <span className="text-[10.5px] text-gray-500">
          {formatISODateToCustom(item.created_at)}
        </span>
      ),
    },
    {
      label: "ACTIONS",
      key: "action",
      render: (item: AdminLoanItem) => (
        <ActionCell
          canView={false}
          rowId={Number(item.id)}
          disabled={item.status !== "pending"}
          otherActions={
            item.status === "pending"
              ? [
                  {
                    name: "Disburse Loan",
                    icon: <FaCheck />,
                    tone: "success",
                    action: () => handleOpenAction(item, "disburse"),
                  },
                  {
                    name: "Reject Loan",
                    icon: <FaXmark />,
                    tone: "danger",
                    action: () => handleOpenAction(item, "reject"),
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
            Loan Facilities Management
          </h1>
          <p className="mt-0.5 text-[15px] text-[#8190a3]">
            Review underwriting loan applications and disburse capital
            atomically.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-[#dfe8f1] bg-[#f8fafc] p-1 text-xs font-semibold">
          {["all", "pending", "active", "rejected", "repaid"].map((st) => (
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
        data={loans}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? loans.length}
        setCurrentPage={setCurrentPage}
        itemsPerPage={10}
        setItemsPerPage={() => {}}
        hasSerialNo={true}
      />

      {/* Extracted Admin Loan Action Modal */}
      <AdminLoanActionModal
        isOpen={confirmModal}
        onClose={() => {
          setConfirmModal(false);
          setSelectedLoan(null);
        }}
        loan={selectedLoan}
        actionType={actionType}
        onConfirm={handleExecute}
        isSubmitting={disburseMutation.isPending || rejectMutation.isPending}
      />
    </>
  );
};

export default Loans;
