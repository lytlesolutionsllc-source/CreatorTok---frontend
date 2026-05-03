"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, getAccounts, Post, Account } from "@/lib/api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type ViewMode = "month" | "week" | "day";

function getFirstDayOfMonth(year: number, month: number) {
  // Returns 0=Mon ... 6=Sun
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Return the Monday of the week containing the given date. */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = (day + 6) % 7; // Mon=0 … Sun=6
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function CalendarPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Month view state
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Week view state – anchor is the Monday of the displayed week
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(today));

  // Day view state
  const [dayViewDate, setDayViewDate] = useState<Date>(new Date(today));

  useEffect(() => {
    Promise.all([getPosts(), getAccounts()])
      .then(([ps, accs]) => {
        setPosts(Array.isArray(ps) ? ps : []);
        setAccounts(Array.isArray(accs) ? accs : []);
      })
      .catch(() => {
        setFetchError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtered posts based on selected account
  const filteredPosts =
    selectedAccountId === "all"
      ? posts
      : posts.filter((p) => p.accountId === selectedAccountId);

  // ── Navigation helpers ──────────────────────────────────────────────────

  function handlePrev() {
    if (viewMode === "month") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
      setSelectedDay(null);
    } else if (viewMode === "week") {
      setWeekStart((ws) => addDays(ws, -7));
    } else {
      setDayViewDate((d) => addDays(d, -1));
    }
  }

  function handleNext() {
    if (viewMode === "month") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
      setSelectedDay(null);
    } else if (viewMode === "week") {
      setWeekStart((ws) => addDays(ws, 7));
    } else {
      setDayViewDate((d) => addDays(d, 1));
    }
  }

  // ── Post helpers ────────────────────────────────────────────────────────

  function postsForDate(date: Date): Post[] {
    return filteredPosts.filter((p) => {
      if (!p.scheduledFor) return false;
      return isSameDay(new Date(p.scheduledFor), date);
    });
  }

  function postsForMonthDay(day: number): Post[] {
    return filteredPosts.filter((p) => {
      if (!p.scheduledFor) return false;
      const d = new Date(p.scheduledFor);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() === day
      );
    });
  }

  // O(1) account label lookup
  const accountMap = new Map(accounts.map((a) => [a.id, `@${a.username}`]));

  function accountLabel(accountId?: string) {
    if (!accountId) return "Unknown account";
    return accountMap.get(accountId) ?? accountId;
  }

  // ── Navigation label ────────────────────────────────────────────────────

  function navLabel() {
    if (viewMode === "month") return `${MONTHS[currentMonth]} ${currentYear}`;
    if (viewMode === "week") {
      const end = addDays(weekStart, 6);
      return `${formatShortDate(weekStart)} – ${formatShortDate(end)}`;
    }
    // day
    return dayViewDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // ── Post card renderer ──────────────────────────────────────────────────

  function PostCard({ post }: { post: Post }) {
    return (
      <div className="p-3 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-purple-400 font-medium">
            {accountLabel(post.accountId)}
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
          <p className="text-sm text-gray-300 truncate" title={post.caption}>{post.caption}</p>
        )}
        {post.scheduledFor && (
          <p className="text-xs text-gray-500 mt-1">
            🕐{" "}
            {new Date(post.scheduledFor).toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    );
  }

  // ── Month view ──────────────────────────────────────────────────────────

  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const selectedPosts = selectedDay ? postsForMonthDay(selectedDay) : [];

  function MonthView() {
    return (
      <>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 font-medium pb-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: totalCells }, (_, i) => {
            const dayNum = i - firstDay + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            const isToday =
              isValid &&
              dayNum === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();
            const isSelected = isValid && dayNum === selectedDay;
            const dayPosts = isValid ? postsForMonthDay(dayNum) : [];

            return (
              <div
                key={i}
                onClick={() => isValid && setSelectedDay(dayNum)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors
                  ${!isValid ? "opacity-0 pointer-events-none" : "cursor-pointer"}
                  ${isSelected ? "bg-purple-600 text-white font-bold ring-2 ring-purple-400" : ""}
                  ${isToday && !isSelected ? "bg-purple-600/30 text-purple-300 font-bold" : ""}
                  ${!isToday && !isSelected && isValid ? "hover:bg-white/5 text-gray-300" : ""}
                `}
              >
                {isValid && (
                  <>
                    <span>{dayNum}</span>
                    {dayPosts.length > 0 && (
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-0.5" />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ── Week view ───────────────────────────────────────────────────────────

  function WeekView() {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const dayPosts = postsForDate(date);
          const isToday = isSameDay(date, today);
          return (
            <div key={date.toISOString()} className="flex flex-col gap-1">
              <div
                className={`text-center text-xs font-medium pb-1 ${
                  isToday ? "text-purple-300" : "text-gray-500"
                }`}
              >
                {DAYS[(date.getDay() + 6) % 7]}
                <span
                  className={`ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                    isToday
                      ? "bg-purple-600 text-white"
                      : "text-gray-400"
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>
              <div className="space-y-1 min-h-[60px]">
                {dayPosts.length === 0 ? (
                  <div className="text-xs text-gray-600 text-center pt-2">—</div>
                ) : (
                  dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-1.5 bg-white/5 rounded text-xs text-gray-300 truncate"
                      title={post.caption ?? ""}
                    >
                      <span className="text-purple-400 font-medium block truncate">
                        {accountLabel(post.accountId)}
                      </span>
                      {post.caption && (
                        <span className="block truncate" title={post.caption}>{post.caption}</span>
                      )}
                      {post.scheduledFor && (
                        <span className="text-gray-500 block">
                          🕐{" "}
                          {new Date(post.scheduledFor).toLocaleTimeString(undefined, {
                            timeStyle: "short",
                          })}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Day view ────────────────────────────────────────────────────────────

  function DayView() {
    const dayPosts = postsForDate(dayViewDate);
    return (
      <div>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : dayPosts.length === 0 ? (
          <p className="text-gray-500 text-sm">No posts scheduled for this day.</p>
        ) : (
          <div className="space-y-3">
            {dayPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-gray-400 text-sm mt-1">
            View and manage your scheduled content.
          </p>
        </div>
        <button
          className="btn-primary text-sm"
          onClick={() => router.push("/dashboard/create")}
        >
          + New Post
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Account filter */}
        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="all">All accounts</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              @{acc.username}
            </option>
          ))}
        </select>

        {/* View mode toggle */}
        <div className="flex border border-white/10 rounded-lg overflow-hidden text-sm">
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 capitalize transition-colors ${
                viewMode === mode
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <div className="glass-card p-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg"
          >
            ← Prev
          </button>
          <h2 className="text-lg font-semibold text-center">{navLabel()}</h2>
          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg"
          >
            Next →
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : fetchError ? (
          <p className="text-red-400 text-sm">Failed to load calendar data. Please refresh the page.</p>
        ) : viewMode === "month" ? (
          <MonthView />
        ) : viewMode === "week" ? (
          <WeekView />
        ) : (
          <DayView />
        )}
      </div>

      {/* Month view: selected-day detail panel */}
      {viewMode === "month" && selectedDay !== null && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            {MONTHS[currentMonth]} {selectedDay}, {currentYear}
          </h3>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : selectedPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">No posts scheduled for this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
