// Main Pipe Support Calculator Engine
// Based on Section 40 05 19 - Pipe Supports and Anchors (Rev. 3)

import {
  CalculatorInput,
  CalculatorOutput,
  Citation,
  HardwareRecommendation,
  SupportType,
  isPlasticMaterial,
  isMetalMaterial,
  parsePipeSize,
} from './types';
import { lookupSpan, lookupSGCorrection } from './span-data';

// Location tolerance data
const LOCATION_TOLERANCES: Record<string, { tolerance: number | 'per_design'; accuracy: string; critical: boolean }> = {
  subfab_rack: { tolerance: 0, accuracy: '±1/4"', critical: true },
  eor_rack: { tolerance: 0.5, accuracy: '±1/4"', critical: true },
  individual_run: { tolerance: 6, accuracy: '±1"', critical: false },
  utility_main: { tolerance: 1, accuracy: '±1"', critical: false },
  lateral_rack_poc: { tolerance: 'per_design', accuracy: '±1/4"', critical: true },
};

// ============================================================================
// GUIDE DISTANCE FROM ELBOW - Thermal Expansion Rules (40 05 19, Part 3.2)
// ============================================================================

interface GuideFromElbowResult {
  minDistance: number;
  rule: string;
  citation: Citation;
}

function calculateGuideFromElbow(
  maxSpan: number,
  anchorToElbowDistance: number,
  isPlastic: boolean,
  pipeSize: number,
  material?: string
): GuideFromElbowResult {
  const runLengthMultiple = anchorToElbowDistance / maxSpan;
  const isPP = material === 'PP';
  
  if (!isPlastic) {
    // METAL PIPE RULES
    if (runLengthMultiple <= 3) {
      return {
        minDistance: maxSpan * 0.75,
        rule: `Run ≤3× span (${runLengthMultiple.toFixed(1)}×): Guide ≥75% of max span`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: 'Metal Guide Distance' }
      };
    } else if (runLengthMultiple <= 10) {
      return {
        minDistance: maxSpan * 1.5,
        rule: `Run 3-10× span (${runLengthMultiple.toFixed(1)}×): Guide ≥1.5× max span`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: 'Metal Guide Distance' }
      };
    } else {
      return {
        minDistance: maxSpan * 1.5,
        rule: `Run >10× span (${runLengthMultiple.toFixed(1)}×): Guide ≥1.5× max span (max rule)`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: 'Metal Guide Distance' }
      };
    }
  } else if (pipeSize <= 2) {
    // PLASTIC PIPE ≤2" RULES - PP upper limit is 20×, others 25×
    const upperLimit = isPP ? 20 : 25;
    if (runLengthMultiple <= 6) {
      return {
        minDistance: maxSpan * 0.75,
        rule: `Plastic ≤2", run ≤6× span (${runLengthMultiple.toFixed(1)}×): Guide ≥75% of max span`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: 'Plastic ≤2" Guide Distance' }
      };
    } else if (runLengthMultiple <= upperLimit) {
      return {
        minDistance: maxSpan * 1.5,
        rule: `Plastic ≤2", run 6-${upperLimit}× span (${runLengthMultiple.toFixed(1)}×): Guide ≥1.5× max span`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: `Plastic ≤2" Guide Distance${isPP ? ' (PP limit)' : ''}` }
      };
    } else {
      return {
        minDistance: maxSpan * 1.5,
        rule: `Plastic ≤2"${isPP ? ' PP' : ''}, run >${upperLimit}× span (${runLengthMultiple.toFixed(1)}×): EXCEEDS SPEC LIMIT - Guide ≥1.5× max span applied`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: `Plastic ≤2" Guide Distance${isPP ? ' (PP limit)' : ''}` }
      };
    }
  } else {
    // PLASTIC PIPE >2" RULES - PP upper limit is 16×, others 20×
    const upperLimit = isPP ? 16 : 20;
    if (runLengthMultiple <= 4) {
      return {
        minDistance: maxSpan * 0.75,
        rule: `Plastic >2", run ≤4× span (${runLengthMultiple.toFixed(1)}×): Guide ≥75% of max span`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: 'Plastic >2" Guide Distance' }
      };
    } else if (runLengthMultiple <= upperLimit) {
      return {
        minDistance: maxSpan * 1.5,
        rule: `Plastic >2", run 4-${upperLimit}× span (${runLengthMultiple.toFixed(1)}×): Guide ≥1.5× max span`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: `Plastic >2" Guide Distance${isPP ? ' (PP limit)' : ''}` }
      };
    } else {
      return {
        minDistance: maxSpan * 1.5,
        rule: `Plastic >2"${isPP ? ' PP' : ''}, run >${upperLimit}× span (${runLengthMultiple.toFixed(1)}×): EXCEEDS SPEC LIMIT - Guide ≥1.5× max span applied`,
        citation: { document: '40 05 19', section: 'Part 3.2', table: `Plastic >2" Guide Distance${isPP ? ' (PP limit)' : ''}` }
      };
    }
  }
}

