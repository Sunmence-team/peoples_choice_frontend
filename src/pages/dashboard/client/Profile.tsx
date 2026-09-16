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
              className="w-full rounded-lg bg-primary cursor-pointer py-3 text-sm font-semibold text-white transition hover:bg-[#04984e]"
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
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-[#04984e]"
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

 
    </div>
  );
}