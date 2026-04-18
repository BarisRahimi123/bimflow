# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `pidflow/` directory.

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema to Supabase (no migration files)
npm run db:migrate   # Create + run a named migration
npm run db:seed      # Seed reference tables
npm run db:studio    # Open Prisma Studio GUI
```

> `prisma generate` runs automatically on `npm install` via `postinstall`.

## Architecture Overview

**PIDFlow** is a Next.js 14 App Router application. It has two distinct functions:
1. **P&ID Extraction** — Upload a drawing → Claude Vision AI extracts piping lines with citations → Engineer verifies → Export to Revit schedule.
2. **Pipe Support Calculator** — Standalone calculator that determines support spacing, hardware type, and vendor products for any pipe run, with full ASME 40 05 19 citation tracking.

```
app/                  Next.js pages (App Router)
  api/                API routes — see below
  calculator/         Standalone pipe support calculator UI
  designer/           React Flow-based visual pipe run designer
  projects/           Project + drawing management
  upload/             P&ID file upload
  resources/          Tolerance/spec browser
lib/
  calculator/         Core calculation engine (no UI dependencies)
  ai/                 Claude Vision API wrapper
  vendors/            Hardware search pipeline (DB → Tavily → Firecrawl)
  specs/              DB query helpers for tolerance/span tables
  designer/           React Flow node/edge type definitions
components/
  ui/                 Radix-based primitives (Button, Input, Tooltip, etc.)
  designer/           Canvas, toolbar, panel, warnings for pipe designer
prisma/
  schema.prisma       Single schema for all tables
  seed.ts             Populates reference tables from spec documents
```

## Key API Routes

| Route | Purpose |
|---|---|
| `POST /api/drawings` | Create drawing record (uses Supabase RPC `create_pidflow_drawing`) |
| `POST /api/drawings/[id]/process` | Trigger Claude Vision extraction |
| `GET /api/drawings/[id]/process` | Poll extraction status |
| `POST /api/calculator` | Run span/support calculation — returns `CalculatorOutput` |
| `POST /api/upload` | Upload P&ID to S3, returns presigned URL |

## Database (Prisma + Supabase)

Two categories of tables:

**Reference tables** (pre-populated from spec documents, rarely change):
- `PipeSpanSpec` — max span by material/size/temperature from `40_05_19.01.pdf`
- `ToleranceSpec` — discipline/element tolerances from `A-9_Change_Management.pdf`
- `HardwareProduct` — support hardware catalog (hangers, guides, anchors)
- `LocationTolerance` — fabrication location tolerance classes
- `GuideDistanceRule`, `SGCorrectionFactor`, `LODRequirement`, `LineClass`, `ServiceCode`

**Application tables**: `Project`, `Drawing`, `ExtractedLine`, `VendorProduct`, `SupportCalculation`, `ScrapedHardwareCache`

## Core Domain: Calculator Engine

`lib/calculator/` is the calculation core — no React/Next dependencies, pure TypeScript.

- **`calculate.ts`** — Main entry point. Interpolates max span from tables, applies span reductions (elbows = 70%, inline components, seismic), calculates guide spacing with thermal expansion math, determines support types.
- **`support-layout.ts`** — Computes actual support positions (ft from start) for a pipe run, handling anchors, riser continuation, branch pipes, expansion loops, and seismic interfaces.
- **`span-data.ts`** — Raw lookup tables (large file, ~69KB). All span/SG data lives here.
- **`types.ts`** — `CalculatorInput` (40+ options) and `CalculatorOutput` (with `calculations`, `supportTypes`, `hardware`, `tolerance`, `flags`, `citations`).

**Key rules embedded in the engine:**
- Plastic pipe (PVC/CPVC/PP/PVDF) uses Georg Fischer Stress Less hardware — no metal contact, no Cush-a-Clamp, 18" max support from fitting centerline (Section 1.5.K).
- Every output field includes a `citations` object pointing to the source document, section, table, and page. This is non-negotiable for engineering traceability.
- `flags.interpolationUsed` is set when exact pipe size/temp isn't in the table — signals the engineer that a judgment call was made.

## AI Extraction Flow

`lib/ai/extract-pid.ts` wraps Claude 3.5 Sonnet (vision).
- Input: image URL (S3 presigned, PDF/PNG/JPEG/WebP)
- Output: `ExtractedLine[]` with confidence scores 0–1
- Lines with confidence ≥ 0.95 are auto-verified; < 0.85 are flagged for review
- If no URL is provided, returns 2 simulated demo lines (for UI testing without API calls)

## Hardware Search Pipeline

`lib/vendors/hardware-search.ts` runs a cascading search:
1. Query `HardwareProduct` table (pre-seeded reference data)
2. Tavily AI search for vendor product URLs
3. Firecrawl to scrape product details
4. Cache result in `ScrapedHardwareCache` (7-day TTL, hit count tracked)

## Required Environment Variables

```
ANTHROPIC_API_KEY
TAVILY_API_KEY
FIRECRAWL_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL                   # pgBouncer connection (Prisma queries)
DIRECT_URL                     # Direct connection (Prisma migrations)
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

## Non-Obvious Implementation Details

- **Supabase RPC for drawing creation**: `POST /api/drawings` calls `create_pidflow_drawing` RPC rather than a direct table insert — don't replace this with a direct Prisma write without checking the RPC for side effects.
- **Webpack canvas alias**: `next.config.js` sets `config.resolve.alias.canvas = false` — required for React Flow to build correctly. Don't remove it.
- **`api/drawings/[drawingId]` uses both `fileName` and `filename`** (and both `fileUrl`/`originalUrl`) — field name normalization exists deliberately for client compatibility.
- **Tolerance classes are location-dependent**: `locationType` (e.g., `subfab_rack` vs `individual_run`) maps to tightly different tolerances (±0" vs ±6"). This drives `result.tolerance.isCritical`.
- **Designer canvas** (`app/designer/`) uses `@xyflow/react` with custom node types defined in `lib/designer/types.ts` — new node types must be registered in both `lib/designer/types.ts` and `components/designer/nodes/index.tsx`.
