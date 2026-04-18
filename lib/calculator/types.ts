// Pipe Support Calculator Types
// Based on Section 40 05 19 - Pipe Supports and Anchors (Rev. 3)

export type PipeMaterial = 
  | 'PVC Schedule 40'
  | 'PVC Schedule 80'
  | 'CPVC'
  | 'PP'
  | 'PVDF'
  | 'Carbon Steel'
  | 'Stainless Steel'
  | 'Copper'
  | 'SS Tubing'
  | 'Copper Tubing';

export type Service = 'water' | 'vapor';

export type Orientation = 'horizontal' | 'vertical';

export type MountingMethod = 'rack' | 'hanging' | 'trapeze' | 'floor' | 'wall';

export type LocationType = 
  | 'subfab_rack'
  | 'eor_rack'
  | 'individual_run'
  | 'utility_main'
  | 'lateral_rack_poc';

export type SupportType = 
  | 'hanger'
  | 'braced_hanger'
  | 'guide'
  | 'anchor'
  | 'slide'
  | 'riser_clamp'
  | 'rack_support'
  | 'trapeze_hanger'
  | 'floor_stand'
  | 'wall_bracket'
  | 'continuous';

export type ComponentWeight = 'light' | 'medium' | 'heavy';

export interface CalculatorInput {
  // Pipe Properties
  material: PipeMaterial;
  lineClass?: string;
  pipeSize: string;
  service: Service;
  temperature: number;
  specificGravity: number;
  
  // Installation Details
  pipeLength: number;
  orientation: Orientation;
  mountingMethod: MountingMethod;
  locationType: LocationType;
  
  // Environment
  isIndoor: boolean;
  isCorrosive: boolean;
  isInsulated: boolean;
  
  // Elbow & Guide Distance (Thermal Expansion)
  hasElbow: boolean;
  anchorToElbowDistance?: number; // Distance from nearest anchor to elbow (ft)
  
  // Continuation from Riser
  isFromRiser?: boolean; // Is this horizontal pipe continuing from a riser?
  riserLength?: number; // Length of the riser this continues from (ft)
  
  // In-line Components
  hasInlineComponent: boolean;
  componentWeight?: ComponentWeight;
  
  // Special Configurations
  hasFlexibleCoupling: boolean;
  isEquipmentConnection: boolean;
  isExpansionLoop: boolean; // Is this part of an expansion loop?
  expansionLoopLeg?: 'offset' | 'connecting'; // Which leg of expansion loop?
  isSeismicInterface: boolean; // Does this cross a seismic movement interface?
  
  // Branch Piping
  isBranchPipe: boolean;
  branchOrientation?: 'horizontal_from_horizontal' | 'horizontal_from_vertical';
  branchDistanceFromAnchor?: number; // Distance from branch to run anchor (ft)
  
  // Double-Wall / Special
  isDoubleWall: boolean;
  carrierPipeMaterial?: string;
  carrierPipeTemp?: number;
  isPPDWSafetyShower?: boolean; // Special 3" PPDW case
  
  // Plastic Piping (40 05 19, Section 1.5.K)
  hasPlasticFitting?: boolean; // Has elbow/tee/wye that needs 18" support
  plasticFittingType?: 'elbow' | 'tee' | 'wye';
}

export interface Citation {
  document: string;
  section?: string;
  table?: string;
  page?: number;
  description?: string;
}

export interface HardwareRecommendation {
  productName: string;
  manufacturer: string;
  partNumber?: string;
  assemblyDrawing?: string;
  productUrl?: string;
}

export interface CalculatorOutput {
  // Input echo (for display)
  input: CalculatorInput;
  
  // Calculations
  calculations: {
    baseMaxSpan: number;
    adjustedMaxSpan: number;
    guideSpacing: number;
    numberOfSpans: number;
    numberOfSupports: number;
    spanReductionApplied: boolean;
    spanReductionReason?: string;
    guideSpacingReduced?: boolean;
    // Guide distance from elbow (thermal expansion)
    minGuideFromElbow?: number;
    // Continuation from riser
    minSupportFromRiserElbow?: number;
    // Branch piping
    minBranchGuideFromRun?: number;
    // Short run can use guide as anchor
    canUseGuideAsAnchor?: boolean;
    guideAsAnchorDistance?: number;
  };
  
  // Support Types
  supportTypes: {
    deadweight: SupportType;
    lateral: SupportType;
    axial: SupportType | null;
  };
  
  // Hardware
  hardware: {
    deadweight?: HardwareRecommendation;
    lateral?: HardwareRecommendation;
    axial?: HardwareRecommendation;
  };
  
  // Tolerance
  tolerance: {
    placementToleranceInches: number | 'per_design';
    fieldAccuracy: string;
    isCritical: boolean;
  };
  
  // Flags
  flags: {
    cushAClampEligible: boolean;
    requiresContinuousSupport: boolean;
    isPlastic: boolean;
    isLongRiser?: boolean;
    requiresStainless316: boolean;
    interpolationUsed: boolean;
  };
  
  // Citations
  citations: {
    maxSpan: Citation;
    guideSpacing: Citation;
    hardware: Citation;
    tolerance: Citation;
    sgCorrection?: Citation;
  };
  
  // Warnings
  warnings: string[];
}

// Material classification helpers
export const PLASTIC_MATERIALS: PipeMaterial[] = [
  'PVC Schedule 40',
  'PVC Schedule 80',
  'CPVC',
  'PP',
  'PVDF'
];

export const METAL_MATERIALS: PipeMaterial[] = [
  'Carbon Steel',
  'Stainless Steel',
  'Copper',
  'SS Tubing',
  'Copper Tubing'
];

export function isPlasticMaterial(material: PipeMaterial): boolean {
  return PLASTIC_MATERIALS.includes(material);
}

export function isMetalMaterial(material: PipeMaterial): boolean {
  return METAL_MATERIALS.includes(material);
}

export function parsePipeSize(size: string): number {
  // Convert pipe size string to number
  const sizeMap: Record<string, number> = {
    '1/4': 0.25,
    '3/8': 0.375,
    '1/2': 0.5,
    '3/4': 0.75,
    '1': 1,
    '1-1/4': 1.25,
    '1 1/4': 1.25,
    '1-1/2': 1.5,
    '1 1/2': 1.5,
    '2': 2,
    '2-1/2': 2.5,
    '2 1/2': 2.5,
    '3': 3,
    '3-1/2': 3.5,
    '3 1/2': 3.5,
    '4': 4,
    '6': 6,
    '8': 8,
    '10': 10,
    '12': 12,
  };
  
  const cleanSize = size.replace(/"/g, '').replace('inch', '').trim();
  return sizeMap[cleanSize] || parseFloat(cleanSize) || 0;
}

// Pipe size options for UI
export const PIPE_SIZES = [
  '1/2"',
  '3/4"',
  '1"',
  '1-1/4"',
  '1-1/2"',
  '2"',
  '2-1/2"',
  '3"',
  '3-1/2"',
  '4"',
  '6"',
  '8"',
  '10"',
  '12"',
];

// Material options for UI with metadata
export const MATERIAL_OPTIONS = [
  { value: 'PVC Schedule 40', label: 'PVC Schedule 40', type: 'plastic', lineClass: 'PV' },
  { value: 'PVC Schedule 80', label: 'PVC Schedule 80', type: 'plastic', lineClass: 'PV' },
  { value: 'CPVC', label: 'CPVC', type: 'plastic', lineClass: 'CP' },
  { value: 'PP', label: 'Polypropylene (PP)', type: 'plastic', lineClass: 'PP' },
  { value: 'PVDF', label: 'PVDF', type: 'plastic', lineClass: 'PF' },
  { value: 'Carbon Steel', label: 'Carbon Steel', type: 'metal', lineClass: 'CC' },
  { value: 'Stainless Steel', label: 'Stainless Steel', type: 'metal', lineClass: 'SA' },
  { value: 'Copper', label: 'Copper', type: 'metal', lineClass: 'BK' },
  { value: 'SS Tubing', label: 'Stainless Steel Tubing', type: 'metal', lineClass: 'SA8X' },
  { value: 'Copper Tubing', label: 'Copper Tubing', type: 'metal', lineClass: 'BK' },
];

// Mounting method options for UI
export const MOUNTING_METHOD_OPTIONS = [
  { 
    value: 'hanging', 
    label: 'Hanging', 
    description: 'Pipe hangs from structure above',
    icon: 'ArrowDown'
  },
  { 
    value: 'rack', 
    label: 'Rack-Mounted', 
    description: 'Pipe sits on rack structure',
    icon: 'LayoutGrid'
  },
  { 
    value: 'trapeze', 
    label: 'Trapeze', 
    description: 'Multiple pipes on shared support',
    icon: 'Layers'
  },
  { 
    value: 'floor', 
    label: 'Floor-Mounted', 
    description: 'Pipe on floor stands',
    icon: 'Square'
  },
  { 
    value: 'wall', 
    label: 'Wall-Mounted', 
    description: 'Pipe attached to wall',
    icon: 'PanelRight'
  },
];

// Location type options for UI
export const LOCATION_TYPE_OPTIONS = [
  { 
    value: 'subfab_rack', 
    label: 'Subfab Lateral Rack', 
    tolerance: '0"',
    critical: true
  },
  { 
    value: 'eor_rack', 
    label: 'EOR Engineered Rack', 
    tolerance: '1/2"',
    critical: true
  },
  { 
    value: 'individual_run', 
    label: 'Individual Pipe Run', 
    tolerance: '6"',
    critical: false
  },
  { 
    value: 'utility_main', 
    label: 'Utility Main/Sub-main', 
    tolerance: '1"',
    critical: false
  },
  { 
    value: 'lateral_rack_poc', 
    label: 'Lateral Rack / POC / Tool Install', 
    tolerance: '±1/4"',
    critical: true
  },
];
