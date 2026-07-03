# CalHamed — Smart Calendar Scheduling

A modern, full-stack calendar scheduling application built with **Next.js 16**, **Nylas**, and **Prisma**. Share your personalized booking link, let clients pick available time slots, and let Nylas handle calendar sync, time zones, and video conferencing — all automatically.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **OAuth Authentication** — Sign in with Google or GitHub via NextAuth v5
- **Calendar Sync** — Powered by [Nylas](https://nylas.com), automatically syncs availability and prevents double bookings
- **Custom Booking Pages** — Each user gets a unique `/[username]/[event]` booking link
- **Event Type Management** — Create, edit, and delete appointment types with custom durations and video call providers
- **Weekly Availability** — Set per-day time windows that clients can book
- **Profile Settings** — Update name, email, and profile image (powered by UploadThing)
- **Modern UI** — Glassmorphism sidebar, animated transitions, dark/light theme, responsive design
- **Time Zone Detection** — Automatically converts times for invitees worldwide

---

## 🛠 Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (Turbopack)    |
| Language         | TypeScript 5                                    |
| Database         | PostgreSQL via [Neon](https://neon.tech)        |
| ORM              | [Prisma 7](https://prisma.io)                   |
| Auth             | [NextAuth v5](https://authjs.dev) (beta)        |
| Calendar API     | [Nylas v8](https://developer.nylas.com)         |
| File Upload      | [UploadThing](https://uploadthing.com)          |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com)      |
| UI Components    | [shadcn/ui](https://ui.shadcn.com) (Radix)      |
| Forms            | [Conform](https://conform.guide) + [Zod](https://zod.dev) |
| Animations       | tailwindcss-animate                              |

---

## 📁 Project Structure

```
app/
├── (bookingPage)/[userName]/[eventName]/  # Public booking page
├── api/
│   ├── auth/                               # NextAuth API routes
│   ├── oauth/exchange/                     # Nylas OAuth exchange
│   └── uploadthing/                        # UploadThing file upload
├── dashboard/
│   ├── page.tsx                            # Event types overview
│   ├── new/page.tsx                        # Create event type
│   ├── settings/page.tsx                   # Account settings
│   ├── availability/page.tsx               # Weekly availability
│   └── layout.tsx                          # Dashboard layout (glassmorphism)
├── onboarding/
│   ├── page.tsx                            # Profile setup (step 1)
│   └── grand-id/page.tsx                   # Calendar connect (step 2)
├── layout.tsx                              # Root layout
└── page.tsx                                # Landing page
components/
├── Navbar.tsx                              # Glassmorphism navbar
├── AuthModal.tsx                           # Login/signup modal
├── DasboardLinks.tsx                       # Sidebar navigation
├── SettingsForm.tsx                        # Profile settings form
├── EmptyState.tsx                          # Empty state placeholder
├── calender/                               # Calendar UI components
├── ui/                                     # shadcn/ui primitives
└── ...
lib/
├── db.ts                                   # Prisma client
├── nylas.ts                                # Nylas client config
├── times.ts                                # Time utility functions
├── validations.ts                          # Zod schemas
└── actions/action.ts                       # Server actions
prisma/
└── schema.prisma                           # Database schema
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database (local or [Neon](https://neon.tech) serverless)
- **Nylas** account ([sign up](https://dashboard.nylas.com))
- **Google OAuth** credentials ([Google Cloud Console](https://console.cloud.google.com))
- **GitHub OAuth** app ([GitHub Developer Settings](https://github.com/settings/developers))
- **UploadThing** account ([sign up](https://uploadthing.com))

### Environment Variables

Create a `.env` file in the project root:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth
AUTH_SECRET="your-auth-secret"                    # openssl rand -base64 32

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Nylas
NYLAS_CLIENT_ID="your-nylas-client-id"
NYLAS_API_SECRET_KEY="your-nylas-api-key"
NYLAS_API_URL="https://api.eu.nylas.com"          # or https://api.us.nylas.com

# UploadThing
UPLOADTHING_TOKEN="your-uploadthing-token"
```

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd cal-nylas

# Install dependencies
npm install

# Run database migrations
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start dev server with Turbopack    |
| `npm run build`  | Production build                   |
| `npm start`      | Start production server            |
| `npm run lint`   | Run ESLint                         |

---

## 🔐 Authentication Flow

1. User clicks **"Try for Free"** → Auth modal with Google & GitHub login
2. **NextAuth** handles OAuth and creates a user in the database
3. New users are redirected to `/onboarding` to set up their profile
4. After profile setup, users connect their calendar via **Nylas Hosted Auth**
5. Nylas returns a `grant_id` — the user is now fully onboarded

---

## 📅 Booking Flow

1. Logged-in users create **event types** (title, duration, description, video provider)
2. Each event type gets a **unique URL** — `calhamed.com/{username}/{event-slug}`
3. Visitors pick a **date** from the calendar and a **time slot**
4. Nylas checks real-time availability and prevents double bookings
5. Booking is confirmed — both parties receive the meeting details

---

## 🗄 Database Schema

- **User** — Profile, OAuth accounts, Nylas `grantId`
- **Availability** — Per-day time windows (`fromTime` / `tillTime`, active toggle)
- **EventType** — Appointment types (title, duration, URL, video provider)
- **Account / Session / VerificationToken** — NextAuth models

See [`prisma/schema.prisma`](prisma/schema.prisma) for full details.

---

## 🎨 Design System

- **Glassmorphism** sidebar and header (`backdrop-blur-xl`, semi-transparent backgrounds)
- **Dark/Light mode** via `next-themes` with system preference detection
- **Animated transitions** — fade-in, slide-up, staggered feature cards
- **Custom glow effects** — gradient overlays, animated ping rings, pulsing CTAs
- Built on **shadcn/ui** primitives with Tailwind CSS v4

---

## 📦 Key Dependencies

| Package              | Purpose                         |
| -------------------- | ------------------------------- |
| `next` 16            | React framework (Turbopack)     |
| `next-auth` v5 beta  | Authentication                  |
| `nylas` v8           | Calendar & email API            |
| `prisma` v7          | Database ORM                    |
| `uploadthing` v7     | File uploads                    |
| `conform` + `zod`    | Form validation                 |
| `react-aria`         | Calendar component              |
| `sonner`             | Toast notifications             |
| `tailwindcss` v4     | Utility-first CSS               |
| `lucide-react`       | Icon library                    |

---

## 📄 License

Private project — all rights reserved.
