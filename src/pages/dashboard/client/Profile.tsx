import React, { useRef, useState } from "react";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import {
  useUpdateProfile,
  useDeleteAccount,
  useDisableAccount,
} from "../../../hooks/useClientData";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import { getErrorMessage } from "../../../helpers/api";
import { formatShortDate } from "../../../helpers/formatterUtility";

type Tab = "personal" | "security" | "wallet";

export default function Profile() {
  const { user } = useUser();
  return <ProfileBody key={user?.id ?? "loading"} />;
}

function ProfileBody() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const { user, token, refreshUser } = useUser();
  const updateMutation = useUpdateProfile();
  const deleteMutation = useDeleteAccount();
  const disableMutation = useDisableAccount();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(
    (user as unknown as { phone?: string })?.phone ?? "",
  );
  const [country, setCountry] = useState(
    (user as unknown as { country?: string })?.country ?? "",
  );

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [disableReason, setDisableReason] = useState("");
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateMutation.mutateAsync({
        first_name: firstName,
        last_name: lastName,
        username,
        phone,
        country,
        email,
      });
      toast.success("Profile updated successfully");
      if (token) await refreshUser(token);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile"));
    }
  };

  const handleDisableAccount = async () => {
    if (!disableReason.trim()) {
      toast.error("Please provide a reason for disabling your account");
      return;
    }
    try {
      await disableMutation.mutateAsync(disableReason.trim());
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to disable account"));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete account"));
    }
  };

  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() ||
    (user?.username?.[0] ?? "U").toUpperCase();

  const createdAt = user?.created_at ? formatShortDate(user.created_at) : "—";
  const lastLogin = user?.updated_at ? formatShortDate(user.updated_at) : "—";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-base sm:text-lg font-bold text-primary">Profile & Account Settings</h1>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex w-full gap-2 rounded-lg p-0.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("personal")}
          className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold cursor-pointer transition ${
            activeTab === "personal"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-600 hover:text-primary bg-gray-100"
          }`}
        >
          Personal Information
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold cursor-pointer transition ${
            activeTab === "security"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-600 hover:text-primary bg-gray-100"
          }`}
        >
          Security & Access
        </button>
      </div>

      {/* Personal Information */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {/* Left Card */}
          <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-5 shadow-xs">
            {/* Profile */}
            {/* Profile */}
            <div className="mb-4 flex items-center gap-3">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover border border-secondary"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {initials}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:text-blue-700 cursor-pointer"
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

            {/* Names */}
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-primary">
                  First Name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-[#243b53] outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-primary">
                  Last Name
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-[#243b53] outline-none transition focus:border-primary"
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-semibold text-primary">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-[#243b53] outline-none transition focus:border-primary"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-semibold text-primary">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-[#243b53] outline-none transition focus:border-primary"
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-semibold text-primary">
                Phone Number
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-[#243b53] outline-none transition focus:border-primary"
              />
            </div>

            {/* Country */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] font-semibold text-primary">
                Country
              </label>

              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-9 sm:h-10 w-full rounded-lg border border-secondary bg-white px-3 text-xs text-[#243b53] outline-none transition focus:border-primary"
              />
            </div>

            {/* Update Button */}
            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={updateMutation.isPending}
              className="flex h-9 sm:h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary cursor-pointer text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {updateMutation.isPending ? "Updating..." : "Update Profile"}
            </button>
          </div>

          {/* Right Card */}
          <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-5 shadow-xs">
            <h2 className="mb-3 text-xs sm:text-[13px] font-bold text-primary">
              Account Information
            </h2>

            {/* User ID */}
            <div className="border-b border-[#e6edf4] py-2.5 first:pt-0">
              <p className="mb-0.5 text-[10px] text-gray-400">User ID</p>
              <p className="text-xs font-semibold text-[#172b4d]">
                #PC-{String(user?.id ?? "—").padStart(6, "0")}
              </p>
            </div>

            {/* Account Created */}
            <div className="border-b border-[#e6edf4] py-2.5">
              <p className="mb-0.5 text-[10px] text-gray-400">Account Created</p>
              <p className="text-xs font-semibold text-[#172b4d]">{createdAt}</p>
            </div>

            {/* Last Updated */}
            <div className="border-b border-[#e6edf4] py-2.5">
              <p className="mb-0.5 text-[10px] text-gray-400">Last Updated</p>
              <p className="text-xs font-semibold text-[#172b4d]">{lastLogin}</p>
            </div>

            {/* Verification Notice */}
            <div className="mt-4 flex gap-2.5 rounded-lg bg-[#e9f9f2] p-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tertiary text-[10px] font-bold text-white">
                ✓
              </div>

              <p className="text-[10.5px] leading-relaxed text-[#428060]">
                For your security, identity information can only be altered through formal bank compliance review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {/* Security Settings */}
          <div className="col-span-2 rounded-xl border border-secondary bg-white p-3.5 sm:p-5 shadow-xs">
            <h2 className="text-xs sm:text-[13px] font-bold text-primary">
              Security & Verification
            </h2>

            <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
              Manage your secondary authentication and verified contact channels.
            </p>

            {/* Email Verification */}
            <div className="mt-3 flex items-center justify-between rounded-lg border border-secondary p-3">
              <div>
                <h3 className="text-xs font-semibold text-[#172b4d]">
                  Email Verification
                </h3>

                <p className="mt-0.5 text-[10.5px] text-gray-500">
                  Primary notification and settlement confirmation channel.
                </p>
              </div>

              <span className="rounded-md bg-green-100 px-2 py-0.5 text-[9.5px] font-semibold text-green-700">
                Verified
              </span>
            </div>

            {/* Phone Verification */}
            <div className="mt-2.5 flex items-center justify-between rounded-lg border border-secondary p-3">
              <div>
                <h3 className="text-xs font-semibold text-[#172b4d]">
                  Phone Verification
                </h3>

                <p className="mt-0.5 text-[10.5px] text-gray-500">
                  SMS clearing authentication & wire authorization OTP rail.
                </p>
              </div>

              <span className="rounded-md bg-green-100 px-2 py-0.5 text-[9.5px] font-semibold text-green-700">
                Verified
              </span>
            </div>

            {/* Security Notice */}
            <div className="mt-4 flex gap-2.5 rounded-lg bg-[#f5f9fd] p-3 border border-secondary/60">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                i
              </div>

              <p className="text-[10.5px] leading-relaxed text-gray-600">
                Never share your security codes (OTP / CTO) with anyone. Bank representatives will never ask for your authentication codes.
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-200 bg-white p-3.5 sm:p-5 shadow-xs lg:col-span-2">
            <h2 className="text-xs sm:text-[13px] font-bold text-red-600">
              Account Management & Actions
            </h2>

            <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
              Temporarily freeze or initiate permanent account closure.
            </p>

            <div className="mt-3.5 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              {/* Disable */}
              <div className="rounded-lg border border-secondary p-3 sm:p-3.5">
                <h3 className="text-xs font-semibold text-[#172b4d]">
                  Freeze / Disable Account
                </h3>

                <p className="mt-0.5 text-[10.5px] text-gray-500">
                  Suspends account activity until you contact customer support.
                </p>

                <textarea
                  rows={2}
                  placeholder="Reason for suspension (optional)"
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  className="mt-2.5 w-full resize-none rounded-lg border border-secondary bg-white p-2 text-xs text-[#243b53] outline-none transition focus:border-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowDisableConfirm(true)}
                  disabled={disableMutation.isPending}
                  className="mt-2.5 h-8.5 w-full rounded-lg border border-amber-500 text-xs font-semibold text-amber-600 transition hover:bg-amber-50 disabled:opacity-60 cursor-pointer"
                >
                  Freeze Account
                </button>
              </div>

              {/* Delete */}
              <div className="rounded-lg border border-red-200 p-3 sm:p-3.5">
                <h3 className="text-xs font-semibold text-red-600">
                  Close Account
                </h3>

                <p className="mt-0.5 text-[10.5px] text-gray-500">
                  Permanent closure of all banking profiles and records.
                </p>

                <div className="h-[52px] flex items-center">
                  <p className="text-[10px] text-gray-400">
                    Remaining funds must be settled prior to account termination.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteMutation.isPending}
                  className="mt-2.5 h-8.5 w-full rounded-lg bg-red-600 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                >
                  Close Account Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDisableConfirm}
        title="Disable your account?"
        message="You will be signed out and your account will be disabled."
        confirmText="Yes, Disable"
        isLoading={disableMutation.isPending}
        onCancel={() => setShowDisableConfirm(false)}
        onConfirm={async () => {
          await handleDisableAccount();
          setShowDisableConfirm(false);
        }}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete your account?"
        message="This permanently deletes your account and data. This cannot be undone."
        confirmText="Yes, Delete"
        isLoading={deleteMutation.isPending}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await handleDeleteAccount();
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
}
