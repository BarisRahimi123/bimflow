# BIMFLOW Pipe Support Calculator
## Technical Documentation & Calculation Logic

**Based on Section 40 05 19 - Pipe Supports and Anchors (Rev. 3)**  
**Project Confluence D3730500**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Input Parameters](#2-input-parameters)
3. [Core Calculations](#3-core-calculations)
4. [Advanced Conditions](#4-advanced-conditions)
5. [Support Type Selection](#5-support-type-selection)
6. [Hardware Recommendations](#6-hardware-recommendations)
7. [Tolerance Requirements](#7-tolerance-requirements)
8. [Calculation Examples](#8-calculation-examples)

---

## 1. Overview

The BIMFLOW Pipe Support Calculator automates the complex engineering decisions required for pipe support placement according to industry specifications. It eliminates manual table lookups, reduces human error, and ensures consistent application of support spacing rules.

### What It Does

- **Calculates maximum support spacing** based on pipe material, size, temperature, and service
- **Applies correction factors** for specific gravity and special conditions
- **Determines support types** (hanger, guide, anchor, slide, riser clamp)
- **Recommends hardware** from approved manufacturers
- **Generates support layouts** with exact positions
- **Provides citations** to specification sections for verification

### Specification Compliance

All calculations are based on:
- **40 05 19** - Pipe Supports and Anchors (Rev. 3)
- **40 05 19.01** - Pipe Support Span Tables
- **A-9 Change Management** - Tolerance Requirements

---

## 2. Input Parameters

### 2.1 Pipe Properties

| Parameter | Options | Impact on Calculation |
|-----------|---------|----------------------|
| **Material** | PVC Sch 40/80, CPVC, PP, PVDF, Carbon Steel, Stainless Steel, Copper, Tubing | Determines base span table |
| **Pipe Size** | 1/2" to 12" NPS | Affects max span (larger = longer spans) |
| **Service** | Water (liquid) or Vapor | Water service = shorter spans due to weight |
| **Temperature** | Ambient to max per material | Higher temp = shorter spans (material weakens) |
| **Specific Gravity** | 1.0 to 2.0+ | SG > 1.0 reduces span (heavier fluid) |

### 2.2 Installation Details

| Parameter | Options | Impact on Calculation |
|-----------|---------|----------------------|
| **Pipe Length** | User input (feet) | Determines number of supports needed |
| **Orientation** | Horizontal / Vertical | Changes support type (hanger vs riser clamp) |
| **Mounting Method** | Hanging, Rack, Trapeze, Floor, Wall | Affects hardware selection |
| **Location Type** | Subfab rack, EOR rack, Individual run, Utility main | Determines placement tolerance |

### 2.3 Environment

| Parameter | Options | Impact on Calculation |
|-----------|---------|----------------------|
| **Indoor/Outdoor** | Indoor / Outdoor | Affects Cush-a-Clamp eligibility |
| **Corrosive Area** | Yes / No | Requires Type 316 SS hardware |
| **Insulated** | Yes / No | May affect hardware selection |

---

## 3. Core Calculations

### 3.1 Step 1: Base Span Lookup

The calculator looks up the maximum support span from tables in **40 05 19.01** based on:
- Pipe material
- Pipe size (NPS)
- Service temperature
- Service type (water/vapor)

**Example:** PVC Schedule 80, 2", 100°F, Water Service → **5.5 ft max span**

### 3.2 Step 2: Specific Gravity Correction

If the fluid specific gravity is greater than 1.0, the span is reduced:

```
Adjusted Span = Base Span × Correction Factor
```

| Specific Gravity | Correction Factor |
|------------------|-------------------|
| 1.0 | 1.00 (no change) |
| 1.1 | 0.97 |
| 1.2 | 0.94 |
| 1.3 | 0.91 |
| 1.4 | 0.88 |
| 1.5 | 0.85 |
| 2.0 | 0.75 |

**Source:** 40 05 19.01, SG Correction Tables

### 3.3 Step 3: Calculate Number of Supports

```
Number of Spans = CEILING(Pipe Length ÷ Adjusted Max Span)
Number of Supports = Number of Spans + 1
```

**Example:** 50 ft pipe with 5.5 ft max span:
- Spans = CEILING(50 ÷ 5.5) = CEILING(9.09) = 10 spans
- Supports = 10 + 1 = **11 supports**

### 3.4 Step 4: Calculate Guide Spacing

Guides provide lateral restraint and are spaced at twice the deadweight span:

```
Guide Spacing = 2 × Max Deadweight Span
```

**Example:** 5.5 ft max span → Guide spacing = **11 ft**

**Source:** 40 05 19, Appendix 1

---

## 4. Advanced Conditions

### 4.1 Direction Change (Elbow) - Metal Pipe

**When:** User checks "Has Direction Change (Elbow)" for metal pipe

**Calculation:**
```
Adjusted Span = Base Span × 0.70 (70% reduction)
```

**Why:** Elbows create stress concentrations. Reducing span ensures adequate support near fittings.

**Source:** 40 05 19, Appendix 1

---

### 4.2 Guide Distance from Elbow (Thermal Expansion)

**When:** User enters "Anchor to Elbow Distance"

**Purpose:** Determines minimum distance from elbow to first guide to allow thermal expansion flexibility.

#### Metal Pipe Rules

| Run Length (Anchor to Elbow) | Min Distance: Elbow to First Guide |
|-----------------------------|-----------------------------------|
| ≤ 3× max span | ≥ 75% of max span |
| > 3× max span | ≥ 1.5× max span |

#### Plastic Pipe ≤2" Rules

| Run Length (Anchor to Elbow) | Min Distance: Elbow to First Guide |
|-----------------------------|-----------------------------------|
| ≤ 6× max span | ≥ 75% of max span |
| > 6× max span | ≥ 1.5× max span |

#### Plastic Pipe >2" Rules

| Run Length (Anchor to Elbow) | Min Distance: Elbow to First Guide |
|-----------------------------|-----------------------------------|
| ≤ 4× max span | ≥ 75% of max span |
| > 4× max span | ≥ 1.5× max span |

**Example:** Metal pipe, 5 ft max span, anchor to elbow = 20 ft
- Run length = 20 ÷ 5 = 4× max span (> 3×)
- Min guide distance = 1.5 × 5 = **7.5 ft from elbow**

**Source:** 40 05 19, Part 3.2

---

### 4.3 Continuation from Vertical Riser

**When:** User checks "Continues from Vertical Riser" and enters "Riser Length"

**Purpose:** Determines first support distance after horizontal pipe transitions from a vertical riser.

#### Metal Pipe Rules

| Riser Length | Min Distance from Elbow |
|--------------|------------------------|
| ≤ 3× max span | ≥ 75% of max span |
| 3-5× max span | ≥ 90% of max span |
| > 5× max span | ≥ 90% of max span |

#### Plastic Pipe ≤2" Rules

| Riser Length | Min Distance from Elbow |
|--------------|------------------------|
| ≤ 6× max span | ≥ 75% of max span |
| 6-10× max span | ≥ 90% of max span |
| > 10× max span | ≥ 90% of max span |

#### Plastic Pipe >2" Rules

| Riser Length | Min Distance from Elbow |
|--------------|------------------------|
| ≤ 4× max span | ≥ 75% of max span |
| 4-7× max span | ≥ 90% of max span |
| > 7× max span | ≥ 90% of max span |

**Source:** 40 05 19, Part 4.4

---

### 4.4 In-Line Components (Valves, Strainers, etc.)

**When:** User checks "Has In-Line Component" and selects weight category

#### Light Component (<10% of span weight)
- **Action:** No span reduction
- **Note:** Standard support spacing applies

#### Medium Component (10-30% of span weight)
- **Action:** Reduce span to 70%
```
Adjusted Span = Base Span × 0.70
```

#### Heavy Component (>30% of span weight)
- **Action:** Support within 25% of span on each side of component
```
Support Distance = Max Span × 0.25
```
- Place one support within this distance BEFORE the component
- Place one support within this distance AFTER the component

**Source:** 40 05 19, Appendix 1

---

### 4.5 Flexible Coupling

**When:** User checks "Has Flexible Coupling"

**Requirements:**
1. Support piping **independently on BOTH sides** of coupling
2. **Tie-rods are REQUIRED**

**Why:** Flexible couplings cannot transfer loads between pipe sections. Each side must be self-supporting.

**Source:** 40 05 19, Section 1.5.G

---

### 4.6 Equipment Connection

**When:** User checks "Equipment Connection"

**Rule:** **NO ANCHOR** on the connection run

**Why:** Equipment connections must allow thermal movement and vibration isolation. An anchor would transmit forces to the equipment.

**Action:**
- Calculator sets axial restraint = none for this run
- Warning provided: "Anchor must be placed elsewhere in the system"

**Source:** 40 05 19, Section 6.3

---

### 4.7 Expansion Loop

**When:** User checks "Part of Expansion Loop" and selects leg type

#### Offset Leg
- **Support Type:** SLIDE
- **Reason:** Offset legs must allow lateral AND axial movement to absorb thermal expansion

#### Connecting Leg
- **Support Type:** GUIDE
- **Reason:** Connecting leg needs lateral control but allows axial movement

**Source:** 40 05 19, Part 6.1

---

### 4.8 Seismic Movement Interface

**When:** User checks "Seismic Movement Interface"

**Support Type:** SLIDE at the interface

**Additional Rule:** Maintain 1.5× max span between guides adjacent to the slide

**Why:** Seismic interfaces require freedom of movement in multiple directions.

**Source:** 40 05 19, Part 6.5

---

### 4.9 Branch Piping

**When:** User checks "Branch Pipe" and enters "Distance from Run Anchor"

**Rules:**
1. **Anchor goes on RUN pipe**, not on branch
2. First branch support location depends on distance from run anchor

#### Metal Pipe Branch Guide Location

| Distance from Run Anchor | Min Guide Distance from Run |
|--------------------------|----------------------------|
| ≤ 2× run span | ≥ 75% of branch span |
| > 2× run span | ≥ 1.5× branch span |

#### Plastic Pipe Branch Guide Location

| Distance from Run Anchor | Min Guide Distance from Run |
|--------------------------|----------------------------|
| ≤ 3× run span | ≥ 75% of branch span |
| > 3× run span | ≥ 1.5× branch span |

**Source:** 40 05 19, Part 5.3

---

### 4.10 Double-Wall Piping

**When:** User checks "Double-Wall Piping" and enters carrier pipe temperature

**Rule:** 
- Support based on **containment (outer) pipe material**
- Use **carrier (inner) pipe temperature** for span lookup

**Why:** The outer pipe carries the structural load, but the inner pipe temperature affects material properties.

**Source:** 40 05 19, Part 6.2

---

### 4.11 3" PPDW Safety Shower

**When:** User checks "3" PPDW Safety Shower" (with 3" pipe size)

**Rule:** Fixed **5-foot maximum span** regardless of other factors

**Why:** Safety shower piping has special requirements for reliability.

**Source:** 40 05 19, Part 6.4

---

### 4.12 Short Run Anchor Alternative

**When:** Pipe length ≤ 2× max span (or ≤ 1× for 4" CS/SS)

**Alternative:** A guide placed close to a 90° elbow can serve as axial restraint instead of a traditional anchor.

#### Guide Location from Elbow

| Pipe Type | Size | Max Distance from Elbow |
|-----------|------|------------------------|
| Metal | ≤ 2" NPS | 6× pipe diameter |
| Metal | > 2" NPS | 4× pipe diameter |
| Plastic | ≤ 2" NPS | 6× pipe diameter |
| Plastic | > 2" NPS | 3× pipe diameter |

**Example:** 2" metal pipe (2" OD)
- Max distance = 6 × 2" = 12" = **1 ft from elbow**

**Source:** 40 05 19, Part 3.3

---

### 4.13 Cush-a-Clamp Eligibility

**Alternative anchoring method** using friction clamps at closer spacing.

#### Eligibility Requirements (ALL must be met)

| Requirement | Value |
|-------------|-------|
| Location | **Indoor only** |
| Material | **Metal only** (no plastic) |
| Size | **≤ 2" NPS** |
| Mounting | Not rack-mounted |

#### Spacing Rule
```
Cush-a-Clamp Spacing = 1× Max Deadweight Span (NOT 2×)
```

**Why:** Friction anchoring distributes load across multiple points instead of single anchor.

**Source:** 40 05 19, Part 3.3

---

### 4.14 Long Vertical Riser (Buckling Prevention)

**When:** Vertical pipe length > 3× max span

**Rule:** Reduce guide spacing to **1× max span** (instead of 2×)

**Why:** Long vertical pipes are susceptible to buckling under their own weight. Closer guide spacing prevents lateral deflection.

**Source:** 40 05 19, Part 4.2

---

### 4.15 4" Carbon Steel / Stainless Steel Limitation

**When:** 4" CS or SS pipe

**Rule:** Short run axial restraint limited to **1× span** (not 2×)

**Why:** Larger diameter metal pipe has different flexibility characteristics.

**Source:** 40 05 19

---

### 4.16 Plastic Fitting Support

**When:** Plastic pipe with direction change (elbow)

**Rule:** Support plastic fitting within **18 inches** of fitting centerline

**Why:** Plastic fittings cannot carry bending loads. Close support prevents stress on the fitting.

**Source:** 40 05 19, Section 1.5.K

---

### 4.17 SS/Copper Dielectric Insulation

**When:** Stainless steel or copper pipe

**Rule:** Must be **dielectrically insulated** from carbon steel supports

**Why:** Prevents galvanic corrosion between dissimilar metals.

**Source:** 40 05 19, Part 7.2

---

## 5. Support Type Selection

### 5.1 Horizontal Pipe

| Support Function | Type | When to Use |
|-----------------|------|-------------|
| Deadweight only | **HANGER** | Standard horizontal support |
| Deadweight + lateral | **GUIDE** | Mid-run lateral control |
| Deadweight + lateral + axial | **ANCHOR** | Fixed point, thermal expansion reference |
| Vertical only (free lateral/axial) | **SLIDE** | Expansion loops, seismic interfaces |
| Deadweight + lateral (from above) | **BRACED HANGER** | When lateral bracing required from hanger |

### 5.2 Vertical Pipe (Riser)

| Support Function | Type | Location |
|-----------------|------|----------|
| Deadweight | **RISER CLAMP** | Near TOP of riser |
| Lateral restraint | **GUIDE** | Every 2× max span (or 1× for long risers) |

---

## 6. Hardware Recommendations

### 6.1 Plastic Pipe Hardware

| Support Type | Recommended Product | Source |
|--------------|---------------------|--------|
| Hanger | GF Stress Less Clevis Hanger Kit | 40 05 19, 2.3.C.2 |
| Guide | GF Stress Less Pipe Guide | 40 05 19, 2.3.C.4 |
| Anchor | GF Stress Less Clamp Fixpoint Kit | 40 05 19, 2.3.C.5 |
| Slide | GF Stress Less Pipe Slides | 40 05 19, 2.3.C.3 |
| Riser Support | GF Stress Less Clamp Fixpoint Kit | 40 05 19, 2.3.C.6 |

**Important:** No metal in direct contact with plastic pipe

### 6.2 Metal Pipe Hardware

| Support Type | Recommended Product |
|--------------|---------------------|
| Hanger | Clevis Hanger (Anvil / Cooper B-Line) |
| Guide | Pipe Guide (Anvil / Cooper B-Line) |
| Anchor | Pipe Anchor or Cush-a-Clamp |
| Slide | Slide Plate Assembly |
| Riser Clamp | Riser Clamp (Anvil / Cooper B-Line) |

### 6.3 Corrosive Area Override

**When in corrosive area (per drawing 100AZ0206):**
- NO carbon steel components
- All metal must be **Type 316 or 316L Stainless Steel**

---

## 7. Tolerance Requirements

| Pipe Location | Placement Tolerance | Field Accuracy | Critical? |
|---------------|--------------------| ---------------|-----------|
| Subfab lateral rack | **0"** (ZERO) | ±1/4" | YES |
| EOR engineered rack | 1/2" | ±1/4" | YES |
| Individual pipe run | 6" | ±1" | NO |
| Utility main/sub-main | 1" | ±1" | NO |
| Lateral rack / POC / Tool | Per design | ±1/4" | YES |

**Source:** A-9 Change Management

---

## 8. Calculation Examples

### Example 1: Basic Horizontal Pipe

**Input:**
- Material: PVC Schedule 80
- Size: 2"
- Service: Water
- Temperature: 100°F
- Specific Gravity: 1.0
- Length: 50 ft
- Location: Individual run

**Calculation:**
1. Base span lookup: 5.5 ft (from 40 05 19.01)
2. SG correction: None (SG = 1.0)
3. Adjusted span: 5.5 ft
4. Number of spans: CEILING(50 ÷ 5.5) = 10
5. Number of supports: 10 + 1 = 11
6. Guide spacing: 5.5 × 2 = 11 ft

**Result:**
- 11 supports at ~5 ft intervals
- Guides at ~11 ft intervals
- 1 anchor (mid-run)
- Tolerance: 6"

---

### Example 2: Metal Pipe with Elbow

**Input:**
- Material: Carbon Steel
- Size: 4"
- Service: Water
- Temperature: 150°F
- Length: 30 ft
- Has Elbow: Yes
- Anchor to Elbow: 25 ft

**Calculation:**
1. Base span lookup: 15 ft
2. Elbow reduction: 15 × 0.70 = 10.5 ft
3. Run length ratio: 25 ÷ 10.5 = 2.4× (≤ 3×)
4. Guide from elbow: 10.5 × 0.75 = 7.9 ft minimum

**Result:**
- Max span: 10.5 ft (reduced for elbow)
- Guide placed ≥ 7.9 ft from elbow
- Warning: "4" CS/SS - short run limited to 1× span"

---

### Example 3: Equipment Connection with Heavy Component

**Input:**
- Material: Stainless Steel
- Size: 3"
- Length: 20 ft
- Equipment Connection: Yes
- Has In-Line Component: Yes (Heavy)

**Calculation:**
1. Base span: 12 ft
2. Equipment connection: No anchor on this run
3. Heavy component: Support within 25% of span = 3 ft each side
4. Result: Supports at 3 ft before and after component

**Result:**
- No anchor on run (equipment connection rule)
- Warning: "Anchor required elsewhere in system"
- Warning: "Heavy component - support within 3 ft each side"
- SS pipe: "Must be dielectrically insulated from CS supports"

---

### Example 4: Expansion Loop Offset Leg

**Input:**
- Material: PP (Polypropylene)
- Size: 2"
- Length: 15 ft
- Part of Expansion Loop: Yes
- Leg Type: Offset

**Calculation:**
1. Base span: 4 ft (PP at temperature)
2. Expansion loop offset leg: Use SLIDE supports
3. No anchor on offset leg

**Result:**
- Support type: SLIDE (allows lateral + axial movement)
- No anchor (expansion loop rule)
- Guide spacing: 8 ft (2× span for lateral control where applicable)

---

## Document Information

| Item | Value |
|------|-------|
| **Software** | BIMFLOW Pipe Support Calculator |
| **Specification Base** | 40 05 19 - Pipe Supports and Anchors, Rev. 3 |
| **Date** | October 24, 2024 |
| **Project Reference** | Confluence D3730500 |

---

*This documentation is for reference purposes. Always verify calculations against current project specifications and consult with the engineer of record for final approval.*
