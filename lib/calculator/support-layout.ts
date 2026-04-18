// Support Layout Generator
// Calculates exact placement of supports along a pipe run
// Based on 40 05 19 - Pipe Supports and Anchors

export type PipeEndType = 
  | 'anchor'           // Fixed anchor point
  | 'equipment'        // Connected to equipment (pump, tank, etc.) - NO anchor allowed
  | 'elbow'            // 90° direction change
  | 'tee_branch'       // Branch connection (this is the branch)
  | 'tee_run'          // Run pipe with branch takeoff
  | 'flex_coupling'    // Flexible coupling
  | 'open'             // Open end or continues
  | 'riser_top'        // Top of vertical riser
  | 'riser_bottom';    // Bottom of vertical riser

export interface PipeRunConfig {
  // Basic properties
  material: string;
  pipeSize: string;
  length: number;           // Total length in feet
  orientation: 'horizontal' | 'vertical';
  maxSpan: number;          // Max support spacing in feet
  guideSpacing: number;     // Guide spacing (typically 2× max span, 1× for long risers)
  
  // Endpoints
  startType: PipeEndType;
  endType: PipeEndType;
  
  // Mid-run features (position in feet from start)
  elbows?: { position: number; direction: '90_horizontal' | '90_vertical' | '45' }[];
  branches?: { position: number; branchSize: string }[];
  flexCouplings?: { position: number }[];
  inlineComponents?: { position: number; type: string; weight: 'light' | 'medium' | 'heavy' }[];
  plasticFittings?: { position: number; type: 'elbow' | 'tee' | 'wye' }[]; // 40 05 19, Section 1.5.K
  
  // Environment
  isPlastic: boolean;
  isEquipmentConnection: boolean;
}

export interface SupportPoint {
  position: number;         // Distance from start (feet)
  type: 'anchor' | 'guide' | 'hanger' | 'riser_clamp' | 'slide';
  reason: string;           // Why this support is here
  critical: boolean;        // Is this placement critical (low tolerance)?
  notes?: string[];         // Additional notes for the modeler
}

export interface SupportLayout {
  supports: SupportPoint[];
  totalSupports: number;
  anchors: number;
  guides: number;
  hangers: number;
  warnings: string[];
  summary: string;
  anchorRequiredElsewhere: boolean;  // True if this run has no anchor and needs one elsewhere
  anchorLocation?: string;           // Where the anchor should be placed if not on this run
}

/**
 * Calculate proper guide distance from elbow based on spec (40 05 19, Part 3.2)
 * This follows the same rules as calculate.ts but is used for layout generation
 */
function calculateGuideDistanceFromElbow(
  runLengthToElbow: number,  // Distance from anchor to elbow
  maxSpan: number,
  isPlastic: boolean,
  pipeSize: number
): { distance: number; rule: string } {
  const runLengthMultiple = runLengthToElbow / maxSpan;
  
  if (!isPlastic) {
    // METAL PIPE RULES (40 05 19, Part 3.2)
    if (runLengthMultiple <= 3) {
      return {
        distance: maxSpan * 0.75,
        rule: `Metal, run ≤3× span: ≥75% of max span`
      };
    } else {
      return {
        distance: maxSpan * 1.5,
        rule: `Metal, run >3× span: ≥1.5× max span`
      };
    }
  } else if (pipeSize <= 2) {
    // PLASTIC PIPE ≤2" RULES
    if (runLengthMultiple <= 6) {
      return {
        distance: maxSpan * 0.75,
        rule: `Plastic ≤2", run ≤6× span: ≥75% of max span`
      };
    } else {
      return {
        distance: maxSpan * 1.5,
        rule: `Plastic ≤2", run >6× span: ≥1.5× max span`
      };
    }
  } else {
    // PLASTIC PIPE >2" RULES
    if (runLengthMultiple <= 4) {
      return {
        distance: maxSpan * 0.75,
        rule: `Plastic >2", run ≤4× span: ≥75% of max span`
      };
    } else {
      return {
        distance: maxSpan * 1.5,
        rule: `Plastic >2", run >4× span: ≥1.5× max span`
      };
    }
  }
}

