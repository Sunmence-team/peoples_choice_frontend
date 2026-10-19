import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setCardPinService } from "../../services/cardServices";
import { getErrorMessage } from "../../helpers/api";

interface SetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: number | string;
  onSuccess?: () => void;
}

const pinSchema = Yup.object().shape({
  pin: Yup.string()
    .trim()
    .matches(/^\d{4}$/, "PIN must be exactly 4 numerical digits")
    .required("PIN is required"),
});

export const SetPinModal: React.FC<SetPinModalProps> = ({
  isOpen,
  onClose,
  cardId,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-[10.5px] text-gray-500 leading-relaxed mb-3">
          This 4-digit PIN is required for ATM cash withdrawals and chip-and-PIN terminal POS purchases.
        </p>

        <Formik
          initialValues={{ pin: "" }}
          validationSchema={pinSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await setCardPinService(cardId, values.pin);
              toast.success(res.message);
              onClose();
              if (onSuccess) onSuccess();
            } catch (err) {
              toast.error(getErrorMessage(err, "Failed to update PIN"));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">
                  Enter New PIN
                </label>
                <Field
                  type="password"
                  name="pin"
                  maxLength={4}
                  autoFocus
                  placeholder="••••"
                  className="h-10 w-full rounded-lg border border-secondary bg-white text-center font-mono text-lg font-bold tracking-[0.5em] text-primary outline-none focus:border-primary transition"
                />
                <ErrorMessage
                  name="pin"
                  component="div"
                  className="text-red-500 text-xs mt-1 text-center"
                />
              </div>

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
                  <span>Save PIN</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SetPinModal;
