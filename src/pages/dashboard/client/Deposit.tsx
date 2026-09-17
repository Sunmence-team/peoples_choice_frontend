import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { QRCodeSVG } from "qrcode.react";
import { submitDepositService } from "../../../helpers/apiService";
import { Loader2 } from "lucide-react";
import DepositStatusTracker from "../../../components/Tracker/DepositTracker";

const walletAddresses = {
    TRC20: "TTrQ0e6e7a2caN_mLMeQv",
    ERC20: "0x8a7d3c4b9e1f2a6d8c0e",
    BEP20: "0x9f2a7b3c6d8e1f0a4b5c",
};

const validationSchema = Yup.object({
    network: Yup.string()
        .oneOf(["TRC20", "ERC20", "BEP20"])
        .required("Please select a network"),

    amount: Yup.number()
        .typeError("Enter a valid amount")
        .positive("Amount must be greater than 0")
        .required("Deposit amount is required"),

    transactionHash: Yup.string()
        .trim()
        .required("Transaction hash is required"),

    paymentProof: Yup.mixed<File>()
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

const DepositRequest = () => {
    const [copied, setCopied] = useState(false);

    const mutation = useMutation({
        mutationFn: submitDepositService,

        onSuccess: (response) => {
            console.log("Deposit submitted:", response);

            formik.resetForm();
        },

        onError: (error) => {
            console.error("Deposit failed:", error);
        },
    });

    const formik = useFormik({
        initialValues: {
            network: "TRC20",
            amount: "",
            transactionHash: "",
            paymentProof: null as File | null,
        },

        validationSchema,

        onSubmit: async (values) => {
            if (!values.paymentProof) return;

            await mutation.mutateAsync({
                network: values.network,
                amount: values.amount,
                transactionHash: values.transactionHash,
                paymentProof: values.paymentProof,
            });
        },
    });

    const walletAddress =
        walletAddresses[
        formik.values.network as keyof typeof walletAddresses
        ];

    const handleCopy = async () => {
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

        formik.setFieldValue("paymentProof", file);
    };

    return (
        <div className="w-full">

            <h2 className='text-2xl text-primary font-bold'>Deposit USDT</h2>
            <p className='text-[13px] font-medium w-[530px] text-gray-500 '>
                Send USDT to tour wallet address and submit your payment details. Your deposit will be reviewed manually before your
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

                        <div className="grid grid-cols-3 gap-3">
                            {(["TRC20", "ERC20", "BEP20"] as const).map(
                                (network) => {
                                    const isSelected =
                                        formik.values.network === network;

                                    return (
                                        <button
                                            key={network}
                                            type="button"
                                            onClick={() =>
                                                formik.setFieldValue("network", network)
                                            }
                                            className={`h-10 rounded-lg border text-xs font-semibold transition ${isSelected
                                                ? "border-primary bg-primary text-white shadow-sm"
                                                : "border-[#e0e8f0] bg-[#f8fafc] text-[#718096] hover:border-primary hover:text-primary"
                                                }`}
                                        >
                                            {network}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="mb-5">
                        <label className="mb-2 block text-[11px] font-semibold text-primary">
                            Company USDT Wallet Address
                        </label>

                        <div className="flex gap-2">
                            <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-[#dfe8f1] bg-[#f8fafc] px-3">
                                <span className="truncate text-[11px] text-[#64748b]">
                                    {walletAddress}
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
                            <QRCodeSVG
                                value={walletAddress}
                                size={88}
                                level="M"
                                includeMargin={false}
                            />
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

                    {/* Transaction Hash */}
                    <div className="mb-4">
                        <label
                            htmlFor="transactionHash"
                            className="mb-2 block text-[11px] font-semibold text-primary"
                        >
                            Transaction Hash
                        </label>

                        <div className="relative">
                            <input
                                id="transactionHash"
                                name="transactionHash"
                                type="text"
                                placeholder="Enter transaction hash"
                                value={formik.values.transactionHash}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`h-10 w-full rounded-lg border bg-white px-3 pr-10 text-xs text-primary outline-none transition placeholder:text-[#a0aec0] 
                                 ${formik.touched.transactionHash &&
                                        formik.errors.transactionHash
                                        ? "border-red-400"
                                        : "border-[#dfe8f1]"
                                    }`}
                            />
                        </div>

                        {formik.touched.transactionHash &&
                            formik.errors.transactionHash && (
                                <p className="mt-1 text-[10px] text-red-500">
                                    {formik.errors.transactionHash}
                                </p>
                            )}
                    </div>

                    {/* Payment Proof */}
                    <div className="mb-4">
                        <label className="mb-2 block text-[11px] font-semibold text-primary">
                            Upload Payment Proof
                        </label>

                        <label
                            htmlFor="paymentProof"
                            className={`flex min-h-[68px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-3 text-center transition hover:bg-[#f8fafc] ${formik.touched.paymentProof &&
                                formik.errors.paymentProof
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

                            {formik.values.paymentProof ? (
                                <span className="max-w-full truncate text-[10px] font-medium text-primary">
                                    {formik.values.paymentProof.name}
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
                                id="paymentProof"
                                name="paymentProof"
                                type="file"
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {formik.touched.paymentProof &&
                            formik.errors.paymentProof && (
                                <p className="mt-1 text-[10px] text-red-500">
                                    {formik.errors.paymentProof as string}
                                </p>
                            )}
                    </div>

                    {/* API Error */}
                    {mutation.isError && (
                        <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[10px] text-red-600">
                            Failed to submit deposit request. Please try again.
                        </div>
                    )}

                    {/* Success */}
                    {mutation.isSuccess && (
                        <div className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-[10px] text-green-600">
                            Deposit request submitted successfully.
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex h-10 w-full items-center justify-center rounded-lg bg-primary cursor-pointer text-[11px] font-bold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {mutation.isPending ? (
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
            
            <div className="mt-5">
                <DepositStatusTracker status="pending_verification" />
            </div>
        </div>
    );
};

export default DepositRequest;