// ============================================================================
// CONTINUATION PIPING FLEXIBILITY - First Support After Riser (40 05 19, Part 4.4)
// ============================================================================

interface ContinuationResult {
  minDistance: number;
  rule: string;
  citation: Citation;
}

function calculateContinuationFromRiser(
  maxSpan: number,
  riserLength: number,
  isPlastic: boolean,
  pipeSize: number
): ContinuationResult {
  const riserMultiple = riserLength / maxSpan;
  
  if (!isPlastic) {
    // METAL PIPE
    if (riserMultiple <= 3) {
      return {
        minDistance: maxSpan * 0.75,
        rule: `Metal riser ≤3× span (${riserMultiple.toFixed(1)}×): First support ≥75% of max span from elbow`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Metal Continuation' }
      };
    } else if (riserMultiple <= 5) {
      return {
        minDistance: maxSpan * 0.9,
        rule: `Metal riser 3-5× span (${riserMultiple.toFixed(1)}×): First support ≥90% of max span from elbow`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Metal Continuation' }
      };
    } else {
      return {
        minDistance: maxSpan * 0.9,
        rule: `Metal riser >5× span (${riserMultiple.toFixed(1)}×): First support ≥90% of max span from elbow`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Metal Continuation' }
      };
    }
  } else if (pipeSize <= 2) {
    // PLASTIC ≤2"
    if (riserMultiple <= 6) {
      return {
        minDistance: maxSpan * 0.75,
        rule: `Plastic ≤2" riser ≤6× span (${riserMultiple.toFixed(1)}×): First support ≥75% of max span`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Plastic ≤2" Continuation' }
      };
    } else if (riserMultiple <= 10) {
      return {
        minDistance: maxSpan * 0.9,
        rule: `Plastic ≤2" riser 6-10× span (${riserMultiple.toFixed(1)}×): First support ≥90% of max span`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Plastic ≤2" Continuation' }
      };
    } else {
      return {
        minDistance: maxSpan * 0.9,
        rule: `Plastic ≤2" riser >10× span (${riserMultiple.toFixed(1)}×): First support ≥90% of max span`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Plastic ≤2" Continuation' }
      };
    }
  } else {
    // PLASTIC >2"
    if (riserMultiple <= 4) {
      return {
        minDistance: maxSpan * 0.75,
        rule: `Plastic >2" riser ≤4× span (${riserMultiple.toFixed(1)}×): First support ≥75% of max span`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Plastic >2" Continuation' }
      };
    } else if (riserMultiple <= 7) {
      return {
        minDistance: maxSpan * 0.9,
        rule: `Plastic >2" riser 4-7× span (${riserMultiple.toFixed(1)}×): First support ≥90% of max span`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Plastic >2" Continuation' }
      };
    } else {
      return {
        minDistance: maxSpan * 0.9,
        rule: `Plastic >2" riser >7× span (${riserMultiple.toFixed(1)}×): First support ≥90% of max span`,
        citation: { document: '40 05 19', section: 'Part 4.4', table: 'Plastic >2" Continuation' }
      };
    }
  }
}

// ============================================================================
// SHORT RUN ANCHOR ALTERNATIVE - Guide as Axial Restraint (40 05 19, Part 3.3)
// ============================================================================

interface ShortRunAnchorResult {
  canUseGuide: boolean;
  maxDistance: number;
  rule: string;
  citation: Citation;
}

function calculateShortRunAnchor(
  maxSpan: number,
  pipeLength: number,
  isPlastic: boolean,
  isMetal: boolean,
  pipeSize: number,
  material: string
): ShortRunAnchorResult {
  // Special case for 4" CS/SS - limited to 1× span
  const is4InchCSSS = (material === 'Carbon Steel' || material === 'Stainless Steel') && pipeSize === 4;
  const maxRunLength = is4InchCSSS ? maxSpan * 1 : maxSpan * 2;
  
  if (pipeLength > maxRunLength) {
    return {
      canUseGuide: false,
      maxDistance: 0,
      rule: `Run too long (${pipeLength} ft > ${maxRunLength} ft max) - standard anchor required`,
      citation: { document: '40 05 19', section: 'Part 3.3' }
    };
  }
  
  // Guide location from elbow
  let guideDistance: number;
  let sizeCategory: string;
  
  if (!isPlastic) {
    // Metal
    if (pipeSize <= 2) {
      guideDistance = pipeSize * 6; // 6× pipe diameter (in inches)
      sizeCategory = '≤2" metal';
    } else {
      guideDistance = pipeSize * 4; // 4× pipe diameter (in inches)
      sizeCategory = '>2" metal';
    }
  } else {
    // Plastic
    if (pipeSize <= 2) {
      guideDistance = pipeSize * 6; // 6× pipe diameter (in inches)
      sizeCategory = '≤2" plastic';
    } else {
      guideDistance = pipeSize * 3; // 3× pipe diameter (in inches)
      sizeCategory = '>2" plastic';
    }
  }
  
  return {
    canUseGuide: true,
    maxDistance: guideDistance / 12, // Convert to feet
    rule: `Short run (≤${maxRunLength} ft): Place guide within ${guideDistance}" (${sizeCategory}) from 90° elbow for axial restraint`,
    citation: { document: '40 05 19', section: 'Part 3.3', description: 'Short run anchor alternative' }
  };
}

