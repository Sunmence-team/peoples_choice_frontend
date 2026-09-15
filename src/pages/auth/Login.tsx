import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { assets } from "../../assets/assets";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white lg:flex">
      <div className="relative hidden min-h-screen overflow-hidden bg-primary bg-cover bg-center lg:flex lg:w-1/2">
        <div className="relative z-10 flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 md:px-10 lg:px-8">
          <img
            src={assets.Untitleddesign}
            alt="Go4bill"
            className="h-40 w-40"
          />

          <div className="flex flex-1 items-center">
            <div className="max-w-[550px]">
              <h2 className="max-w-[500px] text-4xl font-bold leading-[1.15] text-white sm:text-5xl xl:text-[48px]">
                Your money.
                <br />
                Your future.
                <br />
                Your control.
              </h2>

              <p className="mt-7 max-w-[470px] text-base leading-7 text-white sm:text-lg">
                Institutional-grade security with the simplicity your finances
                deserve. Trusted by over 2.4 million members worldwide.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-5 border-t border-white/10 pt-6">
            <div>
              <h3 className="text-xl flex font-bold text-white sm:text-2xl">
                $40B <FaPlus className="mt-1" />
              </h3>
              <p className="mt-1 text-xs text-white">Assets secured</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">1.4M</h3>
              <p className="mt-1 text-xs text-white">Members</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                99.99%
              </h3>
              <p className="mt-1 text-xs text-white">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12 xl:px-16">
        <div className="w-full">
          <div className="mb-9">
            <h1 className="text-3xl text-center font-bold tracking-tight text-[#082f63] sm:text-[32px]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-center leading-6 text-black">
              Sign in to access your accounts and financial dashboard.
            </p>
          </div>

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold  tracking-wide text-black">
                Email Adress
              </label>

              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="alade@example.com"
                  className="h-[55px] w-full rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-semibold  tracking-wide text-black">
                Password
              </label>

              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-[55px] w-full rounded-md border border-gray-300 bg-white px-4 pr-12 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black transition"
                >
                  {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-black">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] rounded border-black accent-primary"
                />

                <span>Remember this device</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-black hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="h-[55px] w-full rounded-md bg-[#0d3566] text-sm font-semibold text-white transition hover:bg-[#092545]"
            >
              Sign In to Your Account
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-black">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#0b376d] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
