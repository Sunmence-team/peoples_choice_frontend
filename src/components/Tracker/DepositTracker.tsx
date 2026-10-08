import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  CircleDollarSign,
  WalletCards,
} from "lucide-react";

export type DepositStatus =
  | "payment_sent"
  | "request_submitted"
  | "pending_verification"
  | "approved"
  | "wallet_credited"
  | "rejected";

interface DepositStatusTrackerProps {
  status: DepositStatus;
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
}: DepositStatusTrackerProps) => {
  const currentIndex = steps.findIndex(
    (step) => step.id === status
  );

  const isRejected = status === "rejected";

  return (
    <div className="w-full rounded-xl border border-secondary bg-white p-5">
      {/* Alert */}
      <div className="mb-5 flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-4 w-4 text-tertiary" />
        </div>

        <p className="text-[11px] font-medium text-green-700">
          Deposits are manually verified by our admin team.
          Your wallet balance will only be credited after
          approval.
        </p>
      </div>

      {/* Heading */}
      <h3 className="mb-5 text-[12px] font-bold text-primary">
        Deposit Status Flow
      </h3>

      {/* Tracker */}
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-[650px] items-start">
          {steps.map((step, index) => {
            const Icon = step.icon;

            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className={`flex items-start ${
                  isLast ? "flex-none" : "flex-1"
                }`}
              >
                {/* Step */}
                <div className="flex min-w-[100px] flex-col items-center">
                  {/* Icon circle */}
                  <div
                    className={`
                      flex h-11 w-11 items-center justify-center
                      rounded-full transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-green-50 text-tertiary"
                          : isCurrent
                            ? "bg-primary/10 text-primary ring-4 ring-primary/5"
                            : "bg-gray-50 text-gray-400"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Label */}
                  <p
                    className={`
                      mt-2 max-w-[90px] text-center text-[10px] font-semibold
                      ${
                        isCompleted || isCurrent
                          ? "text-primary"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div className="flex flex-1 items-center pt-[21px] px-2">
                    <div
                      className={`
                        h-[2px] w-full transition-all duration-500
                        ${
                          index < currentIndex
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }
                      `}
                    />

                    <div
                      className={`
                        -ml-1 h-2 w-2 rotate-45 border-r-2 border-t-2
                        ${
                          index < currentIndex
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

      {/* Rejected state */}
      {isRejected && (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[11px] font-semibold text-red-600">
            Deposit request rejected
          </p>

          <p className="mt-1 text-[10px] text-red-500">
            Your deposit could not be approved. Please
            contact support for more information.
          </p>
        </div>
      )}
    </div>
  );
};

export default DepositStatusTracker;