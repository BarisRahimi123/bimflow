"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  FileText,
  Wrench,
  Settings,
  Target,
  Eye as EyeIcon,
  Hammer,
  ShieldCheck,
  Upload,
  FolderArchive,
  BookOpen,
  ExternalLink,
  Lightbulb,
  X,
  Maximize2,
  Minimize2,
  MessageSquare,
  Paperclip,
  ClipboardCheck,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PhaseAudio } from "@/components/phase-audio";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false });

// Phase narration audio (ElevenLabs exports dropped in /public/audio/playbook).
// Phase 1 is split into 5 parts; phases 2–7 are a single track each.
const PHASE_AUDIO: Record<string, string[]> = {
  setup: [
    "/audio/playbook/phase-1-1.mp3",
    "/audio/playbook/phase-1-2.mp3",
    "/audio/playbook/phase-1-3.mp3",
    "/audio/playbook/phase-1-4.mp3",
    "/audio/playbook/phase-1-5.mp3",
  ],
  scope: ["/audio/playbook/phase-2.mp3"],
  pid: ["/audio/playbook/phase-3.mp3"],
  model: ["/audio/playbook/phase-4.mp3"],
  check: ["/audio/playbook/phase-5.mp3"],
  coordinate: ["/audio/playbook/phase-6.mp3"],
  field: ["/audio/playbook/phase-7.mp3"],
};

interface Step {
  id: string;
  title: string;
  action: string;
  why: string;
  source: string;
  documentId?: string;
  toolRoute?: string;
  toolLabel?: string;
  checklist?: string[];
  checklistPages?: Record<number, number>; // checklist index → PDF page number
  checklistSearchTexts?: Record<number, string>; // checklist index → text to search + highlight in PDF
}

interface Phase {
  id: string;
  number: number;
  title: string;
  icon: typeof Settings;
  color: string;
  steps: Step[];
}

