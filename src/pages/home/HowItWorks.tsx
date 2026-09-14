import React from "react";
import {
  FaUserPlus,
  FaUserCheck,
  FaCoins,
  FaShieldAlt,
  FaWallet,
  FaMoneyBillWave,
  FaCheckCircle,
  FaHistory,
  FaUserCog,
} from "react-icons/fa";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FaUserPlus size={20} />,
      step: "01",
      title: "Create Your Account",
      text: "Register your People's Choice account.",
    },
    {
      icon: <FaUserCheck size={20} />,
      step: "02",
      title: "Set Up Your Profile",
      text: "Complete your profile information.",
    },
    {
      icon: <FaCoins size={20} />,
      step: "03",
      title: "Deposit USDT",
      text: "Follow the provided instructions to make your USDT deposit.",
    },
    {
      icon: <FaShieldAlt size={20} />,
      step: "04",
      title: "Verification",
      text: "Your deposit is manually reviewed by an administrator.",
    },
    {
      icon: <FaWallet size={20} />,
      step: "05",
      title: "Wallet Credited",
      text: "Once approved, the credited amount is reflected in your wallet.",
    },
    {
      icon: <FaMoneyBillWave size={20} />,
      step: "06",
      title: "Request Withdrawal",
      text: "Submit a withdrawal request when you want to withdraw your funds.",
    },
  ];

  const transparency = [
    {
      icon: <FaCheckCircle size={20} />,
      title: "Manual Deposit Review",
      text: "Every USDT deposit is reviewed before funds are credited.",
    },
    {
      icon: <FaHistory size={20} />,
      title: "Clear Wallet Activity",
      text: "View your deposits, withdrawals and transaction history.",
    },
    {
      icon: <FaUserCog size={20} />,
      title: "Simple Account Access",
      text: "A straightforward experience for managing your account.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-light px-6 py-10 md:px-8 lg:px-11"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary sm:text-2xl">
            Get started in a few simple steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-5">
          {steps.map((step) => (
            <div
              key={step.step}
              className="group relative flex flex-col rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-center "
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-lg text-primary sm:h-12 sm:w-12">
                {step.icon}
              </div>

              <p className="text-[9px] flex justify-start font-bold uppercase  text-secondary md:text-[10px] lg:text-[14px]">
                Step {step.step}
              </p>

              <h3 className="mt-1.5 flex justify-start text-[11px] font-bold leading-5 text-primary sm:text-sm lg:text-base">
                {step.title}
              </h3>

              <p className="mt-2 flex justify-start text-[9px] leading-4 text-black sm:text-[11px] sm:leading-5 lg:text-xs">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-md bg-primary px-5 py-6 text-white sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr] lg:items-center">
            <div>
              <p className="mb-1 text-[8px] lg:text-sm font-bold uppercase tracking-[0.18em] text-secondary">
                Trust & Transparency
              </p>

              <h2 className="text-xl font-bold">
                Built with transparency in mind.
              </h2>

              <p className="mt-2 max-w-sm text-[9px] lg:text-[11px] leading-4 text-white">
                Your security and peace of mind are important to us. That’s why
                every part of your wallet experience is designed to be simple
                and transparent.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {transparency.map((item) => (
                <div
                  key={item.title}
                  className="bg-primary/80 shadow border border-light/20 px-4 py-3 rounded-xl"
                >
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-secondary">
                    {item.icon}
                  </div>

                  <h3 className="text-[10px] font-bold">{item.title}</h3>

                  <p className="mt-1 text-[8px] lg:text-[11px] leading-4 text-white">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
