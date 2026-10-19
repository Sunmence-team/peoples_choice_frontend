import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import type { CompanyWallet } from "../../helpers/mappers";

interface AdminWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: CompanyWallet | null;
  onSubmit: (values: { address: string; type: string; balance: number }) => Promise<void>;
  isLoading: boolean;
}

const walletSchema = Yup.object().shape({
  address: Yup.string().trim().required("Wallet address is required"),
  type: Yup.string().trim().required("Wallet network/type is required"),
  balance: Yup.number()
    .typeError("Enter a valid balance")
    .min(0, "Balance cannot be negative")
    .required("Balance is required"),
});

export const AdminWalletModal: React.FC<AdminWalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onSubmit,
  isLoading,
}) => {
  if (!isOpen) return null;

  const isCreating = !wallet;

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h3 className="text-[18px] font-bold text-[#0B2D5B]">
          {isCreating ? "Create Company Wallet" : "Company Wallet Details"}
        </h3>
        <p className="mt-1 text-[12px] text-[#8190a3]">
          {isCreating
            ? "Add a new deposit or payout wallet."
            : "View and update the selected wallet."}
        </p>

        {!isCreating && wallet && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-[#e3eaf2] px-3 py-2">
            <span className="text-[11px] text-[#8190a3]">Status</span>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-medium capitalize ${
                wallet.status === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {wallet.status}
            </span>
          </div>
        )}

        <Formik
          initialValues={{
            address: wallet?.address ?? "",
            type: wallet?.type ?? "TRC20",
            balance: wallet?.balance ?? 0,
          }}
          validationSchema={walletSchema}
          enableReinitialize
          onSubmit={async (values) => {
            await onSubmit({
              address: values.address.trim(),
              type: values.type.trim(),
              balance: Number(values.balance),
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#172b4d]">
                  Address
                </label>
                <Field
                  type="text"
                  name="address"
                  placeholder="Wallet address"
                  className="w-full rounded-lg border border-[#dfe8f1] px-3 py-2.5 font-mono text-sm outline-none focus:border-primary"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#172b4d]">
                  Type / Network
                </label>
                <Field
                  as="select"
                  name="type"
                  className="w-full rounded-lg border border-[#dfe8f1] px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="TRC20">TRC20</option>
                  <option value="ERC20">ERC20</option>
                  <option value="BEP20">BEP20</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#172b4d]">
                  Balance
                </label>
                <Field
                  type="number"
                  name="balance"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[#dfe8f1] px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <ErrorMessage
                  name="balance"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading || isSubmitting}
                  className="rounded-lg border border-[#dfe8f1] py-3 text-sm font-semibold text-[#52677c] transition hover:bg-[#f8fafc] disabled:opacity-60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/80 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading || isSubmitting
                    ? "Saving..."
                    : isCreating
                    ? "Create Wallet"
                    : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default AdminWalletModal;
