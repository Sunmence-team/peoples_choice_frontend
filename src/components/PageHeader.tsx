import React from "react";
import { motion } from "motion/react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-8 md:py-6 ${className}`}>
      <div className="bg-primary text-white rounded-[2rem] md:rounded-br-[10rem] overflow-hidden relative shadow-xl py-14 md:py-18 lg:py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed font-sans"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