/**
 * Parse pipe size string to number
 */
function parsePipeSizeForLayout(size: string): number {
  const sizeMap: Record<string, number> = {
    '1/4': 0.25, '3/8': 0.375, '1/2': 0.5, '3/4': 0.75,
    '1': 1, '1-1/4': 1.25, '1 1/4': 1.25, '1-1/2': 1.5, '1 1/2': 1.5,
    '2': 2, '2-1/2': 2.5, '2 1/2': 2.5, '3': 3, '3-1/2': 3.5, '3 1/2': 3.5,
    '4': 4, '6': 6, '8': 8, '10': 10, '12': 12,
  };
  const cleanSize = size.replace(/"/g, '').replace('inch', '').trim();
  return sizeMap[cleanSize] || parseFloat(cleanSize) || 2; // Default to 2" if unknown
}

/**
 * Generate a complete support layout for a pipe run
 */
export function generateSupportLayout(config: PipeRunConfig): SupportLayout {
  const supports: SupportPoint[] = [];
  const warnings: string[] = [];
  
  const { 
    length, 
    maxSpan, 
    startType, 
    endType, 
    elbows = [], 
    branches = [],
    flexCouplings = [],
    inlineComponents = [],
    isPlastic,
    orientation,
    isEquipmentConnection
  } = config;
  
  // For vertical risers, reduce guide spacing for buckling prevention
  // Per 40 05 19, Part 4.2: If run > 3× max span, guide spacing = 1× max span
  let guideSpacing = config.guideSpacing;
  if (orientation === 'vertical' && length > maxSpan * 3) {
    guideSpacing = maxSpan;
    warnings.push(`BUCKLING PREVENTION: Vertical riser > 3× max span (${(length / maxSpan).toFixed(1)}×). Guide spacing reduced to 1× max span (${maxSpan} ft) per 40 05 19, Part 4.2`);
  }
  
  // === DETERMINE IF THIS RUN HAS AN ANCHOR ===
  const hasAnchorOnThisRun = startType === 'anchor' || endType === 'anchor';
  const isFlexibleRun = (startType === 'elbow' || startType === 'equipment') && 
                        (endType === 'elbow' || endType === 'equipment');
  
  // === STEP 1: Place endpoint supports ===
  
  // Start point
  if (startType === 'anchor') {
    supports.push({
      position: 0,
      type: 'anchor',
      reason: 'ANCHOR - Fixed point at start of run (axial restraint)',
      critical: true,
      notes: [
        'This anchor prevents pipe movement in the axial direction',
        'All thermal expansion occurs toward the other end',
        'Per 40 05 19, Part 3.1',
      ],
    });
  } else if (startType === 'equipment') {
    // NO anchor on equipment - add guide instead for lateral control
    supports.push({
      position: 0.5, // Slightly offset from equipment
      type: 'guide',
      reason: 'Lateral restraint near equipment (NO ANCHOR - allows thermal movement)',
      critical: false,
      notes: [
        'Do NOT place anchor on equipment connection run',
        'Equipment connections must be flexible for thermal movement',
        'Per 40 05 19, Section 6.3',
      ],
    });
  } else if (startType === 'riser_top') {
    supports.push({
      position: 0,
      type: 'riser_clamp',
      reason: 'Riser clamp at top of vertical run (carries deadweight)',
      critical: true,
      notes: ['Riser clamp provides axial support for vertical pipe weight'],
    });
  } else if (startType === 'elbow') {
    // Guide after elbow for thermal expansion control
    // Per 40 05 19, Part 3.2 - Distance depends on run length from anchor to elbow
    const pipeSize = parsePipeSizeForLayout(config.pipeSize);
    
    // Determine run length to anchor (could be at end, or no anchor on this run)
    let runLengthToAnchor = length; // Default: anchor at far end
    if (endType !== 'anchor') {
      // No anchor on this run - use conservative estimate (short run rule)
      runLengthToAnchor = length;
      warnings.push('Start elbow: No anchor on this run - using full length for guide calculation. Ensure anchor exists on connected run.');
    }
    
    const guideCalc = calculateGuideDistanceFromElbow(runLengthToAnchor, maxSpan, isPlastic, pipeSize);
    const guidePos = Math.min(guideCalc.distance, length * 0.4); // Don't place beyond 40% of run length
    
    supports.push({
      position: guidePos,
      type: 'guide',
      reason: `Guide after elbow (${guidePos.toFixed(1)}ft) - ${guideCalc.rule}`,
      critical: true,
      notes: [
        'Per 40 05 19, Part 3.2 - Guide placement for thermal expansion',
        `Run length to anchor: ${runLengthToAnchor.toFixed(1)}ft (${(runLengthToAnchor / maxSpan).toFixed(1)}× max span)`,
        'Elbow provides directional change flexibility',
      ],
    });
  }
  
  // End point
  if (endType === 'anchor') {
    supports.push({
      position: length,
      type: 'anchor',
      reason: 'ANCHOR - Fixed point at end of run (axial restraint)',
      critical: true,
      notes: [
        'This anchor prevents pipe movement in the axial direction',
        'Per 40 05 19, Part 3.1',
      ],
    });
  } else if (endType === 'equipment') {
    // Guide near equipment end
    supports.push({
      position: length - 0.5,
      type: 'guide',
      reason: 'Lateral restraint near equipment (NO ANCHOR)',
      critical: false,
      notes: [
        'Equipment connections must allow thermal movement',
        'Per 40 05 19, Section 6.3',
      ],
    });
  } else if (endType === 'elbow') {
    // Guide before elbow for thermal expansion control
    // Per 40 05 19, Part 3.2 - Distance depends on run length from anchor to elbow
    const pipeSize = parsePipeSizeForLayout(config.pipeSize);
    
    // Determine run length from anchor to elbow
    let runLengthFromAnchor = length; // Default: anchor at start
    if (startType !== 'anchor') {
      // No anchor on this run - use full length
      runLengthFromAnchor = length;
      if (startType !== 'elbow') { // Avoid duplicate warning
        warnings.push('End elbow: No anchor on this run - using full length for guide calculation. Ensure anchor exists on connected run.');
      }
    }
    
    const guideCalc = calculateGuideDistanceFromElbow(runLengthFromAnchor, maxSpan, isPlastic, pipeSize);
    const distanceFromElbow = Math.min(guideCalc.distance, length * 0.4);
    const guidePos = length - distanceFromElbow;
    
    supports.push({
      position: Math.max(guidePos, length * 0.6), // Don't place before 60% of run length
      type: 'guide',
      reason: `Guide before elbow (${distanceFromElbow.toFixed(1)}ft from end) - ${guideCalc.rule}`,
      critical: true,
      notes: [
        'Per 40 05 19, Part 3.2 - Guide placement for thermal expansion',
        `Run length from anchor: ${runLengthFromAnchor.toFixed(1)}ft (${(runLengthFromAnchor / maxSpan).toFixed(1)}× max span)`,
      ],
    });
  }
  
  // === STEP 2: Handle mid-run elbows ===
  const pipeSize = parsePipeSizeForLayout(config.pipeSize);
  
  for (const elbow of elbows) {
    // Calculate run length from nearest anchor to this elbow
    // If start is anchor, use distance from start to elbow
    // If end is anchor, use distance from elbow to end
    // If both are anchors, use the shorter distance
    let runLengthToAnchor: number;
    let anchorDirection: string;
    
    if (startType === 'anchor' && endType === 'anchor') {
      // Both ends are anchors - use shorter distance
      const distFromStart = elbow.position;
      const distFromEnd = length - elbow.position;
      if (distFromStart <= distFromEnd) {
        runLengthToAnchor = distFromStart;
        anchorDirection = 'start anchor';
      } else {
        runLengthToAnchor = distFromEnd;
        anchorDirection = 'end anchor';
      }
    } else if (startType === 'anchor') {
      runLengthToAnchor = elbow.position;
      anchorDirection = 'start anchor';
    } else if (endType === 'anchor') {
      runLengthToAnchor = length - elbow.position;
      anchorDirection = 'end anchor';
    } else {
      // No anchor on this run - use conservative estimate
      runLengthToAnchor = Math.max(elbow.position, length - elbow.position);
      anchorDirection = 'nearest connected anchor';
    }
    
    // Calculate proper guide distance based on spec
    const guideCalc = calculateGuideDistanceFromElbow(runLengthToAnchor, maxSpan, isPlastic, pipeSize);
    const guideAfterElbow = Math.min(elbow.position + guideCalc.distance, length - 0.5);
    
    // Check if there's already a support nearby
    const nearbySupport = supports.find(s => Math.abs(s.position - guideAfterElbow) < maxSpan * 0.25);
    
    if (!nearbySupport) {
      supports.push({
        position: guideAfterElbow,
        type: 'guide',
        reason: `Guide after elbow at ${elbow.position}ft - ${guideCalc.rule}`,
        critical: true,
        notes: [
          'Per 40 05 19, Part 3.2',
          `Run length to ${anchorDirection}: ${runLengthToAnchor.toFixed(1)}ft (${(runLengthToAnchor / maxSpan).toFixed(1)}× max span)`,
        ],
      });
    }
    
    // For plastic, support fitting within 18"
    if (isPlastic) {
      const fittingSupport = elbow.position - 1.5; // 18 inches before
      if (fittingSupport > 0) {
        supports.push({
          position: Math.max(0, fittingSupport),
          type: 'hanger',
          reason: `Support plastic fitting within 18" (at elbow ${elbow.position}ft)`,
          critical: true,
          notes: ['Per 40 05 19, Section 1.5.K - Plastic fittings must be supported within 18" of centerline'],
        });
      }
    }
  }
  
  // === STEP 2.5: Handle explicit plastic fittings (tees, wyes) ===
  // This handles fittings specified separately from elbows (40 05 19, Section 1.5.K)
  const plasticFittings = config.plasticFittings || [];
  for (const fitting of plasticFittings) {
    if (isPlastic) {
      const fittingTypeLabel = fitting.type === 'elbow' ? 'Elbow' : fitting.type === 'tee' ? 'Tee' : 'Wye';
      const planeInfo = fitting.type === 'wye' ? 'horizontal or vertical plane' : 'horizontal plane';
      
      // Support 18" (1.5ft) before the fitting
      const supportBefore = fitting.position - 1.5;
      if (supportBefore > 0) {
        supports.push({
          position: Math.max(0, supportBefore),
          type: 'hanger',
          reason: `Support before plastic ${fittingTypeLabel} within 18" (fitting at ${fitting.position}ft)`,
          critical: true,
          notes: [
            `Per 40 05 19, Section 1.5.K - ${fittingTypeLabel} in ${planeInfo} must be supported within 18" of centerline`,
            'Unless detailed engineering justifies alternate support',
          ],
        });
      }
      
      // Also add a guide at the fitting location for lateral restraint
      supports.push({
        position: fitting.position,
        type: 'guide',
        reason: `Guide at plastic ${fittingTypeLabel} for lateral restraint`,
        critical: true,
        notes: [
          `${fittingTypeLabel} fitting location - guide provides lateral stability`,
        ],
      });
      
      warnings.push(`PLASTIC ${fittingTypeLabel.toUpperCase()} at ${fitting.position}ft: Support within 18" required (40 05 19, Section 1.5.K)`);
    }
  }
  
  // === STEP 3: Handle branch connections ===
  for (const branch of branches) {
    // Anchor goes on RUN pipe near branch
    supports.push({
      position: branch.position,
      type: 'anchor',
      reason: `Anchor at branch takeoff (${branch.branchSize} branch) - placed on RUN pipe`,
      critical: true,
      notes: [
        'Per 40 05 19, Part 5.1 - Anchor goes on run pipe, NOT branch',
        'Branch pipe gets its own support at 25-100% of max span from run centerline',
      ],
    });
    warnings.push(`BRANCH at ${branch.position}ft: Anchor on RUN, first branch support at 25-100% of span from run`);
  }
  
  // === STEP 4: Handle flexible couplings ===
  for (const flex of flexCouplings) {
    // Support on BOTH sides of flexible coupling
    supports.push({
      position: Math.max(0, flex.position - 0.5),
      type: 'hanger',
      reason: `Support before flexible coupling at ${flex.position}ft`,
      critical: true,
      notes: ['Per 40 05 19, Section 6.2 - Pipe must be supported independently on BOTH sides'],
    });
    supports.push({
      position: Math.min(length, flex.position + 0.5),
      type: 'hanger',
      reason: `Support after flexible coupling at ${flex.position}ft`,
      critical: true,
      notes: ['Tie-rods are REQUIRED'],
    });
    warnings.push(`FLEXIBLE COUPLING at ${flex.position}ft: Independent supports on both sides, tie-rods required`);
  }
  
  // === STEP 5: Handle in-line components ===
  for (const comp of inlineComponents) {
    if (comp.weight === 'heavy') {
      // Heavy components need support within 25% of span on each side
      const supportDistance = maxSpan * 0.25;
      supports.push({
        position: Math.max(0, comp.position - supportDistance),
        type: 'hanger',
        reason: `Support before heavy ${comp.type} (within 25% of span)`,
        critical: true,
      });
      supports.push({
        position: Math.min(length, comp.position + supportDistance),
        type: 'hanger',
        reason: `Support after heavy ${comp.type} (within 25% of span)`,
        critical: true,
      });
      warnings.push(`HEAVY COMPONENT (${comp.type}) at ${comp.position}ft: Supports required within ${supportDistance.toFixed(1)}ft on each side`);
    }
  }
  
  // === STEP 6: Fill in intermediate hangers ===
  // Sort existing supports by position
  supports.sort((a, b) => a.position - b.position);
  
  // Find gaps larger than max span and fill with hangers
  const existingPositions = supports.map(s => s.position);
  const intermediateHangers: SupportPoint[] = [];
  
  for (let i = 0; i < existingPositions.length - 1; i++) {
    const start = existingPositions[i];
    const end = existingPositions[i + 1];
    const gap = end - start;
    
    if (gap > maxSpan) {
      // Need to add hangers
      const numSpans = Math.ceil(gap / maxSpan);
      const actualSpan = gap / numSpans;
      
      for (let j = 1; j < numSpans; j++) {
        const pos = start + j * actualSpan;
        intermediateHangers.push({
          position: pos,
          type: 'hanger',
          reason: `Deadweight support (every ${actualSpan.toFixed(1)}ft)`,
          critical: false,
        });
      }
    }
  }
  
  // Add intermediate hangers
  supports.push(...intermediateHangers);
  
  // === STEP 7: Add guides at guide spacing intervals ===
  // Guides are typically at 2× max span
  const guidePositions: number[] = [];
  let lastGuide = 0;
  
  for (const support of supports) {
    if (support.type === 'guide' || support.type === 'anchor') {
      lastGuide = support.position;
    }
  }
  
  // Check if we need additional guides
  const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
  let lastGuideOrAnchor = 0;
  
  for (let pos = 0; pos <= length; pos += guideSpacing) {
    const nearbyLateral = sortedSupports.find(s => 
      (s.type === 'guide' || s.type === 'anchor') && 
      Math.abs(s.position - pos) < guideSpacing * 0.5
    );
    
    if (!nearbyLateral && pos > 0 && pos < length) {
      // Check if there's already a hanger here we can upgrade to a guide
      const hangerAtPos = supports.find(s => 
        s.type === 'hanger' && 
        Math.abs(s.position - pos) < maxSpan * 0.25
      );
      
      if (hangerAtPos) {
        // Upgrade hanger to guide
        hangerAtPos.type = 'guide';
        hangerAtPos.reason = `Guide for lateral control (every ${guideSpacing}ft) - also provides deadweight support`;
      } else {
        // Add new guide
        supports.push({
          position: pos,
          type: 'guide',
          reason: `Guide for lateral control (every ${guideSpacing}ft)`,
          critical: false,
        });
      }
    }
  }
  
  // === STEP 8: Final sort and cleanup ===
  supports.sort((a, b) => a.position - b.position);
  
  // Remove duplicates (supports at nearly the same position)
  const cleanedSupports: SupportPoint[] = [];
  for (const support of supports) {
    const existing = cleanedSupports.find(s => Math.abs(s.position - support.position) < 0.5);
    if (!existing) {
      cleanedSupports.push(support);
    } else if (getPriority(support.type) > getPriority(existing.type)) {
      // Replace with higher priority support
      const idx = cleanedSupports.indexOf(existing);
      cleanedSupports[idx] = {
        ...support,
        notes: [...(support.notes || []), ...(existing.notes || [])],
      };
    }
  }
  
  // === CRITICAL: Add warnings about anchor requirements ===
  const anchorsOnRun = cleanedSupports.filter(s => s.type === 'anchor').length;
  
  // Check if this is a flexible run without anchors
  if (anchorsOnRun === 0) {
    if (startType === 'elbow' && endType === 'elbow') {
      warnings.unshift('⚠️ ANCHOR REQUIRED: This elbow-to-elbow run has NO anchor. An anchor MUST exist on one of the connected runs (before or after the elbows) to control thermal expansion. Per 40 05 19, Part 3.1.');
    } else if (startType === 'equipment' && endType === 'equipment') {
      warnings.unshift('⚠️ ANCHOR REQUIRED: This equipment-to-equipment run has NO anchor (per spec - equipment connections must allow movement). An anchor MUST exist elsewhere in the piping system. Per 40 05 19, Section 6.3.');
    } else if (startType === 'elbow' && endType === 'equipment') {
      warnings.unshift('⚠️ ANCHOR REQUIRED: This run has NO anchor. Place anchor on the piping run BEFORE the start elbow. Per 40 05 19, Part 3.1.');
    } else if (startType === 'equipment' && endType === 'elbow') {
      warnings.unshift('⚠️ ANCHOR REQUIRED: This run has NO anchor. Place anchor on the piping run AFTER the end elbow. Per 40 05 19, Part 3.1.');
    }
  }
  
  // === Build summary ===
  const anchors = cleanedSupports.filter(s => s.type === 'anchor').length;
  const guides = cleanedSupports.filter(s => s.type === 'guide').length;
  const hangers = cleanedSupports.filter(s => s.type === 'hanger').length;
  const riserClamps = cleanedSupports.filter(s => s.type === 'riser_clamp').length;
  
  let summary = `${cleanedSupports.length} total supports: `;
  const parts: string[] = [];
  if (anchors > 0) parts.push(`${anchors} anchor${anchors > 1 ? 's' : ''}`);
  if (guides > 0) parts.push(`${guides} guide${guides > 1 ? 's' : ''}`);
  if (hangers > 0) parts.push(`${hangers} hanger${hangers > 1 ? 's' : ''}`);
  if (riserClamps > 0) parts.push(`${riserClamps} riser clamp${riserClamps > 1 ? 's' : ''}`);
  summary += parts.join(', ');
  
  // Determine if anchor is needed elsewhere
  const anchorRequiredElsewhere = anchors === 0;
  let anchorLocation: string | undefined;
  
  if (anchorRequiredElsewhere) {
    if (startType === 'elbow' && endType === 'elbow') {
      anchorLocation = 'On the piping run connected BEFORE the start elbow, or AFTER the end elbow';
    } else if (startType === 'equipment' && endType === 'equipment') {
      anchorLocation = 'On a connected run that is NOT directly attached to equipment';
    } else if (startType === 'elbow') {
      anchorLocation = 'On the piping run BEFORE the start elbow';
    } else if (endType === 'elbow') {
      anchorLocation = 'On the piping run AFTER the end elbow';
    }
    summary += ' (⚠️ NO ANCHOR on this run - see warnings)';
  }
  
  return {
    supports: cleanedSupports,
    totalSupports: cleanedSupports.length,
    anchors,
    guides,
    hangers,
    warnings,
    summary,
    anchorRequiredElsewhere,
    anchorLocation,
  };
}

/**
 * Get support type priority (higher = more important)
 */
function getPriority(type: string): number {
  const priorities: Record<string, number> = {
    'anchor': 4,
    'riser_clamp': 3,
    'guide': 2,
    'hanger': 1,
    'slide': 2,
  };
  return priorities[type] || 0;
}

/**
 * Generate a text-based visual diagram of the support layout
 */
export function generateLayoutDiagram(layout: SupportLayout, length: number): string {
  const scale = 60; // characters for full length
  const positions = layout.supports.map(s => ({
    char: s.type === 'anchor' ? '▼' : s.type === 'guide' ? '●' : s.type === 'riser_clamp' ? '◆' : '○',
    pos: Math.round((s.position / length) * scale),
    type: s.type,
  }));
  
  // Build the pipe line
  let line = '═'.repeat(scale + 1);
  let markers = ' '.repeat(scale + 1);
  
  // Place markers
  for (const p of positions) {
    line = line.substring(0, p.pos) + p.char + line.substring(p.pos + 1);
  }
  
  // Build legend
  const legend = `
Legend: ▼ = Anchor  ● = Guide  ○ = Hanger  ◆ = Riser Clamp

[START]${line}[END]
0 ft${' '.repeat(scale - 8)}${length} ft
`;
  
  return legend;
}

/**
 * Common pipe run scenarios
 */
export const COMMON_SCENARIOS = {
  tank_to_tank: {
    name: 'Tank to Tank',
    description: 'Horizontal run connecting two tanks or vessels',
    startType: 'equipment' as PipeEndType,
    endType: 'equipment' as PipeEndType,
    notes: [
      'NO anchors on equipment connections',
      'Use guides for lateral control',
      'Allow thermal expansion at both ends',
    ],
  },
  pump_to_equipment: {
    name: 'Pump to Equipment',
    description: 'Connection from pump discharge to process equipment',
    startType: 'equipment' as PipeEndType,
    endType: 'equipment' as PipeEndType,
    notes: [
      'NO anchors - allow pump vibration isolation',
      'Support near pump to reduce transmitted vibration',
      'Flexible connection may be required at pump',
    ],
  },
  anchor_to_anchor: {
    name: 'Anchor to Anchor',
    description: 'Fixed run between two anchor points',
    startType: 'anchor' as PipeEndType,
    endType: 'anchor' as PipeEndType,
    notes: [
      'Maximum thermal expansion occurs at midpoint',
      'May need expansion loop if long run',
      'Guides control lateral movement',
    ],
  },
  anchor_to_elbow: {
    name: 'Anchor to Elbow',
    description: 'Run from fixed point to direction change',
    startType: 'anchor' as PipeEndType,
    endType: 'elbow' as PipeEndType,
    notes: [
      'Guide required after elbow for thermal control',
      'Guide distance depends on run length to elbow',
      'Elbow provides flexibility for thermal expansion',
    ],
  },
  elbow_to_elbow: {
    name: 'Elbow to Elbow',
    description: 'Run between two direction changes',
    startType: 'elbow' as PipeEndType,
    endType: 'elbow' as PipeEndType,
    notes: [
      'Guides required after both elbows',
      'This is a flexible run - no anchors typically needed',
      'Elbows absorb thermal expansion',
    ],
  },
  vertical_riser: {
    name: 'Vertical Riser',
    description: 'Vertical pipe run',
    startType: 'riser_bottom' as PipeEndType,
    endType: 'riser_top' as PipeEndType,
    notes: [
      'Riser clamp at TOP carries deadweight',
      'Guides prevent buckling for long risers (>3× span)',
      'Bottom typically connects to horizontal run',
    ],
  },
  branch_takeoff: {
    name: 'Branch from Main',
    description: 'Branch piping from main run',
    startType: 'tee_branch' as PipeEndType,
    endType: 'open' as PipeEndType,
    notes: [
      'Anchor goes on MAIN pipe, not branch',
      'First branch support at 25-100% of span from main centerline',
      'Branch guide within 1.5× span for thermal control',
    ],
  },
};
