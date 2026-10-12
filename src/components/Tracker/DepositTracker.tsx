import { useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  CircleDollarSign,
  WalletCards,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import type { DepositDetail } from "../../services/depositServices";
import { useDeposit } from "../../hooks/useClientData";
import { formatISODateToCustom } from "../../helpers/formatterUtility";

export type DepositStatus =
  | "payment_sent"
  | "request_submitted"
  | "pending_verification"
  | "approved"
  | "wallet_credited"
  | "rejected";

const statusMap: Record<string, DepositStatus> = {
  pending: "pending_verification",
  processing: "pending_verification",
  in_review: "pending_verification",
  submitted: "request_submitted",
  approved: "approved",
  completed: "wallet_credited",
  credited: "wallet_credited",
  success: "wallet_credited",
  rejected: "rejected",
  declined: "rejected",
  failed: "rejected",
};

export interface DepositStatusTrackerProps {
  status?: DepositStatus;
  deposit?: DepositDetail | null;
  depositId?: number | string | null;
  isLoading?: boolean;
  onClose?: () => void;
}

const steps = [
  {
    id: "payment_sent",
    label: "Payment Sent",
    icon: CircleDollarSign,
  },
  {
    id: "request_submitted",
    label: "Request Submitted",
    icon: ClipboardCheck,
  },
  {
    id: "pending_verification",
    label: "Pending Verification",
    icon: Clock3,
  },
  {
    id: "approved",
    label: "Approved",
    icon: CheckCircle2,
  },
  {
    id: "wallet_credited",
    label: "Wallet Credited",
    icon: WalletCards,
  },
] as const;

const DepositStatusTracker = ({
  status,
  deposit,
  depositId,
  isLoading = false,
  onClose,
}: DepositStatusTrackerProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // If depositId is provided and deposit is not passed directly, use the hook
  const { data: fetchedDeposit, isLoading: queryLoading } = useDeposit(
    deposit ? null : depositId
  );

  const activeDeposit = deposit ?? fetchedDeposit;
  const isFetching =
    isLoading || (Boolean(depositId) && !deposit && queryLoading);

  const resolvedStatus: DepositStatus =
    status ??
    (activeDeposit?.status
      ? statusMap[activeDeposit.status.toLowerCase()] ?? "pending_verification"
      : "pending_verification");

  const currentIndex = steps.findIndex((step) => step.id === resolvedStatus);
  const isRejected = resolvedStatus === "rejected";

  const handleCopy = async (text: string, field: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const formattedAmount = activeDeposit?.amount
    ? Number(activeDeposit.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })
    : null;

  const walletType =
    activeDeposit?.wallet_address?.type ||
    (typeof activeDeposit?.network === "string" ? activeDeposit.network : "USDT");

  const walletAddress =
    activeDeposit?.wallet_address?.address ||
    (typeof activeDeposit?.destination_address === "string"
      ? activeDeposit.destination_address
      : "");

  const displayDate = activeDeposit?.created_at
    ? formatISODateToCustom(activeDeposit.created_at)
    : "";

  const rejectionReason =
    activeDeposit?.remarks ||
    activeDeposit?.note ||
    activeDeposit?.admin_remarks;

  return (
    <div className="w-full rounded-xl border border-secondary bg-white p-5 shadow-[0_2px_10px_rgba(15,45,75,0.04)]">
      {/* Top Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-primary">
                Deposit Status & Tracker
              </h3>
              {isFetching && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              )}
            </div>

            {activeDeposit?.reference_id && (
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                <span>Ref:</span>
                <span className="font-mono font-semibold text-primary">
                  {activeDeposit.reference_id}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(activeDeposit.reference_id, "ref")
                  }
                  className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-primary transition"
                  title="Copy Reference ID"
                >
                  {copiedField === "ref" ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {resolvedStatus === "pending_verification" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 border border-amber-200">
              <Clock3 className="h-3 w-3 animate-pulse" />
              Pending Verification
            </span>
          )}
          {resolvedStatus === "approved" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-blue-200">
              <CheckCircle2 className="h-3 w-3" />
              Approved
            </span>
          )}
          {resolvedStatus === "wallet_credited" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 border border-green-200">
              <CheckCircle2 className="h-3 w-3" />
              Wallet Credited
            </span>
          )}
          {resolvedStatus === "rejected" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 border border-red-200">
              <AlertCircle className="h-3 w-3" />
              Rejected
            </span>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              title="Dismiss Tracker"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real Deposit Details Card (shown when deposit details are available) */}
      {activeDeposit && (
        <div className="mb-5 rounded-lg border border-[#e5edf5] bg-[#f8fafc] p-3.5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </p>
              <p className="text-[13px] font-bold text-primary">
                {formattedAmount} USDT
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Network
              </p>
              <p className="text-[12px] font-semibold text-primary">
                {walletType}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Submitted At
              </p>
              <p className="text-[11px] font-semibold text-primary">
                {displayDate || "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Payment Proof
              </p>
              {activeDeposit.proof_image_url ? (
                <a
                  href={activeDeposit.proof_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  View Receipt
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-[11px] text-gray-400">Attached</span>
              )}
            </div>
          </div>

          {walletAddress && (
            <div className="mt-2.5 pt-2.5 border-t border-[#e2e8f0] flex items-center justify-between text-[11px]">
              <span className="text-gray-500 font-medium">Deposit Address:</span>
              <div className="flex items-center gap-1.5 font-mono text-primary font-medium truncate max-w-[70%]">
                <span className="truncate">{walletAddress}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(walletAddress, "address")}
                  className="rounded p-0.5 text-gray-400 hover:text-primary transition shrink-0"
                  title="Copy Address"
                >
                  {copiedField === "address" ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alert Banner */}
      {resolvedStatus === "pending_verification" && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Clock3 className="h-4 w-4 text-amber-700" />
          </div>
          <p className="text-[11px] font-medium text-amber-800">
            Your deposit request is under manual review. Once confirmed, your wallet balance will be credited automatically.
          </p>
        </div>
      )}

      {resolvedStatus === "approved" && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-[11px] font-medium text-blue-700">
            Your deposit has been approved by admin! Wallet balance crediting is now in progress.
          </p>
        </div>
      )}

      {resolvedStatus === "wallet_credited" && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-[11px] font-medium text-green-700">
            Deposit completed! Your wallet has been successfully credited with the funds.
          </p>
        </div>
      )}

      {isRejected && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <p className="text-[11px] font-semibold text-red-700">
              Deposit request declined
            </p>
          </div>
          <p className="mt-1 text-[11px] text-red-600">
            {rejectionReason
              ? `Reason: ${rejectionReason}`
              : "Your deposit could not be approved. Please contact support or submit a new request with valid payment proof."}
          </p>
        </div>
      )}

      {/* Flow Header */}
      <h4 className="mb-4 text-[12px] font-bold text-primary">
        Verification Progress
      </h4>

      {/* Horizontal Steps Tracker */}
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-[620px] items-start pb-1">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = isRejected
              ? index < 2
              : currentIndex >= 0 && index < currentIndex;
            const isCurrent = !isRejected && index === currentIndex;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className={`flex items-start ${
                  isLast ? "flex-none" : "flex-1"
                }`}
              >
                {/* Step Item */}
                <div className="flex min-w-[95px] flex-col items-center">
                  <div
                    className={`
                      flex h-11 w-11 items-center justify-center
                      rounded-full transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-green-100 text-green-700 ring-2 ring-green-400"
                          : isCurrent
                            ? "bg-primary text-white shadow-md ring-4 ring-primary/20"
                            : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p
                    className={`
                      mt-2 max-w-[95px] text-center text-[10px] font-semibold
                      ${
                        isCompleted
                          ? "text-green-700"
                          : isCurrent
                            ? "text-primary font-bold"
                            : "text-gray-400"
                      }
                    `}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div className="flex flex-1 items-center px-1 pt-[21px]">
                    <div
                      className={`
                        h-[2px] w-full transition-all duration-500
                        ${
                          index < currentIndex && !isRejected
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }
                      `}
                    />

                    <div
                      className={`
                        -ml-1 h-2 w-2 rotate-45 border-r-2 border-t-2
                        ${
                          index < currentIndex && !isRejected
                            ? "border-green-500"
                            : "border-gray-200"
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepositStatusTracker;