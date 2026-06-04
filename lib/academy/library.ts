/**
 * BIM Academy library — pure data module.
 *
 * Maps the BIM Welcome-Package folder structure (00–15) to:
 *  - real documents served via /api/documents/[id] (DOCUMENT_MANIFEST ids)
 *  - narration audio under /public/audio/Audio4Training
 *
 * This module is import-safe on both server and client (no fs access).
 */

const AUDIO_BASE = "/audio/Audio4Training";

/**
 * Narration files in public/audio/Audio4Training.
 * Filenames are ASCII-safe slugs (no spaces/special chars) so Vercel's
 * production static serving resolves them reliably.
 */
const A = {
  cpep: `${AUDIO_BASE}/cpep.mp3`,
  a11: `${AUDIO_BASE}/a11.mp3`,
  a7: `${AUDIO_BASE}/a7.mp3`,
  a9: `${AUDIO_BASE}/a9.mp3`,
  cmc: `${AUDIO_BASE}/cmc.mp3`,
  fileNaming: `${AUDIO_BASE}/file-naming.mp3`,
  coordinates: `${AUDIO_BASE}/coordinates.mp3`,
  bim360: `${AUDIO_BASE}/bim360.mp3`,
  nfkGuide: `${AUDIO_BASE}/nfk-guide.mp3`,
  nfkWeb: `${AUDIO_BASE}/nfk-web.mp3`,
  nfkNaming: `${AUDIO_BASE}/nfk-naming.mp3`,
  nfkIssues: `${AUDIO_BASE}/nfk-issues.mp3`,
  searchSets: `${AUDIO_BASE}/search-sets.mp3`,
  iff1: `${AUDIO_BASE}/iff1.mp3`,
  iff2: `${AUDIO_BASE}/iff2.mp3`,
  iff3: `${AUDIO_BASE}/iff3.mp3`,
  iff4: `${AUDIO_BASE}/iff4.mp3`,
  iffField: `${AUDIO_BASE}/iff-field.mp3`,
  clash1: `${AUDIO_BASE}/clash1.mp3`,
  clash2: `${AUDIO_BASE}/clash2.mp3`,
  clash3: `${AUDIO_BASE}/clash3.mp3`,
  nfpaDesign: `${AUDIO_BASE}/nfpa-design.mp3`,
  nfpaInstall: `${AUDIO_BASE}/nfpa-install.mp3`,
  closeout: `${AUDIO_BASE}/closeout.mp3`,
} as const;

export interface AcademyDoc {
  /** Unique academy id — reuses the DOCUMENT_MANIFEST id so PDFs resolve directly */
  id: string;
  title: string;
  /** Manifest id to serve via /api/documents/[id]; falls back to id when omitted */
  documentId?: string;
  fileType: string;
  /** Optional narration source under /public/audio */
  audioSrc?: string;
}

export interface AcademyFolder {
  id: string;
  code: string;
  title: string;
  summary: string;
  /** Folder-level overview narration */
  audioSrc?: string;
  children: AcademyFolder[];
  docs: AcademyDoc[];
}

const doc = (
  id: string,
  title: string,
  fileType: string,
  audioSrc?: string,
): AcademyDoc => ({ id, documentId: id, title, fileType, audioSrc });

const sub = (
  id: string,
  title: string,
  docs: AcademyDoc[],
  summary = "",
): AcademyFolder => ({ id, code: "", title, summary, children: [], docs });

