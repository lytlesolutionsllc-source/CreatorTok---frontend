"use client";

import { useEffect, useState } from "react";
import { getAccounts, deleteAccount, Account } from "@/lib/api";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

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
            window.location.href =
              "https://creator-tok-backend.vercel.app/api/tiktok/login";
          }}
          className="flex items-center gap-2 bg-black hover:bg-zinc-900 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/10 transition-colors"
        >
          {/* TikTok logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
          </svg>
          Sign in with TikTok
        </button>
      </div>

      {/* Accounts List */}
      <div className="glass-card p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading accounts…</p>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔗</div>
            <p className="text-gray-400 text-sm">
              No accounts connected yet. Click &quot;Sign in with TikTok&quot; to get started.
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
