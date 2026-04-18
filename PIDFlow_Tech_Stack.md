# PIDFlow - Complete Technology Stack

## LANGUAGES & FRAMEWORKS

| Component | Technology | Why This Choice |
|-----------|------------|-----------------|
| **Language** | TypeScript | Type-safe, catches errors before runtime, better IDE support |
| **Frontend Framework** | Next.js 14 (App Router) | Full-stack React, server components, API routes built-in |
| **UI Library** | React 18 | Industry standard, huge ecosystem |
| **Styling** | Tailwind CSS | Fast development, clean responsive design |
| **UI Components** | shadcn/ui | Beautiful, accessible, customizable components |

---

## BACKEND & DATABASE

| Component | Technology | Why This Choice |
|-----------|------------|-----------------|
| **Database** | Supabase (PostgreSQL) | You already have it, real-time, great free tier |
| **ORM** | Prisma | Type-safe database queries, easy migrations |
| **API** | Next.js API Routes | No separate backend needed |
| **Authentication** | Supabase Auth | Built-in, easy to set up |

---

## AI & SEARCH TOOLS

| Component | Technology | Why This Choice |
|-----------|------------|-----------------|
| **P&ID Vision** | Claude 3.5 Sonnet | Best AI for reading technical drawings |
| **Text Processing** | Claude 3.5 Haiku | Fast, cheap for quick lookups |
| **AI SDK** | Vercel AI SDK | Streaming, error handling, easy integration |
| **Vendor Search** | Firecrawl API | AI-powered web scraping, returns structured data |
| **Backup Search** | Tavily API | AI search engine, finds product pages |

### Why Firecrawl + Tavily for Vendor Search?

```
User asks for: "4 inch PVC Schedule 80 pipe"
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: Tavily Search API                                          │
│  ─────────────────────────                                         │
│  Query: "George Fischer 4 inch PVC Schedule 80 pipe site:gfps.com" │
│  Returns: List of URLs matching the product                        │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Firecrawl Scrape API                                       │
│  ────────────────────────────                                      │
│  Input: Product page URL from Tavily                               │
│  Returns: Structured data (product name, specs, images, datasheet) │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  RESULT:                                                            │
│  {                                                                  │
│    "vendor": "George Fischer",                                     │
│    "product": "PVC-U Pipe Schedule 80",                            │
│    "url": "https://www.gfps.com/...",                              │
│    "datasheet": "https://www.gfps.com/.../spec.pdf",               │
│    "image": "https://www.gfps.com/.../image.jpg"                   │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## FILE HANDLING

| Component | Technology | Why This Choice |
|-----------|------------|-----------------|
| **File Storage** | AWS S3 | You already have it |
| **PDF Processing** | pdf-lib + pdf2pic | Convert PDF to images for Claude |
| **Image Processing** | Sharp | Optimize images before sending to AI |
| **Excel Export** | ExcelJS | Create formatted spreadsheets |
| **PDF Export** | @react-pdf/renderer | Generate PDF reports |

---

## HOSTING & DEPLOYMENT

| Component | Technology | Why This Choice |
|-----------|------------|-----------------|
| **Hosting** | Vercel | One-click deploy, great for Next.js |
| **Domain** | Your choice | pidflow.plansrow.com or pidflow.io |
| **Environment** | Vercel Environment Variables | Secure API key storage |

---

## COMPLETE PACKAGE LIST

```json
{
  "dependencies": {
    // Framework
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "typescript": "5.x",
    
    // UI
    "tailwindcss": "3.x",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "lucide-react": "latest",
    
    // Database
    "@prisma/client": "5.x",
    "@supabase/supabase-js": "2.x",
    
    // AI
    "@anthropic-ai/sdk": "latest",
    "ai": "latest",
    "@mendable/firecrawl-js": "latest",
    
    // File Processing
    "@aws-sdk/client-s3": "3.x",
    "pdf-lib": "latest",
    "pdf2pic": "latest",
    "sharp": "latest",
    
    // Export
    "exceljs": "latest",
    "@react-pdf/renderer": "latest",
    
    // Forms & Validation
    "react-hook-form": "latest",
    "zod": "latest",
    "@hookform/resolvers": "latest",
    
    // Utilities
    "date-fns": "latest",
    "uuid": "latest"
  },
  "devDependencies": {
    "prisma": "5.x",
    "@types/node": "latest",
    "@types/react": "latest",
    "eslint": "latest",
    "prettier": "latest"
  }
}
```

---

## API KEYS YOU'LL NEED

| Service | Get API Key From | Cost |
|---------|-----------------|------|
| **Anthropic Claude** | console.anthropic.com | ~$0.15-0.30 per P&ID |
| **Firecrawl** | firecrawl.dev | Free tier: 500 pages/month, then $19/mo |
| **Tavily** | tavily.com | Free tier: 1000 searches/month |
| **AWS S3** | You have this | Your existing costs |
| **Supabase** | You have this | Free tier |

**Total estimated cost:** ~$20-50/month for moderate usage

---

## PROJECT STRUCTURE

```
pidflow/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard
│   ├── upload/
│   │   └── page.tsx             # Upload P&ID page
│   ├── project/[id]/
│   │   └── page.tsx             # Project view
│   ├── drawing/[id]/
│   │   └── page.tsx             # P&ID viewer with results
│   └── api/
│       ├── upload/
│       │   └── route.ts         # Upload to S3
│       ├── extract/
│       │   └── route.ts         # Claude Vision extraction
│       ├── specs/
│       │   └── route.ts         # Spec lookup with citations
│       ├── vendors/
│       │   └── route.ts         # Vendor search
│       └── export/
│           └── route.ts         # Excel/PDF export
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── PIDViewer.tsx            # P&ID image viewer
│   ├── LineCard.tsx             # Line result card with citations
│   ├── VendorCard.tsx           # Vendor product card
│   ├── UploadZone.tsx           # Drag-drop upload
│   └── ExportButton.tsx         # Export options
│
├── lib/
│   ├── claude.ts                # Claude AI integration
│   ├── firecrawl.ts             # Firecrawl integration
│   ├── tavily.ts                # Tavily search integration
│   ├── s3.ts                    # AWS S3 upload
│   ├── pdf.ts                   # PDF to image conversion
│   ├── specs/
│   │   ├── tolerance.ts         # A-9 tolerance lookup
│   │   ├── pipeSpan.ts          # 40 05 19.01 span calculator
│   │   └── lod.ts               # A-7 LOD requirements
│   └── export/
│       ├── excel.ts             # Excel generation
│       └── pdf.ts               # PDF generation
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed all spec data
│
├── public/
│   └── ...
│
├── .env.local                   # API keys (not committed)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ENVIRONMENT VARIABLES

