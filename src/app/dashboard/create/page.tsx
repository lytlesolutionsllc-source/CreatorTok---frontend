"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAccounts, createPost, Account } from "@/lib/api";

export default function CreatePostPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [caption, setCaption] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [accountId, setAccountId] = useState("");
  const [status, setStatus] = useState<"scheduled" | "draft">("scheduled");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAccounts()
      .then((accs) => {
        const list = Array.isArray(accs) ? accs : [];
        setAccounts(list);
        if (list.length > 0) setAccountId(list[0].id);
      })
      .catch(() => setAccounts([]));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!caption.trim() && !scheduledFor) {
      setError("Please add a caption or a scheduled date before creating the post.");
      return;
    }

    setSubmitting(true);
    try {
      await createPost({
        caption: caption.trim() || undefined,
        scheduledFor: scheduledFor || undefined,
        accountId: accountId || undefined,
        status,
      });
      router.push("/dashboard/scheduled");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create post. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">New Post</h1>
          <p className="text-gray-400 text-sm mt-1">
            Schedule or save a new TikTok post.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="glass-card p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Write your post caption…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
          </div>

          {/* Account */}
          {accounts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-gray-900">
                    @{acc.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Scheduled date/time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Schedule Date &amp; Time
            </label>
            <input
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <div className="flex gap-3">
              {(["scheduled", "draft"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    status === s
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white border border-white/10 hover:bg-white/5"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating…" : "Create Post"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