export const ACADEMY: AcademyFolder[] = [
  {
    id: "f00",
    code: "00",
    title: "BIM CPEP & BIM Requirements",
    summary:
      "Project execution plan, contractor BIM requirements, and the modeling & coordination guide that frame the whole program.",
    audioSrc: A.cpep,
    docs: [
      doc("cpep-wip", "CPEP — BIM 3D Design (WIP)", "pdf", A.cpep),
      doc("contractor-bim-req", "Contractor BIM Requirements 2024", "pdf"),
      doc("bim-coordination-guide", "BIM Modeling & Coordination Guide", "pdf"),
    ],
    children: [
      sub("f00-eagle", "Eagle", [
        doc("eagle-bim-req", "Hoffman BIM Requirements Rev4.4", "pdf"),
        doc("eagle-cpep", "Hoffman EAGLE CPEP for BIM 3D Design", "pdf"),
        doc("eagle-osm-shared-params", "Hoffman OSM Shared Parameters", "pdf"),
      ]),
      sub("f00-paragon", "Paragon", [
        doc("paragon-bim-req", "Hoffman BIM Requirements 2024-10", "pdf"),
        doc("paragon-hpep", "Paragon HPEP for BIM 3D Design", "pdf"),
        doc("paragon-coordination-guide", "PARAGON Coordination Guide", "pdf"),
      ]),
    ],
  },
  {
    id: "f01",
    code: "01",
    title: "CAD Standards",
    summary:
      "ICS CAD standards, shared-parameter guides, and vendor packages (Eagle, Paragon) for layers, linetypes, and symbols.",
    docs: [
      doc("ics-cad-standards", "01_34_14_00 CAD Standards", "pdf"),
      doc("ics-bb-flow", "01_34_14_00 BB Flow", "pdf"),
      doc("ics-file-audit", "ICS File Audit Steps", "pdf"),
      doc("shared-params-guide", "Shared Parameters Revit Guide", "pdf"),
    ],
    children: [
      sub("f01-eagle", "Eagle", [
        doc("eagle-shared-params-guide", "INT Shared Parameters Guide", "docx"),
        doc("eagle-linetype-examples", "Intel Linetype Examples", "pdf"),
        doc("eagle-ics-changelog", "ICS 13.4 ChangeLog", "xlsx"),
      ]),
      sub("f01-paragon", "Paragon", [
        doc("paragon-cad-stds", "AppsLabs CAD Stds Rev3", "doc"),
        doc("paragon-shared-params", "Revit Shared Parameters", "txt"),
      ]),
    ],
  },
  {
    id: "f02",
    code: "02",
    title: "EOR PEP & Supporting Documents",
    summary:
      "The A-series appendices: LOD matrix, change management, deliverables format, BIM uses, workflows, and clash adjudication.",
    docs: [
      doc("a7-lod-matrix", "A-7 LOD Matrix", "xlsx", A.a7),
      doc("a9-change-mgmt-pdf", "A-9 Change Management", "pdf", A.a9),
      doc("a11-deliverables", "A-11 Deliverables Format Table", "pdf", A.a11),
    ],
    children: [
      sub("f02-eagle", "Eagle", [
        doc("eagle-a4-bim-uses", "A-4 BIM Use Definitions", "docx"),
        doc("eagle-a6-workflow", "A-6 Design Workflow", "pptx"),
        doc("eagle-a7-lod", "A-7 LOD Matrix", "xlsx", A.a7),
        doc("eagle-a9-change", "A-9 Change Management", "pptx", A.a9),
        doc("eagle-a10-clash", "A-10 Clash Detection", "pptx"),
        doc("eagle-a11-deliverables", "A-11 Deliverables Format Table", "pdf", A.a11),
        doc("eagle-bim-pep", "Project Eagle BIM PEP", "docx"),
      ]),
      sub("f02-paragon", "Paragon", [
        doc("paragon-a1-definitions", "A-1 BIM Definitions", "docx"),
        doc("paragon-a6-workflow", "A-6 Design Workflow", "pptx"),
        doc("paragon-a7-lod", "A-7 LOD Matrix", "xlsx", A.a7),
        doc("paragon-a9-change", "A-9 Change Management", "pptx", A.a9),
        doc("paragon-a10-clash", "A-10 Clash Detection", "pptx"),
        doc("paragon-a11-deliverables-pdf", "A-11 Deliverables Format Table", "pdf", A.a11),
        doc("paragon-bim-pep", "Project Paragon Design BIM PEP", "docx"),
      ]),
    ],
  },
  {
    id: "f03",
    code: "03",
    title: "Certified Model Content (CMC) Guides",
    summary:
      "What it means to certify model content for delivery — the Eagle and Paragon CMC guides.",
    audioSrc: A.cmc,
    docs: [],
    children: [
      sub("f03-eagle", "Eagle", [
        doc("eagle-cmc-guide", "Eagle Certified Model Content Guide", "pdf", A.cmc),
      ]),
      sub("f03-paragon", "Paragon", [
        doc("paragon-cmc-guide", "PARAGON CMC Guide", "pdf", A.cmc),
      ]),
    ],
  },
  {
    id: "f04",
    code: "04",
    title: "File Naming Guides & UPN Lists",
    summary:
      "File-naming conventions, Unique Property Numbers (UPN), layer references, and building elevation maps.",
    audioSrc: A.fileNaming,
    docs: [],
    children: [
      sub("f04-eagle", "Eagle", [
        doc("eagle-file-naming", "EAGLE File Naming Guide", "xlsx", A.fileNaming),
        doc("eagle-upn-list-pdf", "EAGLE UPN List", "pdf"),
        doc("eagle-upn-layer-ref-pdf", "EAGLE UPN-Layer Reference", "pdf"),
        doc("eagle-building-elevations", "Eagle Building Levels & Elevations", "pdf"),
      ]),
      sub("f04-paragon", "Paragon", [
        doc("paragon-file-naming", "PARAGON File Naming Guide", "xlsx", A.fileNaming),
        doc("paragon-2d-codes", "PARAGON 2D Drawing Codes", "xlsx"),
        doc("paragon-cm-map", "PARAGON CM Map", "pdf"),
        doc("paragon-fm-map", "PARAGON FM Map", "pdf"),
      ]),
    ],
  },
  {
    id: "f05",
    code: "05",
    title: "RVT/DWG Grids & Site Coordinates",
    summary:
      "Acquiring project coordinates and aligning Revit/AutoCAD grids to the shared site coordinate system.",
    audioSrc: A.coordinates,
    docs: [
      doc("eagle-coordinates-guide", "Acquiring Project Coordinates Guide", "docx", A.coordinates),
    ],
    children: [],
  },
  {
    id: "f06",
    code: "06",
    title: "Navisworks Configuration Files",
    summary:
      "Quick-property dictionaries, Roamer command standards, and global options for Navisworks.",
    docs: [],
    children: [
      sub("f06-eagle", "Eagle", [
        doc("eagle-quick-props-dict", "Quick Properties Dictionary", "xlsx"),
        doc("eagle-navis-shortcuts-pdf", "Navisworks Shortcut Command List", "pdf"),
        doc("eagle-roamer-2025", "Roamer Command Standard 2025", "pdf"),
      ]),
      sub("f06-paragon", "Paragon", [
        doc("paragon-quick-props-dict", "Quick Properties Dictionary", "xlsx"),
        doc("paragon-global-options-doc", "HCC Navis Global Options 2024", "docx"),
      ]),
    ],
  },
  {
    id: "f07",
    code: "07",
    title: "BIM 360 Guide",
    summary:
      "Working in Autodesk BIM 360 / ACC Docs — folders, permissions, and document control.",
    audioSrc: A.bim360,
    docs: [],
    children: [
      sub("f07-eagle", "Eagle", [
        doc("eagle-bim360-guide", "Eagle BIM 360 Docs", "pdf", A.bim360),
      ]),
      sub("f07-paragon", "Paragon", [
        doc("paragon-bim360-guide", "PARAGON BIM360 Docs & ADC", "pdf", A.bim360),
      ]),
    ],
  },
  {
    id: "f08",
    code: "08",
    title: "BIM Track / Newforma Konekt Guide",
    summary:
      "Issue management across BIM Track (Eagle) and Newforma Konekt (Paragon): accounts, web interface, naming, and design issues.",
    audioSrc: A.nfkGuide,
    docs: [],
    children: [
      sub("f08-eagle", "Eagle — BIM Track", [
        doc("eagle-bt-sec1", "Sec 1 — Invitations, Accounts, Add-ins", "pdf"),
        doc("eagle-bt-sec2", "Sec 2 — Navis Add-in & Creating Issues", "pdf"),
        doc("eagle-bt-sec3", "Sec 3 — Web Interface", "pdf", A.nfkWeb),
        doc("eagle-bt-sec5", "Sec 5 — Construction Coordination", "pdf"),
        doc("eagle-bt-sec6", "Sec 6 — Issue Reporting for IFF", "pdf"),
      ]),
      sub("f08-paragon", "Paragon — Newforma Konekt", [
        doc("paragon-nfk-sec1", "Sec 1 — Invitations, Accounts, Add-ins", "pdf", A.nfkGuide),
        doc("paragon-nfk-sec3", "Sec 3 — Web Interface", "pdf", A.nfkWeb),
        doc("paragon-nfk-naming", "Issue Naming Guide", "pdf", A.nfkNaming),
        doc("paragon-nfk-sec5", "Sec 5 — Design Issues", "pdf", A.nfkIssues),
      ]),
    ],
  },
  {
    id: "f09",
    code: "09",
    title: "Search Sets Guide",
    summary:
      "Building Navisworks search and selection sets so clash and review workflows stay consistent.",
    audioSrc: A.searchSets,
    docs: [
      doc("eagle-search-sets", "HCC Eagle Search & Selection Sets", "pdf", A.searchSets),
    ],
    children: [],
  },
  {
    id: "f10",
    code: "10",
    title: "BIM Workflow Documents",
    summary:
      "The appendix workflow set: design delivery, federated model structure, collaboration, design queries, and IFF.",
    docs: [],
    children: [
      sub("f10-eagle", "Eagle", [
        doc("eagle-wf-design-delivery", "Design Delivery Workflow", "pdf", A.iff1),
        doc("eagle-wf-fm-structure", "Federated Model Structure", "pdf", A.iff2),
        doc("eagle-wf-collaboration", "BIM Collaboration Workflow", "pdf", A.iff3),
        doc("eagle-wf-iff", "IFF Submittal Procedure", "pdf", A.iff4),
        doc("eagle-wf-field-quality", "Model to Field Quality Review", "pdf", A.iffField),
      ]),
      sub("f10-paragon", "Paragon", [
        doc("paragon-wf-design-delivery", "Design Delivery Workflow", "pdf", A.iff1),
        doc("paragon-wf-fm-structure", "Federated Model Structure", "pdf", A.iff2),
        doc("paragon-wf-collaboration", "BIM Collaboration Workflow", "pdf", A.iff3),
        doc("paragon-wf-iff", "IFF Submittal Procedure", "pdf", A.iff4),
        doc("paragon-wf-field-quality", "Model to Field Quality Review", "pdf", A.iffField),
      ]),
    ],
  },
  {
    id: "f11",
    code: "11",
    title: "Meeting Schedules",
    summary: "BIM coordination meeting cadence and schedule.",
    docs: [
      doc("eagle-meeting-schedule", "EAGLE BIM Coordination Meeting Schedule", "pdf"),
    ],
    children: [],
  },
  {
    id: "f12",
    code: "12",
    title: "IFF Submittal Guide",
    summary:
      "Issued-For-Fabrication submittal across the BIM workflow: design delivery, federated structure, collaboration & clash, submittal procedure, and field quality.",
    audioSrc: A.iff1,
    docs: [],
    children: [
      sub("f12-eagle", "Eagle", [
        doc("eagle-iff-workflow", "Eagle IFF Workflow SUB Rev.14", "pdf", A.iff4),
        doc("eagle-iff-checklist", "IFF Submission Checklist for CMs", "pdf"),
        doc("eagle-mod2-schedule", "Eagle MOD 2 Scheduling", "pdf"),
      ]),
      sub("f12-paragon", "Paragon", [
        doc("paragon-iff-sec1", "Sec 1 — Subcontractor", "pdf", A.iff1),
        doc("paragon-iff-sec2", "Sec 2 — CM", "pdf", A.iff2),
        doc("paragon-iff-sec3", "Sec 3 — Shops", "pdf", A.iff3),
        doc("paragon-iff-checklist", "IFF Submittal Checklist for SUBS", "pdf", A.iff4),
      ]),
    ],
  },
  {
    id: "f13",
    code: "13",
    title: "Clash Reporting Process",
    summary:
      "Running clash reports for IFF in three parts: the setup, the review, and the re-review.",
    audioSrc: A.clash1,
    docs: [
      doc("eagle-clash-part1", "Clash Report Guide — Part 1 — IFF Setup", "pdf", A.clash1),
      doc("eagle-clash-part2", "Clash Report Guide — Part 2 — Clash Report", "pdf", A.clash2),
      doc("eagle-clash-part3", "Clash Report Guide — Part 3 — Rereview", "pdf", A.clash3),
    ],
    children: [],
  },
  {
    id: "f14",
    code: "14",
    title: "NSFP (Fire Protection Head Code)",
    summary:
      "NFPA 13 fire-protection training: design and installation requirements for sprinkler head coverage.",
    audioSrc: A.nfpaDesign,
    docs: [
      doc("eagle-nfpa13", "Eagle NFPA 13 Training Package — Design", "pdf", A.nfpaDesign),
      doc("eagle-nfpa13", "Eagle NFPA 13 Training Package — Installation", "pdf", A.nfpaInstall),
    ],
    children: [],
  },
  {
    id: "f15",
    code: "15",
    title: "Close Out",
    summary:
      "Preparing files and submitting the closeout package at the end of the project.",
    audioSrc: A.closeout,
    docs: [
      doc("eagle-closeout-guide", "Closeout Guide — Subs", "pdf", A.closeout),
      doc("eagle-closeout-workflow", "Closeout Workflow", "pdf"),
      doc("paragon-closeout", "PARAGON BIM Closeout", "pdf"),
    ],
    children: [],
  },
];

