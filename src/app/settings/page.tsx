"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const [settingsRes, budgetRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/budget"),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setName(data.user.name);
        setEmail(data.user.email);
      }

      if (budgetRes.ok) {
        const data = await budgetRes.json();
        setBudget(data.budget > 0 ? data.budget.toString() : "");
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");

    if (!name || !email) {
      setProfileError("Name and email are required");
      return;
    }

    setProfileLoading(true);

    try {
      const [profileRes, budgetRes] = await Promise.all([
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        }),
        fetch("/api/budget", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ budget: budget ? parseFloat(budget) : 0 }),
        }),
      ]);

      if (!profileRes.ok) {
        const data = await profileRes.json();
        setProfileError(data.error || "Failed to update profile");
        return;
      }

      if (!budgetRes.ok) {
        const data = await budgetRes.json();
        setProfileError(data.error || "Failed to update budget");
        return;
      }

      setProfileMessage("Profile updated successfully");
    } catch {
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password");
        return;
      }

      setPasswordMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted mt-1">Manage your account preferences</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-secondary rounded w-1/3 mb-6" />
                <div className="space-y-4">
                  <div className="h-10 bg-secondary rounded" />
                  <div className="h-10 bg-secondary rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Profile Settings */}
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Profile Information
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                {profileMessage && (
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {profileError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monthly Budget ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="input-field"
                    placeholder="Set your monthly budget"
                  />
                  <p className="text-xs text-muted mt-1">
                    Set to 0 or leave empty to disable budget tracking
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-5">
                {passwordMessage && (
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                    {passwordMessage}
                  </div>
                )}
                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>

            {/* Account Info */}
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Account
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-card-border">
                  <span className="text-muted">Signed in as</span>
                  <span className="font-medium">{session?.user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted">Account name</span>
                  <span className="font-medium">{session?.user?.name}</span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-danger mt-6"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
