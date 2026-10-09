import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { QRCodeSVG } from "qrcode.react";
import { Loader2 } from "lucide-react";
import DepositStatusTracker, {
  type DepositStatus,
} from "../../../components/Tracker/DepositTracker";
import { useSubmitDeposit, useWallets, useMyDeposits } from "../../../hooks/useClientData";
import { getErrorMessage } from "../../../helpers/api";

const validationSchema = Yup.object({
  wallet_address_id: Yup.number()
    .typeError("Please select a wallet address")
    .required("Please select a wallet address"),

  amount: Yup.number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Deposit amount is required"),

  proof_image: Yup.mixed<File>()
    .required("Payment proof is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) => {
        if (!value) return false;

        return [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
        ].includes(value.type);
      }
    )
    .test(
      "fileSize",
      "File size must not exceed 5MB",
      (value) => {
        if (!value) return false;

        return value.size <= 5 * 1024 * 1024;
      }
    ),
});

const statusMap: Record<string, DepositStatus> = {
  pending: "pending_verification",
  approved: "approved",
  completed: "wallet_credited",
  rejected: "rejected",
};

const DepositRequest = () => {
  const [copied, setCopied] = useState(false);

  const { data: wallets, isLoading: walletsLoading } = useWallets();
  const { data: deposits } = useMyDeposits(1, 5);
  const submitMutation = useSubmitDeposit();

  const formik = useFormik({
    initialValues: {
      wallet_address_id: "" as string | number,
      amount: "",
      proof_image: null as File | null,
    },

    validationSchema,

    onSubmit: async (values, helpers) => {
      if (!values.proof_image) return;

      try {
        await submitMutation.mutateAsync({
          wallet_address_id: values.wallet_address_id,
          amount: values.amount,
          proof_image: values.proof_image,
        });
        helpers.resetForm();
      } catch (error) {
        console.error("Deposit failed:", error);
      }
    },
  });

  const selectedWallet =
    wallets?.find(
      (wallet) => String(wallet.id) === String(formik.values.wallet_address_id)
    ) ?? wallets?.[0];

  const walletAddress = selectedWallet?.address ?? "";

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy wallet address", error);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0] ?? null;

    formik.setFieldValue("proof_image", file);
  };

  const latestDeposit = deposits?.items?.[0];
  const trackerStatus: DepositStatus | null = latestDeposit
    ? statusMap[latestDeposit.status] ?? "pending_verification"
    : null;

  return (
    <div className="w-full">

        <h2 className='text-2xl text-primary font-bold'>Deposit USDT</h2>
        <p className='text-[13px] font-medium w-[530px] text-gray-500 '>
            Send USDT to your wallet address and submit your payment details. Your deposit will be reviewed manually before your
            wallet is credited
        </p>


        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-6">

            <div className="rounded-xl border border-[#e5edf5] bg-white p-5 shadow-[0_2px_10px_rgba(15,45,75,0.04)]">
                {/* Heading */}
                <div className="mb-4">
                    <h2 className="text-[14px] font-bold text-primary">
                        Step 1: Send USDT
                    </h2>
                </div>

                {/* Network */}
                <div className="mb-5">
                    <label className="mb-2 block text-[11px] font-semibold text-primary">
                        Select Network
                    </label>

                    {walletsLoading ? (
                        <div className="flex items-center gap-2 text-[11px] text-[#718096]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Loading addresses...
                        </div>
                    ) : !wallets || wallets.length === 0 ? (
                        <p className="text-[11px] text-[#718096]">
                            No deposit addresses available yet. Please check back later.
                        </p>
                    ) : (
                        <div
                            className={`grid gap-3 ${
                                wallets.length > 3 ? "grid-cols-3" : "grid-cols-3"
                            }`}
                        >
                            {wallets.map((wallet) => {
                                const isSelected =
                                    String(formik.values.wallet_address_id) ===
                                    String(wallet.id);

                                return (
                                    <button
                                        key={wallet.id}
                                        type="button"
                                        onClick={() =>
                                            formik.setFieldValue(
                                                "wallet_address_id",
                                                wallet.id
                                            )
                                        }
                                        className={`h-10 rounded-lg border text-xs font-semibold transition ${isSelected
                                            ? "border-primary bg-primary text-white shadow-sm"
                                            : "border-[#e0e8f0] bg-[#f8fafc] text-[#718096] hover:border-primary hover:text-primary"
                                            }`}
                                    >
                                        {wallet.label ?? wallet.type}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {formik.touched.wallet_address_id &&
                        formik.errors.wallet_address_id && (
                            <p className="mt-1 text-[10px] text-red-500">
                                {formik.errors.wallet_address_id}
                            </p>
                        )}
                </div>

                {/* Wallet Address */}
                <div className="mb-5">
                    <label className="mb-2 block text-[11px] font-semibold text-primary">
                        Company USDT Wallet Address
                    </label>

                    <div className="flex gap-2">
                        <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-[#dfe8f1] bg-[#f8fafc] px-3">
                            <span className="truncate text-[11px] text-[#64748b]">
                                {walletAddress || "—"}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className="h-10 rounded-lg bg-primary px-5 text-[11px] font-semibold text-white transition hover:bg-[#09264d]"
                        >
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* QR + Instructions */}
                <div className="flex items-center gap-5 pt-2">
                    <div className="flex h-[105px] w-[105px] shrink-0 items-center justify-center rounded-lg border border-[#edf2f7] bg-white p-2">
                        {walletAddress ? (
                            <QRCodeSVG
                                value={walletAddress}
                                size={88}
                                level="M"
                                includeMargin={false}
                            />
                        ) : (
                            <span className="text-[9px] text-[#a0aec0]">No QR</span>
                        )}
                    </div>

                    <div>
                        <h3 className="mb-1 text-[12px] font-bold text-primary">
                            Scan to send USDT
                        </h3>

                        <p className="max-w-[210px] text-[11px] leading-5 text-[#718096]">
                            Use the QR code or copy the address above to
                            send your USDT.
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={formik.handleSubmit}
                noValidate
                className="rounded-xl border border-[#e5edf5] bg-white p-5 shadow-[0_2px_10px_rgba(15,45,75,0.04)]"
            >
                <div className="mb-4">
                    <h2 className="text-[14px] font-bold text-primary">
                        Step 2: Submit Request
                    </h2>
                </div>

                {/* Amount */}
                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="mb-2 block text-[11px] font-semibold text-primary"
                    >
                        Deposit Amount (USDT)
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
                        className={`h-10 w-full rounded-lg border bg-white px-3 text-xs text-primary outline-none transition placeholder:text-[#a0aec0]
                            ${formik.touched.amount && formik.errors.amount
                                ? "border-red-400"
                                : "border-[#dfe8f1]"
                            }`}
                    />

                    {formik.touched.amount && formik.errors.amount && (
                        <p className="mt-1 text-[10px] text-red-500">
                            {formik.errors.amount}
                        </p>
                    )}
                </div>

                {/* Payment Proof */}
                <div className="mb-4">
                    <label className="mb-2 block text-[11px] font-semibold text-primary">
                        Upload Payment Proof
                    </label>

                    <label
                        htmlFor="proof_image"
                        className={`flex min-h-[68px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-3 text-center transition hover:bg-[#f8fafc] ${formik.touched.proof_image &&
                            formik.errors.proof_image
                            ? "border-red-400"
                            : "border-[#cbd8e5]"
                            }`}
                    >
                        <svg
                            className="mb-1 h-5 w-5 text-[#94a3b8]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16V4m0 0L8 8m4-4 4 4"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                            />
                        </svg>

                        {formik.values.proof_image ? (
                            <span className="max-w-full truncate text-[10px] font-medium text-primary">
                                {formik.values.proof_image.name}
                            </span>
                        ) : (
                            <>
                                <span className="text-[10px] font-semibold text-[#718096]">
                                    Click to upload or drag & drop
                                </span>

                                <span className="mt-0.5 text-[9px] text-[#a0aec0]">
                                    PNG, JPG or PDF (Max 5MB)
                                </span>
                            </>
                        )}

                        <input
                            id="proof_image"
                            name="proof_image"
                            type="file"
                            accept=".png,.jpg,.jpeg,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {formik.touched.proof_image &&
                        formik.errors.proof_image && (
                            <p className="mt-1 text-[10px] text-red-500">
                                {formik.errors.proof_image as string}
                            </p>
                        )}
                </div>

                {/* API Error */}
                {submitMutation.isError && (
                    <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[10px] text-red-600">
                        {getErrorMessage(
                            submitMutation.error,
                            "Failed to submit deposit request. Please try again."
                        )}
                    </div>
                )}

                {/* Success */}
                {submitMutation.isSuccess && (
                    <div className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-[10px] text-green-600">
                        Deposit request submitted successfully.
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="flex h-10 w-full items-center justify-center rounded-lg bg-primary cursor-pointer text-[11px] font-bold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitMutation.isPending ? (
                        <>

                            <Loader2
                                className="mr-2 h-4 w-4 animate-spin"
                            />

                            Submitting...
                        </>
                    ) : (
                        "Submit Deposit Request"
                    )}
                </button>
            </form>
        </div>

        {trackerStatus && (
            <div className="mt-5">
                <DepositStatusTracker status={trackerStatus} />
            </div>
        )}
    </div>
  );
};

export default DepositRequest;
