// Visual Pipe Designer Types
// Supports ASME B31.3-2024 compliance

// ============================================================================
// Environment Types
// ============================================================================

export type EnvironmentType = 
  | 'pipe_rack'        // Multi-level pipe rack
  | 'subfab'           // Sub-fab cleanroom support
  | 'equipment_area'   // Near equipment (pumps, tanks)
  | 'utility_corridor' // Wall-mounted utility runs
  | 'outdoor'          // Outdoor installations
  | 'seismic_zone';    // High seismic area

export interface EnvironmentConfig {
  type: EnvironmentType;
  label: string;
  icon: string;
  description: string;
  toleranceClass: 'critical' | 'standard' | 'loose';
  defaultMounting: MountingMethod;
}

// ============================================================================
// Pipe & Material Types
// ============================================================================

export type PipeMaterial = 
  | 'Carbon Steel'
  | 'Stainless Steel'
  | 'PVC Schedule 40'
  | 'PVC Schedule 80'
  | 'CPVC'
  | 'PP'
  | 'PVDF'
  | 'Copper'
  | 'Copper Tubing'
  | 'SS Tubing';

export type ServiceType = 'water' | 'vapor' | 'gas' | 'chemical';

export type MountingMethod = 'rack' | 'hanging' | 'trapeze' | 'floor' | 'wall';

export interface PipeDefaults {
  material: PipeMaterial;
  size: string;
  temperature: number;
  service: ServiceType;
  insulated: boolean;
  insulationThickness?: number;
}

// ============================================================================
// Node Types for React Flow
// ============================================================================

export type DesignerNodeType = 
  | 'pipe_horizontal'
  | 'pipe_vertical'
  | 'pipe_sloped'
  | 'elbow_90'
  | 'elbow_45'
  | 'tee'
  | 'wye'
  | 'reducer'
  | 'anchor'
  | 'equipment'
  | 'open_end'
  | 'valve'
  | 'flex_coupling'
  | 'expansion_joint'
  | 'support';

export interface PipeNodeData {
  type: 'pipe_horizontal' | 'pipe_vertical' | 'pipe_sloped';
  length: number;           // feet
  material?: PipeMaterial;  // override default
  size?: string;            // override default
  temperature?: number;     // override default
  slope?: number;           // degrees, for sloped pipes
  label?: string;
}

export interface FittingNodeData {
  type: 'elbow_90' | 'elbow_45' | 'tee' | 'wye' | 'reducer';
  angle?: number;           // for elbows
  radius?: 'long' | 'short'; // elbow radius
  branchSize?: string;      // for tees
  reducedSize?: string;     // for reducers
  position: number;         // distance from start
}

export interface EndpointNodeData {
  type: 'anchor' | 'equipment' | 'open_end';
  equipmentType?: EquipmentType;
  equipmentName?: string;
  nozzleSize?: string;
  allowsMovement?: boolean;
}

export interface ValveNodeData {
  type: 'valve';
  valveType: 'gate' | 'ball' | 'globe' | 'butterfly' | 'check' | 'control' | 'relief';
  size?: string;
  weight?: 'light' | 'medium' | 'heavy';
  position: number;
}

export interface SupportNodeData {
  type: 'support';
  supportType: 'anchor' | 'guide' | 'hanger' | 'slide' | 'riser_clamp';
  position: number;
  isCalculated: boolean;    // auto-placed by system
  isManual: boolean;        // manually placed by user
  reason?: string;
}

// ============================================================================
// Equipment Types
// ============================================================================

export type EquipmentType = 
  | 'tank'
  | 'vessel'
  | 'pump'
  | 'compressor'
  | 'heat_exchanger'
  | 'filter'
  | 'control_valve'
  | 'flow_meter'
  | 'chiller'
  | 'safety_shower';

export interface EquipmentConfig {
  type: EquipmentType;
  label: string;
  icon: string;
  hasVibration: boolean;
  hasThermalGrowth: boolean;
  nozzleLoadSensitive: boolean;
}

// ============================================================================
// Designer State
// ============================================================================

export interface DesignerState {
  // Project info
  projectName: string;
  
  // Environment
  environment: EnvironmentType;
  isIndoor: boolean;
  isCorrosive: boolean;
  seismicZone: boolean;
  
  // Defaults
  defaults: PipeDefaults;
  
  // Selected element
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // Active tool
  activeTool: DesignerTool;
  
  // Calculation results
  calculationResults: CalculationResult | null;
  warnings: DesignerWarning[];
  
  // Code compliance
  codeStandard: 'ASME_B31_3' | '40_05_19';
}

export type DesignerTool = 
  | 'select'
  | 'pipe'           // Draw continuous pipe runs
  | 'pipe_horizontal'
  | 'pipe_vertical'
  | 'elbow'
  | 'tee'
  | 'wye'
  | 'anchor'
  | 'equipment'
  | 'valve'
  | 'delete';

// ============================================================================
// Calculation & Results
// ============================================================================

export interface CalculationResult {
  totalLength: number;
  maxSpan: number;
  adjustedSpan: number;
  thermalExpansion: number;  // inches
  supportsNeeded: number;
  anchors: number;
  guides: number;
  hangers: number;
  codeCompliant: boolean;
}

