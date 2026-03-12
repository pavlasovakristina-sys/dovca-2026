# Dovca 2026 Travel App — Agent Instructions

## What this project is
Static React SPA for sharing a 6-day Gran Canaria travel itinerary among 8 participants.
Hosted on GitHub Pages. No backend.

## Tech stack
- React 19 + Vite 8 + TypeScript strict
- Leaflet 1.9 + react-leaflet 5 (maps)
- @dnd-kit/core + sortable (drag and drop)
- useReducer + Context + localStorage (state)
- Tailwind CSS 4 (utility styling)

## Key files
- src/data/itinerary.json — source of truth for default data
- src/types/index.ts — all TypeScript interfaces
- src/state/reducer.ts — all state mutations
- src/state/context.tsx — ItineraryProvider
- src/hooks/useItinerary.ts — context consumer hook

## Component tree
App -> Header, Navigation, ProgramView | MapView | ItineraryView | ChecklistView
ProgramView -> DaySelector, DayDetail -> ActivityList -> ActivityCard
Modals: EditModal, ActionSheet, SharePanel, Toast

## Rules
- NEVER add a backend or database
- NEVER add external API dependencies requiring keys
- ALWAYS use useItinerary() hook for state access
- ALWAYS handle empty/error states in components
- Mobile-first: 375px is the primary breakpoint
- UI language: Czech
- Bundle budget: <=150KB gzipped

## Deploy
GitHub Actions -> GitHub Pages at /dovca-2026/
Run: npm run build (outputs to dist/)
