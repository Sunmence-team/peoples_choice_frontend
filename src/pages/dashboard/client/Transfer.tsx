import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useDashboard,
  useInternalTransfer,
} from "../../../hooks/useClientData";
import {
  lookupRecipientService,
  submitExternalWireTransferService,
  type BankCountry,
  type BankItem,
  type RecipientLookupResult,
} from "../../../services/transferServices";
import SearchableInput from "../../../components/ui/SearchableInput";
import { getErrorMessage } from "../../../helpers/api";
import {
  CheckCircle2,
  Building2,
  Globe2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatterUtility } from "../../../helpers/formatterUtility";

type TransferTab = "internal" | "external";

export default function Transfer() {
  const { data: stats } = useDashboard();
  const internalTransferMutation = useInternalTransfer();

  const availableBalance = stats?.wallet_balance ?? 0;
  const [active, setActive] = useState<TransferTab>("internal");

  // Recipient live lookup verification
  const [recipientInput, setRecipientInput] = useState("");
  const [recipientVerification, setRecipientVerification] =
    useState<RecipientLookupResult>({
      valid: false,
      name: "",
      accountNumber: "",
    });
  const [isVerifyingRecipient, setIsVerifyingRecipient] = useState(false);

  // External wire directory data
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");

  // 1. Debounced recipient lookup via backend API
  useEffect(() => {
    queueMicrotask(() => {
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
    });
  }, [recipientInput]);

  const internalSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Please enter a valid amount")
      .positive("Amount must be greater than zero")
      .max(
        availableBalance,
        `Amount cannot exceed available balance of $${availableBalance.toLocaleString()}`,
      )
      .required("Transfer amount is required"),
    notes: Yup.string().trim().max(255),
  });

  const wireSchema = Yup.object().shape({
    recipient_name: Yup.string()
      .trim()
      .required("Beneficiary name is required"),
    bank_name: Yup.string().trim().required("Destination bank is required"),
    bank_country: Yup.string()
      .trim()
      .required("Destination country is required"),
    recipient_account_number: Yup.string()
      .trim()
      .required("Destination account number or IBAN is required"),
    routing_number: Yup.string()
      .trim()
      .required("Routing / ABA code is required"),
    swift_bic: Yup.string().trim().required("SWIFT / BIC code is required"),
    amount: Yup.number()
      .typeError("Please enter a valid amount")
      .positive("Amount must be greater than zero")
      .max(
        availableBalance,
        `Amount cannot exceed available balance of $${availableBalance.toLocaleString()}`,
      )
      .required("Wire amount is required"),
    notes: Yup.string().trim().max(255),
  });

  return (
    <div>
      <div className="mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg text-primary font-bold">
          Transfer Money
        </h2>
        <p className="hidden md:block mt-0.5 text-xs font-medium text-gray-500">
          Transfer funds within People's Choice Bank or wire to external
          accounts globally.
        </p>
      </div>

      <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-5">
        <div className="grid grid-cols-2 gap-1.5 sm:flex sm:gap-2 border-b border-gray-200 pb-3 mb-4 max-w-xl">
          <button
            type="button"
            onClick={() => setActive("internal")}
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
            onClick={() => setActive("external")}
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
          <span className="text-gray-500 font-medium">
            Available Account Balance:
          </span>
          <span className="font-bold text-primary">
            {formatterUtility(Number(availableBalance))} USD
          </span>
        </div>

        {/* Tab 1: Within PC Bank */}
        {active === "internal" && (
          <Formik
            initialValues={{
              amount: "",
              notes: "",
            }}
            validationSchema={internalSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              if (!recipientVerification.valid) {
                toast.error(
                  recipientVerification.message ||
                    "Please enter a valid recipient account or username",
                );
                return;
              }

              try {
                const res = await internalTransferMutation.mutateAsync({
                  recipient_account:
                    recipientVerification.accountNumber ||
                    recipientInput.trim(),
                  amount: Number(values.amount),
                  notes: values.notes.trim() || undefined,
                });

                toast.success(res.message || "Transfer completed successfully");
                resetForm();
                setRecipientInput("");
                setRecipientVerification({
                  valid: false,
                  name: "",
                  accountNumber: "",
                });
              } catch (err) {
                toast.error(
                  getErrorMessage(err, "Failed to complete transfer"),
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 max-w-xl">
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
                        Verified: {recipientVerification.name} (Acct:{" "}
                        {recipientVerification.accountNumber})
                      </span>
                    </p>
                  )}
                  {!recipientVerification.valid &&
                    recipientInput.trim().length >= 4 &&
                    !isVerifyingRecipient && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>
                          {recipientVerification.message ||
                            "Recipient not verified in registry"}
                        </span>
                      </p>
                    )}
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Transfer Amount (USD)
                  </label>
                  <Field
                    type="number"
                    name="amount"
                    step="0.01"
                    min="1"
                    placeholder="0.00"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-[10px] mt-1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Note / Description (Optional)
                  </label>
                  <Field
                    type="text"
                    name="notes"
                    placeholder="e.g. Project payment or invoice settlement"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                  <ErrorMessage
                    name="notes"
                    component="div"
                    className="text-red-500 text-[10px] mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !recipientVerification.valid}
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white transition hover:opacity-90 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  <span>
                    {isSubmitting ? "Processing..." : "Transfer Funds"}
                  </span>
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Tab 2: Outside App (Bank Wire) */}
        {active === "external" && (
          <Formik
            initialValues={{
              recipient_name: "",
              bank_country: selectedCountry || "",
              bank_name: "",
              recipient_account_number: "",
              routing_number: "",
              swift_bic: "",
              amount: "",
              notes: "",
            }}
            validationSchema={wireSchema}
            enableReinitialize
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              try {
                const res = await submitExternalWireTransferService({
                  recipient_name: values.recipient_name.trim(),
                  bank_name: values.bank_name.trim(),
                  bank_code: values.swift_bic.trim() || "PCBKUS33",
                  bank_country: values.bank_country,
                  recipient_account_number:
                    values.recipient_account_number.trim(),
                  routing_number: values.routing_number.trim() || undefined,
                  swift_bic: values.swift_bic.trim() || undefined,
                  amount: Number(values.amount),
                  notes: values.notes.trim() || undefined,
                });

                toast.success(
                  res.message ||
                    "External wire transfer submitted successfully and pending clearance",
                );
                resetForm();
                setSelectedCountry("");
                setSelectedCountryName("");
              } catch (err) {
                toast.error(
                  getErrorMessage(err, "Failed to submit wire transfer"),
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-4 max-w-xl">
                {/* Country and Bank Selection with SearchableInput */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-primary">
                      <Globe2 className="h-3.5 w-3.5 text-gray-500" />
                      <span>Destination Country</span>
                    </label>
                    <SearchableInput<BankCountry>
                      endpoint="/banks/countries"
                      placeholder="Search destination country..."
                      displayKey="name"
                      dataKey="data"
                      // fetchOnEmpty={true}
                      initialValue={selectedCountryName}
                      inputContClassName="h-10 w-full p-2 rounded-lg border border-gray-200 bg-white text-xs transition focus-within:border-primary"
                      onSelect={(item: BankCountry) => {
                        setSelectedCountry(item.iso_code);
                        setSelectedCountryName(item.name);
                        setFieldValue("bank_country", item.iso_code);
                        setFieldValue("bank_name", "");
                        setFieldValue("swift_bic", "");
                      }}
                      onInputChange={(val) => {
                        if (!val) {
                          setSelectedCountry("");
                          setSelectedCountryName("");
                          setFieldValue("bank_country", "");
                          setFieldValue("bank_name", "");
                          setFieldValue("swift_bic", "");
                        }
                      }}
                    />
                    <ErrorMessage
                      name="bank_country"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-primary">
                      <Building2 className="h-3.5 w-3.5 text-gray-500" />
                      <span>Destination Bank</span>
                    </label>
                    <SearchableInput<BankItem>
                      endpoint={
                        values.bank_country
                          ? `/banks?country=${encodeURIComponent(values.bank_country.toLowerCase())}`
                          : ""
                      }
                      disabled={!values.bank_country}
                      placeholder={
                        !values.bank_country
                          ? "Select a destination country first"
                          : "Search destination bank..."
                      }
                      displayKey="name"
                      dataKey="data"
                      fetchOnEmpty={true}
                      initialValue={values.bank_name}
                      inputContClassName={`h-10 p-2 w-full rounded-lg border border-gray-200 text-xs! transition ${
                        !values.bank_country
                          ? "bg-gray-100 opacity-60 cursor-not-allowed"
                          : "bg-white focus-within:border-primary"
                      }`}
                      onSelect={(item: BankItem) => {
                        setFieldValue("bank_name", item.name);
                        if (item.code) {
                          setFieldValue("swift_bic", `${item.code}XXX`);
                        }
                      }}
                      onInputChange={(val) => {
                        setFieldValue("bank_name", val);
                      }}
                    />
                    <ErrorMessage
                      name="bank_name"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Beneficiary Full Legal Name
                  </label>
                  <Field
                    type="text"
                    name="recipient_name"
                    placeholder="Recipient full legal name"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                  <ErrorMessage
                    name="recipient_name"
                    component="div"
                    className="text-red-500 text-[10px] mt-1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Destination Account Number / IBAN
                  </label>
                  <Field
                    type="text"
                    name="recipient_account_number"
                    placeholder="External account number or IBAN"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                  <ErrorMessage
                    name="recipient_account_number"
                    component="div"
                    className="text-red-500 text-[10px] mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-[11px] font-bold text-primary">
                      Routing Number (ABA / Sort Code)
                    </label>
                    <Field
                      type="text"
                      name="routing_number"
                      placeholder="e.g. 021000021"
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                    />
                    <ErrorMessage
                      name="routing_number"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-bold text-primary">
                      SWIFT / BIC Code
                    </label>
                    <Field
                      type="text"
                      name="swift_bic"
                      placeholder="e.g. CHASUS33XXX"
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary font-mono uppercase"
                      disabled
                    />
                    <ErrorMessage
                      name="swift_bic"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Wire Amount (USD)
                  </label>
                  <Field
                    type="number"
                    name="amount"
                    step="0.01"
                    min="1"
                    placeholder="0.00"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-[10px] mt-1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-primary">
                    Transfer Memo / Purpose
                  </label>
                  <Field
                    type="text"
                    name="notes"
                    placeholder="e.g. Commercial invoice settlement"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-primary outline-none transition focus:border-primary"
                  />
                  <ErrorMessage
                    name="notes"
                    component="div"
                    className="text-red-500 text-[10px] mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white transition hover:opacity-90 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  <span>
                    {isSubmitting
                      ? "Submitting Wire..."
                      : "Submit Wire Transfer"}
                  </span>
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