export interface DesignerWarning {
  id: string;
  severity: 'error' | 'warning' | 'info';
  code: string;           // e.g., "B31.3-321.4"
  message: string;
  nodeId?: string;        // related node
  suggestion?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const ENVIRONMENT_CONFIGS: Record<EnvironmentType, EnvironmentConfig> = {
  pipe_rack: {
    type: 'pipe_rack',
    label: 'Pipe Rack',
    icon: '🏗️',
    description: 'Multi-level pipe rack structure',
    toleranceClass: 'critical',
    defaultMounting: 'rack',
  },
  subfab: {
    type: 'subfab',
    label: 'Sub-Fab',
    icon: '📦',
    description: 'Below cleanroom, critical tolerance',
    toleranceClass: 'critical',
    defaultMounting: 'hanging',
  },
  equipment_area: {
    type: 'equipment_area',
    label: 'Equipment Area',
    icon: '🏭',
    description: 'Near pumps, tanks, vessels',
    toleranceClass: 'standard',
    defaultMounting: 'floor',
  },
  utility_corridor: {
    type: 'utility_corridor',
    label: 'Utility Corridor',
    icon: '🚶',
    description: 'Wall-mounted utility runs',
    toleranceClass: 'standard',
    defaultMounting: 'wall',
  },
  outdoor: {
    type: 'outdoor',
    label: 'Outdoor',
    icon: '🌤️',
    description: 'Outdoor installations',
    toleranceClass: 'loose',
    defaultMounting: 'floor',
  },
  seismic_zone: {
    type: 'seismic_zone',
    label: 'Seismic Zone',
    icon: '⚡',
    description: 'High seismic area - special bracing',
    toleranceClass: 'critical',
    defaultMounting: 'hanging',
  },
};

export const EQUIPMENT_CONFIGS: Record<EquipmentType, EquipmentConfig> = {
  tank: { type: 'tank', label: 'Tank/Vessel', icon: '🏭', hasVibration: false, hasThermalGrowth: true, nozzleLoadSensitive: true },
  vessel: { type: 'vessel', label: 'Pressure Vessel', icon: '⚗️', hasVibration: false, hasThermalGrowth: true, nozzleLoadSensitive: true },
  pump: { type: 'pump', label: 'Pump', icon: '🔧', hasVibration: true, hasThermalGrowth: false, nozzleLoadSensitive: true },
  compressor: { type: 'compressor', label: 'Compressor', icon: '🌀', hasVibration: true, hasThermalGrowth: false, nozzleLoadSensitive: true },
  heat_exchanger: { type: 'heat_exchanger', label: 'Heat Exchanger', icon: '🔥', hasVibration: false, hasThermalGrowth: true, nozzleLoadSensitive: true },
  filter: { type: 'filter', label: 'Filter/Strainer', icon: '🔲', hasVibration: false, hasThermalGrowth: false, nozzleLoadSensitive: false },
  control_valve: { type: 'control_valve', label: 'Control Valve', icon: '⊳⊲', hasVibration: false, hasThermalGrowth: false, nozzleLoadSensitive: false },
  flow_meter: { type: 'flow_meter', label: 'Flow Meter', icon: '◎', hasVibration: false, hasThermalGrowth: false, nozzleLoadSensitive: false },
  chiller: { type: 'chiller', label: 'Chiller', icon: '❄️', hasVibration: true, hasThermalGrowth: true, nozzleLoadSensitive: true },
  safety_shower: { type: 'safety_shower', label: 'Safety Shower', icon: '🚿', hasVibration: false, hasThermalGrowth: false, nozzleLoadSensitive: false },
};

export const VALVE_TYPES = [
  { value: 'gate', label: 'Gate Valve', icon: '><', weight: 'medium' },
  { value: 'ball', label: 'Ball Valve', icon: '◉', weight: 'light' },
  { value: 'globe', label: 'Globe Valve', icon: '▷◁', weight: 'heavy' },
  { value: 'butterfly', label: 'Butterfly Valve', icon: '🦋', weight: 'light' },
  { value: 'check', label: 'Check Valve', icon: '◄►', weight: 'medium' },
  { value: 'control', label: 'Control Valve', icon: '⊳⊲', weight: 'heavy' },
  { value: 'relief', label: 'Relief Valve', icon: '⊠', weight: 'medium' },
] as const;

// Pipe size options
export const PIPE_SIZES = [
  '1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '2-1/2"', '3"', '4"', '6"', '8"', '10"', '12"'
];

// Material options with properties
export const MATERIAL_OPTIONS: { value: PipeMaterial; label: string; type: 'metal' | 'plastic' }[] = [
  { value: 'Carbon Steel', label: 'Carbon Steel', type: 'metal' },
  { value: 'Stainless Steel', label: 'Stainless Steel', type: 'metal' },
  { value: 'Copper', label: 'Copper', type: 'metal' },
  { value: 'Copper Tubing', label: 'Copper Tubing', type: 'metal' },
  { value: 'SS Tubing', label: 'SS Tubing', type: 'metal' },
  { value: 'PVC Schedule 40', label: 'PVC Schedule 40', type: 'plastic' },
  { value: 'PVC Schedule 80', label: 'PVC Schedule 80', type: 'plastic' },
  { value: 'CPVC', label: 'CPVC', type: 'plastic' },
  { value: 'PP', label: 'Polypropylene (PP)', type: 'plastic' },
  { value: 'PVDF', label: 'PVDF', type: 'plastic' },
];
