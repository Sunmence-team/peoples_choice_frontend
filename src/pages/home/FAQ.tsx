import React from "react";
import { FiPlus } from "react-icons/fi";

const FAQ: React.FC = () => {
  const faqs = [
    "What is People’s Choice?",
    "How do I create an account?",
    "How do USDT deposits work?",
    "How long does deposit verification take?",
    "When will my wallet be credited?",
    "Can I request a withdrawal?",
    "Where can I view my transactions?",
  ];

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
          {faqs.map((question, index) => (
            <div
              key={index}
              className="flex  cursor-pointer items-center
              justify-between rounded-md border border-[#E5E7EB]
              bg-white px-4 py-2"
            >
              <span className="text-[10px] font-medium text-black lg:text-[14px]">
                {question}
              </span>

              <div className="py-2 px-2 rounded-full bg-light">
                <FiPlus size={20} className="shrink-0 text-black" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
