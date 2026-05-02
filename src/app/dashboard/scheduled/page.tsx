"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, deletePost, Post } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-500/20 text-blue-400",
  published: "bg-green-500/20 text-green-400",
  draft: "bg-gray-500/20 text-gray-400",
  failed: "bg-red-500/20 text-red-400",
};

export default function ScheduledPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getPosts()
      .then((ps) => setPosts(Array.isArray(ps) ? ps : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // ignore
    }
  }

  const filters = ["all", "scheduled", "published", "draft", "failed"];

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (!a.scheduledFor) return 1;
    if (!b.scheduledFor) return -1;
    return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scheduled Posts</h1>
          <p className="text-gray-400 text-sm mt-1">
            View and manage all your upcoming content.
          </p>
        </div>
        <button className="btn-primary text-sm" onClick={() => router.push("/dashboard/create")}>+ New Post</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-gray-400 hover:text-white border border-white/10 hover:bg-white/5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading posts…</p>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-400 text-sm">
              {filter === "all"
                ? "No posts yet. Create your first post!"
                : `No ${filter} posts.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-4 bg-white/5 rounded-lg gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {post.accountId && (
                      <span className="text-xs text-purple-400 font-medium">
                        @{post.accountId}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        STATUS_STYLES[post.status ?? ""] ?? "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {post.status ?? "unknown"}
                    </span>
                  </div>
                  {post.caption && (
                    <p className="text-sm text-gray-300 truncate">{post.caption}</p>
                  )}
                  {post.scheduledFor && (
                    <p className="text-xs text-gray-500 mt-1">
                      🕐{" "}
                      {new Date(post.scheduledFor).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
