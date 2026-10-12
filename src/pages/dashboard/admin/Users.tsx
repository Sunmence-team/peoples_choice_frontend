import React, { useState } from "react";
import { toast } from "sonner";
import { FaLock, FaCheck, FaRotateLeft } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";
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
  useAdminUserCtoCode,
  useGenerateAdminUserCtoCode,
} from "../../../hooks/useAdminData";
import {
  formatShortDate,
  getInitials,
} from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";
import type { AdminUser } from "../../../lib/interfaces";
import FormattedInput from "../../../components/ui/FormattedInput";

const UserCtoSection: React.FC<{ userId: number }> = ({ userId }) => {
  const { data: ctoRes, isLoading, refetch } = useAdminUserCtoCode(userId);
  const generateMutation = useGenerateAdminUserCtoCode();

  const [customCode, setCustomCode] = useState("");
  const [amount, setAmount] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  const ctoData = ctoRes;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("CTO code copied to clipboard");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await generateMutation.mutateAsync({
        userId,
        payload: {
          cto_code: customCode.trim() || undefined,
          amount: amount ? Number(amount) : undefined,
          send_email: sendEmail,
        },
      });
      toast.success(res.message || "CTO code generated successfully");
      setCustomCode("");
      setAmount("");
      setShowGenerateForm(false);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to generate CTO code"));
    }
  };

  return (
    <div className="mt-5 rounded-lg border border-[#e3eaf2] p-3 bg-[#f8fafc]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#172b4d]">
            Withdrawal CTO Authorization Code
          </p>
          <p className="text-[10px] text-[#8190a3]">
            Administrative clearance code for user withdrawals
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowGenerateForm(!showGenerateForm)}
          className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
        >
          {showGenerateForm ? "Close Form" : "Generate / Override"}
        </button>
      </div>

      {isLoading ? (
        <div className="py-2 text-[11px] text-gray-400">
          Loading CTO code...
        </div>
      ) : ctoData ? (
        <div className="mt-2.5 rounded-md bg-white border border-[#dfe8f1] p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">
              Active CTO Code:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                {ctoData.cto_code}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(ctoData.cto_code)}
                className="text-[10px] font-medium text-primary hover:underline cursor-pointer bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200"
              >
                Copy
              </button>
            </div>
          </div>
          {ctoData.otp_code && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500">OTP Code:</span>
              <span className="font-mono font-semibold text-gray-800">
                {ctoData.otp_code}
              </span>
            </div>
          )}
          {ctoData.amount && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Authorized Amount:</span>
              <span className="font-semibold text-gray-800">
                {ctoData.amount} USDT
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Status:</span>
            <span
              className={`capitalize font-semibold ${
                ctoData.status === "pending"
                  ? "text-amber-600"
                  : ctoData.status === "used"
                    ? "text-green-600"
                    : "text-red-500"
              }`}
            >
              {ctoData.status}
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-gray-400 italic">
          No pending CTO code for this user.
        </p>
      )}

      {showGenerateForm && (
        <form
          onSubmit={handleGenerate}
          className="mt-3 space-y-2 border-t border-[#dfe8f1] pt-2.5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Custom CTO Code (optional)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="h-8 rounded-md border border-[#dfe8f1] bg-white px-2.5 text-[11px] outline-none focus:border-primary"
            />
            <FormattedInput
              name="amount"
              placeholder="Amount (optional)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-8 rounded-md border border-[#dfe8f1] bg-white px-2.5 text-[11px] outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded border-gray-300 text-primary"
            />
            <label
              htmlFor="sendEmail"
              className="text-[11px] text-gray-600 cursor-pointer"
            >
              Send notification email to user
            </label>
          </div>
          <button
            type="submit"
            disabled={generateMutation.isPending}
            className="w-full rounded-md bg-primary py-2 text-[11px] font-semibold text-white transition hover:bg-primary/80 disabled:opacity-60 cursor-pointer"
          >
            {generateMutation.isPending
              ? "Generating..."
              : "Generate & Save CTO Code"}
          </button>
        </form>
      )}
    </div>
  );
};

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [balanceModal, setBalanceModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "disable" | "enable" | "delete" | "restore" | null
  >(null);
  const [reason, setReason] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceDescription, setBalanceDescription] = useState("");

  const { data, isLoading, error } = useAdminUsers(currentPage, itemsPerPage);
  const users: AdminUser[] = data?.data ?? [];

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

  const getUserInitials = (first_name?: string, last_name?: string) => {
    return getInitials(first_name, last_name);
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

  const openBalanceModal = (user: AdminUser) => {
    setSelectedUser(user);
    setBalanceAmount("");
    setBalanceDescription("");
    setBalanceModal(true);
  };

  const openDisableModal = (user: AdminUser) => {
    setSelectedUser(user);
    setReason("");
    setDisableModal(true);
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
        toast.success(`${selectedUser.first_name} has been disabled`);
      } else if (confirmAction === "enable") {
        await enableMutation.mutateAsync({ userId: selectedUser.id });
        toast.success(`${selectedUser.first_name} has been re-activated`);
      } else if (confirmAction === "delete") {
        await deleteMutation.mutateAsync({ userId: selectedUser.id });
        toast.success(`${selectedUser.first_name} has been deleted`);
      } else {
        await restoreMutation.mutateAsync({ userId: selectedUser.id });
        toast.success(`${selectedUser.first_name} has been restored`);
      }
      setConfirmAction(null);
      setUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Action failed"));
    }
  };

  const handleDisable = async () => {
    if (!selectedUser) return;
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    try {
      await disableMutation.mutateAsync({
        userId: selectedUser.id,
        reason: reason.trim(),
      });
      toast.success(`${selectedUser.first_name} has been disabled`);
      setDisableModal(false);
      setUserModal(false);
      setSelectedUser(null);
      setReason("");
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
      setBalanceModal(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update balance"));
    }
  };

  const statusBadge = (status: AdminUser["is_disabled"]) => (
    <span
      className={`px-3 py-1 rounded-xl font-medium capitalize ${
        !status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      }`}
    >
      {!status ? "Active" : "Disabled"}
    </span>
  );

  const columns = [
    {
      label: "USER",
      key: "username",
      render: (item: AdminUser) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-white uppercase">
            {getUserInitials(item.first_name, item.last_name)}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#172b4d]">
              {item.first_name} {item.last_name}
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
    // {
    //   label: "ROLE",
    //   key: "role",
    //   render: (item: AdminUser) => (
    //     <span className="px-3 py-1 rounded-xl font-medium capitalize bg-primary/10 text-primary">
    //       {item.role}
    //     </span>
    //   ),
    // },
    {
      label: "ACCOUNT STATUS",
      key: "status",
      render: (item: AdminUser) => statusBadge(item.is_disabled),
    },
    // {
    //   label: "WALLET BALANCE",
    //   key: "wallet_balance",
    //   render: (item: AdminUser) => (
    //     <span className="font-semibold">{item.wallet_balance}.00 USDT</span>
    //   ),
    // },
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
            setSelectedUser(item);
            setConfirmAction("delete");
          }}
          otherActions={[
            {
              name: "Update Balance",
              icon: <LuWallet />,
              tone: "default" as const,
              action: () => openBalanceModal(item),
            },
            ...(!item.is_disabled
              ? [
                  {
                    name: "Disable",
                    icon: <FaLock />,
                    tone: "danger" as const,
                    action: () => openDisableModal(item),
                  },
                ]
              : [
                  {
                    name: "Re-activate",
                    icon: <FaCheck />,
                    tone: "success" as const,
                    action: () => {
                      setSelectedUser(item);
                      setConfirmAction("enable");
                    },
                  },
                  {
                    name: "Restore",
                    icon: <FaRotateLeft />,
                    tone: "default" as const,
                    action: () => {
                      setSelectedUser(item);
                      setConfirmAction("restore");
                    },
                  },
                ]),
          ]}
        />
      ),
    },
  ];

  const confirmLabels = {
    disable: {
      title: "Disable this account?",
      message: `${selectedUser?.first_name} will lose access to the platform immediately.`,
      text: "Yes, Disable",
    },
    enable: {
      title: "Re-activate this account?",
      message: `${selectedUser?.first_name} will regain access to the platform.`,
      text: "Yes, Re-activate",
    },
    delete: {
      title: "Delete this account?",
      message: `${selectedUser?.first_name}'s account will be permanently deleted. This cannot be undone.`,
      text: "Yes, Delete",
    },
    restore: {
      title: "Restore this account?",
      message: `${selectedUser?.first_name}'s account will be restored.`,
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
                {getUserInitials(
                  selectedUser.first_name,
                  selectedUser.last_name,
                )}
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#172b4d]">
                  {selectedUser.first_name}
                </p>
                <span className="mt-1 inline-block">
                  {statusBadge(selectedUser.is_disabled)}
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
                // {
                //   label: "Wallet Balance",
                //   value: `${selectedUser.wallet_balance}.00 USDT`,
                // },
                {
                  label: "Joined",
                  value: formatShortDate(selectedUser.created_at),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-[#e3eaf2] pb-3"
                >
                  <span className="text-[11px] text-[#8190a3]">
                    {row.label}
                  </span>
                  <span className="text-[12px] font-semibold text-[#172b4d] capitalize text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTO Clearance Code management */}
            <UserCtoSection userId={selectedUser.id} />

            {/* Modal Actions */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  const target = selectedUser;
                  setUserModal(false);
                  openBalanceModal(target);
                }}
                className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition hover:bg-primary/80 cursor-pointer"
              >
                Update Balance
              </button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {!selectedUser.is_disabled ? (
                  <button
                    type="button"
                    onClick={() => {
                      const target = selectedUser;
                      setUserModal(false);
                      openDisableModal(target);
                    }}
                    className="w-full rounded-lg py-2.5 text-xs font-semibold text-white transition cursor-pointer bg-red-500 hover:bg-red-600"
                  >
                    Disable Account
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setUserModal(false);
                        setConfirmAction("enable");
                      }}
                      className="w-full rounded-lg py-2.5 text-xs font-semibold text-white transition cursor-pointer bg-[#05a957] hover:bg-[#04984e]"
                    >
                      Re-activate Account
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserModal(false);
                        setConfirmAction("restore");
                      }}
                      className="w-full rounded-lg border border-primary py-2.5 text-xs font-semibold text-primary transition cursor-pointer hover:bg-primary/5"
                    >
                      Restore Account
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setUserModal(false);
                    setConfirmAction("delete");
                  }}
                  className="w-full rounded-lg border border-red-200 py-2.5 text-xs font-semibold text-red-600 transition cursor-pointer hover:bg-red-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Balance Modal */}
      {balanceModal && selectedUser && (
        <Modal onClose={() => setBalanceModal(false)}>
          <div className="p-4">
            <h3 className="text-[18px] font-bold text-[#0B2D5B]">
              Update Balance (Hidden Transaction)
            </h3>
            <p className="mt-1 text-[12px] text-[#8190a3]">
              Update balance for {selectedUser.first_name} {selectedUser.last_name}.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <FormattedInput
                name="balanceAmount"
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

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBalanceModal(false)}
                className="rounded-lg border border-[#dfe8f1] px-4 py-2 text-[12px] font-semibold text-[#52677c] transition hover:bg-[#f8fafc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBalanceUpdate}
                disabled={balanceMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-primary/80 disabled:opacity-60 cursor-pointer"
              >
                {balanceMutation.isPending ? "Updating..." : "Update Balance"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Disable Account Modal */}
      {disableModal && selectedUser && (
        <Modal onClose={() => setDisableModal(false)}>
          <div className="p-4">
            <h3 className="text-[18px] font-bold text-red-600">
              Disable Account
            </h3>
            <p className="mt-1 text-[12px] text-[#8190a3]">
              {selectedUser.first_name} will lose access to the platform immediately.
            </p>

            <div className="mt-4">
              <label className="mb-1 block text-[11px] font-semibold text-[#172b4d]">
                Reason (required to disable)
              </label>
              <textarea
                rows={3}
                placeholder="Reason for disabling this account"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full resize-none rounded-md border border-[#dfe8f1] px-3 py-2 text-[11px] outline-none focus:border-primary"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDisableModal(false)}
                className="rounded-lg border border-[#dfe8f1] px-4 py-2 text-[12px] font-semibold text-[#52677c] transition hover:bg-[#f8fafc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisable}
                disabled={disableMutation.isPending}
                className="rounded-lg bg-red-500 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-60 cursor-pointer"
              >
                {disableMutation.isPending ? "Disabling..." : "Disable Account"}
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
        message={confirmAction ? confirmLabels[confirmAction].message : ""}
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