const PHASES: Phase[] = [
  {
    id: 'setup',
    number: 1,
    title: 'Project Setup',
    icon: Settings,
    color: 'blue',
    steps: [
      {
        id: 's1',
        title: 'Load Shared Parameters',
        action: 'Download the Owner Shared Parameters .txt file and load it into Revit via Manage > Shared Parameters. Add all parameters as Instance with "Values can vary by group instance" enabled.',
        why: 'Every model element must carry INT_PKG_Name and INT_SSID parameters. Without these, your model will fail the ICS audit.',
        source: 'Shared Parameters Revit Guide',
        documentId: 'shared-params-guide',
        checklist: [
          'Download Shared Parameters .txt from BIM 360 (GC > CAD Standards folder)',
          'Open Revit > Manage tab > Shared Parameters > Browse > select the .txt file',
          'Add parameters from both "Package" and "Required" parameter groups',
          'Set all parameters as Instance with "Values can vary by group instance"',
          'Verify params appear on a test element in the Properties panel',
        ],
        checklistSearchTexts: {
          0: 'BIM 360',
          1: 'Shared Parameters',
          2: 'Parameter Groups',
          3: 'Values can vary by group',
          4: 'Properties',
        },
      },
      {
        id: 's2',
        title: 'Set Shared Coordinates and Software',
        action: 'Set origin point, survey point, and project base point to match DMS templates exactly. Use the project-specific Revit version only. Use campus local (building) coordinates.',
        why: 'Coordinate points are machine-audited. Wrong coordinates = model appears in wrong location. Wrong Revit version = file incompatibility across the entire project.',
        source: 'CPEP Section 3 + ICS',
        documentId: 'cpep-wip',
        checklist: [
          'Use ONLY the project-specific Revit version (CPEP 3.1.1)',
          'Set building models to campus local coordinate system (CPEP 3.2)',
          'Set origin, survey point, and project base point to match DMS templates',
          'Use Imperial units as primary (metric only for metric-designated systems) (CPEP 3.4)',
          'Model accurately -- no rounding of dimensions (CPEP 3.3)',
          'If modeling in non-Autodesk software, provide DWGs aligned to project coordinate system (CPEP 3.1.3.1)',
          'Provide any object enablers used to Contractor (CPEP 3.1.2)',
        ],
        checklistSearchTexts: {
          0: 'authoring software',
          1: 'campus local',
          2: 'survey point',
          3: 'Imperial',
          4: 'rounding',
          5: 'non-Autodesk',
          6: 'object enabler',
        },
      },
      {
        id: 's3',
        title: 'Configure File Naming and BIM 360',
        action: 'Name files per project naming standards. Set up BIM 360 access. Install Newforma Konekt add-in for Navisworks and your authoring software.',
        why: 'File naming is audited. BIM 360 is the common data environment. Newforma Konekt is required for all coordination issue tracking.',
        source: 'CPEP Sections 4.1, 4.2, 4.3',
        documentId: 'cpep-wip',
        checklist: [
          'Label files with correct type designator: DM (Design), CM (Construction), FM (Federated), EM (Existing), XM (Deleted scope) (CPEP 4.1)',
          'Follow the project layer & naming standard for all files (CPEP 4.1.6)',
          'Sign NDA and submit Contact List Request Form for BIM 360 access (CPEP 4.2.1.5)',
          'Install Newforma Konekt add-in for Navisworks Manage (CPEP 4.3.1.1)',
          'Install Newforma Konekt add-in for Revit/AutoCAD/Plant 3D (recommended) (CPEP 4.3.1.1)',
          'Strongly recommended: host central models on BIM 360 (CPEP 3.1.1.1)',
          'Upload CM NWCs + source files (DWG, RVT) to applicable BIM 360 folders (CPEP 4.2.1.2)',
          'Divide CMs by level and coordination model sectors (CPEP 4.5.4)',
        ],
        checklistSearchTexts: {
          0: 'type designator',
          1: 'naming standard',
          2: 'NDA',
          3: 'Newforma Konekt',
          4: 'Navisworks',
          5: 'central model',
          6: 'source files',
          7: 'coordination model sectors',
        },
      },
      {
        id: 's4',
        title: 'Set Up Worksets, Phases, and 3D Attributes',
        action: 'Create worksets for demand loading only. Set phases. Tag all model geometry with the required 3D object attributes listed in CPEP Appendix 3.2.',
        why: 'Audit checks worksets and design options. Missing attributes block IFF approval. Re-use of DM geometry in CM files is prohibited.',
        source: 'CPEP Sections 3.5, 4.5 + ICS',
        documentId: 'cpep-wip',
        checklist: [
          'Create worksets for demand loading only (not visibility control)',
          'Set minimum phases: Existing Condition + New Construction',
          'Tag ALL model geometry with defined attributes per Appendix 3.2',
          'Do NOT re-use DM geometry in CM files -- detail with accurate dimensions and products (CPEP 4.5.1)',
          'Pre-populate IFF tag metadata at the object geometry level (CPEP 7.3.2.1)',
          'Remove all design options before IFC submission',
        ],
        checklistSearchTexts: {
          0: 'workset',
          1: 'Existing Condition',
          2: 'Appendix 3',
          3: 'DM geometry',
          4: 'IFF tag metadata',
          5: 'design options',
        },
      },
    ],
  },
  {
    id: 'scope',
    number: 2,
    title: 'Know Your Scope',
    icon: Target,
    color: 'purple',
    steps: [
      {
        id: 's5',
        title: 'Understand the BIM Workflow (CPEP)',
        action: 'The CPEP defines the entire BIM lifecycle. Understand the file types (DM/CM/FM/EM), the document hierarchy, the coordination workflow, and the IFF process. This is the contract.',
        why: 'Everything you do must align with this workflow. Non-compliance puts your company at financial risk -- final payment is withheld until record models are approved (CPEP 9.1.5).',
        source: 'CPEP BIM 3D Design WIP',
        documentId: 'cpep-wip',
        checklist: [
          'Understand file types: DM (Design Model), CM (Construction Model), FM (Federated Model), EM (Existing), XM (Deleted scope)',
          'Know the document hierarchy when conflicts arise: (1) Specs/addenda, (2) P&ID, (3) Certified 2D > certified 3D, (4) Certified 3D > certified 2D, (5) More detailed scale governs (CPEP 4.4.4)',
          'Understand FM structure: FM = CM NWD + DM_ISSUED NWD + DM_WIP NWD (CPEP 4.7.1)',
          'FMs are published as NWDs split by Building/Level/Model Sectors (CPEP 4.7.2)',
          'Upload CM files to BIM 360 at least 2x per week and 1 day before next meeting (CPEP 4.5.3)',
          'Know your subcontractor routing priority: on-time IFF = routing priority. Late = route around others (CPEP 5.5)',
          'Monumental scope has routing priority (OSM modules, large bore duct, structural steel, racks) (CPEP 5.5.1)',
          'Field walk: you must walk proposed routing in existing footprints to verify clash-free before IFF or installation (CPEP 4.8.1)',
          'Existing model dimensions require field validation before modeling, fabrication, or installation (CPEP 4.6.1.1)',
        ],
        checklistSearchTexts: {
          0: 'Design Model',
          1: 'document hierarchy',
          2: 'Federated Model',
          3: 'NWD',
          4: '2x per week',
          5: 'routing priority',
          6: 'Monumental',
          7: 'field walk',
          8: 'field validation',
        },
      },
      {
        id: 's6',
        title: 'Meet LOD 400 Requirements (Process)',
        action: 'Process piping = LOD 400 (fabrication accuracy). Every pipe segment, fitting, valve, instrument, and support must be modeled to shop-drawing accuracy with full metadata.',
        why: 'Omitting details like hanger brackets or valve handle swings creates false clearance in clash reports and causes field rework. Missing metadata blocks IFF approval.',
        source: 'BIM Manual Section 04-06 + A-7 LOD Matrix',
        documentId: 'bim-manual-v2',
        checklist: [
          'Model each pipe segment to fabrication accuracy with correct OD',
          'Model all fittings (elbows, tees, reducers, flanges) at exact locations',
          'Model all valves with correct body size AND handle swing clearance zone',
          'Model all instruments at their correct mounting locations',
          'Model all pipe supports (hangers, guides, anchors) at calculated positions',
          'Show true outer diameters INCLUDING insulation thickness',
          'Add slope on all gravity drain lines',
          'Include pull space, access zones, and maintenance clearances (65% transparency recommended)',
          'Use 3D solids only -- no meshes or surfaces',
          'Avoid over-detailing internals (e.g., pump impellers) -- combine small fittings into assemblies for performance',
          'Fill metadata on EVERY object: Tag ID, System Service (PW/CW/DW), Material, Nominal Size, Elevation (TOS and BOS), IFF Status',
          'Assign real material codes from spec list -- never use generic materials',
          'Use shared project coordinates for all equipment -- never unlinked coordinates',
        ],
        checklistSearchTexts: {
          0: 'fabrication accuracy',
          1: 'fittings',
          2: 'valve',
          3: 'instruments',
          4: 'pipe support',
          5: 'insulation thickness',
          6: 'slope',
          7: 'maintenance clearance',
          8: '3D solid',
          9: 'assemblies',
          10: 'Tag ID',
          11: 'material code',
          12: 'shared project coordinates',
        },
        toolRoute: '/calculator',
        toolLabel: 'Pipe Support Calculator',
      },
      {
        id: 's7',
        title: 'Memorize Your Tolerances',
        action: 'Check A-9 before moving any element. Subfab racks = 0". Process piping in EOR racks = 1/2". Individual runs = 6". Use the Tolerance Lookup tool for quick reference.',
        why: 'Moving elements outside tolerance without an RFI is a contract violation. Even within-tolerance changes must be tracked in BIM Track.',
        source: 'A-9 Change Management',
        documentId: 'a9-change-mgmt-pdf',
        toolRoute: '/resources/tolerance',
        toolLabel: 'Tolerance Lookup',
      },
    ],
  },
  {
    id: 'pid',
    number: 3,
    title: 'Read the P&ID',
    icon: EyeIcon,
    color: 'indigo',
    steps: [
      {
        id: 's8',
        title: 'Learn P&ID Symbols',
        action: 'Review OCS Legend Sheets 1-4 to understand piping symbols, valve types, instrument tags, and line designations used on this project.',
        why: 'P&IDs are the source of truth for what piping systems exist, how they connect, and what services they carry. You cannot model correctly without reading the P&ID.',
        source: 'OCS Legend Sheets 1-4',
        documentId: 'ocs-legend-1',
      },
      {
        id: 's9',
        title: 'Extract Piping Data',
        action: 'Upload your P&ID to PIDFlow for AI-powered extraction of line numbers, materials, sizes, and service codes. Verify extracted data before using it.',
        why: 'Automated extraction saves hours of manual P&ID reading and reduces transcription errors.',
        source: 'PIDFlow Upload Tool',
        toolRoute: '/upload',
        toolLabel: 'Upload P&ID',
      },
    ],
  },
  {
    id: 'model',
    number: 4,
    title: 'Model Piping and Supports',
    icon: Hammer,
    color: 'emerald',
    steps: [
      {
        id: 's10',
        title: 'Stage 1: Identify Pipe Run',
        action: 'Before touching the model, gather all the information about this pipe run from the P&ID and spec sheets. This is your pre-modeling data collection -- get it right and everything downstream is easy.',
        why: 'Every calculation and placement decision depends on these inputs. Wrong material or temperature = wrong span = wrong support count = failed audit.',
        source: '40 05 19, Part 1 + P&ID',
        documentId: 'pipe-supports-r3',
        checklist: [
          'Identify pipe material from P&ID line class (CS, SS, copper, PVC 40/80, CPVC, PP, PVDF)',
          'Identify pipe size (NPS) from P&ID line designation',
          'Identify service type: water (liquid) or vapor -- from P&ID service code',
          'Identify operating temperature from process data sheets or P&ID notes',
          'Identify specific gravity if fluid is heavier than water (SG > 1.0)',
          'Identify pipe location: subfab rack / EOR rack / individual run / utility main',
          'Check if system requires pipe stress engineering -- if yes, A/E designs supports, not you (40 05 19, 1.2)',
          'Check if pipe is in a corrosive area per drawing 100AZ0206 -- changes all hardware to 316/316L SS',
          'Check if pipe is indoor or outdoor -- affects Cush-a-Clamp eligibility',
          'Identify insulation requirements and thickness -- you MUST include this in pipe OD',
        ],
        checklistSearchTexts: {
          6: 'pipe stress',       // sec 1.2: pipe stress engineering scope
          7: '316L',              // sec 2.3.A: corrosive area → 316/316L SS
          8: 'Cush-a-Clamp',     // sec 1.5.K: indoor/outdoor Cush-a-Clamp rule
        },
        toolRoute: '/upload',
        toolLabel: 'Extract from P&ID',
      },
      {
        id: 's11',
        title: 'Stage 2: Calculate Support Spacing',
        action: 'Use the span tables (40 05 19.01) to find the maximum support spacing for your pipe. Apply corrections for specific gravity and special conditions. Then calculate how many supports you need.',
        why: 'The span table is the foundation. Every support placement, guide spacing, and anchor location derives from this number.',
        source: '40 05 19.01 Span Tables',
        documentId: 'span-tables-r0',
        toolRoute: '/calculator',
        toolLabel: 'Pipe Support Calculator',
        checklist: [
          'Look up base max span: Material + Size + Temperature + Service in 40 05 19.01 tables',
          'If SG > 1.0: multiply span by correction factor from the SG table in 40 05 19.01',
          'If direction change (metal): reduce span to 70% OR support within 20% of span from elbow (40 05 19, App 1)',
          'If in-line component 10-30% of span weight: reduce span to 70% (40 05 19, App 1)',
          'If in-line component >30% of span weight: support within 25% of span from each side (40 05 19, App 1)',
          'If plastic fitting in horizontal plane: support within 18 inches of centerline (40 05 19, 1.5.K)',
          'Calculate number of supports: CEILING(pipe length / adjusted span) + 1',
          'Calculate guide spacing: 2x the deadweight span (40 05 19, App 1)',
          'If span < 2.5 ft: use continuous support instead of individual supports (40 05 19.01)',
        ],
        checklistPages: {
          0: 2, // span lookup table
          1: 3, // SG correction table
          2: 5, // direction change rules
          3: 5,
          4: 5,
          5: 6, // plastic fitting rule
          8: 4, // continuous support note
        },
        checklistSearchTexts: {
          0: 'Maximum Support',
          1: 'Specific Gravity',
          2: 'Direction Change',
          3: 'in-line component',
          4: 'in-line component',
          5: '18 inches',          // sec 1.5.K: plastic fitting 18" rule
          8: 'continuous support',
        },
      },
      {
        id: 's12',
        title: 'Stage 3: Place Supports in Model',
        action: 'Now place the actual support elements in Revit. Follow the placement rules strictly -- anchor location, guide distance from elbows, hanger intervals, and riser clamp positions all have specific requirements.',
        why: 'Support placement is not arbitrary. Every position is governed by the spec. Wrong placement = thermal stress, pipe sag, or buckling.',
        source: '40 05 19, Appendix 1',
        documentId: 'pipe-supports-r3',
        toolRoute: '/calculator',
        toolLabel: 'Calculator',
        checklist: [
          'ANCHOR: Place single anchor near the MIDDLE of the run (preferred method) (40 05 19, App 1)',
          'GUIDES: Place at max 2x deadweight span intervals along the run (40 05 19, App 1)',
          'GUIDE FROM ELBOW (metal, run <= 3x span): first guide >= 75% of span from elbow (40 05 19, App 1)',
          'GUIDE FROM ELBOW (metal, run 3-10x span): first guide >= 1.5x span from elbow (40 05 19, App 1)',
          'GUIDE FROM ELBOW (plastic <= 2", run <= 6x span): first guide >= 75% of span (40 05 19, App 1)',
          'GUIDE FROM ELBOW (plastic <= 2", run 6-25x span): first guide >= 1.5x span (40 05 19, App 1)',
          'GUIDE FROM ELBOW (plastic > 2", run <= 4x span): first guide >= 75% of span (40 05 19, App 1)',
          'GUIDE FROM ELBOW (plastic > 2", run 4-20x span): first guide >= 1.5x span (40 05 19, App 1)',
          'HANGERS: Place at max deadweight span intervals for horizontal pipe (40 05 19, App 1)',
          'RISER CLAMP: Place ONE near the TOP of vertical pipe (40 05 19, App 1)',
          'RISER GUIDES: Every 2x span on vertical pipe; reduce to 1x span if run > 3x span above restraint (40 05 19, App 1)',
          'BRANCH: Support at 25-100% of branch span from run CL (horizontal); 75-100% (vertical run) (40 05 19, App 1)',
          'BRANCH: Anchor goes on the RUN pipe, never on the branch (40 05 19, App 1)',
          'EXPANSION LOOP: SLIDE on offset legs, GUIDE on connecting leg (40 05 19, App 1)',
          'FLEXIBLE COUPLING: Independent support on BOTH sides, with tie-rods (40 05 19, 1.5.I)',
          'EQUIPMENT CONNECTION: No anchor on the connection run (40 05 19, 1.5.J)',
        ],
        checklistPages: {
          0: 8,  // anchor placement — App 1
          1: 8,  // guide spacing
          2: 9,  // guide from elbow rules
          3: 9,
          4: 10,
          5: 10,
          6: 11,
          7: 11,
          8: 8,  // hangers
          9: 12, // riser clamp
          10: 12,
          11: 13, // branch support
          12: 13,
          13: 14, // expansion loop
          14: 7,  // 1.5.I flexible coupling
          15: 7,  // 1.5.J equipment connection
        },
        checklistSearchTexts: {
          0: 'ANCHOR',
          1: 'GUIDE',
          2: 'elbow',
          3: 'elbow',
          4: 'elbow',
          5: 'elbow',
          6: 'elbow',
          7: 'elbow',
          8: 'HANGER',
          9: 'RISER',
          10: 'riser guide',
          11: 'BRANCH',
          12: 'BRANCH',
          13: 'expansion loop',
          14: 'flexible coupling',    // sec 1.5.I: flexible coupling independent support
          15: 'equipment nozzle',    // sec 1.5.J: no anchor on equipment connection run
        },
      },
      {
        id: 's13',
        title: 'Stage 4: Select and Verify Hardware',
        action: 'Choose the correct hardware product for each support type. Plastic pipe requires GF Stress Less products. Metal pipe uses Appendix 2 specification sheets. Verify everything against the approved manufacturer list.',
        why: 'Wrong hardware damages pipe (especially plastic), fails under load, or corrodes in service. Hardware must be from the approved manufacturer list.',
        source: '40 05 19, Part 2 + Appendix 2',
        documentId: 'pipe-supports-r3',
        toolRoute: '/calculator',
        toolLabel: 'Calculator',
        checklist: [
          'PLASTIC HANGER: GF Stress Less Clevis Hanger Kit, or clevis with neoprene/metal shield wrap (40 05 19, 2.3.C.2)',
          'PLASTIC GUIDE: GF Stress Less Pipe Guide, or plastic sleeve guide (40 05 19, 2.3.C.4)',
          'PLASTIC ANCHOR: GF Stress Less Clamp Fixpoint Kit, or flange anchor (40 05 19, 2.3.C.5)',
          'PLASTIC SLIDE: GF Stress Less Pipe Slides -- PVC indoor, UV UHMW-PE outdoor (40 05 19, 2.3.C.3)',
          'PLASTIC RISER: GF Stress Less Clamp Fixpoint Kit at top (40 05 19, 2.3.C.6)',
          'PLASTIC: No metal in direct contact with pipe -- always use GF or protective wrap (40 05 19, 1.5.K)',
          'PLASTIC: No friction anchors (Cush-a-Clamp) -- compressive load damages plastic (40 05 19, 1.5.K)',
          'PLASTIC: Support metal valves independently from plastic pipe (40 05 19, 1.5.K)',
          'METAL: Select hardware per Appendix 2 based on material (CS/SS/copper) and insulation status',
          'METAL: Stainless/copper must be dielectrically insulated from carbon steel supports (40 05 19, 2.2)',
          'CUSH-A-CLAMP: Indoor only + Metal only + 2" NPS and smaller + spacing = deadweight span (40 05 19, App 1)',
          'CORROSIVE AREA: All hardware must be 316 or 316L stainless steel -- no carbon steel (40 05 19, 2.3.A)',
          'Verify all hardware is from approved manufacturer list: Anvil, PHD, Cooper B-Line, Georg Fischer, ISAT, Carpenter & Patterson (40 05 19, 2.1)',
        ],
        checklistSearchTexts: {
          0: 'Clevis Hanger',       // sec 2.3.C.2: GF Stress Less Clevis Hanger
          1: 'Pipe Guide',          // sec 2.3.C.4: GF Stress Less Pipe Guide
          2: 'Clamp Fixpoint',      // sec 2.3.C.5: GF Stress Less Clamp Fixpoint
          3: 'Pipe Slide',          // sec 2.3.C.3: GF Stress Less Pipe Slides
          4: 'riser clamp',         // sec 2.3.C.6: riser clamp at top
          5: 'metal contact',       // sec 1.5.K: no metal in direct contact
          6: 'Cush-a-Clamp',        // sec 1.5.K: no friction anchors
          7: 'metal valve',         // sec 1.5.K: support metal valves independently
          9: 'dielectric',          // sec 2.2: dielectric insulation requirement
          10: 'Cush-a-Clamp',       // App 1: indoor/metal/2" Cush-a-Clamp rule
          11: '316L',               // sec 2.3.A: corrosive area 316/316L SS
          12: 'approved manufacturer', // sec 2.1: approved manufacturer list
        },
      },
      {
        id: 's14',
        title: 'Stage 5: Tag, Verify, and Move On',
        action: 'Tag every element with required metadata. Run a quick self-check on this pipe run before moving to the next one. This is your quality gate -- do not skip it.',
        why: 'Missing metadata is the #1 cause of IFF delays. Catching errors per-pipe-run is 10x cheaper than catching them during IFF review.',
        source: 'ICS + BIM Manual Sections 04-06, 14',
        documentId: 'bim-manual-v2',
        checklist: [
          'Fill INT_PKG_Name on every element (ICS shared parameter -- required)',
          'Fill INT_SSID on every element (ICS shared parameter -- required)',
          'Fill Tag ID (e.g., PW-001)',
          'Fill System Service (e.g., PW, CW, DW, EX)',
          'Fill Material (e.g., CS-150#, SS-304, PVC-80)',
          'Fill Nominal Size (e.g., 6")',
          'Fill Elevation: TOS (Top of Steel) and BOS (Bottom of Steel)',
          'Fill IFF Status: Pre-IFF / Approved IFF / Re-IFF',
          'Verify insulation is included in pipe OD -- not a separate element',
          'Verify valve handle swing clearance zone is modeled',
          'Verify real material codes used -- not generic',
          'Verify shared project coordinates -- not unlinked',
          'Verify all supports are within max span limits',
          'Verify guides provide flexibility for thermal expansion (distance from elbows)',
          'Verify no interference with other trades visible in your local view',
          'Verify assembly matches Appendix 3 reference drawings (A-1, G-1, S-1, HGR-1, R-1)',
        ],
        checklistSearchTexts: {
          0: 'INT_PKG_Name',
          1: 'INT_SSID',
          2: 'Tag ID',
          3: 'System Service',
          4: 'Material',
          5: 'Nominal Size',
          6: 'Elevation',
          7: 'IFF Status',
          8: 'insulation',
          9: 'valve handle',
          10: 'material code',
          11: 'shared project coordinates',
          12: 'max span',
          13: 'thermal expansion',
          14: 'interference',
          15: 'Appendix 3',
        },
      },
    ],
  },
  {
    id: 'check',
    number: 5,
    title: 'Self-Check',
    icon: ShieldCheck,
    color: 'amber',
    steps: [
      {
        id: 's15',
        title: 'Run Self-Clash Detection',
        action: 'Export NWC via shared coordinates. Run clash tests in Navisworks against the FM. Document ALL found clashes as Newforma Konekt issue tickets.',
        why: 'You are REQUIRED to actively clash your scope against the FM (CPEP 6.4). Issues brought to meetings should only be ones you could not resolve on your own (CPEP 6.5).',
        source: 'CPEP Section 6 + BIM Manual',
        documentId: 'cpep-wip',
        checklist: [
          'Export NWC using shared coordinates (not project internal)',
          'Download the latest Federated Model (FM) from BIM 360',
          'Run clash tests: your CM vs. FM (all disciplines)',
          'Document every found clash as a Newforma Konekt issue ticket (CPEP 6.4)',
          'Try to resolve clashes directly with other subcontractors first (CPEP 6.5)',
          'Only bring unresolvable issues to coordination meetings (CPEP 6.5)',
          'Follow DM routing whenever possible -- deviations require A-9 tolerance check or RFI (CPEP 6.2)',
        ],
        checklistSearchTexts: {
          0: 'shared coordinates',
          1: 'Federated Model',
          2: 'clash test',
          3: 'Newforma Konekt',
          4: 'resolve clashes',
          5: 'coordination meeting',
          6: 'DM routing',
        },
      },
      {
        id: 's16',
        title: 'Verify Tolerances',
        action: 'Compare every moved element against the A-9 tolerance table. Log all changes in BIM Track with viewpoint screenshots -- even within-tolerance adjustments.',
        why: 'Undocumented changes are the leading cause of coordination failures. BIM Track is the project record.',
        source: 'A-9 Change Management',
        documentId: 'a9-change-mgmt-pdf',
        toolRoute: '/resources/tolerance',
        toolLabel: 'Tolerance Lookup',
      },
      {
        id: 's17',
        title: 'Check ICS Audit Criteria',
        action: 'Purge unused types. Remove all design options and groups. Fix all Revit warnings (check acceptable warnings list). Verify no imports (DWG, SKP, DGN). No in-place families.',
        why: 'Your model is machine-audited via MPA. Every one of these items is checked automatically. Failures delay integration.',
        source: 'ICS File Audit Steps',
        documentId: 'ics-file-audit',
      },
      {
        id: 's18',
        title: 'Verify NWC Export',
        action: 'Export NWC using Shared Coordinates (not project internal). Open in Navisworks and verify shared parameters appear in the Properties > Elements panel.',
        why: 'If parameters do not propagate to NWC, your model data is invisible during federated model reviews.',
        source: 'Shared Parameters Revit Guide',
        documentId: 'shared-params-guide',
      },
    ],
  },
  {
    id: 'coordinate',
    number: 6,
    title: 'Coordinate and Submit IFF',
    icon: Upload,
    color: 'blue',
    steps: [
      {
        id: 's19',
        title: 'Upload Models to BIM 360',
        action: 'Upload CM NWCs and source files (RVT, DWG) to your subcontractor upload folder on BIM 360. Upload at least 2x per week and 1 day before the next scheduled meeting.',
        why: 'BIM 360 is the single source of truth. Late uploads delay coordination and may cost you routing priority (CPEP 5.5).',
        source: 'CPEP Sections 4.2, 4.5',
        documentId: 'cpep-wip',
        checklist: [
          'Upload CM NWC + source file (RVT or DWG) to your BIM 360 folder (CPEP 4.2.1.2)',
          'If modeling in Revit, also export and upload a DWG (CPEP 4.2.1.2)',
          'Upload at minimum 2x per week (CPEP 4.5.3)',
          'Upload 1 day prior to next scheduled meeting (CPEP 4.5.3)',
          'Divide CM files by level and coordination model sectors (CPEP 4.5.4)',
          'Include source files alongside NWC files (CPEP 4.5.3)',
        ],
        checklistSearchTexts: {
          0: 'source file',
          1: 'DWG',
          2: '2x per week',
          3: '1 day prior',
          4: 'coordination model sectors',
          5: 'NWC',
        },
      },
      {
        id: 's20',
        title: 'Attend Coordination Meetings',
        action: 'You are required to attend BIM coordination meetings. Bring your BIM team AND field team representatives. Come prepared with your clash report. Resolve issues with other subs directly when possible.',
        why: 'Coordination meetings are contractually required (CPEP 6.3). Field team presence helps with constructability and catches real-world issues the BIM team might miss.',
        source: 'CPEP Section 6',
        documentId: 'cpep-wip',
        checklist: [
          'Attend all scheduled BIM coordination meetings (CPEP 6.3)',
          'Bring field team representatives to assist with clash adjudication (CPEP 6.3)',
          'Resolve issues directly with other subcontractors before meetings (CPEP 6.5)',
          'Only bring unresolvable issues to the meeting (CPEP 6.5)',
          'Follow DM routing whenever possible (CPEP 6.2)',
          'If DM routing is not possible, check A-9 tolerances first, then RFI if outside tolerance (CPEP 6.2)',
          'Use Newforma Konekt for all issue tracking and communication (CPEP 4.3)',
        ],
        checklistSearchTexts: {
          0: 'coordination meeting',
          1: 'field team',
          2: 'resolve',
          3: 'unresolvable',
          4: 'DM routing',
          5: 'RFI',
          6: 'Newforma Konekt',
        },
      },
      {
        id: 's21',
        title: 'Submit for IFF (Issued for Fabrication)',
        action: 'IFF = reservation of space + mitigation of risk. Initiate IFF on Procore. Pass conceptual review (completeness, constructability) then technical review (BIM coordination). Max 2 IFF submissions per day.',
        why: 'IFF approval is the prerequisite for shop drawings or fabrication. Missing or uncoordinated elements that clash with others are YOUR responsibility (CPEP 7.1.2). Installed elements not matching IFF require re-IFF at your cost (CPEP 7.1.3).',
        source: 'CPEP Section 7',
        documentId: 'cpep-wip',
        checklist: [
          'Ensure IFF tag metadata is populated at the object geometry level (CPEP 7.3.2.1)',
          'Initiate IFF submittal on Procore (CPEP 7.3.2)',
          'Latest files from BIM 360 Subcontractor Uploads folder will be used for review (CPEP 7.3.2)',
          'Maximum 2 IFF submissions per day unless approved by BIM Manager (CPEP 7.3.2.2)',
          'Pass conceptual review: package completeness, constructability, issue resolution (CPEP 7.3.3)',
          'Pass technical review: BIM coordination against latest FM (CPEP 7.3.4)',
          'If CONDITIONAL status: resolve all items within 14 days (CPEP 7.3.5)',
          'After approval, upload IFF files to BIM 360 for archiving (CPEP 7.3.6)',
          'Trigger Re-IFF when: DRBs alter scope, RFIs alter scope, or approved field routing needs to be memorialized (CPEP 7.1.4)',
          'IFF approval dates will be communicated to scheduling team for P6 schedule (CPEP 7.4)',
          'Process deliverables: 3D Navisworks model (piping plans, sections), P&IDs (PDF), distribution schematics (PDF), pipe support details (2D PDF), installation details (2D PDF) (A-11)',
          'Upload to BIM 360: RVT source + NWC + summary PDF listing system, sector, revision notes',
          'IFF file name format: LL-YY_IFF-BBB-AAA-XXXX_YYYY-MM-DD (CPEP 7.5.2)',
          'After approval: mark objects as "Approved IFF" in model parameters, lock routing layers, export final NWD',
        ],
        checklistSearchTexts: {
          0: 'IFF tag metadata',
          1: 'Procore',
          2: 'BIM 360',
          3: '2 IFF submissions',
          4: 'conceptual review',
          5: 'technical review',
          6: 'CONDITIONAL',
          7: 'archiving',
          8: 'Re-IFF',
          9: 'P6 schedule',
          10: 'Navisworks model',
          11: 'source',
          12: 'file name format',
          13: 'Approved IFF',
        },
      },
    ],
  },
  {
    id: 'field',
    number: 7,
    title: 'Field and Close-Out',
    icon: FolderArchive,
    color: 'slate',
    steps: [
      {
        id: 's22',
        title: 'Model to Field Quality',
        action: 'Develop a Model to Field plan that communicates IFF routing to the field team. Standard accuracy: +/-1 inch. Critical areas (lateral racks, POC, tool install): +/-1/4 inch. You are at risk when field conditions differ from IFF.',
        why: 'Subcontractors are at risk when field conditions differ from approved IFF locations (CPEP 8.2). Every effort must be made to minimize these occurrences.',
        source: 'CPEP Section 8',
        documentId: 'cpep-wip',
        checklist: [
          'Develop a written Model to Field plan (CPEP 8.1)',
          'Standard field accuracy: +/- 1 inch from IFF routing (CPEP 8.1.1)',
          'Critical areas (lateral racks, POC, tool install): +/- 1/4 inch (CPEP 8.1.1)',
          'Define a process for communicating field changes back to BIM team (CPEP 8.1.2)',
          'Any field routing changes must be updated in CM and re-IFF submitted (CPEP 8.1.2)',
          'Walk proposed routing in existing footprints to verify clash-free before installation (CPEP 4.8.1)',
        ],
        checklistSearchTexts: {
          0: 'Model to Field',
          1: 'field accuracy',
          2: 'critical areas',
          3: 'field changes',
          4: 'Re-IFF',
          5: 'field walk',
        },
      },
      {
        id: 's23',
        title: 'Project Closeout and Record Models',
        action: 'Submit Record Models that are clash-free and compliant with naming standards. All Newforma Konekt issues must be resolved. Record Models must represent actual field conditions within tolerance. Final payment is withheld until approved.',
        why: 'Record Model accuracy is a condition of subcontract closeout. Final payment is withheld until record models are compliant and approved (CPEP 9.1.5).',
        source: 'CPEP Section 9',
        documentId: 'cpep-wip',
        checklist: [
          'Record Models must be clash-free (CPEP 9.1)',
          'Record Models must comply with project layer & naming standards (CPEP 9.1)',
          'All significant Newforma Konekt issues must be resolved (CPEP 9.1.1)',
          'Any significant post-IFF changes must be re-IFF before Record Model submission (CPEP 9.1.2)',
          'Submit files via BIM 360 for audit (CPEP 9.1.3)',
          'Record Model accuracy: must represent field-routed conditions within +/-1" general, +/-1/4" critical (CPEP 9.1.4)',
          'Final payment withheld until record models are compliant and approved (CPEP 9.1.5)',
          'Start meeting closeout requirements early -- do not wait until the end (CPEP 9.1)',
        ],
        checklistSearchTexts: {
          0: 'clash-free',
          1: 'naming standard',
          2: 'Newforma Konekt',
          3: 're-IFF',
          4: 'BIM 360',
          5: 'field-routed',
          6: 'final payment',
          7: 'closeout',
        },
      },
    ],
  },
];

