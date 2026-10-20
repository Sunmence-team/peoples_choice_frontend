import React, { useState } from "react";
import {
  Copy,
  Check,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "./Modal";
import { useAdminUserCtoCode } from "../../hooks/useAdminData";
import { formatShortDate } from "../../helpers/formatterUtility";
import type { AdminUserCodesModalProps } from "../../lib/interfaces";

export const AdminUserCodesModal: React.FC<AdminUserCodesModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { data, isLoading, isError } = useAdminUserCtoCode(
    isOpen && user ? user.id : null,
  );

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const codeData = data?.data;

  return (
    <Modal onClose={onClose}>
      <div className="">
        {/* Header */}
        {data && (
          <div className="flex items-center justify-between border-b border-[#e3eaf2] pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#0B2D5B]">
                  Withdrawal Clearance Codes
                </h3>
                <p className="text-[11px] text-[#8190a3]">
                  {data.user.name} ({data.user.email})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary mb-2" />
            <p className="text-xs text-gray-500 font-medium">
              Fetching clearance codes...
            </p>
          </div>
        ) : isError || !codeData ? (
          <div className="py-8 px-4 text-center">
            <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-800">
              No Clearance Codes Available
            </h4>
            <p className="mt-1 text-[11.5px] text-gray-500 max-w-xs mx-auto leading-relaxed">
              No active or previous CTO/OTC clearance code records exist for
              this user account.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Primary Codes Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* CTO Code Card */}
              <div className="rounded-xl border border-secondary bg-[#f8fafc] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-bold text-[#8190a3] uppercase tracking-wider">
                    CTO Clearance Code
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(codeData.cto_code, "CTO Code")
                    }
                    className="flex items-center gap-1 text-[10.5px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {copiedField === "CTO Code" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>
                      {copiedField === "CTO Code" ? "Copied" : "Copy"}
                    </span>
                  </button>
                </div>
                <div className="font-mono text-sm sm:text-base font-bold text-primary tracking-wide select-all">
                  {codeData.cto_code || "—"}
                </div>
              </div>

              {/* OTC Code Card */}
              <div className="rounded-xl border border-secondary bg-[#f8fafc] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-bold text-[#8190a3] uppercase tracking-wider">
                    OTC Code
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(codeData.otc_code, "OTC Code")
                    }
                    className="flex items-center gap-1 text-[10.5px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {copiedField === "OTC Code" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>
                      {copiedField === "OTC Code" ? "Copied" : "Copy"}
                    </span>
                  </button>
                </div>
                <div className="font-mono text-sm sm:text-base font-bold text-primary tracking-wide select-all">
                  {codeData.otc_code || "—"}
                </div>
              </div>
            </div>

            {/* OTP Verification & Amount */}
            <div className="rounded-xl border border-secondary bg-white p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  OTP Verification Code:
                </span>
                <span className="font-mono font-bold text-primary bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {codeData.otp_code}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  OTP Verification Status:
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                    codeData.is_otp_verified
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {codeData.is_otp_verified ? "Verified" : "Unverified"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  Withdrawal Amount:
                </span>
                <span className="font-bold text-primary">
                  $
                  {Number(codeData.amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  USD
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Code Status:</span>
                <span className="capitalize font-semibold text-primary">
                  {codeData.status}
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="rounded-xl bg-gray-50 p-3 text-[11px] space-y-1.5 border border-secondary text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Created At:</span>
                <span className="font-medium">
                  {formatShortDate(codeData.created_at)}
                </span>
              </div>
              {codeData.otp_verified_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">OTP Verified At:</span>
                  <span className="font-medium">
                    {formatShortDate(codeData.otp_verified_at)}
                  </span>
                </div>
              )}
              {codeData.otc_requested_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">OTC Requested At:</span>
                  <span className="font-medium">
                    {formatShortDate(codeData.otc_requested_at)}
                  </span>
                </div>
              )}
              {codeData.otp_expires_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Expires At:</span>
                  <span className="font-medium">
                    {formatShortDate(codeData.otp_expires_at)}
                  </span>
                </div>
              )}
              {codeData.used_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Used At:</span>
                  <span className="font-medium">
                    {formatShortDate(codeData.used_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdminUserCodesModal;
