import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CreditCard, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { requestCardService, type RequestCardPayload } from "../../services/cardServices";
import { getErrorMessage } from "../../helpers/api";

interface RequestCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName: string;
  onSuccess: (newCardId?: number | string) => void;
}

const cardRequestSchema = Yup.object().shape({
  card_type: Yup.string().oneOf(["virtual", "physical"]).required(),
  card_brand: Yup.string().oneOf(["visa", "mastercard"]).required(),
  card_holder_name: Yup.string().trim().required("Cardholder name is required"),
  billing_address: Yup.string().trim().required("Billing address is required"),
  delivery_address: Yup.string().when("card_type", {
    is: "physical",
    then: (schema) => schema.trim().required("Delivery address is required for physical card delivery"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const RequestCardModal: React.FC<RequestCardModalProps> = ({
  isOpen,
  onClose,
  userFullName,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl border border-secondary animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
          <h3 className="text-xs sm:text-[13px] font-bold text-primary">
            Request / Order New Card
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={{
            card_type: "virtual" as "virtual" | "physical",
            card_brand: "visa" as "visa" | "mastercard",
            card_holder_name: userFullName || "ACCOUNT HOLDER",
            billing_address: "",
            delivery_address: "",
          }}
          validationSchema={cardRequestSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload: RequestCardPayload = {
                card_type: values.card_type,
                card_brand: values.card_brand,
                currency: "USD",
                card_holder_name: values.card_holder_name.trim().toUpperCase(),
                billing_address: values.billing_address.trim(),
                delivery_address:
                  values.card_type === "physical"
                    ? values.delivery_address.trim()
                    : null,
              };

              const res = await requestCardService(payload);
              toast.success(res.message);
              onClose();
              const newId = res.card?.id || res.data?.id;
              onSuccess(newId);
            } catch (err) {
              toast.error(getErrorMessage(err, "Failed to submit card application"));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-3">
              {/* Form Factor selection */}
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Select Card Form Factor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFieldValue("card_type", "virtual")}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      values.card_type === "virtual"
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
                    onClick={() => setFieldValue("card_type", "physical")}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      values.card_type === "physical"
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
                    onClick={() => setFieldValue("card_brand", "visa")}
                    className={`h-9 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      values.card_brand === "visa"
                        ? "border-primary bg-primary text-white"
                        : "border-secondary bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    VISA
                  </button>
                  <button
                    type="button"
                    onClick={() => setFieldValue("card_brand", "mastercard")}
                    className={`h-9 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      values.card_brand === "mastercard"
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
                <Field
                  type="text"
                  name="card_holder_name"
                  className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs font-semibold uppercase text-primary outline-none focus:border-primary transition"
                />
                <ErrorMessage
                  name="card_holder_name"
                  component="div"
                  className="text-red-500 text-[10px] mt-1"
                />
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Billing Address
                </label>
                <Field
                  type="text"
                  name="billing_address"
                  placeholder="Street address, city, state, zip"
                  className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-primary outline-none focus:border-primary transition"
                />
                <ErrorMessage
                  name="billing_address"
                  component="div"
                  className="text-red-500 text-[10px] mt-1"
                />
              </div>

              {/* Delivery Address (only if physical) */}
              {values.card_type === "physical" && (
                <div>
                  <label className="block text-[11px] font-semibold text-primary mb-1">
                    Courier Delivery Address
                  </label>
                  <Field
                    type="text"
                    name="delivery_address"
                    placeholder="Enter street address, city, state, zip"
                    className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-primary outline-none focus:border-primary transition"
                  />
                  <ErrorMessage
                    name="delivery_address"
                    component="div"
                    className="text-red-500 text-[10px] mt-1"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5 block">
                    Dispatched within 3-5 business days via tracked courier delivery.
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 h-9 rounded-lg border border-secondary text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-9 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  <span>Confirm Issuance</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RequestCardModal;
