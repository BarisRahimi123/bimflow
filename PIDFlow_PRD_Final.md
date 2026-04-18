# PIDFlow - P&ID Intelligence Platform
## Product Requirements Document v3.0

**Company:** PlansRow  
**Author:** Baris  
**Date:** January 2025  
**Project:** Project Confluence (Semiconductor Fab)

---

# PART 1: THE PROBLEM & SOLUTION

## 1.1 What We're Building

A platform that helps BIM modelers convert P&ID drawings into Revit models by:

1. **Reading P&IDs automatically** using Claude AI vision
2. **Looking up specifications** from your project documents
3. **Calculating support requirements** based on pipe material and size
4. **Finding vendor products** with direct links
5. **Citing every piece of information** with document reference

## 1.2 The Key Requirement

**Every output must include a citation:**

```
┌────────────────────────────────────────────────────────────────────┐
│ LINE: PW1-241-04-A01                                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ EXTRACTED FROM P&ID:                                               │
│   • Service: Process Water (PW)                                    │
│   • Size: 4"                                                       │
│   • Material: PVC Schedule 80                                      │
│                                                                    │
│ TOLERANCE:                                                         │
│   • Value: 6"                                                      │
│   • 📄 Source: A-9_Change_Management.pdf, Page 5                   │
│   • 📍 Reference: "Process Tolerance Table → Individual pipe runs" │
│                                                                    │
│ SUPPORT SPAN:                                                      │
│   • Maximum: 7.1 ft (at 68°F, water service)                       │
│   • 📄 Source: 40_05_19.01.pdf, Page 4                             │
│   • 📍 Reference: "Table 1.13 - Schedule 80 PVC, 4 inch"           │
│                                                                    │
│ LOD REQUIREMENTS:                                                  │
│   • Include in model: YES (≥2" process piping)                     │
│   • Required metadata: Name, Line Number, Size, Length, Layer      │
│   • 📄 Source: A-7_LOD_Matrix.xlsx, Sheet: Process                 │
│   • 📍 Reference: "Row 52-58: Piping requirements"                 │
│                                                                    │
│ VENDOR PRODUCTS:                                                   │
│   • George Fischer PVC-U Schedule 80 Pipe                          │
│   • 🔗 https://www.gfps.com/us/products/pvc-schedule-80            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

# PART 2: YOUR DOCUMENTS - WHAT'S IN EACH ONE

I've analyzed all 5 documents you uploaded. Here's exactly what data we extract from each:

## 2.1 A-9_Change_Management.pdf (12 pages)

**What it contains:** Tolerance tables for how far construction model can deviate from design model

**Data to extract and embed:**

| Discipline | Element Type | Tolerance | Page |
|------------|--------------|-----------|------|
| **Process** | Subfab lateral racks | 0" | 5 |
| **Process** | Process piping (in EOR racks) | 1/2" | 5 |
| **Process** | Utility mains & sub-mains | 1" | 5 |
| **Process** | Equipment/panel datums | 1/2" | 5 |
| **Process** | Equipment feeders / utility branches | 6" | 5 |
| **Process** | Individual pipe runs | 6" | 5 |
| **Process** | In-line component location | 6" axially | 5 |
| **Process** | EOR designed pipe supports | 6" | 5 |
| **Mechanical** | Subfab lateral rack exhaust | 0" | 4 |
| **Mechanical** | Mechanical equipment | 0" | 4 |
| **Mechanical** | Ductwork mains | 6" | 4 |
| **Mechanical** | Mechanical piping (in racks) | 1" | 4 |
| **Mechanical** | Mechanical piping (not in racks) | 6" | 4 |
| **Mechanical** | Plumbing branches | 12" | 4 |
| **Electrical** | Raceways in subfab racks | 1" | 6 |
| **Electrical** | Major equipment datums | 1/2" | 6 |
| **Electrical** | Individual conduits | 6" | 6 |
| **Structural** | Subfab lateral racks | 0" | 3 |
| **Structural** | Main building steel | 0" | 3 |
| **Structural** | EOR designed pipe supports | 6" | 3 |

**How platform uses it:** When user extracts a line, system looks up discipline + element type → returns tolerance + citation

---

## 2.2 40_05_19.01.pdf (11 pages) - Pipe Support Span Tables

**What it contains:** Maximum support spacing for every pipe material, size, temperature, and service type

**Data to extract and embed:**

### PVC Schedule 40 - Water Service (Table 1.11, Page 3)
| Size | 68°F | 80°F | 100°F | 120°F | 140°F |
|------|------|------|-------|-------|-------|
| 1/2" | 2.4 ft | 2.3 ft | 1.9 ft | 1.6 ft | 1.2 ft |
| 3/4" | 2.8 ft | 2.7 ft | 2.3 ft | 1.9 ft | 1.5 ft |
| 1" | 3.4 ft | 3.3 ft | 2.9 ft | 2.4 ft | 1.8 ft |
| 1-1/2" | 4.2 ft | 4.1 ft | 3.7 ft | 3.1 ft | 2.3 ft |
| 2" | 4.7 ft | 4.6 ft | 4.2 ft | 3.5 ft | 2.6 ft |
| 3" | 5.9 ft | 5.8 ft | 5.5 ft | 4.5 ft | 3.4 ft |
| 4" | 6.6 ft | 6.5 ft | 6.1 ft | 5.0 ft | 3.8 ft |

### PVC Schedule 80 - Water Service (Table 1.13, Page 4)
| Size | 68°F | 80°F | 100°F | 120°F | 140°F |
|------|------|------|-------|-------|-------|
| 1/2" | 2.5 ft | 2.4 ft | 2.1 ft | 1.7 ft | 1.3 ft |
| 3/4" | 3.0 ft | 2.9 ft | 2.6 ft | 2.1 ft | 1.6 ft |
| 1" | 3.5 ft | 3.4 ft | 3.2 ft | 2.6 ft | 2.0 ft |
| 1-1/2" | 4.4 ft | 4.3 ft | 4.1 ft | 3.4 ft | 2.6 ft |
| 2" | 5.0 ft | 4.9 ft | 4.6 ft | 3.9 ft | 3.0 ft |
| 3" | 6.3 ft | 6.1 ft | 5.8 ft | 5.1 ft | 3.9 ft |
| 4" | 7.1 ft | 6.9 ft | 6.6 ft | 5.8 ft | 4.4 ft |

### CPVC Schedule 80 - Water Service (Table 1.21, Page 6)
| Size | 68°F | 80°F | 100°F | 120°F | 140°F |
|------|------|------|-------|-------|-------|
| 1/2" | 2.5 ft | 2.5 ft | 2.3 ft | 2.0 ft | 1.7 ft |
| 1" | 3.5 ft | 3.4 ft | 3.2 ft | 2.9 ft | 2.4 ft |
| 2" | 4.9 ft | 4.8 ft | 4.6 ft | 4.2 ft | 3.4 ft |
| 4" | 7.0 ft | 6.9 ft | 6.5 ft | 5.9 ft | 4.8 ft |

### PP (Polypropylene) SDR 11 - Water Service (Table 1.30, Page 7)
| Size | 68°F | 80°F | 100°F | 120°F | 140°F |
|------|------|------|-------|-------|-------|
| 1" | 2.2 ft | 2.1 ft | 2.0 ft | 1.9 ft | 1.7 ft |
| 2" | 3.5 ft | 3.4 ft | 3.2 ft | 3.1 ft | 3.1 ft |
| 4" | 5.0 ft | 4.8 ft | 4.6 ft | 4.4 ft | 4.3 ft |

### PVDF PN16 - Water Service (Table 1.40, Page 8)
| Size | 68°F | 80°F | 100°F | 120°F | 140°F |
|------|------|------|-------|-------|-------|
| 1" | 2.5 ft | 2.4 ft | 2.3 ft | 2.2 ft | 2.1 ft |
| 2" | 3.7 ft | 3.6 ft | 3.4 ft | 3.3 ft | 3.2 ft |
| 4" | 5.1 ft | 5.0 ft | 4.8 ft | 4.6 ft | 4.4 ft |

### Carbon Steel - Standard Weight (Table 1.50, Page 9)
| Size | Water Service | Vapor Service |
|------|---------------|---------------|
| 1" | 10.0 ft | 11.0 ft |
| 2" | 13.5 ft | 15.0 ft |
| 4" | 19.0 ft | 21.5 ft |

### Stainless Steel (Table 1.60, Page 9-10)
| Size | Water Service | Vapor Service |
|------|---------------|---------------|
| 1" | 9.0 ft | 10.5 ft |
| 2" | 12.0 ft | 15.0 ft |
| 4" | 15.5 ft | 21.0 ft |

### Specific Gravity Correction Factors (for fluids heavier than water)
| Material | SG 1.25 | SG 1.5 | SG 1.75 | SG 2.0 |
|----------|---------|--------|---------|--------|
| PVC Sch 40 | 0.92 | 0.86 | 0.80 | 0.76 |
| PVC Sch 80 | 0.96 | 0.91 | 0.86 | 0.83 |
| CPVC Sch 80 | 0.97 | 0.94 | 0.91 | 0.90 |
| PP SDR 11 | 0.96 | 0.93 | 0.91 | 0.88 |
| PVDF PN16 | 0.98 | 0.94 | 0.92 | 0.90 |

**How platform uses it:** When user extracts a 4" PVC line, system looks up material + size + temperature → returns max span + table reference + page number

---

## 2.3 A-7_LOD_Matrix.xlsx (13 sheets)

**What it contains:** Level of Development requirements - what to model, what metadata is required

**Sheets:** Introduction, Project Info, Common Parameters, Architectural, Structural, Industrial Engineering, Process, Mechanical, Fire Protection, Telecom, Electrical, LifeSafety, Instrumentation

**Key data from Process sheet (Row 52-58):**

| Element | Include in Model | Required Metadata |
|---------|-----------------|-------------------|
| Process piping ≥2" | YES | Name, Line Number, Size (nominal), Length, Layer, Package Name |
| Pipe Fittings | YES | Same as piping |
| Valves | YES (generic spatial) | Same as piping |
| Pipe insulation | YES (volumetric only) | Layer |
| Process piping <2" | NO (except designated stress lines) | N/A |

**How platform uses it:** When user extracts a line, check if size ≥2" → if yes, show required metadata list + sheet reference

---

## 2.4 A-11_Deliverables_Format_Table.pdf (4 pages)

**What it contains:** Output format guidance - 2D (PDF) vs 3D (Navisworks) by discipline

**Key data:**

| Discipline | P&IDs | Piping Plans | Sections |
|------------|-------|--------------|----------|
| Process | 2D (PDF) | 3D (Navisworks) | 3D (Navisworks) |
| Mechanical | 2D (PDF) | 3D (Navisworks) | 3D (Navisworks) |
| Plumbing | 2D (PDF) | 3D (Navisworks) | 3D (Navisworks) |
| Fire Protection | 2D (PDF) | 3D (Navisworks) | 3D (Navisworks) |

**Note from A-11:** "Dimensions are expected to be taken from the model which relies on an equipment Basis of Design. Contractor is responsible for verifying dimensions, elevations, locations and connections based on final equipment selection."

**How platform uses it:** Guide export format recommendations

---

## 2.5 BIM CPEP (11+ pages)

**What it contains:** BIM execution plan, workflows, file naming, IFF process

**Key data:**

| Topic | Requirement | Reference |
|-------|-------------|-----------|
| Model accuracy | Field to match IFF routing: ±1" (general), ±1/4" (critical areas like lateral racks, POC, tool install) | Section 8.1.1 |
| File naming | CM files use format: LL-YY_IFF-BBB-AAA-XXXX_YYYY-MM-DD | Section 7.5.2 |
| IFF status | Files must be clash-free before IFF approval | Section 7.3.4 |
| Record model | Must represent field conditions within tolerances | Section 9.1.4 |

**Document hierarchy (Section 4.4.4):**
1. Specifications (highest priority)
2. P&IDs
3. Certified 2D IFC details
4. Certified 3D models
5. Certified 2D IFC drawings

**How platform uses it:** Provide workflow guidance, validate IFF requirements

---

# PART 3: RECOMMENDED TECH STACK

## 3.1 Why This Stack

| Requirement | Solution | Reason |
|-------------|----------|--------|
| Read P&IDs | Claude 3.5 Sonnet Vision | Best AI vision for technical drawings |
| Fast spec lookup | PostgreSQL + Embeddings | Pre-computed, instant retrieval |
| Store documents | AWS S3 | You already use this |
| Web app | Next.js 14 | Modern, full-stack, easy deployment |
| Database | Supabase (PostgreSQL) | You already use this |
| Vendor search | Claude + Web scraping | Flexible, can find any product |
| Hosting | Vercel | One-click deploy from GitHub |

## 3.2 Complete Tech Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router)                                            │
│  ├── React 18                                                       │
│  ├── TypeScript                                                     │
│  ├── Tailwind CSS                                                   │
│  ├── shadcn/ui components                                           │
│  └── react-pdf (for P&ID viewer)                                    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND                                      │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js API Routes                                                 │
│  ├── /api/upload - Upload P&ID to S3                                │
│  ├── /api/extract - Send to Claude Vision, get extracted data      │
│  ├── /api/specs - Look up specs from database (with citations)     │
│  ├── /api/vendors - Search vendor websites                          │
│  └── /api/export - Generate Excel/PDF with all references          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         AI LAYER                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Anthropic Claude API                                               │
│  ├── Claude 3.5 Sonnet (Vision) - Read P&ID images                 │
│  ├── Claude 3.5 Sonnet - Generate modeling instructions            │
│  └── Claude 3.5 Haiku - Quick lookups, vendor search               │
│                                                                      │
│  Vercel AI SDK - Streaming responses, error handling               │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)                                              │
│  ├── tolerance_specs - All A-9 tolerances with page references     │
│  ├── pipe_spans - All 40 05 19.01 support spans with table refs    │
│  ├── lod_requirements - All A-7 LOD data with sheet references     │
│  ├── line_classes - Material codes (PV, PU, CC, SA, etc.)          │
│  ├── service_codes - Service codes (PW, CW, N2, etc.)              │
│  ├── vendor_products - Cached vendor product data                   │
│  ├── projects - User projects                                       │
│  ├── drawings - Uploaded P&IDs                                      │
│  └── extractions - AI-extracted line data                          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FILE STORAGE                                 │
├─────────────────────────────────────────────────────────────────────┤
│  AWS S3 (Your existing bucket)                                      │
│  ├── /pids/ - Uploaded P&ID PDFs and images                        │
│  ├── /exports/ - Generated Excel/PDF reports                       │
│  └── /specs/ - Original spec documents (for reference links)       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         HOSTING                                      │
├─────────────────────────────────────────────────────────────────────┤
│  Vercel                                                             │
│  ├── Auto-deploy from GitHub                                        │
│  ├── Edge functions for fast response                              │
│  └── Built-in analytics                                             │
└─────────────────────────────────────────────────────────────────────┘
```