// ============================================================================
// BRANCH GUIDE LOCATION (40 05 19, Part 5.3)
// ============================================================================

interface BranchGuideResult {
  minDistance: number;
  rule: string;
  citation: Citation;
}

function calculateBranchGuide(
  branchMaxSpan: number,
  branchDistanceFromAnchor: number,
  runMaxSpan: number,
  isPlastic: boolean
): BranchGuideResult {
  const distanceMultiple = branchDistanceFromAnchor / runMaxSpan;
  
  if (!isPlastic) {
    // Metal
    if (distanceMultiple <= 2) {
      return {
        minDistance: branchMaxSpan * 0.75,
        rule: `Metal branch ≤2× run span from anchor: First guide ≥75% of branch max span`,
        citation: { document: '40 05 19', section: 'Part 5.3', table: 'Branch Guide Location' }
      };
    } else {
      return {
        minDistance: branchMaxSpan * 1.5,
        rule: `Metal branch 2-8× run span from anchor: First guide ≥1.5× branch max span`,
        citation: { document: '40 05 19', section: 'Part 5.3', table: 'Branch Guide Location' }
      };
    }
  } else {
    // Plastic
    if (distanceMultiple <= 3) {
      return {
        minDistance: branchMaxSpan * 0.75,
        rule: `Plastic branch ≤3× run span from anchor: First guide ≥75% of branch max span`,
        citation: { document: '40 05 19', section: 'Part 5.3', table: 'Branch Guide Location' }
      };
    } else {
      return {
        minDistance: branchMaxSpan * 1.5,
        rule: `Plastic branch 3-12× run span from anchor: First guide ≥1.5× branch max span`,
        citation: { document: '40 05 19', section: 'Part 5.3', table: 'Branch Guide Location' }
      };
    }
  }
}

// Hardware recommendations by material type and support function
const HARDWARE_RECOMMENDATIONS: Record<string, Record<string, HardwareRecommendation>> = {
  plastic: {
    hanger: {
      productName: 'GF Stress Less Clevis Hanger Kit',
      manufacturer: 'Georg Fischer',
      assemblyDrawing: 'HGR-1',
    },
    guide: {
      productName: 'GF Stress Less Pipe Guide',
      manufacturer: 'Georg Fischer',
      assemblyDrawing: 'G-1',
    },
    anchor: {
      productName: 'GF Stress Less Clamp Fixpoint Kit',
      manufacturer: 'Georg Fischer',
      assemblyDrawing: 'A-1',
    },
    slide: {
      productName: 'GF Stress Less Pipe Slides',
      manufacturer: 'Georg Fischer',
      assemblyDrawing: 'S-1',
    },
    riser_clamp: {
      productName: 'GF Stress Less Clamp Fixpoint Kit',
      manufacturer: 'Georg Fischer',
      assemblyDrawing: 'R-1',
    },
  },
  metal: {
    hanger: {
      productName: 'Clevis Hanger',
      manufacturer: 'Anvil / Cooper B-Line',
      assemblyDrawing: 'HGR-2',
    },
    braced_hanger: {
      productName: 'Braced Clevis Hanger',
      manufacturer: 'Anvil / Cooper B-Line',
      assemblyDrawing: 'BHGR-1',
    },
    guide: {
      productName: 'Pipe Guide',
      manufacturer: 'Anvil / Cooper B-Line',
      assemblyDrawing: 'G-2',
    },
    anchor: {
      productName: 'Pipe Anchor',
      manufacturer: 'Anvil / Cooper B-Line',
      assemblyDrawing: 'A-2',
    },
    slide: {
      productName: 'Slide Plate Assembly',
      manufacturer: 'Anvil / Cooper B-Line',
      assemblyDrawing: 'S-2',
    },
    riser_clamp: {
      productName: 'Riser Clamp',
      manufacturer: 'Anvil / Cooper B-Line',
      assemblyDrawing: 'R-1',
    },
  },
  metal_small_indoor: {
    anchor: {
      productName: 'Cush-a-Clamp or Cooper B-Line B2400',
      manufacturer: 'Unistrut / Cooper B-Line',
      assemblyDrawing: 'N/A',
    },
  },
  stainless_316: {
    hanger: {
      productName: 'Type 316 SS Clevis Hanger',
      manufacturer: 'Carpenter & Patterson',
      assemblyDrawing: 'HGR-2',
    },
    guide: {
      productName: 'Type 316 SS Pipe Guide',
      manufacturer: 'Carpenter & Patterson',
      assemblyDrawing: 'G-2',
    },
    anchor: {
      productName: 'Type 316 SS Pipe Anchor',
      manufacturer: 'Carpenter & Patterson',
      assemblyDrawing: 'A-2',
    },
  },
};

