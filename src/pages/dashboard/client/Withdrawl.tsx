import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ChevronDown,
  CircleUserRound,
  Clock,
  Info,
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { WithdrawalStatusFlow } from "../../../components/Tracker/WithdrawlTracker";
import {
  useDashboard,
  useMyWithdrawals,
  useRequestWithdrawalOtp,
  useVerifyWithdrawalOtp,
  useRequestWithdrawalOtc,
  useSubmitWithdrawal,
  useWallets,
} from "../../../hooks/useClientData";
import { getErrorMessage } from "../../../helpers/api";
import FormattedInput from "../../../components/ui/FormattedInput";
import {  formatterUtility } from "../../../helpers/formatterUtility";

interface WithdrawalFormValues {
  amount: string;
  network: string;
  destination_address: string;
  otp_code: string;
  otc_code: string;
}

export default function Withdrawal() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { data: wallets } = useWallets();
  const { data: withdrawals } = useMyWithdrawals(1, 5);

  const requestOtpMutation = useRequestWithdrawalOtp();
  const verifyOtpMutation = useVerifyWithdrawalOtp();
  const requestOtcMutation = useRequestWithdrawalOtc();
  const submitMutation = useSubmitWithdrawal();

  const availableBalance = stats?.wallet_balance ?? 0;
  const networks = Array.from(
    new Set((wallets ?? []).map((wallet) => wallet.type)),
  );

  const formik = useFormik<WithdrawalFormValues>({
    initialValues: {
      amount: "",
      network: "",
      destination_address: "",
      otp_code: "",
      otc_code: "",
    },

    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError("Please enter a valid amount")
        .required("Withdrawal amount is required")
        .positive("Amount must be greater than 0")
        .max(
          availableBalance,
          `Amount cannot exceed your available balance of $${availableBalance.toLocaleString()}`,
        ),

      network: Yup.string().required("Please select a clearing rail / network"),

      destination_address: Yup.string()
        .trim()
        .required("Wallet or settlement destination address is required")
        .min(10, "Please enter a valid destination address"),

      ...(step >= 2
        ? {
            otp_code: Yup.string()
              .trim()
              .required("Email OTP code is required")
              .length(6, "OTP code must be exactly 6 digits"),
          }
        : {}),

      ...(step === 3
        ? {
            otc_code: Yup.string()
              .trim()
              .required("OTC clearance code is required"),
          }
        : {}),
    }),

    onSubmit: async (values, helpers) => {
      const wallet =
        wallets?.find((item) => item.type === values.network) ?? wallets?.[0];

      if (!wallet) {
        toast.error("No company wallet available for the selected network");
        return;
      }

      try {
        const res = await submitMutation.mutateAsync({
          amount: values.amount,
          destination_address: values.destination_address,
          wallet_address_id: wallet.id,
          crypto_type: values.network,
          otp_code: values.otp_code.trim(),
          otc_code: values.otc_code.trim(),
        });
        toast.success(
          res.message || "Withdrawal request submitted successfully",
        );
        helpers.resetForm();
        setStep(1);
        setExpiresAt(null);
      } catch (error) {
        toast.error(
          getErrorMessage(error, "Failed to submit withdrawal request"),
        );
      }
    },
  });

  useEffect(() => {
    if (!formik.values.network && networks.length > 0) {
      formik.setFieldValue("network", networks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networks.join(",")]);

  useEffect(() => {
    if (!expiresAt) return;
    const updateTimer = () => {
      const target = new Date(expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRequestOtp = async () => {
    formik.setFieldTouched("amount", true, true);
    formik.setFieldTouched("network", true, true);
    formik.setFieldTouched("destination_address", true, true);

    const errors = await formik.validateForm();
    if (errors.amount || errors.network || errors.destination_address) {
      return;
    }

    try {
      const res = await requestOtpMutation.mutateAsync({
        amount: formik.values.amount,
      });

      if (res.data?.expires_at) {
        setExpiresAt(res.data.expires_at);
      } else {
        const fallbackTarget = new Date(
          Date.now() + (res.data?.expires_in_minutes ?? 15) * 60 * 1000,
        ).toISOString();
        setExpiresAt(fallbackTarget);
      }

      setStep(2);
      toast.success(
        res.message ||
          "Withdrawal OTP requested. Please obtain your OTP and verify it.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to request withdrawal OTP"));
    }
  };

  const handleVerifyOtp = async () => {
    formik.setFieldTouched("otp_code", true, true);
    const errors = await formik.validateForm();
    if (errors.otp_code) {
      return;
    }

    try {
      const res = await verifyOtpMutation.mutateAsync(
        formik.values.otp_code.trim(),
      );
      toast.success(
        res.message ||
          "OTP verified successfully. Requesting OTC clearance code...",
      );

      // Now automatically request OTC code
      try {
        const otcRes = await requestOtcMutation.mutateAsync();
        toast.info(
          otcRes.message ||
            "OTC clearance code requested. Contact administrator/support to obtain your authorization code.",
        );
      } catch (otcErr) {
        toast.info(
          getErrorMessage(
            otcErr,
            "Please contact administrator for your OTC clearance code.",
          ),
        );
      }

      setStep(3);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to verify OTP code"));
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await requestOtpMutation.mutateAsync({
        amount: formik.values.amount,
      });

      if (res.data?.expires_at) {
        setExpiresAt(res.data.expires_at);
      } else {
        const fallbackTarget = new Date(
          Date.now() + (res.data?.expires_in_minutes ?? 15) * 60 * 1000,
        ).toISOString();
        setExpiresAt(fallbackTarget);
      }

      toast.success(res.message || "A new OTP code has been generated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to resend OTP code"));
    }
  };

  const amountError = formik.touched.amount && formik.errors.amount;
  const networkError = formik.touched.network && formik.errors.network;
  const walletError =
    formik.touched.destination_address && formik.errors.destination_address;
  const otpError = formik.touched.otp_code && formik.errors.otp_code;
  const otcError = formik.touched.otc_code && formik.errors.otc_code;

  const latestWithdrawal = withdrawals?.items?.[0];
  const statusMap: Record<
    string,
    "submitted" | "pending_review" | "approved" | "rejected"
  > = {
    pending: "pending_review",
    approved: "approved",
    completed: "approved",
    rejected: "rejected",
  };

  return (
    <div className="w-full">
      {/* Page heading */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-primary">
            Payout & External Withdrawal
          </h1>
          <p className="hidden md:block mt-0.5 text-xs font-medium text-gray-500">
            Request an external funds payout to your designated bank account or
            wire clearing destination.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-xl border border-secondary bg-white">
          {/* Balance header */}
          <div className="border-b border-gray-200 px-3.5 py-3 sm:px-4 sm:py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-primary">
                  <CircleUserRound
                    className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                    strokeWidth={2}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gray-500">
                    Available Account Balance
                  </p>

                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {statsLoading
                        ? "..."
                        : `${formatterUtility(Number(availableBalance))}`}
                    </span>

                    <span className="text-[11px] sm:text-[12px] font-bold text-primary">
                      USD
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-primary shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>
                  {step === 1
                    ? "Step 1 of 3: Details"
                    : step === 2
                      ? "Step 2 of 3: Verify OTP"
                      : "Step 3 of 3: OTC Clearance"}
                </span>
              </div>
            </div>
          </div>

          {/* Form container */}
          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="space-y-4 p-3.5 sm:p-5"
          >
            {step === 1 && (
              <>
                {/* Withdrawal Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-[11px] font-bold text-primary"
                  >
                    Withdrawal Amount (USD)
                  </label>

                  <FormattedInput
                    id="amount"
                    name="amount"
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
                    Clearing Rail / Network
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
                        <option key={network} value={network}>
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
                    htmlFor="destination_address"
                    className="mb-2 block text-[11px] font-bold text-primary"
                  >
                    Destination Account / Wire Settlement Address
                  </label>

                  <input
                    id="destination_address"
                    name="destination_address"
                    type="text"
                    placeholder="Enter destination account or wallet address"
                    value={formik.values.destination_address}
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
                      {formik.errors.destination_address}
                    </p>
                  )}
                </div>

                {/* Submit Step 1: Request OTP */}
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={requestOtpMutation.isPending}
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-primary hover:bg-primary/80 text-[11px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {requestOtpMutation.isPending ? (
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
                      Requesting OTP Code...
                    </>
                  ) : (
                    "Request 2FA OTP & Continue"
                  )}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Step Summary */}
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Amount:</span>
                    <span className="font-bold text-primary">
                      ${formik.values.amount} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Network:</span>
                    <span className="font-bold text-primary">
                      {formik.values.network}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Destination:</span>
                    <span className="font-mono text-[11px] text-gray-700 truncate max-w-[200px]">
                      {formik.values.destination_address}
                    </span>
                  </div>
                </div>

                {/* Timer Banner */}
                <div
                  className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs ${
                    timeLeft > 0
                      ? "bg-blue-50 border-blue-200 text-blue-900"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock
                      className={`h-4 w-4 ${
                        timeLeft > 0 ? "text-blue-600" : "text-red-600"
                      }`}
                    />
                    <span>
                      {timeLeft > 0 ? "OTP Expires In:" : "OTP Code Expired"}
                    </span>
                  </div>

                  {timeLeft > 0 ? (
                    <span className="font-mono font-bold text-blue-700">
                      {formatTimer(timeLeft)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-semibold text-red-600 underline hover:text-red-800 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Field: OTP Code */}
                <div>
                  <label
                    htmlFor="otp_code"
                    className="mb-2 block text-[11px] font-bold text-primary"
                  >
                    Enter 6-Digit OTP Code
                  </label>

                  <input
                    id="otp_code"
                    name="otp_code"
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit verification code"
                    value={formik.values.otp_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-10 w-full rounded-lg border bg-white px-3 text-xs text-primary font-mono outline-none transition placeholder:font-sans placeholder:text-gray-400 ${
                      otpError
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-gray-200 focus:border-primary"
                    }`}
                  />

                  {otpError && (
                    <p className="mt-1 text-[10px] font-medium text-red-500">
                      {formik.errors.otp_code}
                    </p>
                  )}
                </div>

                {/* Actions for Step 2 */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={
                      verifyOtpMutation.isPending ||
                      requestOtcMutation.isPending
                    }
                    className="flex h-10 w-full items-center justify-center rounded-lg bg-primary hover:bg-primary/80 text-[11px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    {verifyOtpMutation.isPending ||
                    requestOtcMutation.isPending ? (
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
                        Verifying OTP Code...
                      </>
                    ) : (
                      "Verify OTP & Continue to OTC"
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={requestOtpMutation.isPending}
                      className="flex items-center justify-center gap-1.5 h-9 rounded-lg border border-gray-200 bg-white text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 cursor-pointer"
                    >
                      <RotateCw className="h-3.5 w-3.5 text-gray-500" />
                      <span>Resend OTP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center gap-1.5 h-9 rounded-lg border border-gray-200 bg-white text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 text-gray-500" />
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* Step Summary with OTP Verified Badge */}
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Amount:</span>
                    <span className="font-bold text-primary">
                      ${formik.values.amount} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Network:</span>
                    <span className="font-bold text-primary">
                      {formik.values.network}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Destination:</span>
                    <span className="font-mono text-[11px] text-gray-700 truncate max-w-[200px]">
                      {formik.values.destination_address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                    <span className="text-gray-600">2FA Verification:</span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="h-3 w-3" /> OTP Verified
                    </span>
                  </div>
                </div>

                {/* Field: OTC Clearance Code */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="otc_code"
                      className="block text-[11px] font-bold text-primary"
                    >
                      OTC Clearance Code
                    </label>
                    <span className="text-[10px] text-gray-400">
                      e.g. OTC-B0ZFJJ
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="otc_code"
                      name="otc_code"
                      type="text"
                      placeholder="Enter OTC clearance code"
                      value={formik.values.otc_code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-10 w-full rounded-lg border bg-white px-3 pr-10 text-xs text-primary font-mono uppercase outline-none transition placeholder:font-sans placeholder:text-gray-400 ${
                        otcError
                          ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                          : "border-gray-200 focus:border-primary"
                      }`}
                    />
                    <KeyRound className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>

                  {otcError && (
                    <p className="mt-1 text-[10px] font-medium text-red-500">
                      {formik.errors.otc_code}
                    </p>
                  )}
                </div>

                {/* Info Box */}
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800">
                  <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <p>
                    Your OTC clearance code has been requested. Please contact
                    administrator/support to obtain your authorization code to
                    finalize this withdrawal.
                  </p>
                </div>

                {/* Actions for Step 3 */}
                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting || submitMutation.isPending}
                    className="flex h-10 w-full items-center justify-center rounded-lg bg-primary hover:bg-primary/80 text-[11px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    {formik.isSubmitting || submitMutation.isPending ? (
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
                        Finalizing Payout...
                      </>
                    ) : (
                      "Confirm & Finalize Withdrawal"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center justify-center gap-1.5 h-9 w-full rounded-lg border border-gray-200 bg-white text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 text-gray-500" />
                    <span>Back to OTP</span>
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <WithdrawalStatusFlow
          status={
            latestWithdrawal
              ? (statusMap[latestWithdrawal.status] ?? "pending_review")
              : "submitted"
          }
        />
      </div>
    </div>
  );
}
