# PROJECT CONFLUENCE
## BIM EXECUTION MANUAL
### Training Version for BIM Modelers

**Document D3730500 | January 2026**

Integrating:
- Section 40 05 19 - Pipe Supports and Anchors (Rev. 3)
- Section 40 05 19.01 - Pipe Support Span Tables
- A-9 Change Management - Tolerances

---

# PART 1: INTRODUCTION

This manual explains the key BIM requirements and pipe support specifications for Project Confluence. It is written in plain language so new team members can quickly understand what is required.

## 1.1 Document Overview

The following specification documents govern pipe support design and installation:

| Document | What It Contains | When You Use It |
|----------|------------------|-----------------|
| 40 05 19 - Pipe Supports and Anchors | Support types, hardware specs, location guidance, assembly drawings | Selecting support types, placing anchors/guides |
| 40 05 19.01 - Pipe Support Span Tables | Maximum spacing between supports by material/size/temperature | Calculating how many supports you need |
| A-9 Change Management | Tolerance requirements by pipe location | Knowing how precise your placement must be |
| BIM CPEP | File naming, coordination workflow, accuracy requirements | Setting up projects, coordinating with other trades |

## 1.2 Who Does What

Understanding responsibilities is critical:

- **A/E (Architect/Engineer):** Designs pipe attachment hardware for stress-engineered systems
- **Contractor:** Designs pipe attachment hardware for NON-stress-engineered systems
- **BIM Modeler:** Models supports according to these specifications with correct types and spacing

---

# PART 2: PIPE SUPPORT TYPES

Understanding the four main support types is essential for correct modeling:

## 2.1 Support Type Definitions

| Type | What It Does | Movement Allowed | When To Use |
|------|--------------|------------------|-------------|
| **SLIDE** | Provides vertical restraint only | Allows lateral AND axial movement | Expansion loops, where pipe needs to move freely |
| **GUIDE** | Provides vertical + lateral restraint | Allows axial movement only | Most horizontal runs, prevents side-to-side movement |
| **ANCHOR** | Provides full restraint (vertical + lateral + axial) | NO movement allowed | Mid-run restraint points, prevents all pipe movement |
| **HANGER** | Suspends pipe from above | Depends on type (regular vs braced) | Horizontal pipe hung from structure above |

## 2.2 Support Selection by Orientation

### Horizontal Pipe Supports
- **HANGERS:** Standard choice for horizontal pipe - suspends from structure above
- **BRACED HANGERS:** Hangers with lateral bracing for additional restraint
- **GUIDES:** Control lateral movement while allowing thermal expansion
- **ANCHORS:** Fixed points that prevent all movement - place mid-run

### Vertical Pipe (Riser) Supports
- **RISER CLAMP:** Primary deadweight support - typically placed near top of riser
- **GUIDES:** Brace vertical pipe at intervals to prevent buckling
- **Maximum guide spacing:** 2× the maximum deadweight span

---

# PART 3: SUPPORT SPACING RULES

## 3.1 Maximum Deadweight Support Spans

Support spacing depends on pipe material, size, temperature, and service. Get exact values from Section 40 05 19.01 tables. Here are the key principles:

### Basic Rules
- Smaller pipe = closer supports
- Higher temperature = closer supports
- Water service = closer supports than vapor service
- Heavier fluid (higher specific gravity) = closer supports

### Span Reduction Rules

| Condition | Span Adjustment | Reference |
|-----------|-----------------|-----------|
| Direction change (metal systems) | Limit to 70% of max span UNLESS support within 20% of span from elbow | 40 05 19, Appendix 1 |
| In-line component 10-30% of span weight | Limit to 70% of max span | 40 05 19, Appendix 1 |
| In-line component >30% of span weight | Support within 25% of max span from each side of component | 40 05 19, Appendix 1 |
| Plastic elbows/tees in horizontal plane | Support within 18 inches of fitting centerline | 40 05 19, Section 1.5.K |

## 3.2 Guide Spacing

Guides prevent lateral movement while allowing thermal expansion. Key rule:

**Maximum guide spacing = 2× the maximum deadweight span**

### Guide Distance from Elbows

