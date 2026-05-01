# CredStack

CredStack is a credit card discovery, comparison, and recommendation platform for the Indian market. It helps users explore credit cards from major issuers (HDFC, Amex, SBI, ICICI, Axis, and more), compare them side-by-side across fees, rewards, and benefits, and receive personalized card recommendations based on their spending profile and preferences.

The application is built as a modern, fully responsive web app with a polished UI, smooth animations, and rich data visualizations. It is currently a frontend-only prototype with all data and AI logic mocked client-side, designed to be wired up to real backends, databases, and LLM-powered recommendation engines.

## What CredStack Does

- **Browse a card catalog.** Search and filter through 18+ Indian credit cards by category (travel, cashback, fuel, premium, lifestyle, business), network (Visa, Mastercard, Amex, RuPay), annual fee, joining fee, and minimum income.
- **View detailed card pages.** Each card has a dedicated page with full benefit breakdowns, reward rates, lounge access details, welcome bonuses, eligibility criteria, and a visual card render.
- **Compare cards side-by-side.** Pick up to 4 cards and see them in a feature-by-feature comparison table that highlights the best value across rewards, fees, and benefits.
- **Get AI-powered recommendations (Advisor).** A 3-step guided flow captures the user's spending breakdown (groceries, travel, fuel, dining, etc.) and preferences, then returns a ranked list of cards best matched to their profile.
- **Analyze spending patterns (Analyzer).** Upload (mock) statement data and receive a 0–100 spending health score along with category-wise efficiency breakdowns, savings opportunities, and risk factors.
- **Track personal finances (Dashboard).** A demo dashboard with monthly spending charts, recent transactions, upcoming payments, and quick actions — designed to extend into a real personal-finance hub.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero, featured cards, categories, stats, and CTA sections |
| `/cards` | Catalog with search, filter sidebar, sort, and grid view |
| `/cards/[id]` | Static card detail page with metadata for SEO |
| `/dashboard` | Mock personal finance dashboard with charts and transactions |
| `/advisor` | Guided AI recommendation flow (3 steps) |
| `/analyzer` | Spending analyzer with score and category insights |
| `/compare` | Side-by-side comparison of up to 4 cards |

## Tech Stack

- **Framework:** Next.js 16.2.4 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS 4 with `tw-animate-css`
- **UI:** shadcn/ui components built on Radix UI primitives (40+ components)
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Theming:** next-themes (light/dark mode)
- **Notifications:** Sonner
- **Analytics:** Vercel Analytics

## Project Structure

```
app/                    # Next.js App Router pages
  cards/                # Card catalog and detail pages
  dashboard/            # Personal finance dashboard
  advisor/              # AI recommendation flow
  analyzer/             # Spending analyzer
  compare/              # Card comparison view
components/
  cards/                # Card-specific UI (filters, grid item, visual)
  home/                 # Landing page sections
  layout/               # Header and footer
  ui/                   # shadcn/ui primitives
hooks/                  # Custom React hooks
lib/
  data/cards.ts         # Card catalog data and helper functions
  utils.ts              # Tailwind class merging utility
public/                 # Static assets
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:

```bash
npm run build
npm run start
```

## Current State and Roadmap

CredStack is a frontend-only prototype. The card catalog, recommendation engine, spending analysis, and dashboard data are all hardcoded or simulated. Planned next steps include:

- **Database backend.** Migrate the static card catalog in `lib/data/cards.ts` to a Postgres database (Supabase or Neon) with API routes or server actions.
- **Authentication.** Add user accounts, saved comparisons, and recommendation history (Clerk or NextAuth).
- **Real AI integration.** Replace the mocked advisor and analyzer logic with actual LLM calls (Claude via the Vercel AI Gateway or AI SDK).
- **Statement parsing.** Add real PDF/CSV statement upload and parsing for the Analyzer.
- **Card images.** Source and host actual card visuals in `public/cards/`.
- **Card application flow.** Integrate apply-now redirects to issuer websites with affiliate tracking.

## License

Private project. Not yet licensed for redistribution.
