# Sunday Hundred — Next.js Dashboard

Production-ready dashboard with **Next.js App Router**, **Tailwind CSS**, and **Axios**.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL=http://your-backend:4000/api
npm run dev
```

## Architecture (4 Layers)

```
UI (page.jsx)  →  Hooks  →  Services  →  axiosInstance  →  Backend API
```

- **`api/endpoints.js`** — all routes in one place
- **`api/urlBuilder.js`** — dynamic URL + query params
- **`api/axiosInstance.js`** — token, interceptors, error handling
- **`services/*.js`** — one file per module, calls axiosInstance
- **`hooks/*.js`** — loading/error/data state, components use these only
- **`components/ui/`** — full design system (Button, Input, Card, Modal, Badge, Toast)

## Rendering Strategy

- **SSR (Server-Side Rendering):** `app/dashboard/page.jsx` fetches initial data on the server using `services/dashboardServerService.js` for better first paint and SEO.
- **CSR (Client-Side Rendering):** `app/dashboard/DashboardClient.jsx` and `app/dashboard/analytics/page.jsx` handle rich interactivity, refresh actions, and local UI state.

## Route Layout System

- Shared shell lives in `components/shared/DashboardLayout.jsx`
- Includes reusable `Sidebar`, `Header`, and `Footer`
- Route-level guard in `app/dashboard/layout.jsx` uses cookie token for SSR auth checks

## Dashboard Pages

- `app/dashboard/page.jsx` (overview)
- `app/dashboard/analytics/page.jsx` (second dashboard module)

## Adding a New Module

1. Add endpoint in `api/endpoints.js`
2. Create `services/myService.js`
3. Create `hooks/useMyModule.js`
4. Create `app/my-module/page.jsx` — only use the hook
5. Add nav link in `components/shared/Sidebar.jsx`