```env
# .env.local

# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# AI - Claude
ANTHROPIC_API_KEY="sk-ant-..."

# Search - Firecrawl (for scraping vendor pages)
FIRECRAWL_API_KEY="fc-..."

# Search - Tavily (for finding vendor URLs)
TAVILY_API_KEY="tvly-..."

# AWS S3
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET_NAME="pidflow-uploads"
AWS_REGION="us-west-2"

# App
NEXT_PUBLIC_APP_URL="https://pidflow.plansrow.com"
```

---

## UI DESIGN PRINCIPLES

### Clean, Minimalistic Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  🔧 PIDFlow                                    [Upload] [Projects]  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │                   Drag & Drop P&ID Here                     │   │
│  │                                                             │   │
│  │                   or click to browse                        │   │
│  │                                                             │   │
│  │              Supports PDF, PNG, JPG, TIFF                   │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                                                     │
│  Recent Projects                                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                   │
│  │ OC35        │ │ Project 5   │ │ Test        │                   │
│  │ 12 P&IDs    │ │ 5 P&IDs     │ │ 2 P&IDs     │                   │
│  │ ✓ Complete  │ │ ● Active    │ │ ○ Draft     │                   │
│  └─────────────┘ └─────────────┘ └─────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Results Page - Clear and Organized

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back   PW1-241-D0-A01_OC35.pdf                    [Export ▼]      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────┐  ┌─────────────────────────────────┐│
│  │                           │  │                                 ││
│  │     [P&ID Drawing]        │  │  24 Lines Extracted             ││
│  │                           │  │  ─────────────────              ││
│  │     Click to zoom         │  │                                 ││
│  │                           │  │  ┌─────────────────────────────┐││
│  │                           │  │  │ PW1-241-04-A01              │││
│  │                           │  │  │ 4" PVC Sch 80 • Process Water│││
│  │                           │  │  │                             │││
│  │                           │  │  │ Tolerance: 6"               │││
│  │                           │  │  │ 📄 A-9, Page 5              │││
│  │                           │  │  │                             │││
│  │                           │  │  │ Max Span: 7.1 ft @ 68°F     │││
│  │                           │  │  │ 📄 40 05 19.01, Table 1.13  │││
│  │                           │  │  │                             │││
│  │                           │  │  │ 🏭 George Fischer           │││
│  │                           │  │  │ 🔗 View Product             │││
│  │                           │  │  └─────────────────────────────┘││
│  │                           │  │                                 ││
│  │                           │  │  [Show All 24 Lines]            ││
│  └───────────────────────────┘  └─────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Line Detail - All Information with Citations

