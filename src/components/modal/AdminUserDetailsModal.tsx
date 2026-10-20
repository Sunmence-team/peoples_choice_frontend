import React from "react";
import Modal from "./Modal";
import { formatShortDate, getInitials } from "../../helpers/formatterUtility";
import type { AdminUser } from "../../lib/interfaces";

interface AdminUserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onOpenBalanceModal: (user: AdminUser) => void;
  onOpenConfirmAction: (
    action: "disable" | "enable" | "delete" | "restore",
  ) => void;
}

export const AdminUserDetailsModal: React.FC<AdminUserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenBalanceModal,
  onOpenConfirmAction,
}) => {
  if (!isOpen || !user) return null;

  const rows = [
    { label: "USER ID", value: `#${user.id}` },
    { label: "FULL NAME", value: `${user.first_name} ${user.last_name}` },
    { label: "EMAIL", value: user.email },
    { label: "PHONE", value: user.phone || "-" },
    { label: "COUNTRY", value: user.country || "-" },
    { label: "ACCOUNT NUMBER", value: user.account_number || "-" },
    { label: "ROLE", value: user.role || "client" },
    { label: "WALLET BALANCE", value: `$${user.balance || 0} USD` },
    {
      label: "KYC STATUS",
      value: user.kyc_status || (user.is_verified ? "verified" : "unverified"),
    },
    { label: "STATUS", value: user.status },
    { label: "JOINED", value: formatShortDate(user.created_at) },
  ];

  return (
    <>
      <Modal onClose={onClose}>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3 border-b border-[#e3eaf2] pb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
              {getInitials(user.first_name, user.last_name)}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B2D5B]">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-[11px] text-[#8190a3] font-mono">
                @{user.username || user.email}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-[#e3eaf2] pb-2 text-xs"
              >
                <span className="text-[11px] text-[#8190a3] font-medium">
                  {row.label}
                </span>
                <span className="font-semibold text-[#172b4d] text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Modal Actions */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBalanceModal(user);
              }}
              className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition hover:bg-primary/90 cursor-pointer"
            >
              Update Balance
            </button>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {user.status === "active" ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConfirmAction("disable");
                  }}
                  className="w-full rounded-lg border border-amber-300 py-2 text-xs font-semibold text-amber-700 transition cursor-pointer hover:bg-amber-50"
                >
                  Disable Account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConfirmAction("enable");
                  }}
                  className="w-full rounded-lg border border-emerald-300 py-2 text-xs font-semibold text-emerald-700 transition cursor-pointer hover:bg-emerald-50"
                >
                  Enable Account
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenConfirmAction("delete");
                }}
                className="w-full rounded-lg border border-red-200 py-2 text-xs font-semibold text-red-600 transition cursor-pointer hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminUserDetailsModal;