export function calculatePipeSupport(input: CalculatorInput): CalculatorOutput {
  const warnings: string[] = [];
  const isPlastic = isPlasticMaterial(input.material);
  const isMetal = isMetalMaterial(input.material);
  const pipeSize = parsePipeSize(input.pipeSize);
  
  // === SPECIAL CASE: 3" PPDW Safety Shower (40 05 19, Part 6.4) ===
  if (input.isPPDWSafetyShower && pipeSize === 3) {
    warnings.push('3" PPDW SAFETY SHOWER: Fixed 5-foot maximum span (40 05 19, Part 6.4)');
    const baseMaxSpan = 5.0;
    return buildOutput(input, baseMaxSpan, baseMaxSpan, warnings, isPlastic, isMetal, pipeSize, false, {
      document: '40 05 19',
      section: 'Part 6.4',
      description: '3" PPDW Safety Shower - 5 ft max span',
    });
  }
  
  // === STEP 1: Look up base span ===
  // For double-wall piping: support based on containment (outer) pipe material,
  // but use carrier (inner) pipe temperature for span lookup (40 05 19, Part 6.2)
  const spanLookupTemp = input.isDoubleWall && input.carrierPipeTemp !== undefined
    ? input.carrierPipeTemp
    : input.temperature;
  
  const spanResult = lookupSpan(
    input.material,
    input.pipeSize,
    input.service,
    spanLookupTemp
  );
  
  if (!spanResult) {
    throw new Error(
      `No span data found for ${input.material} ${input.pipeSize} at ${spanLookupTemp}°F in ${input.service} service`
    );
  }
  
  let baseMaxSpan = spanResult.maxSpan;
  
  // Build citation - note if double-wall temperature was used
  let spanDescription = `${input.material}, ${input.pipeSize}, ${input.service} service, ${spanLookupTemp}°F`;
  if (input.isDoubleWall && input.carrierPipeTemp !== undefined) {
    spanDescription += ` (carrier pipe temp used for double-wall)`;
    warnings.push(`DOUBLE-WALL: Span based on containment pipe (${input.material}) with carrier pipe temperature (${input.carrierPipeTemp}°F) (40 05 19, Part 6.2)`);
  }
  
  const spanCitation: Citation = {
    document: '40 05 19.01',
    table: spanResult.sourceTable,
    description: spanDescription,
  };
  
  // === STEP 2: Check for continuous support requirement ===
  if (baseMaxSpan < 2.5) {
    return {
      input,
      calculations: {
        baseMaxSpan,
        adjustedMaxSpan: baseMaxSpan,
        guideSpacing: 0,
        numberOfSpans: 0,
        numberOfSupports: 0,
        spanReductionApplied: false,
      },
      supportTypes: {
        deadweight: 'continuous',
        lateral: 'continuous',
        axial: null,
      },
      hardware: {},
      tolerance: {
        placementToleranceInches: LOCATION_TOLERANCES[input.locationType]?.tolerance ?? 6 as number | 'per_design',
        fieldAccuracy: LOCATION_TOLERANCES[input.locationType]?.accuracy ?? '±1"',
        isCritical: LOCATION_TOLERANCES[input.locationType]?.critical ?? false,
      },
      flags: {
        cushAClampEligible: false,
        requiresContinuousSupport: true,
        isPlastic,
        requiresStainless316: input.isCorrosive,
        interpolationUsed: spanResult.interpolated,
      },
      citations: {
        maxSpan: spanCitation,
        guideSpacing: { document: '40 05 19.01', section: 'Section B.1' },
        hardware: { document: '40 05 19', section: 'Section 2.3' },
        tolerance: { document: 'A-9 Change Management', page: 5 },
      },
      warnings: ['CONTINUOUS SUPPORT REQUIRED - Max span < 2.5 ft (per 40 05 19.01, Section B.1)'],
    };
  }
  
  // === STEP 3: Apply SG correction ===
  let adjustedSpan = baseMaxSpan;
  let sgCitation: Citation | undefined;
  
  if (input.specificGravity > 1.0 && input.service === 'water') {
    const sgResult = lookupSGCorrection(input.material, input.specificGravity);
    adjustedSpan = Math.round(baseMaxSpan * sgResult.correctionFactor * 10) / 10;
    sgCitation = {
      document: '40 05 19.01',
      table: sgResult.sourceTable,
      description: `SG ${input.specificGravity} correction factor: ${sgResult.correctionFactor}`,
    };
  }
  
  // === STEP 4: Apply condition adjustments ===
  let spanReductionApplied = false;
  let spanReductionReason: string | undefined;
  
  // Direction change reduction for metal
  if (input.hasElbow && isMetal) {
    adjustedSpan = Math.round(adjustedSpan * 0.7 * 10) / 10;
    spanReductionApplied = true;
    spanReductionReason = 'Direction change (elbow) - reduced to 70%';
    warnings.push('Span reduced to 70% due to direction change (40 05 19, Appendix 1)');
  }
  
  // In-line component adjustments
  if (input.hasInlineComponent) {
    if (input.componentWeight === 'medium') {
      adjustedSpan = Math.round(adjustedSpan * 0.7 * 10) / 10;
      spanReductionApplied = true;
      spanReductionReason = 'In-line component (10-30% span weight) - reduced to 70%';
      warnings.push('Span reduced to 70% due to in-line component (40 05 19, Appendix 1)');
    } else if (input.componentWeight === 'heavy') {
      warnings.push('HEAVY COMPONENT: Support required within 25% of span from each side (40 05 19, Appendix 1)');
    }
  }
  
  // Plastic fitting support rule (40 05 19, Section 1.5.K)
  if (isPlastic && (input.hasElbow || input.hasPlasticFitting)) {
    const fittingType = input.plasticFittingType || 'elbow';
    const fittingDesc = fittingType === 'elbow' ? 'Elbow' : fittingType === 'tee' ? 'Tee' : 'Wye';
    warnings.push(`PLASTIC FITTING (${fittingDesc}): Support required within 18" of fitting centerline (40 05 19, Section 1.5.K)`);
    
    if (fittingType === 'wye') {
      warnings.push('Wye fittings in horizontal OR vertical plane must be supported within 18"');
    } else {
      warnings.push(`${fittingDesc} fittings in horizontal plane must be supported within 18"`);
    }
  }
  
  // === STEP 5: Calculate number of supports ===
  const numberOfSpans = Math.ceil(input.pipeLength / adjustedSpan);
  const numberOfSupports = numberOfSpans + 1;
  
  // === STEP 6: Calculate guide spacing ===
  // Default guide spacing is 2× max span
  let guideSpacing = adjustedSpan * 2;
  let guideSpacingReduced = false;
  
  // For long vertical risers, reduce guide spacing for buckling prevention
  // Per 40 05 19, Part 4.2: If run length > 3× max span, guide spacing = 1× max span
  if (input.orientation === 'vertical' && input.pipeLength > adjustedSpan * 3) {
    guideSpacing = adjustedSpan;
    guideSpacingReduced = true;
  }
  
  // === STEP 7: Determine support types based on orientation and mounting method ===
  let deadweightType: SupportType;
  let lateralType: SupportType = 'guide';
  let axialType: SupportType | null = 'anchor';
  
  if (input.orientation === 'horizontal') {
    switch (input.mountingMethod) {
      case 'rack':
        deadweightType = 'rack_support';
        break;
      case 'trapeze':
        deadweightType = 'trapeze_hanger';
        break;
      case 'floor':
        deadweightType = 'floor_stand';
        break;
      case 'wall':
        deadweightType = 'wall_bracket';
        break;
      case 'hanging':
      default:
        deadweightType = 'hanger';
        break;
    }
  } else {
    // Vertical pipe (riser)
    deadweightType = 'riser_clamp';
    warnings.push('Place riser clamp near TOP of vertical run (40 05 19, Part 4)');
    
    // Riser length classification
    const riserMultiple = Math.round((input.pipeLength / adjustedSpan) * 10) / 10;
    
    if (riserMultiple <= 1) {
      // Short riser - can be supported from adjacent horizontal piping
      // Per 40 05 19, Part 4.3: Metal ≤2"=6×, Metal >2"=4×, Plastic ≤2"=6×, Plastic >2"=3×
      let riserDiameterMultiple: number;
      if (pipeSize <= 2) {
        riserDiameterMultiple = 6; // Both metal and plastic ≤2"
      } else if (isMetal) {
        riserDiameterMultiple = 4; // Metal >2"
      } else {
        riserDiameterMultiple = 3; // Plastic >2"
      }
      warnings.push(`Short riser (${riserMultiple}× max span): Can be supported from adjacent horizontal piping within ${riserDiameterMultiple}× pipe diameter from elbow (40 05 19, Part 4.3)`);
    } else if (riserMultiple > 3) {
      // Long riser - guide spacing reduced for buckling prevention
      warnings.push(`Long riser (${riserMultiple}× max span): Guide spacing REDUCED to 1× max span (${adjustedSpan} ft) for buckling prevention (40 05 19, Part 4.2)`);
    }
  }
  
  // === STEP 8: Check special conditions ===
  
  // Additional calculation results
  let minGuideFromElbow: number | undefined;
  let minSupportFromRiserElbow: number | undefined;
  let minBranchGuideFromRun: number | undefined;
  let canUseGuideAsAnchor: boolean | undefined;
  let guideAsAnchorDistance: number | undefined;
  
  // Equipment connection - no anchor allowed
  if (input.isEquipmentConnection) {
    axialType = null;
    warnings.push('EQUIPMENT CONNECTION: Do NOT place anchor on connection run (40 05 19, Section 6.3)');
    warnings.push('Provide flexibility offsets to accommodate equipment movement');
  }
  
  // Flexible coupling rules
  if (input.hasFlexibleCoupling) {
    warnings.push('FLEXIBLE COUPLING: Support piping INDEPENDENTLY on both sides (40 05 19, Section 1.5.G)');
    warnings.push('Tie-rods are REQUIRED');
  }
  
  // === NEW: Expansion Loop Rules (40 05 19, Part 6.1) ===
  // Note: Deadweight support (hanger) still needed for vertical load
  // SLIDE/GUIDE refers to lateral restraint behavior
  if (input.isExpansionLoop) {
    if (input.expansionLoopLeg === 'offset') {
      // Offset leg: SLIDE for lateral (allows lateral + axial movement)
      // Deadweight stays as hanger - pipe still needs vertical support
      lateralType = 'slide';
      axialType = null; // No anchor on offset leg
      warnings.push('EXPANSION LOOP OFFSET LEG: Use SLIDE for lateral restraint (allows lateral + axial movement) (40 05 19, Part 6.1)');
      warnings.push('Deadweight support (hanger) still required for vertical load');
    } else if (input.expansionLoopLeg === 'connecting') {
      // Connecting leg: GUIDE for lateral (controls direction)
      lateralType = 'guide';
      warnings.push('EXPANSION LOOP CONNECTING LEG: Use GUIDE for lateral restraint (controls direction) (40 05 19, Part 6.1)');
    }
  }
  
  // === NEW: Seismic Interface Rules (40 05 19, Part 6.5) ===
  // Note: SLIDE refers to lateral restraint type, not deadweight support
  if (input.isSeismicInterface) {
    // Lateral restraint becomes SLIDE at seismic interface
    lateralType = 'slide';
    warnings.push('SEISMIC INTERFACE: Use SLIDE for lateral restraint at movement interface (40 05 19, Part 6.5)');
    warnings.push('Deadweight support (hanger) still required for vertical load');
    warnings.push(`Maintain 1.5× max span (${(adjustedSpan * 1.5).toFixed(1)} ft) between guides adjacent to slide`);
  }
  
  // === NEW: Guide Distance from Elbow - Thermal Expansion (40 05 19, Part 3.2) ===
  if (input.hasElbow && input.anchorToElbowDistance !== undefined && input.anchorToElbowDistance > 0) {
    const guideFromElbowResult = calculateGuideFromElbow(
      adjustedSpan,
      input.anchorToElbowDistance,
      isPlastic,
      pipeSize,
      input.material
    );
    minGuideFromElbow = Math.round(guideFromElbowResult.minDistance * 10) / 10;
    warnings.push(`GUIDE FROM ELBOW: ${guideFromElbowResult.rule} → Min ${minGuideFromElbow} ft`);
  }
  
  // === NEW: Continuation Piping Flexibility (40 05 19, Part 4.4) ===
  if (input.isFromRiser && input.riserLength !== undefined && input.riserLength > 0) {
    const continuationResult = calculateContinuationFromRiser(
      adjustedSpan,
      input.riserLength,
      isPlastic,
      pipeSize
    );
    minSupportFromRiserElbow = Math.round(continuationResult.minDistance * 10) / 10;
    warnings.push(`CONTINUATION FROM RISER: ${continuationResult.rule} → Min ${minSupportFromRiserElbow} ft from elbow`);
  }
  
  // === NEW: Short Run Anchor Alternative (40 05 19, Part 3.3) ===
  if (input.hasElbow && input.orientation === 'horizontal') {
    const shortRunResult = calculateShortRunAnchor(
      adjustedSpan,
      input.pipeLength,
      isPlastic,
      isMetal,
      pipeSize,
      input.material
    );
    if (shortRunResult.canUseGuide) {
      canUseGuideAsAnchor = true;
      guideAsAnchorDistance = Math.round(shortRunResult.maxDistance * 100) / 100;
      warnings.push(`SHORT RUN OPTION: ${shortRunResult.rule}`);
    }
  }
  
  // Branch pipe rules
  if (input.isBranchPipe) {
    warnings.push('BRANCH PIPE: Place anchor on RUN pipe, not on branch');
    if (input.branchOrientation === 'horizontal_from_horizontal') {
      warnings.push('Support branch at 25-100% of branch max span from run centerline');
    } else {
      warnings.push('Support branch at 75-100% of max span from run centerline');
    }
    
    // === NEW: Branch Guide Location (40 05 19, Part 5.3) ===
    if (input.branchDistanceFromAnchor !== undefined && input.branchDistanceFromAnchor > 0) {
      const branchGuideResult = calculateBranchGuide(
        adjustedSpan, // branch max span (assuming same as run for now)
        input.branchDistanceFromAnchor,
        adjustedSpan, // run max span
        isPlastic
      );
      minBranchGuideFromRun = Math.round(branchGuideResult.minDistance * 10) / 10;
      warnings.push(`BRANCH GUIDE: ${branchGuideResult.rule} → Min ${minBranchGuideFromRun} ft from run centerline`);
    }
  }
  
  // Double-wall piping - warning if carrier temp not provided
  if (input.isDoubleWall && (input.carrierPipeTemp === undefined || input.carrierPipeTemp === 0)) {
    warnings.push('⚠️ DOUBLE-WALL: Carrier pipe temperature not specified - using containment pipe temperature. For accurate span, enter carrier pipe temperature.');
  }
  
  // === NEW: 4" CS/SS Lateral Load Limitation (40 05 19, Part 5.3) ===
  if ((input.material === 'Carbon Steel' || input.material === 'Stainless Steel') && pipeSize === 4) {
    warnings.push('4" CS/SS LIMITATION: Short run axial restraint limited to 1× span (not 2×) (40 05 19)');
  }
  
  // === NEW: SS/Copper Dielectric Insulation (40 05 19, Part 7.2) ===
  if ((input.material === 'Stainless Steel' || input.material === 'Copper' || 
       input.material === 'SS Tubing' || input.material === 'Copper Tubing') && !isPlastic) {
    warnings.push('SS/COPPER: Must be dielectrically insulated from carbon steel supports (40 05 19, Part 7.2)');
  }
  
  // === STEP 9: Check Cush-a-Clamp eligibility ===
  const cushAClampEligible =
    input.isIndoor &&
    isMetal &&
    pipeSize <= 2 &&
    input.mountingMethod !== 'rack';
  
  // === FIX: Cush-a-Clamp spacing is 1× max span, not 2× (40 05 19, Part 3.3) ===
  if (cushAClampEligible) {
    warnings.push(`CUSH-A-CLAMP OPTION: Multi-point anchoring available. Max spacing = ${adjustedSpan} ft (1× max span, NOT 2×) (40 05 19, Part 3.3)`);
  }
  
  // Plastic restrictions
  if (isPlastic) {
    warnings.push('PLASTIC PIPE: No friction anchors (Cush-a-Clamp) allowed - compressive load damages plastic');
    warnings.push('No metal in direct contact with pipe - use GF Stress Less or protective wrap');
  }
  
  // === STEP 10: Select hardware ===
  const materialCategory = isPlastic ? 'plastic' : 'metal';
  let hardware: {
    deadweight?: HardwareRecommendation;
    lateral?: HardwareRecommendation;
    axial?: HardwareRecommendation;
  } = {};
  
  // Get base hardware
  const baseHardware = HARDWARE_RECOMMENDATIONS[materialCategory];
  
  if (deadweightType === 'hanger') {
    hardware.deadweight = baseHardware.hanger;
  } else if (deadweightType === 'riser_clamp') {
    hardware.deadweight = baseHardware.riser_clamp;
  } else {
    hardware.deadweight = baseHardware.hanger; // Fallback
  }
  
  hardware.lateral = baseHardware.guide;
  
  if (axialType) {
    // Check for Cush-a-Clamp option
    if (cushAClampEligible && axialType === 'anchor') {
      hardware.axial = HARDWARE_RECOMMENDATIONS.metal_small_indoor.anchor;
    } else {
      hardware.axial = baseHardware.anchor;
    }
  }
  
  // === STEP 11: Override for corrosive areas ===
  if (input.isCorrosive) {
    warnings.push('CORROSIVE AREA: All metal components must be Type 316 or 316L stainless steel (per 100AZ0206)');
    const ss316Hardware = HARDWARE_RECOMMENDATIONS.stainless_316;
    if (hardware.deadweight && !isPlastic) {
      hardware.deadweight = ss316Hardware.hanger || hardware.deadweight;
    }
    if (hardware.lateral && !isPlastic) {
      hardware.lateral = ss316Hardware.guide || hardware.lateral;
    }
    if (hardware.axial && !isPlastic) {
      hardware.axial = ss316Hardware.anchor || hardware.axial;
    }
  }
  
  // === STEP 12: Get tolerance ===
  const toleranceData = LOCATION_TOLERANCES[input.locationType] || LOCATION_TOLERANCES.individual_run;
  
  // Special warning for zero tolerance
  if (toleranceData.tolerance === 0) {
    warnings.push('⚠️ ZERO TOLERANCE: Supports must be placed EXACTLY as designed');
  }
  
  // Special warning for per-design tolerance
  if (toleranceData.tolerance === 'per_design') {
    warnings.push('TOLERANCE PER DESIGN: Lateral rack / POC / tool install - tolerance must follow specific design requirements. Field accuracy ±1/4" (critical). Per A-9 Change Management.');
  }
  
  // === BUILD OUTPUT ===
  // Guide spacing citation - changes if reduced for long riser
  const guideSpacingCitation = guideSpacingReduced
    ? { document: '40 05 19', section: 'Part 4.2', description: 'Long riser buckling prevention: Guide spacing = 1× max span' }
    : { document: '40 05 19', section: 'Appendix 1', description: 'Guide spacing = 2× deadweight span' };
  
  return {
    input,
    calculations: {
      baseMaxSpan,
      adjustedMaxSpan: adjustedSpan,
      guideSpacing,
      numberOfSpans,
      numberOfSupports,
      spanReductionApplied,
      spanReductionReason,
      guideSpacingReduced,
      // New thermal expansion calculations
      minGuideFromElbow,
      minSupportFromRiserElbow,
      minBranchGuideFromRun,
      canUseGuideAsAnchor,
      guideAsAnchorDistance,
    },
    supportTypes: {
      deadweight: deadweightType,
      lateral: lateralType,
      axial: axialType,
    },
    hardware,
    tolerance: {
      placementToleranceInches: toleranceData.tolerance,
      fieldAccuracy: toleranceData.accuracy,
      isCritical: toleranceData.critical,
    },
    flags: {
      cushAClampEligible,
      requiresContinuousSupport: false,
      isPlastic,
      isLongRiser: guideSpacingReduced,
      requiresStainless316: input.isCorrosive,
      interpolationUsed: spanResult.interpolated,
    },
    citations: {
      maxSpan: spanCitation,
      guideSpacing: guideSpacingCitation,
      hardware: { document: '40 05 19', section: 'Appendix 2', description: 'Hardware specifications' },
      tolerance: { document: 'A-9 Change Management', page: 5 },
      ...(sgCitation && { sgCorrection: sgCitation }),
    },
    warnings,
  };
}

