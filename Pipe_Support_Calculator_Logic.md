# PIPE SUPPORT CALCULATOR
## Decision Logic Reference

**Based on Section 40 05 19 - Pipe Supports and Anchors (Rev. 3)**

---

## 1. REQUIRED INPUT PARAMETERS

| Parameter | Options | Affects |
|-----------|---------|---------|
| **Pipe Material** | Carbon Steel, Stainless Steel, Copper, PVC Sch 40, PVC Sch 80, CPVC, PP, PVDF, HDPE | Max span, support types, hardware selection |
| **Pipe Size** | 1/2" to 12"+ (NPS) | Max span, hardware sizing |
| **Service** | Water (liquid) or Vapor | Max span (water = shorter spans) |
| **Temperature** | Ambient to 200°F+ (depends on material) | Max span (higher temp = shorter spans) |
| **Specific Gravity** | 1.0 to 2.0+ | Span correction factor |
| **Pipe Length** | User input (feet) | Number of supports calculation |
| **Orientation** | Horizontal or Vertical | Support type selection |
| **Location** | Subfab rack / EOR rack / Individual run / Utility main | Tolerance requirements |
| **Indoor/Outdoor** | Indoor or Outdoor | Cush-a-Clamp eligibility |
| **Corrosive Area** | Yes or No (per drawing 100AZ0206) | Hardware material requirements |

---

## 2. CALCULATION LOGIC

### Step 1: Look Up Base Max Span
From 40 05 19.01 tables based on **Material + Size + Temperature + Service**

### Step 2: Apply Specific Gravity Correction (if SG > 1.0)
```
Adjusted Span = Base Span × Correction Factor (from 40 05 19.01)
```

### Step 3: Apply Condition Adjustments

| Condition | Adjustment | Source |
|-----------|------------|--------|
| Direction change (metal) | Reduce to 70% of max span OR support within 20% of span from elbow | 40 05 19, App 1 |
| In-line component 10-30% span weight | Reduce to 70% of max span | 40 05 19, App 1 |
| In-line component >30% span weight | Support within 25% of span each side | 40 05 19, App 1 |
| Plastic fittings horizontal plane | Support within 18" of centerline | 40 05 19, 1.5.K |

### Step 4: Calculate Number of Supports
```
Number of Spans = CEILING(Pipe Length ÷ Adjusted Max Span)
Number of Supports = Number of Spans + 1
```

### Step 5: Calculate Guide Spacing
```
Max Guide Spacing = 2 × Max Deadweight Span
```

---

## 3. SUPPORT TYPE DECISION LOGIC

### 3.1 Horizontal Pipe

| Function Needed | Support Type | Conditions |
|-----------------|--------------|------------|
| Vertical only (allow lateral + axial) | **SLIDE** | Expansion loops, seismic interfaces |
| Vertical + lateral (allow axial) | **GUIDE** | Standard mid-run support |
| Full restraint | **ANCHOR** | Mid-run fixed point, near branches |
| Suspension from above | **HANGER** | Standard horizontal support |
| Suspension + lateral restraint | **BRACED HANGER** | When lateral bracing required |

### 3.2 Vertical Pipe (Riser)

| Function Needed | Support Type | Location |
|-----------------|--------------|----------|
| Deadweight support | **RISER CLAMP** | Near top of riser |
| Lateral bracing | **GUIDE** | Every 2× max span |
| Buckling prevention | **GUIDE at closer spacing** | Every 1× max span when >3× span above restraint |

---

## 4. GUIDE DISTANCE FROM ELBOW LOGIC

### 4.1 Metal Pipe Systems

| Run Length (Anchor to Elbow) | Min Distance: Elbow to First Guide |
|-----------------------------|-----------------------------------|
| ≤ 3× max span | ≥ 75% of max span |
| > 3× and ≤ 10× max span | ≥ 1.5× max span |

### 4.2 Plastic Pipe Systems (2" and smaller)

| Run Length (Anchor to Elbow) | Min Distance: Elbow to First Guide |
|-----------------------------|-----------------------------------|
| ≤ 6× max span | ≥ 75% of max span |
| > 6× and ≤ 25× max span (20× for PP) | ≥ 1.5× max span |

### 4.3 Plastic Pipe Systems (larger than 2")

| Run Length (Anchor to Elbow) | Min Distance: Elbow to First Guide |
|-----------------------------|-----------------------------------|
| ≤ 4× max span | ≥ 75% of max span |
| > 4× and ≤ 20× max span (16× for PP) | ≥ 1.5× max span |

