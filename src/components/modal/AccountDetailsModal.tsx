import React, { useState } from "react";
import Modal from "./Modal";
import { Copy, Check, Landmark, ShieldCheck } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import {
  BANK_METADATA,
  getBankAccountNumber,
} from "../../services/transferServices";
import { toast } from "sonner";

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const accountNumber = getBankAccountNumber(user);
  const holderName =
    user?.full_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.username ||
    "Account Holder";

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rows = [
    { label: "Bank Name", value: BANK_METADATA.bankName, key: "bank", copyable: false },
    { label: "Account Holder", value: holderName, key: "holder", copyable: false },
    {
      label: "Account Number",
      value: accountNumber,
      key: "acct",
      copyable: true,
    },
    {
      label: "Routing Number (ABA)",
      value: BANK_METADATA.routingNumber,
      key: "routing",
      copyable: true,
    },
    {
      label: "SWIFT / BIC Code",
      value: BANK_METADATA.swiftBic,
      key: "swift",
      copyable: true,
    },
    { label: "Account Type", value: "Premier Checking (USD)", key: "type", copyable: false },
    { label: "Bank Address", value: BANK_METADATA.headquarters, key: "addr", copyable: false },
    { label: "Deposit Insurance", value: BANK_METADATA.fdicStatus, key: "fdic", copyable: false },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="p-1 sm:p-2">
        <div className="flex items-start sm:items-center gap-3 mb-2">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Landmark size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-[18px] font-bold text-[#0B2D5B] leading-tight">
              Direct Deposit & Account Coordinates
            </h3>
            <p className="text-[11px] sm:text-[12px] text-[#8190a3] mt-0.5">
              Share these details to receive wire transfers, direct deposits, or P2P payments.
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 grid gap-2.5 sm:gap-3">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-[#e3eaf2] pb-2 sm:pb-3"
            >
              <span className="text-[10px] sm:text-[11px] text-[#8190a3] uppercase tracking-wider shrink-0 font-medium">
                {row.label}
              </span>
              <div className="flex items-center justify-between sm:justify-end gap-2 min-w-0">
                <span className="text-[11px] sm:text-[12px] font-semibold text-[#172b4d] font-mono break-all text-left sm:text-right">
                  {row.value}
                </span>
                {row.copyable && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(row.value, row.key, row.label)}
                    className="cursor-pointer text-primary hover:opacity-80 p-1 transition shrink-0"
                    title={`Copy ${row.label}`}
                  >
                    {copiedKey === row.key ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 sm:p-3 border border-gray-200 text-[11px] sm:text-xs text-gray-600">
          <ShieldCheck size={16} className="text-green-600 shrink-0" />
          <span className="leading-tight">
            People's Choice Bank accounts are protected by dual-factor encryption and 24/7 transaction monitoring.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default AccountDetailsModal;
