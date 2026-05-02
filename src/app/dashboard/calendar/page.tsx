"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, Post } from "@/lib/api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getFirstDayOfMonth(year: number, month: number) {
  // Returns 0=Mon ... 6=Sun
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalendarPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    getPosts()
      .then((ps) => setPosts(Array.isArray(ps) ? ps : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }

  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const postsForDay = (day: number) =>
    posts.filter((p) => {
      if (!p.scheduledFor) return false;
      const d = new Date(p.scheduledFor);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() === day
      );
    });

  const selectedPosts = selectedDay ? postsForDay(selectedDay) : [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-gray-400 text-sm mt-1">
            View and manage your scheduled content.
          </p>
        </div>
        <button className="btn-primary text-sm" onClick={() => router.push("/dashboard/create")}>+ New Post</button>
      </div>

      <div className="glass-card p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg"
          >
            ← Prev
          </button>
          <h2 className="text-lg font-semibold">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            className="text-gray-400 hover:text-white transition-colors px-3 py-1 text-sm border border-white/10 rounded-lg"
          >
            Next →
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs text-gray-500 font-medium pb-2"
            >
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
            const dayPosts = isValid ? postsForDay(dayNum) : [];

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
      </div>

      {/* Selected day posts */}
      {selectedDay !== null && (
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
                    <p className="text-sm text-gray-300">{post.caption}</p>
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