/* ── Lookups & helpers ────────────────────────────────────────── */

export function getFolder(id: string): AcademyFolder | null {
  const walk = (folders: AcademyFolder[]): AcademyFolder | null => {
    for (const f of folders) {
      if (f.id === id) return f;
      const found = walk(f.children);
      if (found) return found;
    }
    return null;
  };
  return walk(ACADEMY);
}

/** All docs flattened, preserving folder traversal order, with a stable key. */
export interface FlatDoc extends AcademyDoc {
  key: string;
  folderId: string;
  folderTitle: string;
}

export function flattenDocs(): FlatDoc[] {
  const out: FlatDoc[] = [];
  const walk = (folders: AcademyFolder[]) => {
    for (const f of folders) {
      f.docs.forEach((d, i) =>
        out.push({ ...d, key: `${f.id}:${d.id}:${i}`, folderId: f.id, folderTitle: f.title }),
      );
      walk(f.children);
    }
  };
  walk(ACADEMY);
  return out;
}

export function findFolderForFolder(childId: string): AcademyFolder | null {
  const walk = (folders: AcademyFolder[], parent: AcademyFolder | null): AcademyFolder | null => {
    for (const f of folders) {
      if (f.id === childId) return parent;
      const found = walk(f.children, f);
      if (found !== null) return found;
    }
    return null;
  };
  return walk(ACADEMY, null);
}

export function getDocByKey(key: string): FlatDoc | null {
  return flattenDocs().find((d) => d.key === key) ?? null;
}

export function getDocNeighbors(key: string): { prev: FlatDoc | null; next: FlatDoc | null } {
  const all = flattenDocs();
  const idx = all.findIndex((d) => d.key === key);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function academyStats() {
  const docs = flattenDocs();
  const withAudio = docs.filter((d) => d.audioSrc).length;
  return { folders: ACADEMY.length, docs: docs.length, narrated: withAudio };
}
