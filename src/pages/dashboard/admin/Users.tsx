import React, { useState } from "react";
import { toast } from "sonner";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import Modal from "../../../components/modal/Modal";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import { adminUsers } from "../../../lib/adminData";
import {
  formatShortDate,
  getInitials,
} from "../../../helpers/formatterUtility";
import type { AdminUser } from "../../../lib/interfaces";

const Users: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserInitials = (fullName: string) => {
    const [first = "", last = ""] = fullName.split(" ");
    return getInitials(first, last);
  };

  const openUser = (id: number) => {
    const found = users.find((item) => item.id === id);
    if (found) {
      setSelectedUser(found);
      setUserModal(true);
    }
  };

  const toggleAccountStatus = () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((item) =>
          item.id === selectedUser.id
            ? {
                ...item,
                status: item.status === "active" ? "disabled" : "active",
              }
            : item,
        ),
      );
      toast.success(
        selectedUser.status === "active"
          ? `${selectedUser.full_name} has been disabled`
          : `${selectedUser.full_name} has been re-activated`,
      );
      setIsSubmitting(false);
      setConfirmOpen(false);
      setUserModal(false);
      setSelectedUser(null);
    }, 600);
  };

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
      render: (item: AdminUser) => (
        <span
          className={`px-3 py-1 rounded-xl font-medium capitalize ${
            item.status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item.status}
        </span>
      ),
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
        />
      ),
    },
  ];

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
        isLoading={false}
        error={false}
        data={users}
        columns={columns}
        currentPage={1}
        totalPages={1}
        totalItems={users.length}
        setCurrentPage={() => {}}
        itemsPerPage={10}
        setItemsPerPage={() => {}}
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
                <span
                  className={`mt-1 inline-block px-3 py-1 rounded-xl font-medium capitalize text-[9px] ${
                    selectedUser.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                { label: "Username", value: `@${selectedUser.username}` },
                { label: "Email", value: selectedUser.email },
                { label: "Phone", value: selectedUser.phone },
                { label: "Country", value: selectedUser.country },
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

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition cursor-pointer ${
                selectedUser.status === "active"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#05a957] hover:bg-[#04984e]"
              }`}
            >
              {selectedUser.status === "active" ? "Disable Account" : "Re-activate Account"}
            </button>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title={
          selectedUser?.status === "active"
            ? "Disable this account?"
            : "Re-activate this account?"
        }
        message={`${selectedUser?.full_name} will ${
          selectedUser?.status === "active" ? "lose" : "gain"
        } access to the platform immediately.`}
        confirmText={
          selectedUser?.status === "active" ? "Yes, Disable" : "Yes, Re-activate"
        }
        onCancel={() => setConfirmOpen(false)}
        onConfirm={toggleAccountStatus}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default Users;