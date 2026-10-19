import React, { useState } from "react";
import { toast } from "sonner";
import { LuWallet } from "react-icons/lu";
import { FaWallet } from "react-icons/fa6";
import { FaLock, FaLockOpen, FaRotateLeft } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import AdminWalletModal from "../../../components/modal/AdminWalletModal";
import {
  useAdminWallets,
  useCreateAdminWallet,
  useUpdateAdminWallet,
  useDisableAdminWallet,
  useEnableAdminWallet,
  useDeleteAdminWallet,
  useRestoreAdminWallet,
} from "../../../hooks/useAdminData";
import { getErrorMessage } from "../../../helpers/api";
import type { CompanyWallet } from "../../../helpers/mappers";

type WalletAction = "disable" | "enable" | "delete" | "restore" | null;

const Balances: React.FC = () => {
  const [selected, setSelected] = useState<CompanyWallet | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<WalletAction>(null);

  const { data, isLoading, error } = useAdminWallets();
  const wallets = data?.items ?? [];

  const createMutation = useCreateAdminWallet();
  const updateMutation = useUpdateAdminWallet();
  const disableMutation = useDisableAdminWallet();
  const enableMutation = useEnableAdminWallet();
  const deleteMutation = useDeleteAdminWallet();
  const restoreMutation = useRestoreAdminWallet();

  const actionMutation =
    pendingAction === "disable"
      ? disableMutation
      : pendingAction === "enable"
        ? enableMutation
        : pendingAction === "delete"
          ? deleteMutation
          : restoreMutation;

  const totalValue = wallets.reduce((sum, item) => sum + (+item.balance), 0);

  const openCreate = () => {
    setSelected(null);
    setViewModal(true);
  };

  const openWallet = (id: number) => {
    const found = wallets.find((item) => item.id === id);
    if (found) {
      setSelected(found);
      setViewModal(true);
    }
  };

  const handleSaveWallet = async (values: {
    address: string;
    type: string;
    balance: number;
  }) => {
    try {
      if (!selected) {
        await createMutation.mutateAsync({
          address: values.address,
          type: values.type,
          balance: values.balance,
        });
        toast.success("Company wallet created");
      } else {
        await updateMutation.mutateAsync({
          walletId: selected.id,
          payload: {
            address: values.address,
            type: values.type,
            balance: values.balance,
          },
        });
        toast.success("Company wallet updated");
      }
      setViewModal(false);
      setSelected(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save wallet"));
    }
  };

  const runAction = async () => {
    if (!selected || !pendingAction) return;

    try {
      const vars = { walletId: selected.id };
      if (pendingAction === "disable") {
        await disableMutation.mutateAsync(vars);
        toast.success("Wallet disabled");
      } else if (pendingAction === "enable") {
        await enableMutation.mutateAsync(vars);
        toast.success("Wallet enabled");
      } else if (pendingAction === "delete") {
        await deleteMutation.mutateAsync(vars);
        toast.success("Wallet deleted");
      } else {
        await restoreMutation.mutateAsync(vars);
        toast.success("Wallet restored");
      }
      setPendingAction(null);
      setViewModal(false);
      setSelected(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Action failed"));
    }
  };

  const statusBadge = (status: CompanyWallet["status"]) => (
    <span
      className={`px-3 py-1 rounded-xl font-medium capitalize ${
        status === "active"
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  );

  const columns = [
    {
      label: "TYPE",
      key: "type",
      render: (item: CompanyWallet) => (
        <span className="px-3 py-1 rounded-xl font-medium bg-primary/10 text-primary">
          {item.type}
        </span>
      ),
    },
    {
      label: "ADDRESS",
      key: "address",
      render: (item: CompanyWallet) => (
        <span className="font-mono text-[11px] text-[#52677c]">
          {item.address}
        </span>
      ),
    },
    {
      label: "BALANCE",
      key: "balance",
      render: (item: CompanyWallet) => (
        <span className="font-semibold">{item.balance}.00 USDT</span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item: CompanyWallet) => statusBadge(item.status),
    },
    {
      label: "ACTION",
      key: "action",
      render: (item: CompanyWallet) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id)}
          onView={() => openWallet(item.id)}
          onDelete={() => {
            openWallet(item.id);
            setPendingAction("delete");
          }}
          otherActions={[
            item.status === "active"
              ? {
                  name: "Disable",
                  icon: <FaLock />,
                  tone: "warning",
                  action: () => {
                    openWallet(item.id);
                    setPendingAction("disable");
                  },
                }
              : {
                  name: "Enable",
                  icon: <FaLockOpen />,
                  tone: "success",
                  action: () => {
                    openWallet(item.id);
                    setPendingAction("enable");
                  },
                },
            {
              name: "Restore",
              icon: <FaRotateLeft />,
              tone: "default",
              action: () => {
                openWallet(item.id);
                setPendingAction("restore");
              },
            },
          ]}
        />
      ),
    },
  ];

  const actionCopy = {
    disable: {
      title: "Disable this wallet?",
      message: "This wallet will no longer be used for deposits or payouts.",
      text: "Yes, Disable",
    },
    enable: {
      title: "Enable this wallet?",
      message: "This wallet will be re-activated for use.",
      text: "Yes, Enable",
    },
    delete: {
      title: "Delete this wallet?",
      message: "This permanently removes the company wallet.",
      text: "Yes, Delete",
    },
    restore: {
      title: "Restore this wallet?",
      message: "This restores the previously removed wallet.",
      text: "Yes, Restore",
    },
  } as const;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
            Company Wallets
          </h1>
          <p className="mt-0.5 text-[15px] text-[#8190a3]">
            Manage company deposit and payout wallets.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-primary/80 cursor-pointer"
        >
          + Add Wallet
        </button>
      </div>

      <div className="relative min-h-[120px] overflow-hidden rounded-xl bg-[#0B2D5B] p-4 text-white shadow-sm mt-6">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/[0.03]" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10">
            <FaWallet size={18} />
          </div>
          <div>
            <p className="text-[13px] text-[#d9e4f0]">
              Total Value in Company Wallets
            </p>
            <p className="mt-1 text-[28px] font-bold leading-none tracking-[-1px]">
              {totalValue}.00{" "}
              <span className="text-[10px] font-semibold text-[#dce8f5]">
                USDT
              </span>
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#35d27d]">
              <LuWallet size={12} /> {wallets.length} wallets
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-primary font-bold text-xl mb-5">All Wallets</h2>
        <ReusableTable
          isLoading={isLoading}
          error={error}
          data={wallets}
          columns={columns}
          currentPage={1}
          totalPages={data?.totalPages ?? 1}
          totalItems={data?.total ?? wallets.length}
          setCurrentPage={() => {}}
          itemsPerPage={50}
          setItemsPerPage={() => {}}
          hasSerialNo={true}
        />
      </div>

      <AdminWalletModal
        isOpen={viewModal && !pendingAction}
        onClose={() => {
          setViewModal(false);
          setSelected(null);
        }}
        wallet={selected}
        onSubmit={handleSaveWallet}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!pendingAction && !!selected}
        title={pendingAction ? actionCopy[pendingAction].title : ""}
        message={pendingAction ? actionCopy[pendingAction].message : ""}
        confirmText={pendingAction ? actionCopy[pendingAction].text : "Confirm"}
        onCancel={() => setPendingAction(null)}
        onConfirm={runAction}
        isLoading={actionMutation.isPending}
      />
    </>
  );
};

export default Balances;
