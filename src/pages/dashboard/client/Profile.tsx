import React, { useRef, useState } from "react";

type Tab = "personal" | "security" | "wallet";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const [fullName, setFullName] = useState("Areez Kamal");
  const [email, setEmail] = useState("areezkamal@gmail.com");
  const [phone, setPhone] = useState("+234 810 300 7467");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [accountName, setAccountName] = useState("Areez Kamal");
  const [bankName, setBankName] = useState("First Bank");
  const [accountNumber, setAccountNumber] = useState("0123456789");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleUpdateProfile = () => {
    console.log({
      fullName,
      email,
      phone,
    });

    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen p-">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#0d2340]">
          Profile Settings
        </h1>

        <p className="mt-0.5 text-[15px] text-gray-500">
          Manage your account information and security settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex w-fit gap-5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("personal")}
          className={`rounded-md px-8 py-3 text-sm font-medium cursor-pointer transition ${
            activeTab === "personal"
              ? "bg-primary text-white shadow-sm"
              : "text-primary hover:text-primary bg-white"
          }`}
        >
          Personal Information
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`rounded-md px-8 py-3 text-sm font-medium cursor-pointer transition ${
            activeTab === "security"
              ? "bg-primary text-white shadow-sm"
              : "text-[#66809c] hover:text-primary bg-white"
          }`}
        >
          Security
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`rounded-md px-8 py-3 text-sm font-medium cursor-pointer transition ${
            activeTab === "wallet"
              ? "bg-primary text-white shadow-sm"
              : "text-[#66809c] hover:text-primary bg-white"
          }`}
        >
          Wallet Information
        </button>
      </div>

      {/* Personal Information */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1  gap-5 lg:grid-cols-2">
          {/* Left Card */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            {/* Profile */}
            <div className="mb-6 flex items-center gap-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
                  AK
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-primary/90 hover:text-blue-600"
              >
                Change Photo
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 text-sm text-[#243b53] outline-none transition focus:border-[#0c4778]"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 text-sm text-[#243b53] outline-none transition focus:border-[#0c4778]"
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Phone Number
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 text-sm text-[#243b53] outline-none transition focus:border-[#0c4778]"
              />
            </div>

            {/* Update Button */}
            <button
              type="button"
              onClick={handleUpdateProfile}
              className="w-full rounded-lg bg-tetiary cursor-pointer py-3 text-sm font-semibold text-white transition hover:bg-[#04984e]"
            >
              Update Profile
            </button>
          </div>

          {/* Right Card */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-primary">
              Account Information
            </h2>

            {/* User ID */}
            <div className="border-b border-[#e6edf4] py-4 first:pt-0">
              <p className="mb-1 text-xs text-gray-400">User ID</p>
              <p className="text-sm font-medium text-[#52677c]">
                #PC-000123
              </p>
            </div>

            {/* Account Created */}
            <div className="border-b border-[#e6edf4] py-4">
              <p className="mb-1 text-xs text-gray-400">Account Created</p>
              <p className="text-sm font-medium text-[#52677c]">
                Sep 1, 2026
              </p>
            </div>

            {/* Last Login */}
            <div className="border-b border-[#e6edf4] py-4">
              <p className="mb-1 text-xs text-gray-400">Last Login</p>
              <p className="text-sm font-medium text-[#52677c]">
                Sep 14, 2026, 08:32 AM
              </p>
            </div>

            {/* Verification Notice */}
            <div className="mt-5 flex gap-3 rounded-lg bg-[#e9f9f2] p-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tetiary text-xs font-bold text-white">
                ✓
              </div>

              <p className="text-xs leading-5 text-[#428060]">
                For your security, some information can only be changed after
                verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 ">
          {/* Change Password */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primary">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update your password to keep your account secure.
              </p>
            </div>

            {/* Current Password */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 pr-12 text-sm text-[#243b53] outline-none transition focus:border-primary"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-primary"
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 pr-12 text-sm text-[#243b53] outline-none transition focus:border-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-primary"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 pr-12 text-sm text-[#243b53] outline-none transition focus:border-primary"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-primary"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (newPassword !== confirmPassword) {
                  alert("Passwords do not match");
                  return;
                }

                alert("Password updated successfully");
              }}
              className="w-full rounded-lg bg-tetiary py-3 text-sm font-semibold text-white transition hover:bg-[#04984e]"
            >
              Update Password
            </button>
          </div>

          {/* Security Settings */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">
              Security Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage additional security features for your account.
            </p>

            {/* 2FA */}
            <div className="mt-6 flex items-center justify-between rounded-lg border border-[#e1eaf2] p-4">
              <div className="pr-4">
                <h3 className="text-sm font-semibold text-[#243b53]">
                  Two-Factor Authentication
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Add an extra layer of security when logging into your
                  account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  twoFactorEnabled ? "bg-tetiary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    twoFactorEnabled ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Email Verification */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-[#e1eaf2] p-4">
              <div>
                <h3 className="text-sm font-semibold text-[#243b53]">
                  Email Verification
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Your email address has been verified.
                </p>
              </div>

              <span className="rounded-full bg-[#e9f9f2] px-3 py-1 text-xs font-medium text-[#428060]">
                Verified
              </span>
            </div>

            {/* Phone Verification */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-[#e1eaf2] p-4">
              <div>
                <h3 className="text-sm font-semibold text-[#243b53]">
                  Phone Verification
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Your phone number has been verified.
                </p>
              </div>

              <span className="rounded-full bg-[#e9f9f2] px-3 py-1 text-xs font-medium text-[#428060]">
                Verified
              </span>
            </div>

            {/* Security Notice */}
            <div className="mt-5 flex gap-3 rounded-lg bg-[#f5f9fd] p-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                i
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Never share your password or verification codes with
                anyone. Our support team will never ask for your password.
              </p>
            </div>
          </div>

          {/* Login Activity */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-primary">
              Recent Login Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review recent activity on your account.
            </p>

            <div className="mt-5 divide-y divide-[#e6edf4]">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#243b53]">
                    Chrome · Windows
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Lagos, Nigeria · Sep 14, 2026
                  </p>
                </div>

                <span className="rounded-full bg-[#e9f9f2] px-3 py-1 text-xs font-medium text-[#428060]">
                  Current
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#243b53]">
                    Chrome · Android
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Lagos, Nigeria · Sep 12, 2026
                  </p>
                </div>

                <span className="text-xs text-gray-400">
                  2 days ago
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

     {/* Wallet */}
      {activeTab === "wallet" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Wallet Balance */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Available Wallet Balance
                </p>

                <h2 className="mt-2 text-3xl font-bold text-primary">
                  ₦250,000.00
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f9f2] text-xl text-tetiary">
                ₦
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="rounded-lg bg-tetiary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#04984e]"
              >
                Deposit
              </button>

              <button
                type="button"
                className="rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-[#f4f8fc]"
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* Wallet Status */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">
              Wallet Status
            </h2>

            <div className="mt-5 flex items-center justify-between border-b border-[#e6edf4] pb-4">
              <span className="text-sm text-gray-500">
                Wallet Status
              </span>

              <span className="rounded-full bg-[#e9f9f2] px-3 py-1 text-xs font-medium text-[#428060]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#e6edf4] py-4">
              <span className="text-sm text-gray-500">
                Wallet ID
              </span>

              <span className="text-sm font-medium text-[#40556d]">
                WAL-000123
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-sm text-gray-500">
                Currency
              </span>

              <span className="text-sm font-medium text-[#40556d]">
                Nigerian Naira (NGN)
              </span>
            </div>
          </div>

          {/* Bank Account */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primary">
                Bank Account
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the bank account connected to your wallet.
              </p>
            </div>

            {/* Account Name */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Account Name
              </label>

              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full rounded-lg border border-[#d8e4ef] px-4 py-3 text-sm text-[#243b53] outline-none transition focus:border-primary"
              />
            </div>

            {/* Bank Name */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Bank Name
              </label>

              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 text-sm text-[#243b53] outline-none transition focus:border-primary"
              >
                <option>First Bank</option>
                <option>GTBank</option>
                <option>Access Bank</option>
                <option>UBA</option>
                <option>Zenith Bank</option>
                <option>Opay</option>
                <option>Moniepoint</option>
              </select>
            </div>

            {/* Account Number */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#40556d]">
                Account Number
              </label>

              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                maxLength={10}
                className="w-full rounded-lg border border-[#d8e4ef] px-4 py-3 text-sm text-[#243b53] outline-none transition focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={() => alert("Bank information updated")}
              className="w-full rounded-lg bg-tetiary py-3 text-sm font-semibold text-white transition hover:bg-[#04984e]"
            >
              Update Bank Information
            </button>
          </div>

          {/* Wallet Security */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">
              Wallet Security
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Important information about your wallet.
            </p>

            <div className="mt-6 rounded-lg bg-[#fff8e8] p-4">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e5a500] text-xs font-bold text-white">
                  !
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#755b18]">
                    Keep your wallet secure
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#8b7538]">
                    Make sure your bank information is correct before
                    making withdrawals. Some changes may require
                    additional verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-[#f5f9fd] p-4">
              <p className="text-xs leading-5 text-gray-500">
                Your wallet information is protected and can only be
                accessed by you after successful authentication.
              </p>
            </div>
          </div>

          {/* Transaction Information */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Recent Wallet Activity
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your most recent wallet transactions.
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>

            <div className="mt-5 divide-y divide-[#e6edf4]">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#243b53]">
                    Wallet Deposit
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Sep 14, 2026 · 10:32 AM
                  </p>
                </div>

                <span className="text-sm font-semibold text-tetiary">
                  +₦100,000.00
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#243b53]">
                    Property Purchase
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Sep 12, 2026 · 02:15 PM
                  </p>
                </div>

                <span className="text-sm font-semibold text-red-500">
                  -₦50,000.00
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#243b53]">
                    Wallet Deposit
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Sep 10, 2026 · 09:40 AM
                  </p>
                </div>

                <span className="text-sm font-semibold text-tetiary">
                  +₦200,000.00
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}