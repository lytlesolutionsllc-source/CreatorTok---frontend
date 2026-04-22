import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://creator-tok-backend.vercel.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Types ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  username: string;
  followersCount?: number;
  status?: string;
}

export interface Post {
  id: string;
  caption?: string;
  status?: string;
  scheduledFor?: string;
  accountId?: string;
}

export interface Schedule {
  id: string;
  postId?: string;
  scheduledFor?: string;
  status?: string;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data.data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res.data.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get("/api/auth/me");
  return res.data.data.user;
}

// ── Accounts ───────────────────────────────────────────────────────────────

export async function getAccounts(): Promise<Account[]> {
  const res = await api.get("/api/accounts");
  const accounts = res.data.data.accounts;
  if (!Array.isArray(accounts)) return [];
  return accounts.map(
    (acc: { id: string; accountName: string; followerCount?: number; status?: string }) => ({
      id: acc.id,
      username: acc.accountName,
      followersCount: acc.followerCount,
      status: acc.status,
    })
  );
}

export async function createAccount(
  data: Partial<Account>
): Promise<Account> {
  const payload = {
    accountName: data.username,
    accessToken: "mock_access_token",
    refreshToken: "mock_refresh_token",
    tokenExpiresAt: new Date(Date.now() + 86400000).toISOString(),
    followerCount: 0,
  };
  const res = await api.post("/api/accounts", payload);
  const acc = res.data.data.account;
  return {
    id: acc.id,
    username: acc.accountName,
    followersCount: acc.followerCount,
    status: acc.status,
  };
}

export async function updateAccount(
  id: string,
  data: Partial<Account>
): Promise<Account> {
  const res = await api.put(`/api/accounts/${id}`, data);
  return res.data.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await api.delete(`/api/accounts/${id}`);
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const res = await api.get("/api/posts");
  const posts = res.data.data.posts;
  return Array.isArray(posts) ? posts : [];
}

export async function createPost(data: Partial<Post>): Promise<Post> {
  const res = await api.post("/api/posts", data);
  return res.data.data.post;
}

export async function updatePost(
  id: string,
  data: Partial<Post>
): Promise<Post> {
  const res = await api.put(`/api/posts/${id}`, data);
  return res.data.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/api/posts/${id}`);
}

// ── Schedules ──────────────────────────────────────────────────────────────

export async function getSchedules(): Promise<Schedule[]> {
  const res = await api.get("/api/schedules");
  const schedules = res.data.data.schedules;
  return Array.isArray(schedules) ? schedules : [];
}

export async function createSchedule(
  data: Partial<Schedule>
): Promise<Schedule> {
  const res = await api.post("/api/schedules", data);
  return res.data.data;
}

export async function updateSchedule(
  id: string,
  data: Partial<Schedule>
): Promise<Schedule> {
  const res = await api.put(`/api/schedules/${id}`, data);
  return res.data.data;
}

export async function deleteSchedule(id: string): Promise<void> {
  await api.delete(`/api/schedules/${id}`);
}

export default api;
