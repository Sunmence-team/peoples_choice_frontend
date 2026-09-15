import React from "react";
import {
  FaUser,
  FaCoins,
  FaShieldAlt,
  FaWallet,
  FaExchangeAlt,
  FaReceipt,
} from "react-icons/fa";

const Features: React.FC = () => {
  const features = [
    {
      icon: <FaUser />,
      title: "Easy Account Creation",
      description: "Create your People's Choice account quickly and easily.",
    },
    {
      icon: <FaCoins />,
      title: "USDT Deposits",
      description: "Deposit funds using supported USDT payment instructions.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Manual Verification",
      description:
        "Deposits are manually reviewed by an administrator before your wallet is credited.",
    },
    {
      icon: <FaWallet />,
      title: "Wallet Management",
      description: "View and manage your available wallet balance.",
    },
    {
      icon: <FaExchangeAlt />,
      title: "Withdrawal Requests",
      description: "Submit withdrawal requests from your account.",
    },
    {
      icon: <FaReceipt />,
      title: "Transaction History",
      description: "Track your deposits, withdrawals and wallet activity.",
    },
  ];
  return (
    <>
      <section
        id="features"
        className="scroll-mt-16 bg-white px-6 py-8 md:px-8 lg:px-11"
      >
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <h2 className="mb-5 text-xl font-bold text-[#0B2D5B] sm:text-2xl">
            Everything you need to manage your wallet.
          </h2>

          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border-1 border-light hover:bg-light/20 px-6 py-4"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-xl text-secondary">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-black">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 max-w-xs text-sm leading-6 text-black">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
