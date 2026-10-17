import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { toast } from "sonner";
import {
  useDashboard,
  useInternalTransfer,
} from "../../hooks/useClientData";
import {
  lookupRecipientService,
  getSupportedCountriesService,
  getBanksByCountryService,
  submitExternalWireTransferService,
  type BankCountry,
  type BankItem,
  type RecipientLookupResult,
} from "../../services/transferServices";
import { getErrorMessage } from "../../helpers/api";
import { CheckCircle2, Globe2, Building2, Search, AlertCircle } from "lucide-react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "internal" | "external";
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  initialMode = "internal",
}) => {
  const { data: stats } = useDashboard();
  const internalTransferMutation = useInternalTransfer();

  const availableBalance = stats?.balance ?? 0;
  const [activeTab, setActiveTab] = useState<"internal" | "external">(initialMode);

  // --- INTERNAL FORM STATE ---
  const [recipientInput, setRecipientInput] = useState("");
  const [recipientVerification, setRecipientVerification] = useState<RecipientLookupResult>({
    valid: false,
    name: "",
    accountNumber: "",
  });
  const [isVerifyingRecipient, setIsVerifyingRecipient] = useState(false);
  const [internalAmount, setInternalAmount] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  // --- EXTERNAL WIRE STATE ---
  const [countries, setCountries] = useState<BankCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableBanks, setAvailableBanks] = useState<BankItem[]>([]);
  const [isBanksLoading, setIsBanksLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState("");

  const [wireBeneficiary, setWireBeneficiary] = useState("");
  const [wireBankName, setWireBankName] = useState("");
  const [wireBankCode, setWireBankCode] = useState("");
  const [wireAccount, setWireAccount] = useState("");
  const [wireRouting, setWireRouting] = useState("021000021");
  const [wireSwift, setWireSwift] = useState("");
  const [wireAmount, setWireAmount] = useState("");
  const [wireNote, setWireNote] = useState("");
  const [isSubmittingWire, setIsSubmittingWire] = useState(false);

  // 1. Debounced recipient lookup
  useEffect(() => {
    if (!recipientInput.trim()) {
      setRecipientVerification({ valid: false, name: "", accountNumber: "" });
      setIsVerifyingRecipient(false);
      return;
    }

    setIsVerifyingRecipient(true);
    const handler = setTimeout(async () => {
      try {
        const res = await lookupRecipientService(recipientInput);
        setRecipientVerification(res);
      } catch (err) {
        setRecipientVerification({
          valid: false,
          name: "",
          accountNumber: "",
          message: getErrorMessage(err, "Recipient account not found"),
        });
      } finally {
        setIsVerifyingRecipient(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [recipientInput]);

  // 2. Load countries on mount dynamically
  useEffect(() => {
    if (!isOpen) return;
    const fetchCountries = async () => {
      try {
        const res = await getSupportedCountriesService();
        if (Array.isArray(res) && res.length > 0) {
          setCountries(res);
          setSelectedCountry(res[0].iso_code);
        }
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };
    fetchCountries();
  }, [isOpen]);

  // 3. Load banks when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    const fetchBanks = async () => {
      setIsBanksLoading(true);
      try {
        const banks = await getBanksByCountryService(selectedCountry, bankSearch);
        setAvailableBanks(banks);
        if (banks.length > 0 && !bankSearch) {
          setWireBankName(banks[0].name);
          setWireBankCode(banks[0].code || "");
          setWireSwift(banks[0].code ? `${banks[0].code}XXX` : "");
        }
      } catch (err) {
        console.error("Failed to load banks for country", err);
      } finally {
        setIsBanksLoading(false);
      }
    };
    fetchBanks();
  }, [selectedCountry, bankSearch]);

  if (!isOpen) return null;

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setWireBankName(selected);
    const found = availableBanks.find((b) => b.name === selected);
    if (found) {
      setWireBankCode(found.code || "");
      setWireSwift(found.code ? `${found.code}XXX` : "");
    }
  };

  const handleInternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(internalAmount);

    if (!recipientVerification.valid) {
      toast.error(recipientVerification.message || "Please enter a valid recipient account or username");
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
      const res = await internalTransferMutation.mutateAsync({
        recipient_account: recipientVerification.accountNumber || recipientInput.trim(),
        amount: amountNum,
        notes: internalNote.trim() || undefined,
      });

      toast.success(res.message || "Transfer completed successfully");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to complete transfer"));
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  const handleWireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(wireAmount);

    if (!wireBeneficiary.trim()) {
      toast.error("Beneficiary full name is required");
      return;
    }
    if (!wireAccount.trim()) {
      toast.error("Recipient account number / IBAN is required");
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid wire amount");
      return;
    }
    if (amountNum > availableBalance) {
      toast.error(`Amount cannot exceed available balance of $${availableBalance.toLocaleString()}`);
      return;
    }

    setIsSubmittingWire(true);
    try {
      const res = await submitExternalWireTransferService({
        recipient_name: wireBeneficiary.trim(),
        bank_name: wireBankName,
        bank_code: wireBankCode || wireSwift || "PCBKUS33",
        bank_country: selectedCountry || "US",
        recipient_account_number: wireAccount.trim(),
        routing_number: wireRouting.trim() || undefined,
        swift_bic: wireSwift.trim() || undefined,
        amount: amountNum,
        notes: wireNote.trim() || undefined,
      });

      toast.success(res.message || "Wire request submitted successfully");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit wire transfer"));
    } finally {
      setIsSubmittingWire(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-1 sm:p-2">
        <h3 className="text-base sm:text-[18px] font-bold text-[#0B2D5B] leading-tight">
          Transfer Money
        </h3>
        <p className="mt-0.5 text-[11px] sm:text-[12px] text-[#8190a3]">
          Transfer funds within People's Choice Bank or wire to an outside account globally.
        </p>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 border-b border-gray-200 pb-3 mt-3 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`rounded-lg py-2 px-2 text-[11px] sm:text-xs font-semibold text-center transition cursor-pointer ${
              activeTab === "internal"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Within PC Bank
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("external")}
            className={`rounded-lg py-2 px-2 text-[11px] sm:text-xs font-semibold text-center transition cursor-pointer ${
              activeTab === "external"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Outside App (Wire)
          </button>
        </div>

        {/* Available Balance Banner */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-2.5 sm:p-3 border border-gray-200 text-xs">
          <span className="text-gray-500 font-medium">Available Account Balance:</span>
          <span className="font-bold text-primary">
            ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
          </span>
        </div>

        {/* INTERNAL TRANSFER */}
        {activeTab === "internal" && (
          <form onSubmit={handleInternalSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-bold text-primary">
                Recipient (Account Number, Username, or Email)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  placeholder="e.g. 3081234567 or @username or email"
                  required
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary pr-9"
                />
                {isVerifyingRecipient && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}
                {recipientVerification.valid && !isVerifyingRecipient && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>

              {recipientVerification.valid && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-green-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    Verified: {recipientVerification.name} (Acct: {recipientVerification.accountNumber})
                  </span>
                </p>
              )}
              {!recipientVerification.valid && recipientInput.trim().length >= 4 && !isVerifyingRecipient && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{recipientVerification.message || "Recipient not verified in registry"}</span>
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
                placeholder="e.g. Project payment or gift"
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

        {/* EXTERNAL WIRE / PAYOUT */}
        {activeTab === "external" && (
          <form onSubmit={handleWireSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-primary">
                  <Globe2 className="h-3.5 w-3.5 text-gray-500" />
                  <span>Destination Country</span>
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                >
                  {countries.length === 0 ? (
                    <option value="">Loading countries...</option>
                  ) : (
                    countries.map((c) => (
                      <option key={c.iso_code} value={c.iso_code}>
                        {c.name} ({c.currency})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-primary">
                  <Building2 className="h-3.5 w-3.5 text-gray-500" />
                  <span>Destination Bank</span>
                </label>
                <select
                  value={wireBankName}
                  onChange={handleBankSelect}
                  disabled={isBanksLoading}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary disabled:opacity-60"
                >
                  {isBanksLoading ? (
                    <option value="">Querying live banks...</option>
                  ) : availableBanks.length === 0 ? (
                    <option value="">No institutions found for country</option>
                  ) : (
                    availableBanks.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} {b.code ? `(${b.code})` : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Bank Search filter */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder="Search live SWIFT directory..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-[11px] text-primary outline-none transition focus:border-primary focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold text-primary">
                Beneficiary Full Legal Name
              </label>
              <input
                type="text"
                value={wireBeneficiary}
                onChange={(e) => setWireBeneficiary(e.target.value)}
                placeholder="Recipient full legal name"
                required
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold text-primary">
                Destination Account Number / IBAN
              </label>
              <input
                type="text"
                value={wireAccount}
                onChange={(e) => setWireAccount(e.target.value)}
                placeholder="External account number or IBAN"
                required
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-[11px] font-bold text-primary">
                  Routing Number (ABA / Sort Code)
                </label>
                <input
                  type="text"
                  value={wireRouting}
                  onChange={(e) => setWireRouting(e.target.value)}
                  placeholder="e.g. 021000021"
                  required
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold text-primary">
                  SWIFT / BIC Code
                </label>
                <input
                  type="text"
                  value={wireSwift}
                  onChange={(e) => setWireSwift(e.target.value)}
                  placeholder="e.g. CHASUS33XXX"
                  required
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary font-mono uppercase"
                />
              </div>
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
                required
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold text-primary">
                Transfer Memo / Purpose
              </label>
              <input
                type="text"
                value={wireNote}
                onChange={(e) => setWireNote(e.target.value)}
                placeholder="e.g. Commercial invoice settlement"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingWire}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white transition hover:opacity-90 cursor-pointer disabled:opacity-60"
            >
              {isSubmittingWire ? "Submitting Wire..." : "Submit Wire Transfer"}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default TransferModal;
