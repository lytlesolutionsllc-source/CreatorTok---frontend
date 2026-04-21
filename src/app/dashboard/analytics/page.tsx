"use client";

import { useEffect, useState } from "react";
import { getPosts, getAccounts, Post, Account } from "@/lib/api";

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPosts(), getAccounts()])
      .then(([ps, accs]) => {
        setPosts(Array.isArray(ps) ? ps : []);
        setAccounts(Array.isArray(accs) ? accs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.status === "published");
  const scheduled = posts.filter((p) => p.status === "scheduled");
  const drafts = posts.filter((p) => p.status === "draft");

  const postsByAccount = accounts.map((acc) => ({
    account: acc,
    count: posts.filter((p) => p.accountId === acc.id).length,
  }));

  const stats = [
    { label: "Total Posts", value: posts.length, icon: "📊" },
    { label: "Published", value: published.length, icon: "✅" },
    { label: "Scheduled", value: scheduled.length, icon: "⏰" },
    { label: "Drafts", value: drafts.length, icon: "📝" },
    { label: "Connected Accounts", value: accounts.length, icon: "🔗" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track your content performance and growth.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold">
              {loading ? "…" : stat.value}
            </div>
            <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Post status breakdown */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Post Status Breakdown</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        ) : (
          <div className="space-y-3">
            {[
              { label: "Published", count: published.length, color: "bg-green-500" },
              { label: "Scheduled", count: scheduled.length, color: "bg-blue-500" },
              { label: "Draft", count: drafts.length, color: "bg-gray-500" },
            ].map(({ label, count, color }) => {
              const pct = posts.length > 0 ? Math.round((count / posts.length) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{label}</span>
                    <span className="text-gray-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Posts per account */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Posts per Account</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : accounts.length === 0 ? (
          <p className="text-gray-500 text-sm">No connected accounts.</p>
        ) : (
          <div className="space-y-3">
            {postsByAccount.map(({ account, count }) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                    {account.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="text-sm">@{account.username}</span>
                </div>
                <span className="text-sm text-gray-400">{count} posts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
