import React, { useRef, useState } from "react";

type Tab = "personal" | "security" | "wallet";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const [fullName, setFullName] = useState("Areez Kamal");
  const [email, setEmail] = useState("areezkamal@gmail.com");
  const [phone, setPhone] = useState("+234 810 300 7467");

  const [profileImage, setProfileImage] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[#f7faff] p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d2340]">
          Profile Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and security settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex w-fit gap-5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("personal")}
          className={`rounded-md px-8 py-3 text-sm font-medium cursor-pointer transition ${
            activeTab === "personal"
              ? "bg-[#073b68] text-white shadow-sm"
              : "text-[#66809c] hover:text-[#073b68] bg-[#eef5fc]"
          }`}
        >
          Personal Information
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`rounded-md px-8 py-3 text-sm font-medium cursor-pointer transition ${
            activeTab === "security"
              ? "bg-[#073b68] text-white shadow-sm"
              : "text-[#66809c] hover:text-[#073b68] bg-[#eef5fc]"
          }`}
        >
          Security
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`rounded-md px-8 py-3 text-sm font-medium cursor-pointer transition ${
            activeTab === "wallet"
              ? "bg-[#073b68] text-white shadow-sm"
              : "text-[#66809c] hover:text-[#073b68] bg-[#eef5fc]"
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#082f55] text-xl font-semibold text-white">
                  AK
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-blue-500 hover:text-blue-600"
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
              className="w-full rounded-lg bg-[#05a957] cursor-pointer py-3 text-sm font-semibold text-white transition hover:bg-[#04984e]"
            >
              Update Profile
            </button>
          </div>

          {/* Right Card */}
          <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-[#173b5f]">
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
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#05a957] text-xs font-bold text-white">
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
        <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#173b5f]">
            Security
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Manage your password and account security settings.
          </p>
        </div>
      )}

      {/* Wallet */}
      {activeTab === "wallet" && (
        <div className="rounded-xl border border-[#dce8f3] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#173b5f]">
            Wallet Information
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Manage your wallet information and payment details.
          </p>
        </div>
      )}
    </div>
  );
}