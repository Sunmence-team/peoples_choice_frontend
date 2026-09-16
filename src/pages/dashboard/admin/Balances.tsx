import React, { useState } from "react";
import { LuWallet } from "react-icons/lu";
import { FaWallet } from "react-icons/fa6";
import ReusableTable from "../../../utility/ReusableTable";
import ActionCell from "../../../components/ui/ActionCell";
import Modal from "../../../components/modal/Modal";
import { adminBalances } from "../../../lib/adminData";
import {
  formatISODateToCustom,
  getInitials,
} from "../../../helpers/formatterUtility";
import type { WalletBalance } from "../../../lib/interfaces";

const Balances: React.FC = () => {
  const [selected, setSelected] = useState<WalletBalance | null>(null);
  const [viewModal, setViewModal] = useState(false);

  const getUserInitials = (fullName: string) => {
    const [first = "", last = ""] = fullName.split(" ");
    return getInitials(first, last);
  };

  const totalValue = adminBalances.reduce((sum, item) => sum + item.balance, 0);

  const openBalance = (id: number) => {
    const found = adminBalances.find((item) => item.id === id);
    if (found) {
      setSelected(found);
      setViewModal(true);
    }
  };

  const columns = [
    {
      label: "USER",
      key: "full_name",
      render: (item: WalletBalance) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-white uppercase">
            {getUserInitials(item.full_name)}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#172b4d]">
              {item.full_name}
            </p>
            <p className="text-[9px] text-[#8190a3]">@{item.username}</p>
          </div>
        </div>
      ),
    },
    {
      label: "WALLET BALANCE",
      key: "balance",
      render: (item: WalletBalance) => (
        <span className="font-semibold">{item.balance}.00 {item.currency}</span>
      ),
    },
    {
      label: "CURRENCY",
      key: "currency",
      render: (item: WalletBalance) => (
        <span className="px-3 py-1 rounded-xl font-medium bg-green-100 text-green-600">
          {item.currency}
        </span>
      ),
    },
    {
      label: "LAST UPDATED",
      key: "last_updated",
      render: (item: WalletBalance) => formatISODateToCustom(item.last_updated),
    },
    {
      label: "ACTION",
      key: "action",
      render: (item: WalletBalance) => (
        <ActionCell
          canView={true}
          rowId={Number(item.id)}
          onView={() => openBalance(item.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#0B2D5B]">
          Wallet Balances
        </h1>
        <p className="mt-0.5 text-[15px] text-[#8190a3]">
          View all users' wallet balances and available funds.
        </p>
      </div>

      <div className="relative min-h-[120px] overflow-hidden rounded-xl bg-[#0B2D5B] p-4 text-white shadow-sm mt-6">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/[0.03]" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10">
            <FaWallet size={18} />
          </div>
          <div>
            <p className="text-[13px] text-[#d9e4f0]">
              Total Value in User Wallets
            </p>
            <p className="mt-1 text-[28px] font-bold leading-none tracking-[-1px]">
              {totalValue}.00 <span className="text-[10px] font-semibold text-[#dce8f5]">USDT</span>
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#35d27d]">
              <LuWallet size={12} /> {adminBalances.length} funded wallets
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-primary font-bold text-xl mb-5">
          All Wallet Balances
        </h2>
        <ReusableTable
          isLoading={false}
          error={false}
          data={adminBalances}
          columns={columns}
          currentPage={1}
          totalPages={1}
          totalItems={adminBalances.length}
          setCurrentPage={() => {}}
          itemsPerPage={10}
          setItemsPerPage={() => {}}
          hasSerialNo={true}
        />
      </div>

      {viewModal && selected && (
        <Modal onClose={() => setViewModal(false)}>
          <div className="p-4">
            <h3 className="text-[18px] font-bold text-[#0B2D5B]">
              Wallet Balance Details
            </h3>
            <p className="mt-1 text-[12px] text-[#8190a3]">
              Full wallet information for the selected user.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white uppercase">
                {getUserInitials(selected.full_name)}
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#172b4d]">
                  {selected.full_name}
                </p>
                <p className="text-[11px] text-[#8190a3]">
                  @{selected.username}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  label: "Wallet Balance",
                  value: `${selected.balance}.00 ${selected.currency}`,
                },
                { label: "Currency", value: selected.currency },
                {
                  label: "Last Updated",
                  value: formatISODateToCustom(selected.last_updated),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-[#e3eaf2] pb-3"
                >
                  <span className="text-[11px] text-[#8190a3]">
                    {row.label}
                  </span>
                  <span className="text-[12px] font-semibold text-[#172b4d] text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Balances;