import {
  Check,
  CircleUserRound,
  ShieldCheck,
  X,
} from "lucide-react";

type WithdrawalStatus =
  | "submitted"
  | "pending_review"
  | "approved"
  | "rejected";

interface WithdrawalStatusFlowProps {
  status?: WithdrawalStatus;
}

export function WithdrawalStatusFlow({
  status = "pending_review",
}: WithdrawalStatusFlowProps) {
  const isSubmitted =
    status === "submitted" ||
    status === "pending_review" ||
    status === "approved";

  const isPending =
    status === "pending_review" ||
    status === "approved";

  const isApproved = status === "approved";

  const isRejected = status === "rejected";

  return (
    <div className="rounded-xl border border-secondary bg-white">
      {/* Information */}
      <div className="p-4">
        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck
                className="h-4 w-4 text-green-600"
                strokeWidth={2.5}
              />
            </div>

            <p className="text-[11px] font-semibold leading-5 text-green-700">
              Withdrawal requests are reviewed manually.
              Approved payments will be marked Completed
              after processing.
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="border-t border-gray-200 px-5 py-5">
        <h2 className="mb-6 text-sm font-bold text-primary">
          Withdrawal Status Flow
        </h2>

        {/* Main horizontal flow */}
        <div className="flex items-start">
          {/* Submitted */}
          <StatusStep
            label="Submitted"
            icon={
              <CircleUserRound className="h-4 w-4" />
            }
            active={isSubmitted}
            completed={
              status === "pending_review" ||
              status === "approved"
            }
          />

          {/* Arrow */}
          <StatusArrow active={isPending} />

          {/* Pending */}
          <StatusStep
            label={
              <>
                Pending
                <br />
                Review
              </>
            }
            icon={
              <CircleUserRound className="h-4 w-4" />
            }
            active={isPending}
            completed={isApproved}
          />

          {/* Arrow */}
          <StatusArrow active={isApproved} />

          {/* Approved */}
          <StatusStep
            label="Approved"
            icon={<Check className="h-4 w-4" />}
            active={isApproved}
            completed={isApproved}
          />
        </div>

        {/* Rejected branch */}
        <div className="relative ml-[50%] mt-2 flex flex-col items-center">
          {/* Down arrow */}
          <div className="mb-2 flex h-7 flex-col items-center">
            <div className="h-4 w-[2px] bg-gray-300" />

            <div className="h-2 w-2 rotate-45 border-b-2 border-r-2 border-gray-300" />
          </div>

          {/* Rejected */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isRejected
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <X
                className="h-5 w-5"
                strokeWidth={2.5}
              />
            </div>

            <span
              className={`mt-2 text-[10px] font-semibold ${
                isRejected
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              Rejected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Status Step */
/* ---------------------------------- */

interface StatusStepProps {
  label: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
  completed: boolean;
}

function StatusStep({
  label,
  icon,
  active,
  completed,
}: StatusStepProps) {
  return (
    <div className="flex min-w-[65px] flex-1 flex-col items-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
          completed
            ? "bg-green-600 text-white"
            : active
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-400"
        }`}
      >
        {icon}
      </div>

      <span
        className={`mt-2 text-center text-[10px] font-semibold leading-4 ${
          active
            ? "text-primary"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ---------------------------------- */
/* Arrow */
/* ---------------------------------- */

function StatusArrow({
  active,
}: {
  active: boolean;
}) {
  return (
    <div className="flex flex-1 items-center px-1 pt-5">
      <div
        className={`h-[2px] flex-1 ${
          active
            ? "bg-green-500"
            : "bg-gray-200"
        }`}
      />

      <div
        className={`h-2 w-2 rotate-45 border-r-2 border-t-2 ${
          active
            ? "border-green-500"
            : "border-gray-200"
        }`}
      />
    </div>
  );
}