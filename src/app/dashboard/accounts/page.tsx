"use client";

import { useEffect, useState } from "react";
import { getAccounts, createAccount, deleteAccount, Account } from "@/lib/api";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function fetchAccounts() {
    setLoading(true);
    getAccounts()
      .then((accs) => setAccounts(Array.isArray(accs) ? accs : []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createAccount({ username: username.trim() });
      setUsername("");
      setShowForm(false);
      fetchAccounts();
    } catch {
      setError("Failed to add account. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // silently ignore; refresh will show current state
      fetchAccounts();
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Connected Accounts</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your TikTok accounts.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setError("");
          }}
          className="btn-primary text-sm"
        >
          + Add Account
        </button>
      </div>

      {/* Add Account Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Connect a TikTok Account</h2>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="TikTok username (e.g. @creator)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
                setUsername("");
              }}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Accounts List */}
      <div className="glass-card p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading accounts…</p>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔗</div>
            <p className="text-gray-400 text-sm">
              No accounts connected yet. Click &quot;+ Add Account&quot; to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                    {account.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <div className="text-sm font-medium">@{account.username}</div>
                    {account.followersCount != null && (
                      <div className="text-xs text-gray-400">
                        {account.followersCount.toLocaleString()} followers
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {account.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        account.status === "connected"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {account.status}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