## 3.3 Key Libraries

| Purpose | Library | Why |
|---------|---------|-----|
| AI SDK | `@anthropic-ai/sdk` + `ai` (Vercel) | Official Anthropic SDK + streaming |
| PDF Processing | `pdf-lib` + `sharp` | Convert PDF to images for Claude |
| Excel Export | `exceljs` | Create Excel with formatting |
| PDF Export | `@react-pdf/renderer` | Generate PDF reports |
| File Upload | `@aws-sdk/client-s3` | Upload to your S3 bucket |
| UI Components | `shadcn/ui` | Professional, customizable |
| PDF Viewer | `react-pdf` | Display P&ID in browser |
| Forms | `react-hook-form` + `zod` | Form validation |

---

# PART 4: DATABASE SCHEMA (WITH CITATIONS)

## 4.1 Spec Tables (Pre-populated from your documents)

```sql
-- Tolerances from A-9
CREATE TABLE tolerance_specs (
  id SERIAL PRIMARY KEY,
  discipline TEXT NOT NULL,        -- 'Process', 'Mechanical', etc.
  element_type TEXT NOT NULL,      -- 'Individual pipe runs'
  tolerance TEXT NOT NULL,         -- '6 inch'
  notes TEXT,
  -- CITATION FIELDS
  source_document TEXT DEFAULT 'A-9_Change_Management.pdf',
  source_page INTEGER,             -- 5
  source_table TEXT,               -- 'Process Tolerance Table'
  source_row TEXT                  -- 'Individual pipe runs'
);

-- Pipe Support Spans from 40 05 19.01
CREATE TABLE pipe_span_specs (
  id SERIAL PRIMARY KEY,
  material TEXT NOT NULL,          -- 'PVC Schedule 80'
  service TEXT NOT NULL,           -- 'Water', 'Vapor'
  pipe_size TEXT NOT NULL,         -- '4 inch'
  temperature INTEGER NOT NULL,    -- 68, 80, 100, etc.
  max_span DECIMAL NOT NULL,       -- 7.1
  -- CITATION FIELDS
  source_document TEXT DEFAULT '40_05_19.01.pdf',
  source_page INTEGER,             -- 4
  source_table TEXT,               -- 'Table 1.13'
  source_description TEXT          -- 'Schedule 80 PVC Water Service'
);

-- SG Correction Factors from 40 05 19.01
CREATE TABLE sg_correction_factors (
  id SERIAL PRIMARY KEY,
  material TEXT NOT NULL,
  specific_gravity DECIMAL NOT NULL,
  correction_factor DECIMAL NOT NULL,
  source_document TEXT DEFAULT '40_05_19.01.pdf',
  source_page INTEGER,
  source_table TEXT
);

-- LOD Requirements from A-7
CREATE TABLE lod_requirements (
  id SERIAL PRIMARY KEY,
  discipline TEXT NOT NULL,        -- 'Process'
  element_type TEXT NOT NULL,      -- 'Piping'
  size_threshold TEXT,             -- '≥2 inch'
  include_in_model BOOLEAN,        -- true
  required_metadata TEXT[],        -- ['Name', 'Line Number', 'Size', 'Length', 'Layer']
  excluded_items TEXT[],           -- ['Piping <2" unless designated']
  -- CITATION FIELDS
  source_document TEXT DEFAULT 'A-7_LOD_Matrix.xlsx',
  source_sheet TEXT,               -- 'Process'
  source_rows TEXT                 -- 'Row 52-58'
);

-- Line Class Codes
CREATE TABLE line_classes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,       -- 'PV', 'PU', 'CC', 'SA'
  material TEXT NOT NULL,          -- 'PVC', 'CPVC', 'Carbon Steel'
  schedule TEXT,                   -- 'Schedule 80'
  description TEXT
);

-- Service Codes
CREATE TABLE service_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,       -- 'PW', 'CW', 'N2'
  service TEXT NOT NULL,           -- 'Process Water'
  typical_material TEXT            -- 'PVC, CPVC, SS'
);
```

