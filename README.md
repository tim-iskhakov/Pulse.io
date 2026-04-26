# Pulse.io

Crypto market dashboard built with Nuxt 4.
https://pulse--io.vercel.app/

It renders the initial coins list on the server and then keeps prices fresh in real time via Binance WebSocket updates.

## Features

- SSR-first coins loading through a Nuxt server API (`/api/coins`)
- Cached upstream requests to CoinGecko (30s cache window)
- Real-time price updates from Binance mini ticker stream
- Pinia store for client-side state updates
- 7d sparkline chart per coin (Lightweight Charts)
- Tailwind-based UI with typed domain models

## Tech Stack

- Nuxt 4 + Vue 3 + TypeScript
- Pinia
- Tailwind CSS + SCSS
- VueUse (`useWebSocket`)
- Nitro server routes (`server/api`)
- Vitest + Nuxt test utils (testing setup)

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- `pnpm` (project uses `pnpm`)

### Installation

```bash
pnpm install
```

### Run in Development

```bash
pnpm dev
```

App will be available at `http://localhost:3000`.

### Production Build

```bash
pnpm build
pnpm preview
```

## Available Scripts

- `pnpm dev` — start local dev server
- `pnpm build` — build for production
- `pnpm preview` — preview production build locally
- `pnpm generate` — generate static output
- `pnpm lint` — run ESLint
- `pnpm lint:fix` — auto-fix ESLint issues
- `pnpm format` — check formatting with Prettier
- `pnpm format:fix` — auto-format with Prettier

## Data Flow

1. `app/components/coins/List.vue` calls `useGetCoins()`.
2. `app/composables/useGetCoins.ts` uses `useFetch('/api/coins')` and writes data into Pinia store.
3. `server/api/coins.get.ts` fetches market data from CoinGecko and maps response fields.
4. `app/composables/useBinanceWebSocket.ts` subscribes to Binance stream and patches only changed prices in store.

## Project Structure

```text
app/
  components/         # UI components
  composables/        # data providers and websocket logic
  stores/             # Pinia stores
  assets/css/         # theme styles
server/
  api/                # backend endpoints
  utils/              # server-side mappers
shared/
  types/              # shared domain types
```

## Notes

- The app proxies third-party market data through `/api/coins` instead of calling CoinGecko directly from the client.
- WebSocket updates are lightweight and update only `currentPrice` in store items.