The first guide after an elbow must be placed to allow flexibility for thermal expansion:

| System Type | Run Length from Anchor to Elbow | Min Distance: Elbow to First Guide |
|-------------|--------------------------------|-----------------------------------|
| Metal pipe | Up to 3× max span | ≥75% of max span |
| Metal pipe | 3× to 10× max span | ≥1.5× max span |
| Plastic pipe (2" and smaller) | Up to 6× max span | ≥75% of max span |
| Plastic pipe (2" and smaller) | 6× to 25× max span | ≥1.5× max span |
| Plastic pipe (larger than 2") | Up to 4× max span | ≥75% of max span |
| Plastic pipe (larger than 2") | 4× to 20× max span | ≥1.5× max span |

## 3.3 Anchor Placement

Anchors provide full restraint and are critical control points:

### Preferred Anchor Location
- Single in-line anchor near the **MIDDLE** of the run (preferred method)
- This allows thermal expansion in both directions

### Alternative: Multi-Point Anchors (Cush-a-Clamp)
- Only allowed on **indoor** metal systems **2" NPS and smaller**
- Maximum spacing: same as deadweight span
- **NOT allowed on plastic pipe** (compressive load causes stress)

### Short Run Alternative

For short runs (up to 2× max span), a guide after a 90-degree elbow can provide axial restraint:

| Pipe Type/Size | Guide Location from Elbow |
|----------------|--------------------------|
| Metal, up to 2" NPS | Within 6× pipe diameter |
| Metal, larger than 2" NPS | Within 4× pipe diameter |
| Plastic, up to 2" NPS | Within 6× pipe diameter |
| Plastic, larger than 2" NPS | Within 3× pipe diameter |

---

# PART 4: VERTICAL PIPE (RISER) RULES

## 4.1 Basic Riser Support
- Provide **ONE** rigid vertical support near the **TOP** of the riser
- Add guides at maximum spacing of 2× the deadweight span
- For metal indoor systems 2" and smaller: Cush-a-Clamp can provide both support and guiding

## 4.2 Buckling Prevention

**For long risers, reduce guide spacing to prevent buckling:**

- If run length above restraint point exceeds 3× max span:
  - Reduce guide spacing to **1× max span** (not 2×) above the restraint point
  - Continue until remaining length is less than 3× span

## 4.3 Short Riser Rule

Risers up to 1× max span in length can be supported from adjacent horizontal piping:

| Pipe Type/Size | Vertical Support Location |
|----------------|--------------------------|
| Metal, up to 2" NPS | Within 6× pipe diameter from elbow |
| Metal, larger than 2" NPS | Within 4× pipe diameter from elbow |
| Plastic, up to 2" NPS | Within 6× pipe diameter from elbow |
| Plastic, larger than 2" NPS | Within 3× pipe diameter from elbow |

## 4.4 Continuation Piping Flexibility

The first support on horizontal pipe continuing from a riser must allow for thermal expansion:

| System Type | Riser Length | Min Distance: Elbow to First Support |
|-------------|--------------|-------------------------------------|
| Metal | Up to 3× max span | ≥75% of max span |
| Metal | 3× to 5× max span | ≥90% of max span |
| Plastic (2" and smaller) | Up to 6× max span | ≥75% of max span |
| Plastic (2" and smaller) | 6× to 10× max span | ≥90% of max span |
| Plastic (larger than 2") | Up to 4× max span | ≥75% of max span |
| Plastic (larger than 2") | 4× to 7× max span | ≥90% of max span |

---

# PART 5: BRANCH PIPING RULES

## 5.1 Horizontal Branch from Horizontal Run
- Support the branch at **25% to 100%** of branch max span from run centerline
- Do **NOT** place an anchor on the branch - use guide/anchor on run pipe near branch

## 5.2 Horizontal Branch from Vertical Run
- Support the branch at **75% to 100%** of max span from run centerline

## 5.3 Branch Guide Location

First guide on branch must provide flexibility for thermal expansion:

| System | Branch Location from Run Anchor | First Guide from Run Centerline |
|--------|--------------------------------|--------------------------------|
| Metal | Up to 2× run max span | At least 75% of branch max span |
| Metal | 2× to 8× run max span | At least 1.5× branch max span |
| Plastic | Up to 3× run max span | At least 75% of branch max span |
| Plastic | 3× to 12× run max span | At least 1.5× branch max span |

---

# PART 6: SPECIAL CONFIGURATIONS

## 6.1 Expansion Loops
- Provide **SLIDE** supports on offset legs (allows movement)
- Provide **GUIDE** on connecting leg (controls direction)

## 6.2 Flexible Couplings

**Critical safety requirement:**
- Support piping **INDEPENDENTLY** on both sides of the coupling
- Design so coupling failure does not cause pipe to fall or pose risk
- Tie-rods are required

## 6.3 Equipment Connections
- Do **NOT** place anchors on the connection run
- Provide flexibility offsets to accommodate equipment movement
- Support pipe independently from equipment

## 6.4 Secondary Containment (Double-Wall) Piping
- Support based on **CONTAINMENT** pipe material
- Use operating temperature of **CARRIER** pipe for span determination
- 3" PPDW safety shower pipe: **5-foot maximum span**

## 6.5 Seismic Movement Interfaces
- Provide **SLIDE** support where seismic movement must be accommodated
- Maintain 1.5× max span between guides adjacent to slide

---

# PART 7: MATERIAL-SPECIFIC REQUIREMENTS

## 7.1 Plastic Pipe Special Rules

Plastic pipe requires extra care due to material properties:

- **NO FRICTION ANCHORS** (Cush-a-Clamp, etc.) - compressive load damages plastic
- No metal in direct contact with pipe - use GF Stress Less or protective wrap
- Support fittings within 18" of centerline
- Support metal valves independently from plastic pipe
- Provide anchor in each long run per manufacturer recommendations

## 7.2 Stainless Steel and Copper Pipe
- Must be dielectrically insulated from carbon steel supports
- Integral attachments (trunnions, shear lugs) must be compatible material

## 7.3 Corrosive Areas

Supports in designated corrosive areas (per drawing 100AZ0206):
- No carbon steel allowed
- Use Type 316 or 316L stainless steel for metal components
- Plastic components must be rated for corrosive environment

---

# PART 8: PLACEMENT TOLERANCES

Tolerance requirements vary by pipe location. This determines how precise your support placement must be:

| Pipe Location | Tolerance | Accuracy Required | Source |
|---------------|-----------|-------------------|--------|
| Subfab lateral racks | **0" (ZERO)** | Exact - no deviation allowed | A-9, Page 5 |
| EOR engineered racks | 1/2" | Very tight tolerance | A-9, Page 5 |
| Individual pipe runs (not in rack) | 6" | Standard tolerance | A-9, Page 5 |
| Utility mains and sub-mains | 1" | Moderate tolerance | A-9, Page 5 |
| General field accuracy | ±1" | Standard | BIM CPEP |
| Lateral racks, POC, tool install | ±1/4" | Critical areas | BIM CPEP |

**IMPORTANT: Zero tolerance in subfab lateral racks means supports must be placed EXACTLY as designed.**

---

# PART 9: APPROVED MANUFACTURERS

## 9.1 Pipe Attachment Hardware

| Manufacturer | Notes |
|--------------|-------|
| Pipe Shields Inc. | Non-FM listed - NOT for fire protection |
| Anvil | Full approval |
| Rilco | Non-FM listed - NOT for fire protection |
| PHD Manufacturing | Excluding strut-based components |
| Cooper B-Line | Excluding strut-based components |
| Carpenter & Patterson | Full approval |
| Georg Fischer | Full approval - preferred for plastic pipe |
| ISAT (International Seismic Application Technology) | Full approval |

## 9.2 Pre-Insulated Pipe Supports
- Rilco
- Bergen Pre-Insulated Pipe Supports, Inc.
- Pipe Shields Inc.
- National Pipe Hanger Corporation
- ISAT
- Carpenter & Patterson

## 9.3 Key Products by Application

| Application | Recommended Product | Part Number |
|-------------|---------------------|-------------|
| Plastic pipe hangers | GF Stress Less Pipe Guide - Clevis Hanger Kit | See Appendix 2 |
| Plastic pipe guides | GF Stress Less Pipe Guide | See Appendix 2 |
| Plastic pipe anchors | GF Stress Less Clamp Fixpoint Kit | See Appendix 2 |
| Metal small pipe multi-anchor | Unistrut Cush-a-Clamp or Cooper B-Line B2400 | Indoor 2" and smaller only |

---

# PART 10: BIM MODELING CHECKLISTS

## 10.1 Pre-Modeling Checklist

- [ ] Confirm pipe material (CS, SS, copper, PVC, CPVC, PP, PVDF)
- [ ] Confirm pipe size (NPS)
- [ ] Confirm service (water/vapor)
- [ ] Confirm operating temperature
- [ ] Confirm specific gravity if >1.0
- [ ] Identify pipe location (subfab rack, EOR rack, individual run, utility main)
- [ ] Check if system requires pipe stress engineering (A/E designs) or not (Contractor designs)
- [ ] Check if pipe is in corrosive area (drawing 100AZ0206)

## 10.2 Support Spacing Checklist

- [ ] Look up maximum span in 40 05 19.01 tables for your material/size/temperature/service
- [ ] Apply span reduction if in-line components or direction changes present
- [ ] Calculate guide spacing (2× deadweight span)
- [ ] Verify anchor placement (prefer mid-run)
- [ ] Check first guide distance from elbows meets flexibility requirements

## 10.3 Support Type Selection Checklist

- [ ] Horizontal pipe: Select HANGER, BRACED HANGER, or SLIDE per requirements
- [ ] Vertical pipe: Select RISER CLAMP near top, GUIDES at intervals
- [ ] Plastic pipe: Confirm no friction anchors, no metal contact
- [ ] Corrosive areas: Confirm 316/316L SS hardware
- [ ] Verify hardware from approved manufacturer list

## 10.4 Special Conditions Checklist

- [ ] Branch piping: Support location and anchor on run (not branch)
- [ ] Expansion loops: Slides on offset legs, guide on connecting leg
- [ ] Flexible couplings: Independent support both sides, tie-rods
- [ ] Equipment connections: No anchors on connection run
- [ ] Valves on plastic pipe: Independent support

## 10.5 QA/QC Checklist

- [ ] All supports within maximum span limits
- [ ] Guides provide flexibility for thermal expansion
- [ ] Anchors placed appropriately (mid-run preferred)
- [ ] Hardware from approved manufacturers
- [ ] Placement within tolerance for location type
- [ ] No interference with other trades
- [ ] Assembly matches Appendix 3 drawings

---

# APPENDIX A: QUICK REFERENCE TABLES

## A.1 Support Function Summary

| Support Type | Vertical Restraint | Lateral Restraint | Axial Restraint |
|--------------|-------------------|-------------------|-----------------|
| Slide | YES | NO | NO |
| Guide | YES | YES | NO |
| Anchor | YES | YES | YES |
| Hanger | YES | NO | NO |
| Braced Hanger | YES | YES | Depends on config |

## A.2 Assembly Drawing Reference

| Drawing | Description | Application |
|---------|-------------|-------------|
| A-1, A-2 | Anchor assemblies | Full restraint points |
| G-1, G-2, G-3, G-4 | Guide assemblies | Lateral restraint with axial movement |
| S-1, S-2 | Slide assemblies | Vertical support only |
| HGR-1, HGR-2, HGR-3 | Hanger assemblies | Horizontal pipe from above |
| BHGR-1, BHGR-2, BHGR-3 | Braced hanger assemblies | Horizontal pipe with lateral restraint |
| R-1 | Riser support assembly | Vertical pipe deadweight support |

## A.3 Cush-a-Clamp Limitations

Cush-a-Clamp (and similar friction anchors) can **ONLY** be used:
- Indoor installations only
- Metal systems only (NO PLASTIC)
- 2" NPS and smaller only
- Maximum spacing: 1× deadweight span

---

*Document prepared using specifications from Project Confluence D3730500, Section 40 05 19 Rev. 3 (24 Oct 2024)*
