"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    // Profile update would call an API endpoint when available
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    // Password update would call an API endpoint when available
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account preferences.
        </p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        {saved && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Profile saved successfully.
          </div>
        )}
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button type="submit" className="btn-primary text-sm">
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        {passwordError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {passwordError}
          </div>
        )}
        {passwordSaved && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Password changed successfully.
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary text-sm">
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border border-red-500/20">
        <h2 className="text-lg font-semibold mb-4 text-red-400">Account</h2>
        <p className="text-gray-400 text-sm mb-4">
          Sign out of your CreatorTok account on this device.
        </p>
        <button
          onClick={handleLogout}
          className="border border-red-500/50 text-red-400 hover:bg-red-500/10 font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
