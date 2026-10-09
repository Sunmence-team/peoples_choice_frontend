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
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { assets } from "../../assets/assets";
import { useRegister } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";
import { getErrorMessage } from "../../helpers/api";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();
  const { login, refreshUser } = useUser();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      phone: "",
      email: "",
      country: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      username: Yup.string().required("Username is required"),
      phone: Yup.string().required("Phone number is required"),
      email: Yup.string().required("Email is required").email("Enter a valid email"),
      country: Yup.string().required("Country is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      password_confirmation: Yup.string()
        .required("Confirm your password")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await registerMutation.mutateAsync(values);

        if (result?.token) {
          login(result.token, result.user, result.role);
          if (!result.user) await refreshUser(result.token);
          toast.success("Account created successfully");
          navigate("/dashboard/overview");
          return;
        }

        toast.success("Account created. Please sign in.");
        navigate("/login");
      } catch (error) {
        toast.error(getErrorMessage(error, "Unable to create account"));
      }
    },
  });

  const isSubmitting = registerMutation.isPending || formik.isSubmitting;

  const fieldClass =
    "h-[55px] w-full rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition placeholder:text-black focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11";

  const errorText = (name: keyof typeof formik.values) =>
    formik.touched[name] && formik.errors[name] ? (
      <p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>
    ) : null;

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

          <form className="space-y-4" onSubmit={formik.handleSubmit} noValidate>
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
                    name="first_name"
                    placeholder="First name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={fieldClass}
                  />
                </div>
                {errorText("first_name")}
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
                    name="last_name"
                    placeholder="Last name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={fieldClass}
                  />
                </div>
                {errorText("last_name")}
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
                  name="username"
                  placeholder="Choose a username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={fieldClass}
                />
              </div>
              {errorText("username")}
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
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={fieldClass}
                />
              </div>
              {errorText("phone")}
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
                  name="email"
                  placeholder="Enter your email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={fieldClass}
                />
              </div>
              {errorText("email")}
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
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[55px] w-full appearance-none rounded-md border border-light bg-white px-4 text-sm text-black outline-none transition focus:border-[#0b376d] focus:ring-1 focus:ring-light sm:pl-11"
                >
                  <option value="" disabled>
                    Select your country
                  </option>

                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              {errorText("country")}
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
                  name="password"
                  placeholder="Create a password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              {errorText("password")}
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
                  name="password_confirmation"
                  placeholder="Confirm your password"
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              {errorText("password_confirmation")}
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-[55px] w-full items-center justify-center gap-2 rounded-md bg-[#0d3566] text-sm font-semibold text-white transition hover:bg-[#092545] disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating your account..." : "Create Your Account"}
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
