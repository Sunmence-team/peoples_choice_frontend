import React from "react";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { assets } from "../../assets/assets";

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-primary py-16 md:py-20 lg:py-20 h-170"
    >
      <div className=" px-6 md:px-10 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 ">
          <div className="relative z-10 ">
            <h2 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-6xl lg:text-[3.7rem] xl:text-[4rem]">
              Your money.
              <br />
              <span className="text-secondary">Your choice.</span>
            </h2>

            <p className="mt-8  text-base leading-7 text-white/90 sm:text-lg">
              People’s Choice gives you a simple and reliable way to manage your
              digital funds. Create your account, manage your wallet, deposit
              using USDT, and request withdrawals all from one place.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <IoShieldCheckmarkSharp className="text-xl text-secondary" />

              <p className="text-sm font-medium tracking-wide text-secondary">
                Simple tools. Smarter money management.
              </p>
            </div>
          </div>

          <div className="relative h-[520px] w-full overflow-hidden rounded-xl ">
            <img
              src={assets.human}
              alt="Go4bill"
              className="h-full lg:h-200 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
