# Screen Recording Full Stack

A full-stack screen recording and video sharing platform built with Next.js and Bunny.net. Users can record their screen in the browser, upload videos and thumbnails, manage visibility, and share links. Authentication is handled by Better Auth with Google OAuth, video metadata is stored in Xata via Drizzle ORM, and Arcjet provides security protection.

## Features
- In-browser screen recording with optional microphone audio
- Upload videos and thumbnails to Bunny Stream/Storage
- Public or private visibility controls
- Shareable video pages with embedded player
- Search, filter, and pagination for the video library
- Server actions for upload orchestration and metadata persistence
- Arcjet bot protection and rate limiting
- Responsive UI with Tailwind CSS

## Tech Stack
- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Better Auth** (Google OAuth)
- **Bunny.net** Stream, Storage, CDN
- **Drizzle ORM** + **Xata** (Postgres)
- **Arcjet** security middleware
- **Tailwind CSS**

## Architecture Overview
1. The client records a screen capture using the MediaDevices API.
2. Server actions request Bunny upload URLs for the video and thumbnail.
3. The client uploads assets directly to Bunny.
4. The app stores video metadata in Xata and renders the library and detail pages with Next.js.

## Project Structure
- `app/` — Next.js routes (auth, upload, video pages)
- `components/` — UI and recording widgets
- `lib/` — authentication, server actions, utilities
- `drizzle/` — schema and database configuration
- `constants/` — service endpoints, limits, UI constants

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Install
```bash
npm install
```

### Environment Variables
Create a `.env.local` (or `.env`) file in the project root:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Base URL for the app and Better Auth client |
| `BETTER_AUTH_URL` | Base URL for Better Auth server-side callbacks |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth for signing/encryption |
| `BETTER_AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `BETTER_AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `ARCJET_API_KEY` | Arcjet API key |
| `BUNNY_LIBRARY_ID` | Bunny Stream library ID |
| `BUNNY_STREAM_ACCESS_API_KEY` | Bunny Stream API key |
| `BUNNY_STORAGE_ACCESS_KEY` | Bunny Storage API key |
| `XATA_API_KEY` | Xata API key used by the client |
| `DATABASE_URL_POSTGRES` | Postgres connection string for Drizzle migrations |

> Note: The app reads `BETTER_AUTH_GOOGLE_CLIENT_ID`, `BETTER_AUTH_GOOGLE_CLIENT_SECRET`, and `BUNNY_STREAM_ACCESS_API_KEY` (not `BUNNY_STREAM_ACCESS_KEY`) as named above.

### Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts
- `npm run dev` — Start the development server
- `npm run lint` — Run ESLint checks
- `npm run build` — Build for production
- `npm run start` — Start the production server

## Deployment Notes
- Set `NEXT_PUBLIC_BASE_URL` to the deployed URL.
- Ensure Bunny Stream/Storage and Arcjet keys are configured in the hosting environment.

## License
This project is provided as-is. Add a license if you plan to distribute it.
