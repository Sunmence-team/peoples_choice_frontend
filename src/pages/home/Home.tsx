import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { assets } from "../../assets/assets";
import About from "./About";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import { FaPlus } from "react-icons/fa6";
import { LuPercent } from "react-icons/lu";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden">
        <div className="mx-auto flex  items-center px-6 py-12 lg:px-10 lg:py-0">
          <div className="w-full lg:w-1/2">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary">
              Simple. Secure. Trusted.
            </p>

            <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-primary sm:text-6xl lg:text-7xl">
              Your Money,
              <br />
              <span className="text-secondary">Made Simple.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-6 text-black lg:text-lg">
              A modern digital banking experience for managing your funds, using
              USDT deposits and requesting withdrawals with confidence.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="w-fit rounded-md bg-primary flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white"
              >
                Create Account <FaArrowRight />
              </Link>
            </div>

            <div className="mt-6 flex max-w-xl items-center gap-8 border-t border-primary/20 pt-9 sm:gap-14">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-1">
                  50K
                  <FaPlus />
                </h3>
                <p className="mt-1 text-sm text-black">Active Users</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-1">
                  $2M
                  <FaPlus />
                </h3>
                <p className="mt-1 text-sm text-black">Total Deposits</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-1">
                  99.9
                  <LuPercent />
                </h3>
                <p className="mt-1 text-sm text-black">Uptime</p>
              </div>
            </div>
          </div>

          <div className="relative hidden h-[650px] w-1/2 items-center justify-center lg:flex">
            <div className="absolute left-70 top-24 h-[290px] w-[290px] rotate-12 rounded-full bg-secondary/45 blur-3xl" />

            <div className="relative left-40  bottom-8 flex  items-center justify-end">
              <img
                src={assets.phone}
                alt="People's Choice banking mobile application"
                className="h-[495px] w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      <About />
      <Features />
      <HowItWorks />
      <FAQ />
    </div>
  );
};

export default Home;
