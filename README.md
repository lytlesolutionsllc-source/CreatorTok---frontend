# CreatorTok — Frontend

Multi-account TikTok content calendar and scheduling platform.

## Tech Stack
- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Auth:** JWT tokens via backend API
- **Deployment:** Vercel

## Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `https://creator-tok-backend.vercel.app`) |

## Getting Started
```bash
npm install
npm run dev
```

## Pages
- `/` — Landing page
- `/login` — Login
- `/register` — Register
- `/dashboard` — Protected dashboard with live data from API
