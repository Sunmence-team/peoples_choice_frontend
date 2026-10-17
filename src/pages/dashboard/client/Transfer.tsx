import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useDashboard,
  useInternalTransfer,
  useWallets,
} from "../../../hooks/useClientData";
import {
  POPULAR_BANKS,
  validateRecipientLookup,
  requestExternalTransferOtpService,
  submitExternalWireTransferService,
} from "../../../services/transferServices";
import { getErrorMessage } from "../../../helpers/api";

type TransferTab = "internal" | "external";

export default function Transfer() {
  const { data: stats } = useDashboard();
  const { data: wallets } = useWallets();
  const internalTransferMutation = useInternalTransfer();

  const availableBalance = stats?.balance ?? 0;
  const [active, setActive] = useState<TransferTab>("internal");

  // Internal form state
  const [recipientInput, setRecipientInput] = useState("");
  const [recipientVerification, setRecipientVerification] = useState<{
    valid: boolean;
    name: string;
    accountNumber: string;
  }>({ valid: false, name: "", accountNumber: "" });
  const [internalAmount, setInternalAmount] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  // External wire state
  const [wireBeneficiary, setWireBeneficiary] = useState("");
  const [wireBankName, setWireBankName] = useState(POPULAR_BANKS[0]);
  const [wireAccount, setWireAccount] = useState("");
  const [wireRouting, setWireRouting] = useState("021000021");
  const [wireAmount, setWireAmount] = useState("");
  const [wireNote, setWireNote] = useState("");

  const [externalStep, setExternalStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState("");
  const [ctoCode, setCtoCode] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isSubmittingWire, setIsSubmittingWire] = useState(false);

  useEffect(() => {
    const res = validateRecipientLookup(recipientInput);
    setRecipientVerification(res);
  }, [recipientInput]);

  const handleInternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(internalAmount);

    if (!recipientVerification.valid) {
      toast.error("Please enter a valid recipient account or username");
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid transfer amount");
      return;
    }
    if (amountNum > availableBalance) {
      toast.error(`Amount cannot exceed available balance of $${availableBalance.toLocaleString()}`);
      return;
    }

    setIsSubmittingInternal(true);
    try {
      await internalTransferMutation.mutateAsync({
        recipient_identifier: recipientVerification.accountNumber || recipientInput,
        recipient_name: recipientVerification.name,
        amount: amountNum,
        note: internalNote,
      });

      toast.success("Transfer completed successfully");
      setRecipientInput("");
      setInternalAmount("");
      setInternalNote("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to complete transfer"));
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  const handleRequestWireOtp = async () => {
    const amountNum = parseFloat(wireAmount);
    if (!wireBeneficiary.trim()) {
      toast.error("Beneficiary name is required");
      return;
    }
    if (!wireAccount.trim()) {
      toast.error("Account number is required");
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid transfer amount");
      return;
    }
    if (amountNum > availableBalance) {
      toast.error(`Amount cannot exceed available balance of $${availableBalance.toLocaleString()}`);
      return;
    }

    setIsRequestingOtp(true);
    try {
      const res = await requestExternalTransferOtpService(amountNum);
      toast.success(res.message || "OTP sent to your registered email");
      setExternalStep(2);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to request OTP"));
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleWireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit email OTP");
      return;
    }
    if (!ctoCode.trim()) {
      toast.error("Please enter your CTO clearance code");
      return;
    }

    setIsSubmittingWire(true);
    try {
      const res = await submitExternalWireTransferService(
        {
          beneficiary_name: wireBeneficiary,
          bank_name: wireBankName,
          account_number: wireAccount,
          routing_number: wireRouting,
          amount: wireAmount,
          note: wireNote,
          otp_code: otpCode.trim(),
          cto_code: ctoCode.trim(),
        },
        wallets ?? []
      );

      toast.success(res.message || "Wire request submitted successfully");
      setExternalStep(1);
      setWireBeneficiary("");
      setWireAccount("");
      setWireAmount("");
      setWireNote("");
      setOtpCode("");
      setCtoCode("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit wire transfer"));
    } finally {
      setIsSubmittingWire(false);
    }
  };

  return (
    <div>
      <div className="mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg text-primary font-bold">Transfer Money</h2>
        <p className="text-[11px] sm:text-xs font-medium text-gray-500">
          Transfer funds within People's Choice Bank or wire to external accounts.
        </p>
      </div>

      <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-5">
        <div className="grid grid-cols-2 gap-1.5 sm:flex sm:gap-2 border-b border-gray-200 pb-3 mb-4 max-w-xl">
          <button
            type="button"
            onClick={() => {
              setActive("internal");
              setExternalStep(1);
            }}
            className={`rounded-lg py-2 px-2 text-[11px] sm:text-xs font-semibold text-center transition cursor-pointer ${
              active === "internal"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Within PC Bank
          </button>
          <button
            type="button"
            onClick={() => {
              setActive("external");
              setExternalStep(1);
            }}
            className={`rounded-lg py-2 px-2 text-[11px] sm:text-xs font-semibold text-center transition cursor-pointer ${
              active === "external"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Outside App (Wire)
          </button>
        </div>

        {/* Available Balance banner */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-2.5 sm:p-3 border border-gray-200 text-xs max-w-xl">
          <span className="text-gray-500 font-medium">Available Account Balance:</span>
          <span className="font-bold text-primary">${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</span>
        </div>

        {/* Tab 1: Within PC Bank */}
        {active === "internal" && (
          <form onSubmit={handleInternalSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="mb-2 block text-[11px] font-bold text-primary">
                Recipient (Account Number, Username, or Email)
              </label>
              <input
                type="text"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                placeholder="e.g. 1048291042 or @username"
                required
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
              />
              {recipientVerification.valid && (
                <p className="mt-1 text-[11px] text-green-600 font-medium">
                  Verified: {recipientVerification.name} (Acct: {recipientVerification.accountNumber})
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold text-primary">
                Transfer Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={availableBalance}
                value={internalAmount}
                onChange={(e) => setInternalAmount(e.target.value)}
                placeholder="0.00"
                required
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold text-primary">
                Note / Description (Optional)
              </label>
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="e.g. Project payment"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingInternal}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white transition hover:opacity-90 cursor-pointer disabled:opacity-60"
            >
              {isSubmittingInternal ? "Processing..." : "Transfer Funds"}
            </button>
          </form>
        )}

        {/* Tab 2: Outside App (Bank Wire) */}
        {active === "external" && (
          <div className="max-w-xl">
            {externalStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Beneficiary Full Name
                  </label>
                  <input
                    type="text"
                    value={wireBeneficiary}
                    onChange={(e) => setWireBeneficiary(e.target.value)}
                    placeholder="Recipient full legal name"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-[11px] font-bold text-primary">
                      Destination Bank Institution
                    </label>
                    <select
                      value={wireBankName}
                      onChange={(e) => setWireBankName(e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                    >
                      {POPULAR_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-bold text-primary">
                      Routing Number (ABA)
                    </label>
                    <input
                      type="text"
                      value={wireRouting}
                      onChange={(e) => setWireRouting(e.target.value)}
                      placeholder="e.g. 021000021"
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Destination Account / Address
                  </label>
                  <input
                    type="text"
                    value={wireAccount}
                    onChange={(e) => setWireAccount(e.target.value)}
                    placeholder="External Account Number / IBAN / Destination Address"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Wire Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={availableBalance}
                    value={wireAmount}
                    onChange={(e) => setWireAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Transfer Note / Purpose
                  </label>
                  <input
                    type="text"
                    value={wireNote}
                    onChange={(e) => setWireNote(e.target.value)}
                    placeholder="Transfer memo"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRequestWireOtp}
                  disabled={isRequestingOtp}
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white transition hover:opacity-90 cursor-pointer disabled:opacity-60"
                >
                  {isRequestingOtp ? "Requesting OTP..." : "Proceed to Security Verification"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleWireSubmit} className="space-y-4">
                <p className="text-xs text-gray-500">
                  Please enter the 6-digit OTP code sent to your registered email and the CTO clearance code from your administrator.
                </p>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Email OTP Code (6 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    required
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary font-mono text-center tracking-widest font-bold"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Admin CTO Clearance Code
                  </label>
                  <input
                    type="text"
                    value={ctoCode}
                    onChange={(e) => setCtoCode(e.target.value)}
                    placeholder="e.g. CTO-AB12CD"
                    required
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary font-mono text-center tracking-widest font-bold"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setExternalStep(1)}
                    className="flex h-10 w-1/3 items-center justify-center rounded-lg bg-secondary text-[11px] font-medium border border-primary/10 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingWire}
                    className="flex h-10 w-2/3 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white transition hover:opacity-90 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmittingWire ? "Authorizing..." : "Submit Wire Transfer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
