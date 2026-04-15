"use client";

const accounts = [
  { name: "@creativestudio", followers: "124K", status: "connected" },
  { name: "@brandofficial", followers: "89K", status: "connected" },
  { name: "@personalpage", followers: "32K", status: "pending" },
];

const scheduledPosts = [
  {
    account: "@creativestudio",
    caption: "Behind the scenes of our latest shoot 🎬",
    scheduledFor: "Today at 6:00 PM",
    status: "scheduled",
  },
  {
    account: "@brandofficial",
    caption: "New product drop — don't miss it! 🔥",
    scheduledFor: "Tomorrow at 9:00 AM",
    status: "scheduled",
  },
  {
    account: "@personalpage",
    caption: "My morning routine that changed my life ✨",
    scheduledFor: "Apr 17 at 3:00 PM",
    status: "draft",
  },
];

const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back! Here&apos;s your content overview.
          </p>
        </div>
        <button className="btn-primary text-sm">+ New Post</button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Connected Accounts", value: "3", icon: "🔗" },
          { label: "Scheduled Posts", value: "12", icon: "📅" },
          { label: "Posts This Week", value: "8", icon: "📤" },
          { label: "Total Followers", value: "245K", icon: "👥" },
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
            <button className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg">
              ← Prev
            </button>
            <span className="text-sm text-gray-300 px-3 py-1">April 2026</span>
            <button className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg">
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
          {Array.from({ length: 35 }, (_, i) => {
            const dayNum = i - 1; // offset so 1 = Monday
            const date = dayNum >= 0 && dayNum < 30 ? dayNum + 1 : null;
            const hasPost = date && [3, 7, 10, 14, 17, 21].includes(date);
            const isToday = date === 15;
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer transition-colors
                  ${!date ? "opacity-0 pointer-events-none" : ""}
                  ${isToday ? "bg-purple-600 text-white font-bold" : "hover:bg-white/5 text-gray-300"}
                `}
              >
                {date && (
                  <>
                    <span>{date}</span>
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
            <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
              + Add Account
            </button>
          </div>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.name}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                    {account.name[1].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{account.name}</div>
                    <div className="text-xs text-gray-400">
                      {account.followers} followers
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    account.status === "connected"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {account.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Scheduled Posts</h2>
            <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {scheduledPosts.map((post, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-400 font-medium">
                    {post.account}
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
                <p className="text-sm text-gray-300 mb-1">{post.caption}</p>
                <p className="text-xs text-gray-500">🕐 {post.scheduledFor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
