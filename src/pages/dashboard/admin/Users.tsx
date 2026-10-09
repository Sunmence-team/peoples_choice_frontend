import React, { useState } from "react";
import { toast } from "sonner";
import { FaLock, FaCheck, FaRotateLeft } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import Modal from "../../../components/modal/Modal";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import {
  useAdminUsers,
  useDisableAdminUser,
  useEnableAdminUser,
  useDeleteAdminUser,
  useRestoreAdminUser,
  useUpdateAdminUserBalance,
} from "../../../hooks/useAdminData";
import {
  formatShortDate,
  getInitials,
} from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { AdminUser } from "../../../lib/interfaces";

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "disable" | "enable" | "delete" | "restore" | null
  >(null);
  const [reason, setReason] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceDescription, setBalanceDescription] = useState("");

  const { data, isLoading, error } = useAdminUsers(currentPage, itemsPerPage);
  const users = data?.items ?? [];

  const disableMutation = useDisableAdminUser();
  const enableMutation = useEnableAdminUser();
  const deleteMutation = useDeleteAdminUser();
  const restoreMutation = useRestoreAdminUser();
  const balanceMutation = useUpdateAdminUserBalance();

  const actionMutation =
    confirmAction === "disable"
      ? disableMutation
      : confirmAction === "enable"
        ? enableMutation
        : confirmAction === "delete"
          ? deleteMutation
          : restoreMutation;

  const getUserInitials = (fullName: string) => {
    const [first = "", last = ""] = fullName.split(" ");
    return getInitials(first, last);
  };

  const openUser = (id: number) => {
    const found = users.find((item) => item.id === id);
    if (found) {
      setSelectedUser(found);
      setUserModal(true);
      setReason("");
      setBalanceAmount("");
      setBalanceDescription("");
    }
  };

  const runAction = async () => {
    if (!selectedUser || !confirmAction) return;

    try {
      if (confirmAction === "disable") {
        if (!reason.trim()) {
          toast.error("Please provide a reason");
          return;
        }
        await disableMutation.mutateAsync({
          userId: selectedUser.id,
          reason: reason.trim(),
        });
        toast.success(`${selectedUser.full_name} has been disabled`);
      } else if (confirmAction === "enable") {
        await enableMutation.mutateAsync({ userId: selectedUser.id });
        toast.success(`${selectedUser.full_name} has been re-activated`);
      } else if (confirmAction === "delete") {
        await deleteMutation.mutateAsync({ userId: selectedUser.id });
        toast.success(`${selectedUser.full_name} has been deleted`);
      } else {
        await restoreMutation.mutateAsync({ userId: selectedUser.id });
        toast.success(`${selectedUser.full_name} has been restored`);
      }
      setConfirmAction(null);
      setUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Action failed"));
    }
  };

  const handleBalanceUpdate = async () => {
    if (!selectedUser) return;
    const amount = Number(balanceAmount);
    if (!amount || Number.isNaN(amount)) {
      toast.error("Enter a valid balance amount");
      return;
    }
    if (!balanceDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      await balanceMutation.mutateAsync({
        userId: selectedUser.id,
        balance: amount,
        description: balanceDescription.trim(),
      });
      toast.success("User balance updated");
      setBalanceAmount("");
      setBalanceDescription("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update balance"));
    }
  };

  const statusBadge = (status: AdminUser["status"]) => (
    <span
      className={`px-3 py-1 rounded-xl font-medium capitalize ${
        status === "active"
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  );

  const columns = [
    {
      label: "USER",
      key: "username",
      render: (item: AdminUser) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-white uppercase">
            {getUserInitials(item.full_name)}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#172b4d]">
              {item.full_name}
            </p>
            <p className="text-[9px] text-[#8190a3]">@{item.username}</p>
          </div>
        </div>
      ),
    },
    {
      label: "EMAIL",
      key: "email",
      render: (item: AdminUser) => item.email,
    },
    {
      label: "ROLE",
      key: "role",
      render: (item: AdminUser) => (
        <span className="px-3 py-1 rounded-xl font-medium capitalize bg-primary/10 text-primary">
          {item.role}
        </span>
      ),
    },
    {
      label: "ACCOUNT STATUS",
      key: "status",
      render: (item: AdminUser) => statusBadge(item.status),
    },
    {
      label: "WALLET BALANCE",
      key: "wallet_balance",
      render: (item: AdminUser) => (
        <span className="font-semibold">{item.wallet_balance}.00 USDT</span>
      ),
    },
    {
      label: "JOINED",
      key: "created_at",
      render: (item: AdminUser) => formatShortDate(item.created_at),
    },
    {
      label: "ACTION",
      key: "action",
      render: (item: AdminUser) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id)}
          onView={() => openUser(item.id)}
          onDelete={() => {
            openUser(item.id);
            setConfirmAction("delete");
          }}
          otherActions={
            item.status === "active"
              ? [
                  {
                    name: "Disable",
                    icon: <FaLock />,
                    tone: "danger",
                    action: () => openUser(item.id),
                  },
                ]
              : [
                  {
                    name: "Re-activate",
                    icon: <FaCheck />,
                    tone: "success",
                    action: () => {
                      openUser(item.id);
                      setConfirmAction("enable");
                    },
                  },
                  {
                    name: "Restore",
                    icon: <FaRotateLeft />,
                    tone: "default",
                    action: () => {
                      openUser(item.id);
                      setConfirmAction("restore");
                    },
                  },
                ]
          }
        />
      ),
    },
  ];

  const confirmLabels = {
    disable: {
      title: "Disable this account?",
      message: `${selectedUser?.full_name} will lose access to the platform immediately.`,
      text: "Yes, Disable",
    },
    enable: {
      title: "Re-activate this account?",
      message: `${selectedUser?.full_name} will regain access to the platform.`,
      text: "Yes, Re-activate",
    },
    delete: {
      title: "Delete this account?",
      message: `${selectedUser?.full_name}'s account will be permanently deleted. This cannot be undone.`,
      text: "Yes, Delete",
    },
    restore: {
      title: "Restore this account?",
      message: `${selectedUser?.full_name}'s account will be restored.`,
      text: "Yes, Restore",
    },
  } as const;

  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          User Management
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          View all users and manage their accounts.
        </p>
      </div>

      <ReusableTable
        isLoading={isLoading}
        error={error}
        data={users}
        columns={columns}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.total ?? users.length}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        hasSerialNo={true}
      />

      {userModal && selectedUser && (
        <Modal onClose={() => setUserModal(false)}>
          <div className="p-4">
            <h3 className="text-[18px] font-bold text-[#0B2D5B]">
              Manage User Account
            </h3>
            <p className="mt-1 text-[12px] text-[#8190a3]">
              Review account details and update its status.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white uppercase">
                {getUserInitials(selectedUser.full_name)}
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#172b4d]">
                  {selectedUser.full_name}
                </p>
                <span className="mt-1 inline-block">
                  {statusBadge(selectedUser.status)}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                { label: "Username", value: `@${selectedUser.username}` },
                { label: "Email", value: selectedUser.email },
                { label: "Phone", value: selectedUser.phone || "-" },
                { label: "Country", value: selectedUser.country || "-" },
                { label: "Role", value: selectedUser.role },
                {
                  label: "Wallet Balance",
                  value: `${selectedUser.wallet_balance}.00 USDT`,
                },
                { label: "Joined", value: formatShortDate(selectedUser.created_at) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-[#e3eaf2] pb-3"
                >
                  <span className="text-[11px] text-[#8190a3]">{row.label}</span>
                  <span className="text-[12px] font-semibold text-[#172b4d] capitalize text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Balance update */}
            <div className="mt-5 rounded-lg border border-[#e3eaf2] p-3">
              <p className="text-[11px] font-semibold text-[#172b4d]">
                Update Balance (Hidden Transaction)
              </p>

              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="h-9 rounded-md border border-[#dfe8f1] px-3 text-[11px] outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={balanceDescription}
                  onChange={(e) => setBalanceDescription(e.target.value)}
                  className="h-9 rounded-md border border-[#dfe8f1] px-3 text-[11px] outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={handleBalanceUpdate}
                disabled={balanceMutation.isPending}
                className="mt-2 w-full rounded-md bg-primary py-2 text-[11px] font-semibold text-white transition hover:bg-primary/80 disabled:opacity-60"
              >
                {balanceMutation.isPending ? "Updating..." : "Update Balance"}
              </button>
            </div>

            {selectedUser.status === "active" && (
              <div className="mt-5 rounded-lg border border-[#e3eaf2] p-3">
                <p className="text-[11px] font-semibold text-[#172b4d]">
                  Reason (required to disable)
                </p>
                <textarea
                  rows={2}
                  placeholder="Reason for disabling this account"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-2 w-full resize-none rounded-md border border-[#dfe8f1] px-3 py-2 text-[11px] outline-none focus:border-primary"
                />
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {selectedUser.status === "active" ? (
                <button
                  type="button"
                  onClick={() => setConfirmAction("disable")}
                  className="w-full rounded-lg py-3 text-sm font-semibold text-white transition cursor-pointer bg-red-500 hover:bg-red-600"
                >
                  Disable Account
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmAction("enable")}
                    className="w-full rounded-lg py-3 text-sm font-semibold text-white transition cursor-pointer bg-[#05a957] hover:bg-[#04984e]"
                  >
                    Re-activate Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction("restore")}
                    className="w-full rounded-lg border border-primary py-3 text-sm font-semibold text-primary transition cursor-pointer hover:bg-primary/5"
                  >
                    Restore Account
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setConfirmAction("delete")}
                className="w-full rounded-lg border border-red-200 py-3 text-sm font-semibold text-red-600 transition cursor-pointer hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!confirmAction}
        title={
          confirmAction ? confirmLabels[confirmAction].title : "Are you sure?"
        }
        message={
          confirmAction ? confirmLabels[confirmAction].message : ""
        }
        confirmText={
          confirmAction ? confirmLabels[confirmAction].text : "Confirm"
        }
        onCancel={() => setConfirmAction(null)}
        onConfirm={runAction}
        isLoading={actionMutation.isPending}
      />
    </>
  );
};

export default Users;
