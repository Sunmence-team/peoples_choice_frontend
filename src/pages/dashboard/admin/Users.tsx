import React, { useState } from "react";
import { toast } from "sonner";
import { FaLock, FaCheck, FaRotateLeft } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import AdminUserDetailsModal from "../../../components/modal/AdminUserDetailsModal";
import AdminUserBalanceModal from "../../../components/modal/AdminUserBalanceModal";
import AdminUserDisableModal from "../../../components/modal/AdminUserDisableModal";
import {
  useAdminUsers,
  useDisableAdminUser,
  useEnableAdminUser,
  useDeleteAdminUser,
  useRestoreAdminUser,
  useUpdateAdminUserBalance,
} from "../../../hooks/useAdminData";
import {
  formatCompactAmount,
  formatShortDate,
  getInitials,
} from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { AdminUser } from "../../../lib/interfaces";
import AdminUserCodesModal from "../../../components/modal/AdminUserCodesModal";
import { KeyRound } from "lucide-react";

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [balanceModal, setBalanceModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "enable" | "delete" | "restore" | null
  >(null);
  const [viewCtoCodes, setViewCtoCodes] = useState(false);

  const { data, isLoading, error } = useAdminUsers(currentPage, itemsPerPage);
  const users: AdminUser[] = data?.data ?? [];

  const disableMutation = useDisableAdminUser();
  const enableMutation = useEnableAdminUser();
  const deleteMutation = useDeleteAdminUser();
  const restoreMutation = useRestoreAdminUser();
  const balanceMutation = useUpdateAdminUserBalance();

  const actionMutation =
    confirmAction === "enable"
      ? enableMutation
      : confirmAction === "delete"
        ? deleteMutation
        : restoreMutation;

  const getUserInitials = (first_name?: string, last_name?: string) => {
    return getInitials(first_name, last_name);
  };

  const openUser = (id: number) => {
    const found = users.find((item) => item.id === id);
    if (found) {
      setSelectedUser(found);
      setUserModal(true);
    }
  };

  const handleDisableConfirm = async (
    userId: number | string,
    reasonText: string,
  ) => {
    try {
      await disableMutation.mutateAsync({
        userId: Number(userId),
        reason: reasonText,
      });
      toast.success("User account disabled");
      setDisableModal(false);
      setUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to disable user"));
    }
  };

  const handleBalanceConfirm = async (
    userId: number | string,
    amount: number,
    description: string,
  ) => {
    try {
      await balanceMutation.mutateAsync({
        userId: Number(userId),
        balance: amount,
        description,
      });
      toast.success("User balance updated");
      setBalanceModal(false);
      setUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update balance"));
    }
  };

  const runConfirmAction = async () => {
    if (!selectedUser || !confirmAction) return;

    try {
      const vars = { userId: selectedUser.id };
      if (confirmAction === "enable") {
        await enableMutation.mutateAsync(vars);
        toast.success("User account enabled");
      } else if (confirmAction === "delete") {
        await deleteMutation.mutateAsync(vars);
        toast.success("User account deleted");
      } else {
        await restoreMutation.mutateAsync(vars);
        toast.success("User account restored");
      }
      setConfirmAction(null);
      setUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Action failed"));
    }
  };

  // const statusBadge = (status: AdminUser["status"]) => {
  //   const isSuccess = status === "active";
  //   const isDestructive = status === "disabled" || status === "deleted";
  //   return (
  //     <span
  //       className={`px-3 py-1 rounded-xl font-medium capitalize ${
  //         isSuccess
  //           ? "bg-green-100 text-green-600"
  //           : isDestructive
  //             ? "bg-red-100 text-red-600"
  //             : "bg-gray-100 text-gray-600"
  //       }`}
  //     >
  //       {status}
  //     </span>
  //   );
  // };

  const columns = [
    {
      label: "FULL NAME",
      key: "name",
      render: (item: AdminUser) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-xs text-white">
            {getUserInitials(item.first_name, item.last_name)}
          </div>
          <div>
            <p className="font-semibold text-[13px] text-[#0B2D5B]">
              {item.first_name} {item.last_name}
            </p>
            <p className="text-[11px] text-[#8190a3] font-mono">
              @{item.username || item.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "EMAIL",
      key: "email",
      render: (item: AdminUser) => (
        <span className="text-[12px] text-[#52677c]">{item.email}</span>
      ),
    },
    {
      label: "PHONE",
      key: "phone",
      render: (item: AdminUser) => (
        <span className="text-[12px] text-[#52677c]">{item.phone || "-"}</span>
      ),
    },
    {
      label: "BALANCE",
      key: "balance",
      render: (item: AdminUser) => (
        <span className="font-semibold text-[12px] text-[#0B2D5B]">
          {formatCompactAmount(Number(item.balance)) || 0} USD
        </span>
      ),
    },
    {
      label: "ROLE",
      key: "role",
      render: (item: AdminUser) => (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary capitalize">
          {item.role || "client"}
        </span>
      ),
    },
    {
      label: "KYC STATUS",
      key: "kyc_status",
      render: (item: AdminUser) => {
        const kyc =
          item.kyc_status || (item.is_verified ? "verified" : "unverified");
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
              kyc === "verified"
                ? "bg-green-100 text-green-700"
                : kyc === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {kyc}
          </span>
        );
      },
    },
    // {
    //   label: "STATUS",
    //   key: "status",
    //   render: (item: AdminUser) => statusBadge(item.status),
    // },
    {
      label: "JOINED",
      key: "created_at",
      render: (item: AdminUser) => (
        <span className="text-[11px] text-[#8190a3]">
          {formatShortDate(item.created_at)}
        </span>
      ),
    },
    {
      label: "ACTION",
      key: "action",
      render: (item: AdminUser) => (
        <ActionCell
          canView={true}
          rowId={item.id}
          onView={() => openUser(item.id)}
          onDelete={() => {
            setSelectedUser(item);
            setConfirmAction("delete");
          }}
          toggleAction={() => setSelectedUser(item)}
          otherActions={[
            {
              name: "View CTO & Clearance Codes",
              icon: <KeyRound size={11} className="text-[11px]!" />,
              tone: "default",
              action: () => {
                // setSelectedUser(item);
                setViewCtoCodes(true);
              },
            },
            {
              name: "Update Balance",
              icon: <LuWallet />,
              tone: "default",
              action: () => {
                setSelectedUser(item);
                setBalanceModal(true);
              },
            },
            item.status === "active"
              ? {
                  name: "Disable",
                  icon: <FaLock />,
                  tone: "warning",
                  action: () => {
                    setSelectedUser(item);
                    setDisableModal(true);
                  },
                }
              : {
                  name: "Enable",
                  icon: <FaCheck />,
                  tone: "success",
                  action: () => {
                    setSelectedUser(item);
                    setConfirmAction("enable");
                  },
                },
            {
              name: "Restore",
              icon: <FaRotateLeft />,
              tone: "default",
              action: () => {
                setSelectedUser(item);
                setConfirmAction("restore");
              },
            },
          ]}
        />
      ),
    },
  ];

  const actionCopy = {
    enable: {
      title: "Enable this user account?",
      message:
        "The user will regain full access to their dashboard and facilities.",
      text: "Yes, Enable",
    },
    delete: {
      title: "Delete this user account?",
      message: "This will remove the user profile from active records.",
      text: "Yes, Delete",
    },
    restore: {
      title: "Restore this user account?",
      message: "This will restore the previously removed user.",
      text: "Yes, Restore",
    },
  } as const;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
            Users Management
          </h1>
          <p className="mt-0.5 text-[15px] text-[#8190a3]">
            Manage user accounts, balances, KYC status and system permissions.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ReusableTable
          isLoading={isLoading}
          error={error}
          data={users}
          columns={columns}
          currentPage={currentPage}
          totalPages={data?.meta?.last_page ?? 1}
          totalItems={data?.meta?.total ?? users.length}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          hasSerialNo={true}
        />
      </div>

      {/* Extracted Modals */}
      <AdminUserDetailsModal
        isOpen={userModal}
        onClose={() => {
          setUserModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onOpenBalanceModal={(u) => {
          setSelectedUser(u);
          setBalanceModal(true);
        }}
        onOpenConfirmAction={(action) => {
          if (action === "disable") {
            setDisableModal(true);
          } else {
            setConfirmAction(action);
          }
        }}
      />

      {selectedUser && (
        <AdminUserCodesModal
          isOpen={viewCtoCodes}
          onClose={() => setViewCtoCodes(false)}
          user={selectedUser}
        />
      )}

      <AdminUserBalanceModal
        isOpen={balanceModal}
        onClose={() => {
          setBalanceModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={handleBalanceConfirm}
        isSubmitting={balanceMutation.isPending}
      />

      <AdminUserDisableModal
        isOpen={disableModal}
        onClose={() => {
          setDisableModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={handleDisableConfirm}
        isSubmitting={disableMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!confirmAction && !!selectedUser}
        title={confirmAction ? actionCopy[confirmAction].title : ""}
        message={confirmAction ? actionCopy[confirmAction].message : ""}
        confirmText={confirmAction ? actionCopy[confirmAction].text : "Confirm"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={runConfirmAction}
        isLoading={actionMutation.isPending}
      />
    </>
  );
};

export default Users;
