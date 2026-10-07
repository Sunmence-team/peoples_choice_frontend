import React, { useState } from "react";

import { FiPlus } from "react-icons/fi";

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is People’s Choice?",
      answer:
        "People’s Choice is a digital banking platform that provides simple and secure financial services.",
    },
    {
      question: "How do I create an account?",
      answer:
        "Click on the Sign Up option, fill in your details, and follow the instructions to create your account.",
    },
    {
      question: "How do USDT deposits work?",
      answer:
        "Follow the provided instructions to make your USDT deposit. Once verified, the amount will be credited to your wallet.",
    },
    {
      question: "How long does deposit verification take?",
      answer:
        "Deposit verification usually takes some time depending on the network and verification process.",
    },
    {
      question: "When will my wallet be credited?",
      answer:
        "Once your deposit is approved, the credited amount will be reflected in your wallet.",
    },
    {
      question: "Can I request a withdrawal?",
      answer:
        "Yes. Submit a withdrawal request whenever you want to access your funds.",
    },
    {
      question: "Where can I view my transactions?",
      answer:
        "You can view your transaction history from your account dashboard.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="scroll-mt-16 bg-white px-6 py-12 md:px-8 lg:px-11"
    >
      <div className="">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary lg:text-2xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid gap-2.5 grid-cols-1 md:gap-x-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => handleToggle(index)}
              onMouseLeave={() => setOpenIndex(null)}
              className="flex cursor-pointer items-centera
              justify-between rounded-md border border-[#E5E7EB]
              bg-white px-4 py-2"
            >
              <div>
                <span className="text-[10px] font-medium text-black lg:text-[14px]">
                  {faq.question}
                </span>

                {openIndex === index && (
                  <p className="mt-2 text-[10px] text-gray-black lg:text-[13px]">
                    {faq.answer}
                  </p>
                )}
              </div>

              <div className="rounded-full px-2 py-2">
                <FiPlus
                  size={20}
                  className={`shrink-0 text-black transition-transform duration-200 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
