"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccounts, getPosts, Account, Post } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  useEffect(() => {
    Promise.all([getAccounts(), getPosts()])
      .then(([accs, ps]) => {
        setAccounts(Array.isArray(accs) ? accs : []);
        setPosts(Array.isArray(ps) ? ps : []);
      })
      .catch(() => {
        // leave empty on error — empty states are shown below
      })
      .finally(() => setLoadingData(false));
  }, []);

  const scheduledPosts = posts.filter((p) => p.status === "scheduled");
  const postsThisWeek = posts.filter((p) => {
    if (!p.scheduledFor) return false;
    const d = new Date(p.scheduledFor);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo && d <= now;
  });

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {user ? `Welcome back, ${user.name}!` : "Welcome back!"}{" "}
            Here&apos;s your content overview.
          </p>
        </div>
        <button className="btn-primary text-sm" onClick={() => router.push("/dashboard/scheduled")}>+ New Post</button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Connected Accounts",
            value: loadingData ? "…" : String(accounts.length),
            icon: "🔗",
          },
          {
            label: "Scheduled Posts",
            value: loadingData ? "…" : String(scheduledPosts.length),
            icon: "📅",
          },
          {
            label: "Posts This Week",
            value: loadingData ? "…" : String(postsThisWeek.length),
            icon: "📤",
          },
          {
            label: "Total Posts",
            value: loadingData ? "…" : String(posts.length),
            icon: "👥",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Calendar */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Content Calendar</h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-300 px-3 py-1">
              {new Date(calYear, calMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={nextMonth}
              className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-gray-500 font-medium pb-2"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: totalCells }, (_, i) => {
            const dayNum = i - firstDay + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            const todayDate = today.getDate();
            const isToday =
              isValid &&
              dayNum === todayDate &&
              calMonth === today.getMonth() &&
              calYear === today.getFullYear();
            const hasPost = isValid
              ? posts.some((p) => {
                  if (!p.scheduledFor) return false;
                  const d = new Date(p.scheduledFor);
                  return (
                    d.getFullYear() === calYear &&
                    d.getMonth() === calMonth &&
                    d.getDate() === dayNum
                  );
                })
              : false;
            return (
              <div
                key={i}
                onClick={() => isValid && router.push("/dashboard/calendar")}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors
                  ${!isValid ? "opacity-0 pointer-events-none" : "cursor-pointer"}
                  ${isToday ? "bg-purple-600 text-white font-bold" : "hover:bg-white/5 text-gray-300"}
                `}
              >
                {isValid && (
                  <>
                    <span>{dayNum}</span>
                    {hasPost && (
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1" />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Connected Accounts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Connected Accounts</h2>
            <button onClick={() => router.push("/dashboard/accounts")} className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
              + Add Account
            </button>
          </div>
          {loadingData ? (
            <p className="text-gray-500 text-sm">Loading accounts…</p>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No accounts connected yet. Click &quot;+ Add Account&quot; to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                      {account.username?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        @{account.username}
                      </div>
                      {account.followersCount != null && (
                        <div className="text-xs text-gray-400">
                          {account.followersCount.toLocaleString()} followers
                        </div>
                      )}
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Posts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Scheduled Posts</h2>
            <button onClick={() => router.push("/dashboard/scheduled")} className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
              View All
            </button>
          </div>
          {loadingData ? (
            <p className="text-gray-500 text-sm">Loading posts…</p>
          ) : scheduledPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No scheduled posts yet. Create your first post!
            </p>
          ) : (
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-purple-400 font-medium">
                      {post.accountId ?? "Unknown account"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        post.status === "scheduled"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  {post.caption && (
                    <p className="text-sm text-gray-300 mb-1">{post.caption}</p>
                  )}
                  {post.scheduledFor && (
                    <p className="text-xs text-gray-500">
                      🕐{" "}
                      {new Date(post.scheduledFor).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
