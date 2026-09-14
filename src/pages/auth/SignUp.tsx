import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
  FiGlobe,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white lg:flex">
      <div
        className="relative hidden min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat lg:flex lg:w-1/2"
        style={{
          backgroundImage: `url(${assets.human})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12 xl:px-16">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl text-center font-bold tracking-tight text-[#082f63] sm:text-[32px]">
              Create your account
            </h1>

            <p className="mt-2 text-center text-sm leading-6 text-black">
              Join People’s Choice Bank and take control of your finances with a
              simple and secure banking experience.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                  First Name
                </label>

                <div className="relative">
                  <FiUser
                    size={20}
                    className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                  />

                  <input
                    type="text"
                    placeholder="First name"
                    className="h-[55px] w-full rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                  Last Name
                </label>

                <div className="relative">
                  <FiUser
                    size={20}
                    className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                  />

                  <input
                    type="text"
                    placeholder="Last name"
                    className="h-[55px] w-full rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                Username
              </label>

              <div className="relative">
                <FiUser
                  size={20}
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                />

                <input
                  type="text"
                  placeholder="Choose a username"
                  className="h-[55px] w-full rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                Phone Number
              </label>

              <div className="relative">
                <FiPhone
                  size={20}
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                />

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="h-[55px] w-full rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                Email Address
              </label>

              <div className="relative">
                <FiMail
                  size={20}
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-[55px] w-full rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                Country
              </label>

              <div className="relative">
                <FiGlobe
                  size={20}
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                />

                <select
                  defaultValue=""
                  className="h-[55px] w-full appearance-none rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                >
                  <option value="" disabled>
                    Select your country
                  </option>

                  <option value="nigeria">Nigeria</option>
                  <option value="ghana">Ghana</option>
                  <option value="kenya">Kenya</option>
                  <option value="south-africa">South Africa</option>
                  <option value="united-kingdom">United Kingdom</option>
                  <option value="united-states">United States</option>
                  <option value="canada">Canada</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                Password
              </label>

              <div className="relative">
                <FiLock
                  size={20}
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="h-[55px] w-full rounded-md border border-gray-300 bg-white px-4 pr-12 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wide text-black">
                Confirm Password
              </label>

              <div className="relative">
                <FiLock
                  size={20}
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-black sm:block"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="h-[55px] w-full rounded-md border border-gray-300 bg-white px-4 pr-12 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black transition"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              className="mt-2 h-[55px] w-full rounded-md bg-[#0d3566] text-sm font-semibold text-white transition hover:bg-[#092545]"
            >
              Create Your Account
            </button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0b376d] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
