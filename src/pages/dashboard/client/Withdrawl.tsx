import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ChevronDown,
  CircleUserRound,
} from "lucide-react";
import { WithdrawalStatusFlow } from "../../../components/Tracker/WithdrawlTracker";

type Network = "TRC20" | "ERC20" | "BEP20";

interface WithdrawalFormValues {
  amount: string;
  network: Network | "";
  walletAddress: string;
  note: string;
}

const AVAILABLE_BALANCE = 2450;

const networks: Network[] = ["TRC20", "ERC20", "BEP20"];

const validationSchema = Yup.object({
  amount: Yup.number()
    .typeError("Please enter a valid amount")
    .required("Withdrawal amount is required")
    .positive("Amount must be greater than 0")
    .max(
      AVAILABLE_BALANCE,
      `Amount cannot exceed your available balance of ${AVAILABLE_BALANCE} USDT`
    ),

  network: Yup.string()
    .oneOf(["TRC20", "ERC20", "BEP20"], "Please select a valid network")
    .required("Please select a network"),

  walletAddress: Yup.string()
    .trim()
    .required("Wallet address is required")
    .min(10, "Please enter a valid wallet address"),

  note: Yup.string()
    .max(250, "Note cannot exceed 250 characters"),
});

export default function Withdrawal() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<WithdrawalFormValues>({
    initialValues: {
      amount: "",
      network: "",
      walletAddress: "",
      note: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        console.log("Withdrawal request:", values);

        // Later:
        // await withdrawalMutation.mutateAsync(values);

        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        formik.resetForm();
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const amountError =
    formik.touched.amount && formik.errors.amount;

  const networkError =
    formik.touched.network && formik.errors.network;

  const walletError =
    formik.touched.walletAddress &&
    formik.errors.walletAddress;

    const style = "w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-3 text-xs text-primary outline-none transition placeholder:text-gray-400"

  return (
    <div className="w-full">
      {/* Page heading */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-primary">
          Withdraw Funds
        </h1>

        <p className="mt-1 text-[13px] font-medium text-gray-500">
          Request a withdrawal from your available wallet
          balance.
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">

        <div className="overflow-hidden rounded-xl border border-secondary bg-white">
          {/* Balance */}
          <div className="border-b border-gray-200 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tetiary">
                <CircleUserRound
                  className="h-5 w-5 text-white"
                  strokeWidth={2}
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold text-gray-500">
                  Available Balance
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary">
                    {AVAILABLE_BALANCE.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>

                  <span className="text-[12px] font-bold text-primary">
                    USDT
                  </span>
                </div>

                <p className="text-[10px] font-medium text-gray-400">
                  ≈ ${AVAILABLE_BALANCE.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 p-5"
          >
            {/* Withdrawal Amount */}
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-[11px] font-bold text-primary"
              >
                Withdrawal Amount (USDT)
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="any"
                placeholder="Enter amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-10 w-full rounded-lg border bg-white px-3 text-xs text-primary outline-none transition placeholder:text-gray-400 ${
                  amountError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:border-primary"
                }`}
              />

              {amountError && (
                <p className="mt-1 text-[10px] font-medium text-red-500">
                  {formik.errors.amount}
                </p>
              )}
            </div>

            {/* Network */}
            <div>
              <label
                htmlFor="network"
                className="mb-2 block text-[11px] font-bold text-primary"
              >
                USDT Network
              </label>

              <div className="relative">
                <select
                  id="network"
                  name="network"
                  value={formik.values.network}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-10 text-xs text-primary outline-none transition ${
                    networkError
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:border-primary"
                  }`}
                >
                  <option value="">Select network</option>

                  {networks.map((network) => (
                    <option
                      key={network}
                      value={network}
                    >
                      {network}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              {networkError && (
                <p className="mt-1 text-[10px] font-medium text-red-500">
                  {formik.errors.network}
                </p>
              )}
            </div>

            {/* Wallet Address */}
            <div>
              <label
                htmlFor="walletAddress"
                className="mb-2 block text-[11px] font-bold text-primary"
              >
                USDT Wallet Address
              </label>

              <input
                id="walletAddress"
                name="walletAddress"
                type="text"
                placeholder="Enter wallet address"
                value={formik.values.walletAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-10 w-full rounded-lg border bg-white px-3 text-xs text-primary outline-none transition placeholder:text-gray-400 ${
                  walletError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:border-primary"
                }`}
              />

              {walletError && (
                <p className="mt-1 text-[10px] font-medium text-red-500">
                  {formik.errors.walletAddress}
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <label
                htmlFor="note"
                className="mb-2 block text-[11px] font-bold text-primary"
              >
                Withdrawal Note (Optional)
              </label>

              <textarea
                id="note"
                name="note"
                rows={3}
                placeholder="Add a note (optional)"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={style}
              />

              {formik.touched.note &&
                formik.errors.note && (
                  <p className="mt-1 text-[10px] font-medium text-red-500">
                    {formik.errors.note}
                  </p>
                )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-tertiary text-[11px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-30"
                    />

                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>

                  Submitting...
                </>
              ) : (
                "Submit Withdrawal Request"
              )}
            </button>
          </form>
        </div>

        <WithdrawalStatusFlow status="pending_review" />
      </div>
    </div>
  );
}