function usePlaybookData() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Record<string, string[]>>({});

  useEffect(() => {
    try {
      const s1 = localStorage.getItem('pidflow-guide-progress');
      if (s1) setCompleted(new Set(JSON.parse(s1)));
      const s2 = localStorage.getItem('pidflow-guide-notes');
      if (s2) setNotes(JSON.parse(s2));
      const s3 = localStorage.getItem('pidflow-guide-attachments');
      if (s3) setAttachments(JSON.parse(s3));
    } catch { /* ignore */ }
  }, []);

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('pidflow-guide-progress', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const updateNote = (id: string, text: string) => {
    setNotes((prev) => {
      const next = { ...prev, [id]: text };
      localStorage.setItem('pidflow-guide-notes', JSON.stringify(next));
      return next;
    });
  };

  const addAttachment = (id: string, fileName: string) => {
    setAttachments((prev) => {
      const next = { ...prev, [id]: [...(prev[id] || []), fileName] };
      localStorage.setItem('pidflow-guide-attachments', JSON.stringify(next));
      return next;
    });
  };

  return { completed, toggle, notes, updateNote, attachments, addAttachment };
}

export default function GuidePage() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [viewingDocPage, setViewingDocPage] = useState<number>(1);
  const [viewingSearchText, setViewingSearchText] = useState<string | undefined>(undefined);
  const [isViewerExpanded, setIsViewerExpanded] = useState(false);
  const [playAll, setPlayAll] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear hover timer on unmount
  useEffect(() => () => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); }, []);

  const openDoc = (docId: string, page: number = 1, searchText?: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setViewingDocId(docId);
    setViewingDocPage(page);
    setViewingSearchText(searchText); // always set (clears stale highlight when no searchText)
  };

  const closeDoc = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setViewingDocId(null);
    setViewingDocPage(1);
    setViewingSearchText(undefined);
    setIsViewerExpanded(false);
  };

  const handleCheckItemHover = (docId: string, page?: number, searchText?: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setViewingDocId(docId);
      if (page !== undefined) setViewingDocPage(page);
      if (searchText !== undefined) setViewingSearchText(searchText);
    }, 350);
  };

  const handleCheckItemLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };
  const { completed, toggle, notes, updateNote, attachments, addAttachment } = usePlaybookData();

  const totalSteps = PHASES.reduce((sum, p) => sum + p.steps.length, 0);
  const completedCount = completed.size;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const activePhase = PHASES[activePhaseIndex];
  const activeStep = activePhase.steps[activeStepIndex];
  const isFirstStep = activePhaseIndex === 0 && activeStepIndex === 0;
  const isLastStep = activePhaseIndex === PHASES.length - 1 && activeStepIndex === activePhase.steps.length - 1;
  const isDone = completed.has(activeStep.id);

  const goNext = () => {
    if (activeStepIndex < activePhase.steps.length - 1) setActiveStepIndex(activeStepIndex + 1);
    else if (activePhaseIndex < PHASES.length - 1) { setActivePhaseIndex(activePhaseIndex + 1); setActiveStepIndex(0); }
  };
  const goPrev = () => {
    if (activeStepIndex > 0) setActiveStepIndex(activeStepIndex - 1);
    else if (activePhaseIndex > 0) { setActivePhaseIndex(activePhaseIndex - 1); setActiveStepIndex(PHASES[activePhaseIndex - 1].steps.length - 1); }
  };

  // "Play all" walks the narration phase-by-phase. When a phase's tracks finish,
  // jump to the next phase (which auto-plays); stop after the final phase.
  const handlePhaseAudioEnded = () => {
    if (!playAll) return;
    if (activePhaseIndex < PHASES.length - 1) {
      setActivePhaseIndex(activePhaseIndex + 1);
      setActiveStepIndex(0);
    } else {
      setPlayAll(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b bg-white dark:bg-slate-900 z-10">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary text-white"><BookOpen className="w-5 h-5" /></div>
              <div>
                <h1 className="font-semibold text-slate-900 dark:text-slate-100">Modeler Playbook</h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500">Process BIM Onboarding</p>
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlayAll((v) => !v)}
              className={cn(
                "text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                playAll
                  ? "bg-primary text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
              aria-pressed={playAll}
            >
              <Volume2 className="w-4 h-4" /> {playAll ? "Playing all…" : "Play all"}
            </button>
            <Link href="/resources" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">Resources <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {!isViewerExpanded && (
          <div className="w-64 flex-shrink-0 border-r bg-white dark:bg-slate-900/50 overflow-y-auto hidden md:block">
            <div className="p-3 space-y-4">
              {PHASES.map((phase, pi) => {
                const active = pi === activePhaseIndex;
                const done = phase.steps.every((s) => completed.has(s.id));
                const Icon = phase.icon;
                return (
                  <div key={phase.id}>
                    <button onClick={() => { setActivePhaseIndex(pi); setActiveStepIndex(0); }} className={cn("w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors", active ? "bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
                      <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", active ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                        {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phase {phase.number}</div>
                        <div className={cn("text-xs font-semibold truncate", active ? "text-primary" : "text-slate-600 dark:text-slate-300")}>{phase.title}</div>
                      </div>
                    </button>
                    {active && (
                      <div className="ml-5 pl-3 mt-1 border-l-2 border-slate-100 dark:border-slate-800 space-y-0.5">
                        {phase.steps.map((step, si) => (
                          <button key={step.id} onClick={() => setActiveStepIndex(si)} className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-[11px] transition-colors", si === activeStepIndex ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-primary font-medium" : "text-slate-500 hover:text-slate-800")}>
                            {completed.has(step.id) ? <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" /> : <Circle className={cn("w-3 h-3 flex-shrink-0", si === activeStepIndex ? "text-primary" : "text-slate-300")} />}
                            <span className="truncate">{step.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Slide */}
        <div className={cn("flex-1 flex flex-col min-h-0", viewingDocId && !isViewerExpanded ? "hidden lg:block" : "")}>
          <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <PhaseAudio
              key={activePhase.id}
              tracks={PHASE_AUDIO[activePhase.id] ?? []}
              phaseNumber={activePhase.number}
              autoPlay={playAll}
              onAllEnded={handlePhaseAudioEnded}
            />

            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 mb-6">Phase {activePhase.number} &middot; Step {activeStepIndex + 1} of {activePhase.steps.length}</Badge>

            <h2 className={cn("text-3xl md:text-4xl font-bold mb-6", isDone ? "text-slate-400" : "text-slate-900 dark:text-slate-100")}>{activeStep.title}</h2>
            <p className={cn("text-lg leading-relaxed mb-8", isDone ? "text-slate-500" : "text-slate-700 dark:text-slate-300")}>{activeStep.action}</p>

            <div className="rounded-2xl p-5 mb-10 bg-primary/5 border border-primary/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Lightbulb className="w-5 h-5 text-primary" /></div>
              <div><h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Why it matters</h4><p className="text-sm text-foreground leading-relaxed">{activeStep.why}</p></div>
            </div>

            {(activeStep.documentId || activeStep.toolRoute) && (
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {activeStep.documentId && (
                  <button onClick={() => openDoc(activeStep.documentId!)} className={cn("inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all", viewingDocId === activeStep.documentId ? "bg-slate-900 text-white shadow-md" : "bg-white border border-slate-200 shadow-sm hover:shadow-md text-slate-700")}>
                    <FileText className="w-4 h-4" /> View: {activeStep.source}
                  </button>
                )}
                {activeStep.toolRoute && (
                  <Link href={activeStep.toolRoute} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-white shadow-sm">
                    <Wrench className="w-4 h-4" /> Open {activeStep.toolLabel}
                  </Link>
                )}
              </div>
            )}

            {activeStep.checklist && activeStep.checklist.length > 0 && (() => {
              const checkedCount = activeStep.checklist!.filter((_, i) => completed.has(`${activeStep.id}-check-${i}`)).length;
              const total = activeStep.checklist!.length;
              return (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" /> Checklist
                    </h4>
                    <span className="text-xs text-slate-400">{checkedCount} of {total}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${total > 0 ? (checkedCount / total) * 100 : 0}%` }} />
                  </div>
                  <div className="space-y-1.5">
                    {activeStep.checklist!.map((item, i) => {
                      const checkKey = `${activeStep.id}-check-${i}`;
                      const isChecked = completed.has(checkKey);
                      const pageRef = activeStep.checklistPages?.[i];
                      const searchRef = activeStep.checklistSearchTexts?.[i];
                      const hasDocRef = (pageRef !== undefined || searchRef !== undefined) && activeStep.documentId;
                      const isActiveHighlight =
                        viewingDocId === activeStep.documentId &&
                        searchRef !== undefined &&
                        viewingSearchText === searchRef;
                      return (
                        <div
                          key={i}
                          onMouseEnter={() =>
                            hasDocRef
                              ? handleCheckItemHover(activeStep.documentId!, pageRef, searchRef)
                              : undefined
                          }
                          onMouseLeave={hasDocRef ? handleCheckItemLeave : undefined}
                          className={cn(
                            "flex items-start gap-3 py-2.5 rounded-lg px-1 -mx-1 group transition-colors",
                            isActiveHighlight && "bg-yellow-50 dark:bg-yellow-900/10",
                            hasDocRef && !isActiveHighlight && "hover:bg-slate-50 dark:hover:bg-slate-800/30",
                          )}
                        >
                          <button
                            onClick={() => toggle(checkKey)}
                            className="flex-shrink-0 mt-0.5 focus:outline-none"
                            aria-label={isChecked ? "Uncheck" : "Check"}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                            )}
                          </button>
                          <button
                            onClick={() => toggle(checkKey)}
                            className="flex-1 text-left focus:outline-none"
                          >
                            <span className={cn("text-sm leading-relaxed", isChecked ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-300")}>{item}</span>
                          </button>
                          {hasDocRef && (
                            <button
                              onClick={() => openDoc(activeStep.documentId!, pageRef ?? 1, searchRef)}
                              title={searchRef ? `Highlight "${searchRef}" in reference` : `Jump to page ${pageRef}`}
                              className={cn(
                                "flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors",
                                isActiveHighlight
                                  ? "bg-yellow-400 text-yellow-900"
                                  : viewingDocId === activeStep.documentId && viewingDocPage === pageRef && !searchRef
                                  ? "bg-primary text-white"
                                  : "bg-primary/10 text-primary hover:bg-primary/20"
                              )}
                            >
                              <FileText className="w-3 h-3" />
                              {pageRef ? `p.${pageRef}` : '§'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-slate-400" /> My Notes</h4>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all">
                <textarea value={notes[activeStep.id] || ''} onChange={(e) => updateNote(activeStep.id, e.target.value)} placeholder="Add notes, reminders, or questions..." className="w-full min-h-[100px] p-4 bg-transparent resize-y outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400" />
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"><Paperclip className="w-3.5 h-3.5" /> Attach File<input type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) addAttachment(activeStep.id, e.target.files[0].name); }} /></label>
                </div>
              </div>
              {(attachments[activeStep.id] || []).length > 0 && (
                <div className="flex flex-wrap gap-2">{attachments[activeStep.id].map((f, i) => (<div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-sm"><FileText className="w-3 h-3 text-primary" /><span className="truncate max-w-[150px]">{f}</span></div>))}</div>
              )}
            </div>
          </div>
          </div>

          {/* Bottom Bar -- outside scroll container */}
          <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button onClick={goPrev} disabled={isFirstStep} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ArrowLeft className="w-4 h-4" /> Previous</button>
              <button onClick={() => { if (!isDone) toggle(activeStep.id); goNext(); }} disabled={isLastStep && isDone} className={cn("inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md", isDone ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-emerald-500 hover:bg-emerald-600 text-white")}>
                {isDone ? (<>Next Step <ArrowRight className="w-4 h-4" /></>) : (<><CheckCircle2 className="w-4 h-4" /> Complete & Continue</>)}
              </button>
            </div>
          </div>
        </div>

        {/* Document Viewer Panel */}
        {viewingDocId && (
          <div className={cn("border-l bg-slate-100 dark:bg-slate-950 flex flex-col", isViewerExpanded ? "absolute inset-0 z-20" : "w-full lg:w-2/5 lg:relative absolute inset-0 z-20 lg:z-0")}>
            <div className="h-12 px-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                Reference Document
                {viewingSearchText ? (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 truncate max-w-[120px]">
                    ↑ {viewingSearchText}
                  </span>
                ) : viewingDocPage > 1 ? (
                  <span className="text-xs font-normal text-slate-400">— p.{viewingDocPage}</span>
                ) : null}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsViewerExpanded(!isViewerExpanded)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden lg:block">{isViewerExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</button>
                <button onClick={closeDoc} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 relative min-h-0">
              <PDFViewer
                documentId={viewingDocId!}
                page={viewingDocPage}
                searchText={viewingSearchText}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
