# Northcraft Goods

**Polished Next.js storefront with Postgres inventory, iframe-safe overlays, and graceful checkout collisions.**

![Northcraft Goods preview](https://images.unsplash.com/photo-1498049860656-af28884c997d?auto=format&fit=crop&w=1400&q=80)

## Architecture

```
Browser (Tailwind UI + optimistic cart + Framer Motion)
        │
        ▼
Next.js 15 App Router (RSC + Route Handlers + Server Actions)
        │
        ├── JSON APIs  /api/products | /api/cart | /api/checkout
        └── Prisma ORM
                    │
                    ▼
               PostgreSQL (Supabase prod · Docker locally)
```

## Tech stack

| Layer        | Choice                                       |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 15 (App Router, TypeScript strict)   |
| Styling      | Tailwind CSS v4                              |
| Motion       | Framer Motion page transitions               |
| Data         | Prisma 5 + PostgreSQL                        |
| Hosting plan | Vercel (frontend) + Supabase Postgres (data) |

## Features

- Hero-led marketing home with featured collections and fixed-ID Unsplash photography.
- Product catalog with URL-driven filters (`category`, `priceMin`/`priceMax`, `inStock`, `sort`) plus skeleton loaders.
- PDP with multi-image gallery, variant picker, live stock indicator, related products.
- `/api/products?q=` search powering the global search bar.
- Cart drawer **`position:absolute` inside the app shell** (iframe-safe) plus `/cart` parity, localStorage + `/api/cart` persistence, inventory warnings.
- Checkout hits `/api/checkout`, creates `Order` + `OrderItem` rows, decrements stock in a **serializable transaction**, clears server cart on success.
- `/orders/[id]` confirmation page backed by Postgres (refresh-safe).
- `/admin` gated by `ADMIN_PASSWORD` (+10 stock, edit price, archive, create SKU, orders with line items).

## Local setup

```bash
cp .env.example .env
docker compose up -d          # Postgres on localhost:55432
npm install
npm run db:migrate            # or: npx prisma migrate dev
npm run db:seed
npm run dev                   # http://localhost:3000
```

**Admin password:** whatever you set in `ADMIN_PASSWORD` (`.env.example` suggests `changeme-strong-admin-secret`; the quick-start `.env` used while building used `northcraft-demo-admin`).

## Database schema (overview)

- `Product` — slug, merchandising fields, `images[]`, `stock`, `featured`, `hasVariants`, `archived`.
- `ProductVariant` — optional finishes with independent `stock`.
- `CartSession` — guest id (`nc_guest` cookie) + JSON lines.
- `Order` / `OrderItem` — captures `priceAtPurchaseCents` snapshot.

## Deployment (Vercel + Supabase)

1. Create a Supabase project → copy the **transaction** `DATABASE_URL`.
2. Ensure the repo exists at `https://github.com/ori1706/northcraft-goods`.
3. Import into Vercel → add `DATABASE_URL`, `ADMIN_PASSWORD`, ensure production NODE_ENV (Vercel default).
4. `vercel.json` runs `prisma migrate deploy` during build.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ori1706/northcraft-goods&env=DATABASE_URL,ADMIN_PASSWORD&project-name=northcraft-goods)

If `npx vercel --prod --yes` prompts for interactive login, stop immediately and deploy via the dashboard (see note in team brief).

## Iframe embed snippet

```html
<iframe
  src="https://<your-vercel-domain>"
  width="100%"
  height="720"
  style="border: 0; border-radius: 16px"
  title="Northcraft Goods"
  allow="autoplay; clipboard-write"
  loading="lazy"
></iframe>
```

Open `iframe-test.html` while `npm run dev` is running (via `npx serve .`) to validate CSP / layout clipping.

## Scripts

| Script             | Purpose                          |
| ------------------ | -------------------------------- |
| `npm run dev`      | Turbopack dev server             |
| `npm run build`    | Production build (`prisma generate` included) |
| `npm run db:seed`  | Seed demo catalog               |
| `npm run db:migrate` | Apply migrations locally      |
