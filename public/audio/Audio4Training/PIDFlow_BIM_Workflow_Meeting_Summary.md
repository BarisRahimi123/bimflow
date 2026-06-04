# PIDFlow: BIM Modeling Workflow & Document Reference Guide

## Meeting Summary: How We Get From P&ID to Model-Ready Data

---

## EXECUTIVE OVERVIEW

PIDFlow automates the process of extracting pipe data from P&IDs and looking up all required specifications from project documents. Every piece of information is backed by a **document citation** so modelers know exactly where the data came from.

**The Problem We're Solving:**
- BIM modelers manually look up specs across multiple documents
- Time-consuming to find tolerances, support spans, LOD requirements
- Risk of errors when cross-referencing documents
- No traceability for where information came from

**Our Solution:**
- AI reads P&ID → Extracts all line data
- System automatically looks up specs from project documents
- Every output includes source document, page, table, and row citation
- One-click export to Excel/PDF with full references

---

## THE COMPLETE BIM MODELING WORKFLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   STEP 1: P&ID UPLOAD                                                       │
│   ──────────────────                                                        │
│   • User uploads P&ID (PDF/PNG)                                             │
│   • AI (Claude Vision) reads the drawing                                    │
│   • Extracts: Line numbers, equipment tags, valves, notes                   │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   STEP 2: LINE DATA PARSING                                                 │
│   ─────────────────────────                                                 │
│   Example Line: PW1-241-04-A01                                              │
│                                                                             │
│   Parsed As:                                                                │
│   • PW = Service Code (Process Water)                                       │
│   • 1 = Area/Building                                                       │
│   • 241 = System/Zone                                                       │
│   • 04 = Size (4 inch)                                                      │
│   • A01 = Sequence                                                          │
│                                                                             │
│   Material determined from Line Class code (e.g., PV = PVC Schedule 80)    │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   STEP 3: SPECIFICATION LOOKUP (with citations)                             │
│   ─────────────────────────────────────────────                             │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ A. TOLERANCE LOOKUP                                                 │   │
│   │    Source: A-9_Change_Management.pdf                                │   │
│   │    Question: "How much can this pipe deviate from design?"          │   │
│   │                                                                     │   │
│   │    System checks: What is the pipe location?                        │   │
│   │    • Subfab lateral rack → 0" (ZERO tolerance)                      │   │
│   │    • EOR engineered rack → 1/2"                                     │   │
│   │    • Individual pipe run → 6"                                       │   │
│   │    • Utility main → 1"                                              │   │
│   │                                                                     │   │
│   │    Output: "Tolerance: 6 inch"                                      │   │
│   │    Citation: A-9, Page 5, Process Table, Row: Individual pipe runs  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ B. SUPPORT SPAN CALCULATION                                         │   │
│   │    Source: 40_05_19.01.pdf                                          │   │
│   │    Question: "What is the maximum distance between supports?"       │   │
│   │                                                                     │   │
│   │    System checks:                                                   │   │
│   │    • Material: PVC Schedule 80                                      │   │
│   │    • Size: 4 inch                                                   │   │
│   │    • Service: Water (SG = 1.0)                                      │   │
│   │    • Temperature: 68°F (default, user can change)                   │   │
│   │                                                                     │   │
│   │    Looks up Table 1.13 → 4" PVC Sch 80 @ 68°F Water = 7.1 ft       │   │
│   │                                                                     │   │
│   │    If SG > 1.0, applies correction factor from same document        │   │
│   │                                                                     │   │
│   │    Output: "Max Span: 7.1 ft"                                       │   │
│   │    Citation: 40_05_19.01, Page 4, Table 1.13                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ C. NUMBER OF SUPPORTS CALCULATION                                   │   │
│   │    Source: 40_05_19.01.pdf + User Input                             │   │
│   │    Question: "How many supports do I need for this pipe run?"       │   │
│   │                                                                     │   │
│   │    User inputs:                                                     │   │
│   │    • Pipe length: 50 ft                                             │   │
│   │    • Orientation: Horizontal                                        │   │
│   │                                                                     │   │
│   │    Calculation:                                                     │   │
│   │    • 50 ft ÷ 7.1 ft max span = 7.04 spans → Round up = 8 spans     │   │
│   │    • Number of supports = 8 + 1 = 9 SUPPORTS                        │   │
│   │                                                                     │   │
│   │    Output: "9 supports required"                                    │   │
│   │    Citation: Based on 40_05_19.01, Table 1.13                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ D. SUPPORT TYPE SELECTION                                           │   │
│   │    Source: 40_05_19.pdf (Pipe Supports and Anchors)                 │   │
│   │    Question: "What TYPE of support should I use?"                   │   │
│   │                                                                     │   │
│   │    System checks:                                                   │   │
│   │    • Orientation: Horizontal → Clevis hanger, pipe clamp, trapeze   │   │
│   │    • Orientation: Vertical → Riser clamp, guide                     │   │
│   │    • Location: In rack → Rack-mounted support                       │   │
│   │    • Location: Field run → Field support                            │   │
│   │    • Near valve/elbow → Additional support required                 │   │
│   │                                                                     │   │
│   │    Output: "Use clevis hanger or pipe clamp"                        │   │
│   │    Citation: 40_05_19, Section X, Page X                            │   │
│   │                                                                     │   │
│   │    ⚠️ STATUS: Document uploaded but not yet processed (68 pages)   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ E. LOD REQUIREMENTS                                                 │   │
│   │    Source: A-7_LOD_Matrix.xlsx                                      │   │
│   │    Question: "Should this be in the model? What metadata needed?"   │   │
│   │                                                                     │   │
│   │    System checks:                                                   │   │
│   │    • Discipline: Process                                            │   │
│   │    • Element: Piping                                                │   │
│   │    • Size: 4 inch (≥2", so YES include)                             │   │
│   │                                                                     │   │
│   │    Output:                                                          │   │
│   │    • Include in Model: YES                                          │   │
│   │    • Required Metadata: Name, Line Number, Size, Length, Layer      │   │
│   │    • Excluded: Piping <2", field routed piping                      │   │
│   │                                                                     │   │
│   │    Citation: A-7_LOD_Matrix.xlsx, Sheet: Process, Rows 52-58        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ F. FIELD ACCURACY REQUIREMENTS                                      │   │
│   │    Source: BIM_CPEP.pdf                                             │   │
│   │    Question: "How accurate must the field installation be?"         │   │
│   │                                                                     │   │
│   │    System checks location:                                          │   │
│   │    • General areas → ±1" accuracy                                   │   │
│   │    • Critical areas (lateral racks, POC, tool install) → ±1/4"      │   │
│   │                                                                     │   │
│   │    Citation: BIM CPEP, Section 8.1.1                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   STEP 4: VENDOR PRODUCT SEARCH                                             │
│   ─────────────────────────────                                             │
│   • System searches preferred vendors (George Fischer, Victaulic, etc.)     │
│   • Finds matching products for pipe material/size                          │
│   • Returns: Product URL, Datasheet PDF, Images                             │
│   • User can add custom vendor URLs                                         │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│   STEP 5: OUTPUT WITH FULL CITATIONS                                        │
│   ──────────────────────────────────                                        │
│   • Display all results on screen                                           │
│   • Export to Excel with all citations                                      │
│   • Export to PDF report                                                    │
│   • Every piece of data traceable to source document                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## DOCUMENT REFERENCE MATRIX

### Which Document Answers Which Question?

| Question | Document | Location | What You Get |
|----------|----------|----------|--------------|
| **How much can this pipe deviate from design?** | A-9_Change_Management.pdf | Pages 2-6, Tolerance Tables | Tolerance value (0" to 12") based on element type and location |
| **What is the max span between supports?** | 40_05_19.01.pdf | Pages 2-11, Tables 1.10-1.71 | Max span in feet based on material, size, temp, service |
| **How do I correct for heavy fluids?** | 40_05_19.01.pdf | After each span table | SG correction factor (1.0, 0.92, 0.86, etc.) |
| **What TYPE of support do I use?** | 40_05_19.pdf | TBD (68 pages) | Support type based on orientation, location, special conditions |
| **Should this be in the model?** | A-7_LOD_Matrix.xlsx | Discipline sheets | Yes/No + required metadata + exclusions |
| **What metadata is required?** | A-7_LOD_Matrix.xlsx | Discipline sheets | Name, Line Number, Size, Length, Layer, etc. |
| **What deliverable format?** | A-11_Deliverables.pdf | Format tables | 2D (PDF) or 3D (Navisworks) |
| **How accurate must field install be?** | BIM_CPEP.pdf | Section 8.1.1 | ±1" general, ±1/4" critical areas |
| **What is the document hierarchy?** | BIM_CPEP.pdf | Section on hierarchy | Specs > P&IDs > 2D IFC > 3D models > 2D drawings |

---

## TOLERANCE QUICK REFERENCE (A-9)

### Process Discipline

| Element Type | Tolerance | Page |
|--------------|-----------|------|
| Subfab lateral racks | 0" (ZERO) | 5 |
| Process piping in EOR racks | 1/2" | 5 |
| Utility mains & sub-mains | 1" | 5 |
| Equipment/panel datums | 1/2" | 5 |
| Equipment feeders / utility branches | 6" | 5 |
| Individual pipe runs | 6" | 5 |
| In-line component location | 6" axially | 5 |
| EOR designed pipe supports | 6" | 5 |
| All remaining components | 2" | 5 |

### Key Insight:
**Location matters!** The same pipe has different tolerances based on WHERE it is:
- In a subfab rack = ZERO tolerance (critical)
- In an EOR rack = 1/2" tolerance
- Individual run = 6" tolerance

---

## PIPE SUPPORT SPAN QUICK REFERENCE (40 05 19.01)

### PVC Schedule 80 - Water Service (Most Common)

| Size | 68°F | 80°F | 100°F | 120°F | 140°F |
|------|------|------|-------|-------|-------|
| 1/2" | 2.5 ft | 2.4 ft | 2.1 ft | 1.7 ft | 1.3 ft |
| 1" | 3.5 ft | 3.4 ft | 3.2 ft | 2.6 ft | 2.0 ft |
| 2" | 5.0 ft | 4.9 ft | 4.6 ft | 3.9 ft | 3.0 ft |
| 3" | 6.3 ft | 6.1 ft | 5.8 ft | 5.1 ft | 3.9 ft |
| 4" | 7.1 ft | 6.9 ft | 6.6 ft | 5.8 ft | 4.4 ft |

**Source:** 40_05_19.01.pdf, Page 4, Table 1.13

### Key Insight:
- **Higher temperature = Shorter spans** (pipe gets weaker)
- **Water service = Shorter spans than vapor** (heavier load)
- **If SG > 1.0**, multiply span by correction factor

---

## SUPPORT CALCULATOR INPUTS & OUTPUTS

### What User Inputs:

| Input | Options | Why Needed |
|-------|---------|------------|
| Pipe Size | 1/2" to 4"+ | Determines base span |
| Material | PVC Sch 40/80, CPVC, PP, PVDF, CS, SS | Different materials = different spans |
| Service | Water / Vapor | Water needs closer supports |
| Temperature | 68°F - 140°F | Higher temp = closer supports |
| Specific Gravity | 1.0 - 2.0 | Heavy fluid = closer supports |
| Pipe Length | User input (ft) | To calculate # of supports |
| Orientation | Horizontal / Vertical | Different support types |
| **Location** | Subfab rack, EOR rack, Individual run, Utility main | Affects tolerance AND support type |

### What System Outputs:

| Output | Source Document | Citation Example |
|--------|-----------------|------------------|
| Tolerance | A-9 | "A-9, Page 5, Process Table, Individual pipe runs" |
| Max Span | 40 05 19.01 | "40_05_19.01, Page 4, Table 1.13, 4 inch @ 68°F" |
| # of Supports | Calculated | "Based on 40_05_19.01 max span" |
| Support Type | 40 05 19 | TBD - document being processed |
| LOD Requirements | A-7 | "A-7, Process sheet, Rows 52-58" |
| Field Accuracy | BIM CPEP | "BIM CPEP, Section 8.1.1" |

---

## EXAMPLE OUTPUT FOR A SINGLE LINE

```
═══════════════════════════════════════════════════════════════════════════════
LINE: PW1-241-04-A01
═══════════════════════════════════════════════════════════════════════════════

PARSED DATA:
  Service:        Process Water (PW)
  Size:           4 inch
  Material:       PVC Schedule 80 (Line Class PV)
  Area:           241
  Location:       Individual pipe run (not in rack)

───────────────────────────────────────────────────────────────────────────────
📐 TOLERANCE
───────────────────────────────────────────────────────────────────────────────
  Value:          6 inches
  
  📄 Source:      A-9_Change_Management.pdf
  📍 Page:        5
  📍 Table:       Approved Tolerances Table - Process
  📍 Row:         "Individual pipe runs including branch fitting locations"

───────────────────────────────────────────────────────────────────────────────
📏 SUPPORT SPAN
───────────────────────────────────────────────────────────────────────────────
  Maximum Span:   7.1 ft @ 68°F
  Service:        Water (SG = 1.0)
  
  📄 Source:      40_05_19.01.pdf
  📍 Page:        4
  📍 Table:       1.13 - Schedule 80 PVC Pipe Maximum Support Spacing
  📍 Row:         4 inch nominal, 68°F
  
  ℹ️ If temperature changes:
     80°F → 6.9 ft | 100°F → 6.6 ft | 120°F → 5.8 ft | 140°F → 4.4 ft

───────────────────────────────────────────────────────────────────────────────
🔢 NUMBER OF SUPPORTS (User Input: 50 ft pipe)
───────────────────────────────────────────────────────────────────────────────
  Pipe Length:    50 ft
  Max Span:       7.1 ft
  Calculation:    50 ÷ 7.1 = 7.04 spans → Round up = 8 spans
  
  SUPPORTS NEEDED: 9 (8 spans + 1)
  
  [====|====|====|====|====|====|====|====|====]
   ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
   1    2    3    4    5    6    7    8    9

───────────────────────────────────────────────────────────────────────────────
📋 LOD REQUIREMENTS
───────────────────────────────────────────────────────────────────────────────
  Include in Model:   ✓ YES (≥2" process piping)
  
  Required Metadata:
    □ Name
    □ Line Number
    □ Size (nominal)
    □ Length
    □ Layer
    □ Package Name
  
  📄 Source:      A-7_LOD_Matrix.xlsx
  📍 Sheet:       Process
  📍 Rows:        52-58

───────────────────────────────────────────────────────────────────────────────
🎯 FIELD ACCURACY
───────────────────────────────────────────────────────────────────────────────
  Requirement:    ±1" (standard accuracy)
  
  📄 Source:      BIM_CPEP.pdf
  📍 Section:     8.1.1
  
  Note: If in lateral rack, POC, or tool install → ±1/4" required

───────────────────────────────────────────────────────────────────────────────
🏭 VENDOR PRODUCTS
───────────────────────────────────────────────────────────────────────────────
  ★ George Fischer (Preferred)
    PVC-U Pipe Schedule 80 - 4"
    🔗 Product Page | 📄 Datasheet | 🖼️ Image
    
  Spears Manufacturing
    PVC Schedule 80 Pipe - 4"
    🔗 Product Page | 📄 Datasheet

═══════════════════════════════════════════════════════════════════════════════
```

---

## PROJECT STATUS

### ✅ COMPLETED

| Item | Status |
|------|--------|
| PRD Document | ✅ Complete |
| Tech Stack Selection | ✅ Complete (Next.js, Supabase, Claude, Tavily, Firecrawl) |
| Database Schema | ✅ Complete (all tables designed) |
| Seed Script | ✅ Complete (tolerances, spans, line classes, vendors) |
| A-9 Tolerances Extracted | ✅ Complete with citations |
| 40_05_19.01 Spans Extracted | ✅ Complete with citations |
| A-7 LOD Requirements | ✅ Complete with citations |
| BIM CPEP Field Accuracy | ✅ Complete with citations |
| Project Starter Code | ✅ Complete (downloadable zip) |
| API Keys | ✅ Obtained (Claude, Tavily, Firecrawl) |

### ⏳ IN PROGRESS

| Item | Status |
|------|--------|
| 40_05_19 Support Types | ⏳ Document available, needs processing (68 pages) |
| Support Calculator Tool | ⏳ Waiting for support type data |
| Supabase Connection | ⏳ Ready to configure |

### 📋 NEXT STEPS

1. Process 40_05_19 document for support types
2. Add Support Calculator page to application
3. Configure Supabase database connection
4. Run seed script to populate specs
5. Test full workflow

---

## MEETING TALKING POINTS

### 1. What Problem Are We Solving?
"BIM modelers spend significant time manually looking up specs across multiple documents. PIDFlow automates this by reading P&IDs and automatically pulling tolerances, support spans, and LOD requirements - all with traceable citations."

### 2. How Does It Work?
"Upload a P&ID → AI extracts all line data → System looks up specs from project documents → Every output includes the exact source (document, page, table, row) so modelers know where the information came from."

### 3. What Documents Are We Using?
- **A-9**: Tolerances (how much deviation is allowed)
- **40 05 19.01**: Support spans (max distance between supports)
- **40 05 19**: Support types (what kind of support to use) - being processed
- **A-7**: LOD requirements (what to model, what metadata)
- **BIM CPEP**: Field accuracy requirements

### 4. What's the Key Innovation?
"Every piece of data includes a citation. Instead of 'Max span is 7.1 ft', we say 'Max span is 7.1 ft per 40_05_19.01, Page 4, Table 1.13'. Full traceability."

### 5. Current Status?
"Core framework complete. All spec data extracted and seeded. Working on the Support Calculator tool that lets modelers input pipe properties and get number of supports, type of supports, and all specs with citations."

---

*Document generated for PlansRow/PIDFlow project - January 2025*