// ============================================================================
// HELPER: Build output for special cases (3" PPDW, etc.)
// ============================================================================

function buildOutput(
  input: CalculatorInput,
  baseMaxSpan: number,
  adjustedSpan: number,
  warnings: string[],
  isPlastic: boolean,
  isMetal: boolean,
  pipeSize: number,
  interpolated: boolean,
  spanCitation: Citation
): CalculatorOutput {
  const numberOfSpans = Math.ceil(input.pipeLength / adjustedSpan);
  const numberOfSupports = numberOfSpans + 1;
  const guideSpacing = adjustedSpan * 2;
  
  const cushAClampEligible = input.isIndoor && isMetal && pipeSize <= 2 && input.mountingMethod !== 'rack';
  
  let deadweightType: SupportType = input.orientation === 'horizontal' ? 'hanger' : 'riser_clamp';
  
  const materialCategory = isPlastic ? 'plastic' : 'metal';
  const baseHardware = HARDWARE_RECOMMENDATIONS[materialCategory];
  
  const hardware = {
    deadweight: baseHardware.hanger,
    lateral: baseHardware.guide,
    axial: baseHardware.anchor,
  };
  
  const toleranceData = LOCATION_TOLERANCES[input.locationType] || LOCATION_TOLERANCES.individual_run;
  
  return {
    input,
    calculations: {
      baseMaxSpan,
      adjustedMaxSpan: adjustedSpan,
      guideSpacing,
      numberOfSpans,
      numberOfSupports,
      spanReductionApplied: false,
    },
    supportTypes: {
      deadweight: deadweightType,
      lateral: 'guide',
      axial: 'anchor',
    },
    hardware,
    tolerance: {
      placementToleranceInches: toleranceData.tolerance,
      fieldAccuracy: toleranceData.accuracy,
      isCritical: toleranceData.critical,
    },
    flags: {
      cushAClampEligible,
      requiresContinuousSupport: false,
      isPlastic,
      requiresStainless316: input.isCorrosive,
      interpolationUsed: interpolated,
    },
    citations: {
      maxSpan: spanCitation,
      guideSpacing: { document: '40 05 19', section: 'Appendix 1', description: 'Guide spacing = 2× max span' },
      hardware: { document: '40 05 19', section: 'Appendix 2' },
      tolerance: { document: 'A-9 Change Management', page: 5 },
    },
    warnings,
  };
}
