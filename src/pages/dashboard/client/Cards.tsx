import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Lock,
  Unlock,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  ShieldCheck,
  Wifi,
  Sparkles,
  Truck,
  Loader2,
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import {
  getCardsService,
  requestCardService,
  freezeCardService,
  setCardPinService,
  type BankCard,
  type RequestCardPayload,
} from "../../../services/cardServices";
import { getErrorMessage } from "../../../helpers/api";

export default function Cards() {
  const { user } = useUser();
  const [cards, setCards] = useState<BankCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<number | string | null>(null);

  // Security toggles
  const [revealedCardId, setRevealedCardId] = useState<number | string | null>(null);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);

  // Request form state
  const [cardType, setCardType] = useState<"virtual" | "physical">("virtual");
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard">("visa");
  const [cardHolder, setCardHolder] = useState(user?.full_name || user?.username || "ACCOUNT HOLDER");
  const [billingAddress, setBillingAddress] = useState("1 Wall St, New York, NY 10005");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await getCardsService();
      setCards(data);
      if (data.length > 0 && !selectedCardId) {
        setSelectedCardId(data[0].id);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load cards"));
    } finally {
      setLoading(false);
    }
  };

  const activeCard = cards.find((c) => String(c.id) === String(selectedCardId)) || cards[0];

  const handleToggleFreeze = async (card: BankCard) => {
    try {
      const res = await freezeCardService(card.id);
      toast.success(res.message);
      const newStatus = (res.status || res.data?.status || (card.status === "frozen" ? "active" : "frozen")) as "active" | "frozen";
      setCards((prev) =>
        prev.map((c) => (String(c.id) === String(card.id) ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update card status"));
    }
  };

  const handleCopyNumber = async (card: BankCard) => {
    try {
      await navigator.clipboard.writeText(card.card_number.replace(/\s+/g, ""));
      setCopiedId(card.id);
      toast.success("Card number copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to copy card number"));
    }
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pinValue)) {
      toast.error("PIN must be exactly 4 numerical digits");
      return;
    }
    if (!activeCard) return;

    setIsSubmittingPin(true);
    try {
      const res = await setCardPinService(activeCard.id, pinValue);
      toast.success(res.message);
      setShowPinModal(false);
      setPinValue("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update PIN"));
    } finally {
      setIsSubmittingPin(false);
    }
  };

  const handleRequestCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardType === "physical" && !deliveryAddress.trim()) {
      toast.error("Please enter a valid physical delivery address");
      return;
    }

    setIsSubmittingCard(true);
    try {
      const payload: RequestCardPayload = {
        card_type: cardType,
        card_brand: cardBrand,
        currency: "USD",
        card_holder_name: cardHolder.trim(),
        billing_address: billingAddress.trim(),
        delivery_address: cardType === "physical" ? deliveryAddress.trim() : null,
      };

      const res = await requestCardService(payload);
      toast.success(res.message);
      setShowRequestModal(false);
      await loadCards();
      const newId = res.card?.id || res.data?.id;
      if (newId) {
        setSelectedCardId(newId);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit card application"));
    } finally {
      setIsSubmittingCard(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page Heading: title always visible, desc hidden on small screens */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-primary">
            Cards & Digital Wallets
          </h1>
          <p className="hidden md:block mt-0.5 text-xs font-medium text-gray-500">
            Manage your contactless virtual debit cards and physical bank cards with real-time controls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRequestModal(true)}
          className="h-9 px-3.5 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
        >
          <Plus size={14} />
          <span>Request New Card</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-xl border border-secondary bg-white p-8 text-center shadow-xs">
          <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-primary">No Cards Issued Yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Order a People's Choice Bank virtual debit card for instant online transactions or a physical card for ATM and in-store use.
          </p>
          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className="mt-4 h-9 px-4 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 cursor-pointer"
          >
            Order Your First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-5">
          {/* Left Column: Visual Card Display & Card Selector */}
          <div className="space-y-3.5">
            {/* Active Card Graphic */}
            {activeCard && (
              <div
                className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-lg transition-all ${
                  activeCard.card_type === "virtual"
                    ? "bg-gradient-to-br from-[#0B2D5B] via-[#082245] to-[#041124] border border-white/10"
                    : "bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] border border-slate-700"
                }`}
              >
                {/* Background holographic glow */}
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-emerald-500/5 pointer-events-none" />

                {/* Card Top: Bank Title + Contactless + Card Type Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-white/90 block">
                      PEOPLE'S CHOICE BANK
                    </span>
                    <span className="text-[9px] text-[#93c5fd] font-medium tracking-tight">
                      {activeCard.card_type === "virtual" ? "VIRTUAL DEBIT" : "PHYSICAL DEBIT"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-white/70 rotate-90" />
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        activeCard.status === "active"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : activeCard.status === "frozen"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {activeCard.status}
                    </span>
                  </div>
                </div>

                {/* EMV Chip & Reveal toggle */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-7 w-9 rounded-sm bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-400/40 shadow-inner flex items-center justify-center">
                    <div className="w-full h-[1px] bg-amber-600/30" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRevealedCardId((prev) => (prev === activeCard.id ? null : activeCard.id))
                    }
                    className="flex items-center gap-1 text-[10px] text-white/80 hover:text-white transition cursor-pointer bg-white/10 px-2 py-1 rounded-md"
                    title={revealedCardId === activeCard.id ? "Hide details" : "Show details"}
                  >
                    {revealedCardId === activeCard.id ? (
                      <>
                        <EyeOff size={12} />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye size={12} />
                        <span>Reveal</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 16-Digit Card Number */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base sm:text-[19px] tracking-[0.18em] font-bold text-white drop-shadow-sm select-all">
                      {revealedCardId === activeCard.id
                        ? activeCard.card_number
                        : activeCard.masked_card_number}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(activeCard)}
                      className="p-1 text-white/70 hover:text-white transition cursor-pointer"
                      title="Copy Card Number"
                    >
                      {copiedId === activeCard.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Cardholder + Expiry + Brand Logo */}
                <div className="flex items-end justify-between pt-1 text-xs">
                  <div>
                    <span className="block text-[8px] text-white/60 uppercase tracking-wider font-semibold">
                      Cardholder Name
                    </span>
                    <span className="font-semibold tracking-wide text-[11px] sm:text-xs text-white uppercase">
                      {activeCard.card_holder_name}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="block text-[8px] text-white/60 uppercase tracking-wider font-semibold">
                      Expires
                    </span>
                    <span className="font-mono text-[11px] sm:text-xs font-semibold text-white">
                      {activeCard.expiration_month}/{activeCard.expiration_year}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="block text-[8px] text-white/60 uppercase tracking-wider font-semibold">
                      CVV
                    </span>
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white">
                      {revealedCardId === activeCard.id ? activeCard.cvv : "•••"}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-black italic text-sm sm:text-base tracking-tighter text-white">
                      {activeCard.card_brand.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Card Switcher Selector (if user has multiple cards) */}
            {cards.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {cards.map((c) => {
                  const isSelected = String(c.id) === String(selectedCardId);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCardId(c.id)}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left transition cursor-pointer min-w-[170px] ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                          : "border-secondary bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard className="h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold truncate">
                          {c.card_type === "virtual" ? "Virtual" : "Physical"} •••• {c.card_number.slice(-4)}
                        </p>
                        <p className="text-[9px] text-gray-400 capitalize">{c.card_brand} ({c.status})</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Card Actions & Controls */}
          {activeCard && (
            <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-bold text-primary">
                      Card Security & Controls
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      Card ID: #{String(activeCard.id).slice(-6)} • Currency: {activeCard.currency}
                    </p>
                  </div>

                  <span
                    className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold capitalize ${
                      activeCard.status === "active"
                        ? "bg-green-100 text-green-700"
                        : activeCard.status === "frozen"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {activeCard.status}
                  </span>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => handleToggleFreeze(activeCard)}
                    className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeCard.status === "frozen"
                        ? "border-green-600 bg-green-50 text-green-700 hover:bg-green-100"
                        : "border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {activeCard.status === "frozen" ? (
                      <>
                        <Unlock size={14} />
                        <span>Unfreeze Card</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Freeze Card</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPinModal(true)}
                    className="h-9 rounded-lg border border-secondary bg-gray-50 text-xs font-semibold text-primary hover:bg-gray-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound size={14} />
                    <span>Set / Change PIN</span>
                  </button>
                </div>

                {/* Spending Limit Meter */}
                <div className="rounded-lg bg-gray-50 p-3 border border-secondary/70 mb-4">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-[10.5px] font-medium text-gray-500">Daily Spending Limit</span>
                    <span className="font-bold text-primary">
                      ${activeCard.spending_limit.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[24%]" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-gray-400 mt-1">
                    <span>Used: $3,600.00</span>
                    <span>Remaining: ${(activeCard.spending_limit - 3600).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Card Specs */}
                <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[10.5px] text-gray-400">Card Form Factor</span>
                    <span className="font-semibold text-primary capitalize">{activeCard.card_type} Debit</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[10.5px] text-gray-400">Payment Network</span>
                    <span className="font-semibold text-primary capitalize">{activeCard.card_brand} Worldwide</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[10.5px] text-gray-400">Billing Address</span>
                    <span className="font-medium text-gray-700 truncate max-w-[200px] text-[10.5px]">
                      {activeCard.billing_address}
                    </span>
                  </div>
                  {activeCard.delivery_address && (
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[10.5px] text-gray-400">Delivery Address</span>
                      <span className="font-medium text-gray-700 truncate max-w-[200px] text-[10.5px]">
                        {activeCard.delivery_address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[10px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-tertiary" />
                <span>Protected by Visa/Mastercard 3D Secure Zero-Liability Protection</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Set 4-Digit PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl border border-secondary animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-primary" />
                <h3 className="text-xs sm:text-[13px] font-bold text-primary">
                  Set 4-Digit Security PIN
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePin} className="space-y-3">
              <p className="text-[10.5px] text-gray-500 leading-relaxed">
                This 4-digit PIN is required for ATM cash withdrawals and chip-and-PIN terminal POS purchases.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Enter New PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  placeholder="••••"
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
                  className="h-10 w-full rounded-lg border border-secondary bg-white text-center font-mono text-lg font-bold tracking-[0.5em] text-primary outline-none focus:border-primary transition"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 h-9 rounded-lg border border-secondary text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPin || pinValue.length !== 4}
                  className="flex-1 h-9 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmittingPin ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Save PIN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request New Card Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl border border-secondary animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-tertiary" />
                <h3 className="text-xs sm:text-[13px] font-bold text-primary">
                  Request / Order New Card
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestCard} className="space-y-3">
              {/* Form Factor selection */}
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Select Card Form Factor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCardType("virtual")}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      cardType === "virtual"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-secondary bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-0.5">
                      <CreditCard size={13} />
                      <span>Virtual Card</span>
                    </div>
                    <p className="text-[9.5px] text-gray-500 leading-tight">
                      Instant online activation for e-commerce and subscriptions.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardType("physical")}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      cardType === "physical"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-secondary bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-0.5">
                      <Truck size={13} />
                      <span>Physical Card</span>
                    </div>
                    <p className="text-[9.5px] text-gray-500 leading-tight">
                      Embossed debit card delivered to your residential address.
                    </p>
                  </button>
                </div>
              </div>

              {/* Card Brand */}
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Card Payment Network
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCardBrand("visa")}
                    className={`h-9 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      cardBrand === "visa"
                        ? "border-primary bg-primary text-white"
                        : "border-secondary bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    VISA
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardBrand("mastercard")}
                    className={`h-9 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      cardBrand === "mastercard"
                        ? "border-primary bg-primary text-white"
                        : "border-secondary bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    MASTERCARD
                  </button>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Cardholder Name (Embossed on Card)
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs font-semibold uppercase text-primary outline-none focus:border-primary transition"
                />
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Billing Address
                </label>
                <input
                  type="text"
                  required
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-primary outline-none focus:border-primary transition"
                />
              </div>

              {/* Delivery Address (only if physical) */}
              {cardType === "physical" && (
                <div>
                  <label className="block text-[11px] font-semibold text-primary mb-1">
                    Courier Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter street address, city, state, zip"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-primary outline-none focus:border-primary transition"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5 block">
                    Dispatched within 3-5 business days via tracked courier delivery.
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 h-9 rounded-lg border border-secondary text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCard}
                  className="flex-1 h-9 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmittingCard ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Confirm Issuance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