## 4.2 Application Tables

```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- P&ID Drawings
CREATE TABLE drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,          -- S3 URL
  status TEXT DEFAULT 'uploaded',  -- uploaded, processing, extracted, complete
  page_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Extracted Lines (with all citations)
CREATE TABLE extracted_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drawing_id UUID REFERENCES drawings(id),
  
  -- Extracted from P&ID
  line_number TEXT NOT NULL,       -- 'PW1-241-04-A01'
  service_code TEXT,               -- 'PW'
  service_name TEXT,               -- 'Process Water'
  area TEXT,                       -- '241'
  size TEXT,                       -- '4 inch'
  material TEXT,                   -- 'PVC Schedule 80'
  line_class TEXT,                 -- 'PV'
  
  -- From A-9 (with citation)
  tolerance_value TEXT,            -- '6 inch'
  tolerance_citation JSONB,        -- {"document": "A-9", "page": 5, "table": "Process", "row": "Individual pipe runs"}
  
  -- From 40 05 19.01 (with citation)
  max_span DECIMAL,                -- 7.1
  span_citation JSONB,             -- {"document": "40_05_19.01", "page": 4, "table": "Table 1.13", "material": "PVC Sch 80", "temp": "68°F"}
  
  -- From A-7 (with citation)
  include_in_model BOOLEAN,
  required_metadata TEXT[],
  lod_citation JSONB,              -- {"document": "A-7", "sheet": "Process", "rows": "52-58"}
  
  -- AI confidence
  confidence DECIMAL DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vendor Products
CREATE TABLE vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id UUID REFERENCES extracted_lines(id),
  
  vendor TEXT NOT NULL,            -- 'George Fischer'
  product_name TEXT,               -- 'PVC-U Schedule 80 Pipe'
  model_number TEXT,
  product_url TEXT,                -- Clickable link
  datasheet_url TEXT,
  image_url TEXT,
  specifications JSONB,
  
  is_preferred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# PART 5: HOW IT WORKS (STEP BY STEP)

## 5.1 User Uploads P&ID

```
User uploads: PW1-241-D0-A01_OC35.pdf
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. Store in S3                                                     │
│  2. Convert PDF pages to images                                     │
│  3. Create drawing record in database                              │
│  4. Return drawing ID to frontend                                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 5.2 AI Extracts Data