```
┌─────────────────────────────────────────────────────────────────────┐
│ Line: PW1-241-04-A01                                    [✓ Verify]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EXTRACTED DATA                                                     │
│  ──────────────                                                    │
│  Service      Process Water (PW)                                   │
│  Size         4 inch                                               │
│  Material     PVC Schedule 80                                      │
│  Area         241                                                  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📐 TOLERANCE                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Value: 6 inches                                            │   │
│  │                                                             │   │
│  │  📄 Source: A-9_Change_Management.pdf                       │   │
│  │  📍 Page: 5                                                 │   │
│  │  📍 Table: Approved Tolerances - Process                    │   │
│  │  📍 Row: "Individual pipe runs including branch fittings"   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📏 SUPPORT SPAN                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Maximum: 7.1 ft                                            │   │
│  │  Temperature: 68°F  [Change ▼]                              │   │
│  │  Service: Water (SG = 1.0)                                  │   │
│  │                                                             │   │
│  │  📄 Source: 40_05_19.01.pdf                                 │   │
│  │  📍 Page: 4                                                 │   │
│  │  📍 Table: 1.13 - Schedule 80 PVC Water Service             │   │
│  │  📍 Row: 4 inch nominal                                     │   │
│  │                                                             │   │
│  │  ℹ️ If temperature changes:                                 │   │
│  │     80°F → 6.9 ft | 100°F → 6.6 ft | 120°F → 5.8 ft        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📋 LOD REQUIREMENTS                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Include in Model: ✓ YES (≥2" process piping)               │   │
│  │                                                             │   │
│  │  Required Metadata:                                         │   │
│  │  □ Name          □ Line Number      □ Size (nominal)        │   │
│  │  □ Length        □ Layer            □ Package Name          │   │
│  │                                                             │   │
│  │  📄 Source: A-7_LOD_Matrix.xlsx                             │   │
│  │  📍 Sheet: Process                                          │   │
│  │  📍 Rows: 52-58 (Piping section)                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  🏭 VENDOR PRODUCTS                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [IMG] George Fischer                        ★ Preferred    │   │
│  │        PVC-U Pipe Schedule 80 - 4"                          │   │
│  │        Model: 161-017-000                                   │   │
│  │                                                             │   │
│  │        🔗 Product Page  📄 Datasheet  🖼️ Image              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [IMG] Spears Manufacturing                                 │   │
│  │        PVC Schedule 80 Pipe - 4"                            │   │
│  │                                                             │   │
│  │        🔗 Product Page  📄 Datasheet                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [+ Add Custom Vendor URL]                                         │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [📋 Copy Instructions]  [📥 Export to Excel]  [📄 Export PDF]     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## SUMMARY: WHAT YOU NEED

### Accounts to Create (if you don't have):
1. ✅ Supabase - You have this
2. ✅ AWS S3 - You have this  
3. ⬜ Anthropic Claude - console.anthropic.com
4. ⬜ Firecrawl - firecrawl.dev (for scraping vendor pages)
5. ⬜ Tavily - tavily.com (for finding vendor URLs)
6. ✅ Vercel - You likely have this

### API Keys to Get:
1. `ANTHROPIC_API_KEY` - From Anthropic Console
2. `FIRECRAWL_API_KEY` - From Firecrawl Dashboard
3. `TAVILY_API_KEY` - From Tavily Dashboard

### Total Cost Estimate:
- **Supabase:** Free tier
- **AWS S3:** ~$5/month
- **Vercel:** $20/month (Pro)
- **Claude AI:** ~$20-40/month (100 P&IDs)
- **Firecrawl:** Free tier or $19/month
- **Tavily:** Free tier

**Total: ~$45-85/month**

---

## READY TO BUILD!

Once you confirm, I'll generate:
1. Complete Prisma schema
2. Database seed script with ALL your spec data
3. Initial Next.js project setup
4. All the Cursor prompts to build each feature

Let me know when you have the API keys!
