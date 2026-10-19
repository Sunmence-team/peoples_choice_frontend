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
  Loader2,
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import {
  getCardsService,
  freezeCardService,
  type BankCard,
} from "../../../services/cardServices";
import { getErrorMessage } from "../../../helpers/api";
import SetPinModal from "../../../components/modal/SetPinModal";
import RequestCardModal from "../../../components/modal/RequestCardModal";

export default function Cards() {
  const { user } = useUser();
  const [cards, setCards] = useState<BankCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<number | string | null>(
    null,
  );

  // Security toggles
  const [revealedCardId, setRevealedCardId] = useState<number | string | null>(
    null,
  );
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
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
  }

  const activeCard =
    cards.find((c) => String(c.id) === String(selectedCardId)) || cards[0];

  const handleToggleFreeze = async (card: BankCard) => {
    try {
      const res = await freezeCardService(card.id);
      toast.success(res.message);
      const newStatus = (res.status ||
        res.data?.status ||
        (card.status === "frozen" ? "active" : "frozen")) as
        | "active"
        | "frozen";
      setCards((prev) =>
        prev.map((c) =>
          String(c.id) === String(card.id) ? { ...c, status: newStatus } : c,
        ),
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

  return (
    <div className="w-full">
      {/* Page Heading: title always visible, desc hidden on small screens */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-primary">
            Cards & Digital Wallets
          </h1>
          <p className="hidden md:block mt-0.5 text-xs font-medium text-gray-500">
            Manage your contactless virtual debit cards and physical bank cards
            with real-time controls.
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
          <h3 className="text-sm font-bold text-primary">
            No Cards Issued Yet
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Order a People's Choice Bank virtual debit card for instant online
            transactions or a physical card for ATM and in-store use.
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
                      {activeCard.card_type === "virtual"
                        ? "VIRTUAL DEBIT"
                        : "PHYSICAL DEBIT"}
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
                      setRevealedCardId((prev) =>
                        prev === activeCard.id ? null : activeCard.id,
                      )
                    }
                    className="flex items-center gap-1 text-[10px] text-white/80 hover:text-white transition cursor-pointer bg-white/10 px-2 py-1 rounded-md"
                    title={
                      revealedCardId === activeCard.id
                        ? "Hide details"
                        : "Show details"
                    }
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
                    {activeCard.status !== "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(activeCard)}
                        className="p-1 text-white/70 hover:text-white transition cursor-pointer"
                        title="Copy Card Number"
                      >
                        {copiedId === activeCard.id ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
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
                      {activeCard.expiry_month}/{activeCard.expiry_year}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="block text-[8px] text-white/60 uppercase tracking-wider font-semibold">
                      CVV
                    </span>
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white">
                      {revealedCardId === activeCard.id
                        ? activeCard.cvv
                        : "•••"}
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
              <div className="grid grid-cols-3 gap-2 overflow-x-auto no-scrollbar pb-1">
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
                          {c.card_type === "virtual" ? "Virtual" : "Physical"}{" "}
                          •••• {c.card_number?.slice(-4)}
                        </p>
                        <p className="text-[9px] text-gray-400 capitalize">
                          {c.card_brand} ({c.status})
                        </p>
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
                      Currency: {activeCard.currency}
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

                {/* Card Specs */}
                <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[10.5px] text-gray-400">
                      Card Form Factor
                    </span>
                    <span className="font-semibold text-primary capitalize">
                      {activeCard.card_type} Debit
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[10.5px] text-gray-400">
                      Payment Network
                    </span>
                    <span className="font-semibold text-primary capitalize">
                      {activeCard.card_brand}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[10.5px] text-gray-400">
                      Billing Address
                    </span>
                    <span className="font-medium text-gray-700 truncate max-w-[200px] text-[10.5px]">
                      {activeCard.billing_address}
                    </span>
                  </div>
                  {activeCard.delivery_address && (
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[10.5px] text-gray-400">
                        Delivery Address
                      </span>
                      <span className="font-medium text-gray-700 truncate max-w-[200px] text-[10.5px]">
                        {activeCard.delivery_address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[10px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-tertiary" />
                <span>
                  Protected by Visa/Mastercard 3D Secure Zero-Liability
                  Protection
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Set 4-Digit PIN Modal */}
      {activeCard && (
        <SetPinModal
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          cardId={activeCard.id}
          onSuccess={() => loadCards()}
        />
      )}

      {/* Request New Card Modal */}
      <RequestCardModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        userFullName={user?.full_name || user?.username || "ACCOUNT HOLDER"}
        onSuccess={(newId) => {
          loadCards();
          if (newId) setSelectedCardId(newId);
        }}
      />
    </div>
  );
}