```
Claude Vision API receives image + prompt:
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  EXTRACTION PROMPT:                                                 │
│                                                                     │
│  "Analyze this P&ID drawing and extract ALL piping lines.          │
│   For each line, provide:                                          │
│   - Line number (e.g., PW1-241-04-A01)                             │
│   - Parse: Service code, Area, Size, Sequence                      │
│   - Connected equipment                                             │
│   - Valves on line                                                  │
│   - Any notes that apply                                           │
│                                                                     │
│   Return as JSON with confidence scores."                          │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
Returns: [
  {
    "line_number": "PW1-241-04-A01",
    "service": "PW",
    "area": "241",
    "size": "04",
    "confidence": 0.95
  },
  ...
]
```

## 5.3 System Looks Up Specs (WITH CITATIONS)

```
For each extracted line:
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: Determine Material                                         │
│  ─────────────────────────                                         │
│  Service code "PW" + Line class lookup → "PVC Schedule 80"         │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Look Up Tolerance (from A-9 table in database)            │
│  ──────────────────────────────────────────────────────            │
│  Query: WHERE discipline='Process' AND element_type='pipe runs'    │
│                                                                     │
│  Result:                                                            │
│  {                                                                  │
│    "tolerance": "6 inch",                                          │
│    "citation": {                                                   │
│      "document": "A-9_Change_Management.pdf",                      │
│      "page": 5,                                                    │
│      "table": "Approved Tolerances Table - Process",               │
│      "row": "Individual pipe runs including branch fitting"        │
│    }                                                                │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Calculate Support Span (from 40 05 19.01 table)           │
│  ───────────────────────────────────────────────────────           │
│  Query: WHERE material='PVC Schedule 80'                           │
│         AND pipe_size='4 inch'                                     │
│         AND temperature=68                                         │
│         AND service='Water'                                        │
│                                                                     │
│  Result:                                                            │
│  {                                                                  │
│    "max_span": 7.1,                                                │
│    "unit": "ft",                                                   │
│    "citation": {                                                   │
│      "document": "40_05_19.01.pdf",                                │
│      "page": 4,                                                    │
│      "table": "Table 1.13",                                        │
│      "description": "Schedule 80 PVC Pipe Maximum Support          │
│                      Spacing in Water Service"                     │
│    }                                                                │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: Get LOD Requirements (from A-7 table)                     │
│  ─────────────────────────────────────────────                     │
│  Query: WHERE discipline='Process'                                 │
│         AND element_type='Piping'                                  │
│         AND size >= 2"                                             │
│                                                                     │
│  Result:                                                            │
│  {                                                                  │
│    "include_in_model": true,                                       │
│    "required_metadata": ["Name", "Line Number", "Size",            │
│                          "Length", "Layer", "Package Name"],       │
│    "citation": {                                                   │
│      "document": "A-7_LOD_Matrix.xlsx",                            │
│      "sheet": "Process",                                           │
│      "rows": "52-58",                                              │
│      "description": "Piping - Process piping 2\" nominal           │
│                      and above shown on the P&IDs"                 │
│    }                                                                │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 5.4 System Searches Vendors

```
For material "PVC Schedule 80" + size "4 inch":
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Search preferred vendors in order:                                 │
│  1. George Fischer (gfps.com)                                      │
│  2. Spears Manufacturing                                           │
│  3. NIBCO                                                          │
│                                                                     │
│  Returns:                                                           │
│  {                                                                  │
│    "vendor": "George Fischer",                                     │
│    "product": "PVC-U Pipe Schedule 80",                            │
│    "model": "161-017-000",                                         │
│    "product_url": "https://www.gfps.com/...",                      │
│    "datasheet_url": "https://www.gfps.com/.../datasheet.pdf",      │
│    "image_url": "https://www.gfps.com/.../image.jpg"               │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 5.5 Generate Output with All Citations

```
Final output for modeler:
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ LINE: PW1-241-04-A01                                               │
│ Service: Process Water | Size: 4" | Material: PVC Schedule 80      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ 📐 TOLERANCE                                                        │
│    Value: 6"                                                        │
│    📄 A-9_Change_Management.pdf, Page 5                            │
│    📍 "Process Table → Individual pipe runs"                       │
│                                                                     │
│ 📏 SUPPORT SPAN                                                     │
│    Maximum: 7.1 ft @ 68°F (Water service)                          │
│    📄 40_05_19.01.pdf, Page 4                                      │
│    📍 "Table 1.13 - Schedule 80 PVC"                               │
│                                                                     │
│ 📋 LOD REQUIREMENTS                                                 │
│    Include in Model: YES                                            │
│    Required Metadata: Name, Line Number, Size, Length, Layer       │
│    📄 A-7_LOD_Matrix.xlsx, Sheet: Process                          │
│    📍 "Rows 52-58: Piping requirements"                            │
│                                                                     │
│ 🏭 VENDOR                                                           │
│    George Fischer PVC-U Schedule 80                                │
│    🔗 Product Page | 📄 Datasheet | 🖼️ Image                       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ MODELING INSTRUCTIONS:                                              │
│ 1. Create 4" PVC Schedule 80 pipe                                  │
│ 2. Place supports every 7.1 ft maximum                             │
│ 3. Tolerance: May deviate up to 6" from design                     │
│ 4. Add metadata: Name, Line Number, Size, Length, Layer            │
│ 5. Reference George Fischer 161-017-000 for product specs          │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PART 6: DEVELOPMENT PHASES

## Phase 1: Database & Seed Data (Week 1)

**Goal:** All your spec documents converted to database tables with citations

**Tasks:**
1. Create Supabase database with all tables
2. Write seed script to populate:
   - All A-9 tolerances (with page numbers)
   - All 40 05 19.01 pipe spans (with table references)
   - All A-7 LOD requirements (with sheet/row references)
   - Line class codes
   - Service codes
3. Verify all data with citations

**Deliverable:** Database with all specs, queryable with citations

## Phase 2: P&ID Upload & Storage (Week 2)

**Goal:** Users can upload P&IDs and see them in the system

**Tasks:**
1. Create upload page with drag-and-drop
2. Connect to AWS S3 for file storage
3. Convert PDF to images for viewing
4. Build P&ID viewer component

**Deliverable:** Upload and view P&IDs

## Phase 3: AI Extraction (Weeks 3-4)

**Goal:** Claude AI reads P&IDs and extracts all line data

**Tasks:**
1. Build Claude Vision integration
2. Create extraction prompts
3. Parse AI responses into structured data
4. Store extractions in database
5. Display extracted data with confidence scores

**Deliverable:** Automatic line extraction from P&IDs

## Phase 4: Spec Matching with Citations (Week 5)

**Goal:** Every extracted line gets matched specs with full citations

**Tasks:**
1. Build tolerance lookup service
2. Build pipe span calculator
3. Build LOD requirement matcher
4. Format citations for display
5. Update UI to show all citations

**Deliverable:** Full spec matching with document references

## Phase 5: Vendor Integration (Week 6)

**Goal:** Search preferred vendors and provide product links

**Tasks:**
1. Build vendor search service
2. Integrate with Claude for web search
3. Store vendor product data
4. Display products with clickable links

**Deliverable:** Vendor products with URLs

## Phase 6: Export & Polish (Weeks 7-8)

**Goal:** Export results with all citations, polish UI

**Tasks:**
1. Build Excel export with citations
2. Build PDF report generation
3. Add verification workflow
4. UI/UX improvements
5. Testing and bug fixes

**Deliverable:** Production-ready PIDFlow

---

# PART 7: COST ESTIMATE

## 7.1 AI Costs

| Operation | Model | Cost |
|-----------|-------|------|
| P&ID Vision Analysis | Claude 3.5 Sonnet | ~$0.10-0.20 per page |
| Vendor Search | Claude 3.5 Haiku | ~$0.01-0.02 per search |
| **Per P&ID (average)** | | **~$0.20-0.40** |

**Monthly estimate (100 P&IDs):** $20-40

## 7.2 Infrastructure Costs

| Service | Cost |
|---------|------|
| Supabase (Free tier) | $0 |
| AWS S3 (existing) | ~$5/month |
| Vercel (Pro) | $20/month |
| **Total** | **~$25/month + AI costs** |

---

# PART 8: NEXT STEPS

## Immediate Actions

1. **Confirm this approach works for you**
   - Does the citation format meet your needs?
   - Are there any documents I missed?

2. **Decide on standalone vs BIMFlow integration**
   - Standalone: Separate app, faster to build
   - Integration: Part of BIMFlow, shared database

3. **Set up development environment**
   - Create new Next.js project
   - Connect to your Supabase
   - Set up S3 bucket access

4. **Start Phase 1: Seed all spec data**
   - I can generate the complete seed script with all your data

---

## Questions for You:

1. **Does this citation format work?** (Document name, page number, table/row reference)

2. **What temperature should I default to for pipe span calculations?** (68°F? Or should users input?)

3. **Which vendors are your preferred vendors?** (I have George Fischer, Victaulic, Anvil, Spears - are there others?)

4. **Do you want this as a standalone app or part of BIMFlow?**

5. **Ready to start building?** I can generate the complete database seed script with all your spec data right now.

---

*Let me know if this breakdown makes sense and if you're ready to proceed!*