---

## 5. AXIAL RESTRAINT (ANCHOR) LOGIC

### 5.1 Primary Method: Single In-Line Anchor
**Preferred location:** Near middle of run (allows thermal expansion both directions)

### 5.2 Alternative: Cush-a-Clamp Multi-Point Anchoring

| Eligibility Check | Requirement |
|-------------------|-------------|
| Location | **INDOOR only** |
| Material | **METAL only** (no plastic) |
| Size | **2" NPS and smaller only** |
| Spacing | Maximum = deadweight span |

### 5.3 Short Run Alternative: Guide as Axial Restraint

For runs ≤ 2× max span (≤ 1× for 4" CS/SS), a guide after 90° elbow provides axial restraint:

| Pipe Type | Size | Guide Location from Elbow |
|-----------|------|--------------------------|
| Metal | ≤ 2" NPS | Within 6× pipe diameter |
| Metal | > 2" NPS | Within 4× pipe diameter |
| Plastic | ≤ 2" NPS | Within 6× pipe diameter |
| Plastic | > 2" NPS | Within 3× pipe diameter |

---

## 6. HARDWARE SELECTION LOGIC

### 6.1 Plastic Pipe Hardware

| Support Type | Acceptable Hardware | Source |
|--------------|---------------------|--------|
| Hanger | GF Stress Less Clevis Hanger Kit, or clevis with neoprene/metal shield wrap | 40 05 19, 2.3.C.2 |
| Slide | GF Stress Less Pipe Slides, or plastic slide plate (PVC indoor, UV UHMW-PE outdoor) | 40 05 19, 2.3.C.3 |
| Guide | GF Stress Less Pipe Guide, or plastic sleeve guide, or pipe strap with wrap | 40 05 19, 2.3.C.4 |
| Anchor | GF Stress Less Clamp Fixpoint Kit, or flange anchor | 40 05 19, 2.3.C.5 |
| Riser Support | GF Stress Less Clamp Fixpoint Kit, or flange support with restraint | 40 05 19, 2.3.C.6 |

### 6.2 Metal Pipe Hardware

Select from Appendix 2 specification sheets by material:
- Carbon Steel Pipe (uninsulated / insulated)
- Stainless Steel Pipe (uninsulated / insulated)
- Stainless Steel Tube (vapor / liquid, insulated / uninsulated)
- Copper Tube (vapor / liquid, insulated / uninsulated)

### 6.3 Corrosive Area Override

**IF location is in corrosive area (per drawing 100AZ0206):**
- NO carbon steel components allowed
- Metal components: Type 316 or 316L stainless steel only
- Contact manufacturer to confirm corrosion-resistant version available

---

## 7. TOLERANCE REQUIREMENTS

| Pipe Location Input | Tolerance | Field Accuracy |
|--------------------|-----------|----------------|
| Subfab lateral rack | **0" (ZERO)** | ±1/4" (critical) |
| EOR engineered rack | 1/2" | ±1/4" (critical) |
| Individual pipe run | 6" | ±1" (standard) |
| Utility main/sub-main | 1" | ±1" (standard) |
| Lateral racks, POC, tool install | Per design | ±1/4" (critical) |

---

## 8. CALCULATOR OUTPUT FORMAT

The calculator should return a JSON object with the following structure:

```json
{
  "input": {
    "material": "PVC Sch 80",
    "size_nps": "2",
    "service": "water",
    "temperature_f": 100,
    "specific_gravity": 1.0,
    "pipe_length_ft": 50,
    "orientation": "horizontal",
    "location": "individual_run",
    "indoor": true,
    "corrosive_area": false
  },
  "calculations": {
    "base_max_span_ft": 5.5,
    "adjusted_max_span_ft": 5.5,
    "guide_spacing_ft": 11.0,
    "number_of_spans": 10,
    "number_of_supports": 11
  },
  "support_types": {
    "deadweight": "hanger",
    "lateral_restraint": "guide",
    "axial_restraint": "anchor"
  },
  "hardware": {
    "hanger": "GF Stress Less Clevis Hanger Kit",
    "guide": "GF Stress Less Pipe Guide",
    "anchor": "GF Stress Less Clamp Fixpoint Kit"
  },
  "tolerance": {
    "placement_tolerance_in": 6,
    "field_accuracy_in": 1
  },
  "citations": {
    "max_span": "40 05 19.01, Table X",
    "guide_spacing": "40 05 19, Appendix 1",
    "hardware": "40 05 19, Appendix 2",
    "tolerance": "A-9 Change Management"
  }
}
```

---

## 9. DECISION FLOWCHART PSEUDOCODE

```
FUNCTION calculatePipeSupport(input):
    
    // Step 1: Get base span
    baseSpan = lookupSpanTable(input.material, input.size, input.temperature, input.service)
    
    // Step 2: Apply SG correction
    IF input.specificGravity > 1.0:
        correctionFactor = lookupSGCorrection(input.specificGravity)
        adjustedSpan = baseSpan * correctionFactor
    ELSE:
        adjustedSpan = baseSpan
    
    // Step 3: Calculate supports
    numberOfSpans = CEILING(input.pipeLength / adjustedSpan)
    numberOfSupports = numberOfSpans + 1
    guideSpacing = adjustedSpan * 2
    
    // Step 4: Determine support types
    IF input.orientation == "horizontal":
        deadweightType = "hanger"
        lateralType = "guide"
        axialType = "anchor"
    ELSE: // vertical
        deadweightType = "riser_clamp"
        lateralType = "guide"
        axialType = determineVerticalAxial(input)
    
    // Step 5: Check Cush-a-Clamp eligibility
    cushAClampEligible = (
        input.indoor == true AND
        isMetal(input.material) AND
        input.size <= 2
    )
    
    // Step 6: Select hardware
    IF isPlastic(input.material):
        hardware = selectPlasticHardware(deadweightType, lateralType, axialType)
    ELSE:
        hardware = selectMetalHardware(input.material, input.insulated)
    
    // Step 7: Override for corrosive areas
    IF input.corrosiveArea:
        hardware = convertToStainless316(hardware)
    
    // Step 8: Get tolerance
    tolerance = lookupTolerance(input.location)
    
    RETURN {
        calculations: { adjustedSpan, guideSpacing, numberOfSupports },
        supportTypes: { deadweightType, lateralType, axialType },
        hardware: hardware,
        tolerance: tolerance,
        cushAClampEligible: cushAClampEligible
    }
```

---

## 10. SPECIAL CASE HANDLERS

### 10.1 3" PPDW Safety Shower Pipe
```
IF input.material == "PPDW" AND input.size == 3:
    baseSpan = 5.0  // Fixed 5-foot span
    // Use standard PPDW-specific guide distance rules from spec
```

### 10.2 4" Carbon Steel / Stainless Steel Lateral Load Limitation
```
IF (input.material == "CS" OR input.material == "SS") AND input.size == 4:
    // Limit short run axial restraint to 1× span (not 2×)
    shortRunLimit = baseSpan * 1  // Instead of baseSpan * 2
```

### 10.3 Branch Piping
```
FUNCTION calculateBranchSupport(branchInput, runInput):
    // Anchor goes on RUN pipe, not branch
    // Support distance from run centerline: 25-100% of branch span (horizontal)
    // Support distance from run centerline: 75-100% of branch span (vertical run)
```

### 10.4 Expansion Loops
```
FUNCTION calculateExpansionLoopSupports(loopConfig):
    // Offset legs: SLIDE supports
    // Connecting leg: GUIDE support
    // Adjacent run: GUIDE supports per standard rules
```

---

## 11. DATA TABLES REQUIRED

To implement this calculator, you need to extract and store these tables from 40 05 19.01:

1. **Span Tables by Material**
   - PVC Schedule 40 (water/vapor, by temperature)
   - PVC Schedule 80 (water/vapor, by temperature)
   - CPVC (water/vapor, by temperature)
   - PP (water/vapor, by temperature)
   - PVDF (water/vapor, by temperature)
   - Carbon Steel (water/vapor, by temperature)
   - Stainless Steel (water/vapor, by temperature)
   - Copper (water/vapor, by temperature)

2. **Specific Gravity Correction Factors**

3. **Hardware Part Numbers** (from Appendix 2)
   - By material category
   - By support function (anchor, guide, slide, hanger, riser)

4. **Assembly Drawing References** (from Appendix 3)
   - A-1, A-2 (Anchors)
   - G-1 through G-4 (Guides)
   - S-1, S-2 (Slides)
   - HGR-1 through HGR-3 (Hangers)
   - BHGR-1 through BHGR-3 (Braced Hangers)
   - R-1 (Riser)

---

*Document Reference: Section 40 05 19 - Pipe Supports and Anchors, Rev. 3 (24 Oct 2024), Project Confluence D3730500*
