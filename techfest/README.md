# TEKHOLIC — RVCE Campus Events

IEEE RVCE Web Development Track submission.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Data Source

Controlled by `VITE_DATA_SOURCE` in `.env`:

```
# Remote (default — used if env var not set)
VITE_DATA_SOURCE=https://pub-d6db99c9b68842a5b6f527e86583f256.r2.dev/events.json

# Local file (serve via vite's public/ folder or a local static server)
VITE_DATA_SOURCE=http://localhost:4000/events.json
```

Copy `events.json` to `public/events.json` and set `VITE_DATA_SOURCE=/events.json` for pure local mode.

## Features

- **Event Feed** — Virtual-windowed list of all 12,000 events (no DOM crash)
- **Search** — Full-text search across title, club, venue, tags
- **Tag Filter** — Multi-select tag pills; auto-extracted from dataset
- **Sort** — By date, name, or popularity
- **Event Detail** — Full info, capacity bar, registration simulation with QR ticket
- **Bookmarks** — Star any event; persists in localStorage across sessions
- **Edge-case safe** — Handles null room numbers, missing timestamps, inverted times, empty tags

## Build

```bash
npm run build
npm run preview
```
