"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getAccounts,
  createPost,
  generateImage,
  uploadImage,
  getTrendingMusic,
  getFavoritesMusic,
  Account,
  MusicTrack,
} from "@/lib/api";
import Image from "next/image";

type ImageMode = "ai" | "upload";
type MusicTab = "trending" | "favorites";

export default function CreatePostPage() {
  const router = useRouter();

  // ── Existing fields ──────────────────────────────────────────────────────
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [caption, setCaption] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [accountId, setAccountId] = useState("");
  const [status, setStatus] = useState<"scheduled" | "draft">("scheduled");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Image state ──────────────────────────────────────────────────────────
  const [imageMode, setImageMode] = useState<ImageMode>("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Music state ───────────────────────────────────────────────────────────
  const [musicTab, setMusicTab] = useState<MusicTab>("trending");
  const [trendingTracks, setTrendingTracks] = useState<MusicTrack[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<MusicTrack[]>([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);

  // ── Accounts ──────────────────────────────────────────────────────────────
  useEffect(() => {
    getAccounts()
      .then((accs) => {
        const list = Array.isArray(accs) ? accs : [];
        setAccounts(list);
        if (list.length > 0) setAccountId(list[0].id);
      })
      .catch(() => setAccounts([]));
  }, []);

  // ── Music loading ─────────────────────────────────────────────────────────
  useEffect(() => {
    setMusicError(null);
    setMusicLoading(true);
    const fetch =
      musicTab === "trending" ? getTrendingMusic : getFavoritesMusic;
    fetch()
      .then((tracks) => {
        if (musicTab === "trending") setTrendingTracks(tracks);
        else setFavoriteTracks(tracks);
      })
      .catch(() =>
        setMusicError(
          `Failed to load ${musicTab} music. Please try again.`
        )
      )
      .finally(() => setMusicLoading(false));
  }, [musicTab]);

  // ── Switch image mode ─────────────────────────────────────────────────────
  function switchImageMode(mode: ImageMode) {
    setImageMode(mode);
    setImageUrl(null);
    setImageError(null);
    setAiPrompt("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Generate AI image ─────────────────────────────────────────────────────
  async function handleGenerateImage() {
    if (!aiPrompt.trim()) return;
    setImageError(null);
    setGeneratingImage(true);
    try {
      const result = await generateImage(aiPrompt.trim());
      setImageUrl(result.imageUrl);
    } catch {
      setImageError("Image generation failed. Please try again.");
    } finally {
      setGeneratingImage(false);
    }
  }

  // ── Upload image ──────────────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setImageUrl(null);
    try {
      const result = await uploadImage(file);
      setImageUrl(result.imageUrl);
    } catch {
      setImageError("Image upload failed. Please try again.");
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
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
        imageUrl: imageUrl ?? undefined,
        musicId: selectedMusicId ?? undefined,
      });
      router.push("/dashboard/scheduled");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create post. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const activeTracks =
    musicTab === "trending" ? trendingTracks : favoriteTracks;

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

          {/* ── Image Section ─────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image
            </label>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-3">
              {(["ai", "upload"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => switchImageMode(mode)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    imageMode === mode
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white border border-white/10 hover:bg-white/5"
                  }`}
                >
                  {mode === "ai" ? "🤖 AI Image" : "📤 Upload Photo"}
                </button>
              ))}
            </div>

            {/* AI image panel */}
            {imageMode === "ai" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe the image you want…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !aiPrompt.trim()}
                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingImage ? "Generating…" : "Generate"}
                </button>
              </div>
            )}

            {/* Upload panel */}
            {imageMode === "upload" && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-gray-300 file:text-sm file:font-medium hover:file:bg-white/10 transition-colors"
                />
              </div>
            )}

            {/* Image error */}
            {imageError && (
              <p className="text-red-400 text-sm mt-2">{imageError}</p>
            )}

            {/* Preview */}
            {imageUrl && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-white/10 w-full aspect-video bg-white/5">
                <Image
                  src={imageUrl}
                  alt="Post image preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs rounded-full px-2 py-1 transition-colors"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          {/* ── Music Section ─────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Music
            </label>

            {/* Tabs */}
            <div className="flex gap-2 mb-3">
              {(["trending", "favorites"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMusicTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    musicTab === tab
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white border border-white/10 hover:bg-white/5"
                  }`}
                >
                  {tab === "trending" ? "🔥 Trending" : "⭐ Favorites"}
                </button>
              ))}
            </div>

            {/* Track list */}
            {musicLoading && (
              <p className="text-gray-400 text-sm">Loading music…</p>
            )}
            {musicError && (
              <p className="text-red-400 text-sm">{musicError}</p>
            )}
            {!musicLoading && !musicError && activeTracks.length === 0 && (
              <p className="text-gray-500 text-sm">No tracks available.</p>
            )}
            {!musicLoading && activeTracks.length > 0 && (
              <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {activeTracks.map((track) => (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMusicId(
                          selectedMusicId === track.id ? null : track.id
                        )
                      }
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedMusicId === track.id
                          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-300 border border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">🎵</span>
                      <span className="flex-1 truncate">
                        <span className="font-medium">{track.title}</span>
                        {track.artist && (
                          <span className="text-gray-400 ml-1">
                            — {track.artist}
                          </span>
                        )}
                      </span>
                      {selectedMusicId === track.id && (
                        <span className="text-purple-400 text-xs">✓</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedMusicId && (
              <button
                type="button"
                onClick={() => setSelectedMusicId(null)}
                className="mt-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear selection
              </button>
            )}
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

          {error && <p className="text-red-400 text-sm">{error}</p>}

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
