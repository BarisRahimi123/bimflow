import path from 'path';
import fs from 'fs';

const DOCUMENTS_ROOT = path.join(process.cwd(), 'documents');

export interface DocumentEntry {
  id: string;
  fileName: string;
  relativePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  inlineable: boolean;
}

const MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  md: 'text/markdown',
  html: 'text/html',
  rfa: 'application/octet-stream',
  zipx: 'application/zip',
  zip: 'application/zip',
  lin: 'application/octet-stream',
  shp: 'application/octet-stream',
  shx: 'application/octet-stream',
  one: 'application/onenote',
  msg: 'application/vnd.ms-outlook',
  oft: 'application/vnd.ms-outlook',
};

const INLINE_TYPES = new Set(['pdf', 'txt', 'md', 'html']);

function entry(id: string, relativePath: string, fileSize: number): DocumentEntry {
  const fileName = path.basename(relativePath);
  const ext = fileName.split('.').pop()?.toLowerCase().replace('-', '') || '';
  return {
    id,
    fileName,
    relativePath,
    fileType: ext,
    fileSize,
    mimeType: MIME_MAP[ext] || 'application/octet-stream',
    inlineable: INLINE_TYPES.has(ext),
  };
}

const WP = 'Docs/OneDrive_2025-11-03/07 - Engineering-Doc Control/7.20 BIM/7.20.00 Welcome Package';
const SPECS = 'Docs/OneDrive_2025-11-03/07 - Engineering-Doc Control/7.05 Specifications';
const LEGENDS = 'Docs/07 - Engineeing-Doc Control/OneDrive_1_3-10-2026';
const SPAN_TABLES = 'Docs/07 - Engineeing-Doc Control/7.05 Specifications/40 - Process Interconnections/OneDrive_2025-11-19/7.05 Specifications/40 - Process Interconnections';
const BIM = 'BIM';

export const DOCUMENT_MANIFEST: Record<string, DocumentEntry> = {
  // 00_BIM CPEP and BIM Requirements
  'cpep-wip': entry('cpep-wip', `${WP}/00_BIM CPEP and BIM Requirements/2025.09.17_CPEP_BIM_3D_Design_WIP.pdf`, 177953),
  'contractor-bim-req': entry('contractor-bim-req', `${WP}/00_BIM CPEP and BIM Requirements/Contractor_BIM_Requirements_2024.pdf`, 127951),
  'bim-coordination-guide': entry('bim-coordination-guide', `${WP}/00_BIM CPEP and BIM Requirements/Project Confluence BIM Modeling and Coordination Guide.pdf`, 331831),

  // 01_CAD Standards
  'ics-cad-standards': entry('ics-cad-standards', `${WP}/01_CAD Standards/01_34_14_00.pdf`, 1468225),
  'ics-cad-standards-docx': entry('ics-cad-standards-docx', `${WP}/01_CAD Standards/01_34_14 Cad Standards.docx`, 203636),
  'ics-bb-flow': entry('ics-bb-flow', `${WP}/01_CAD Standards/01_34_14_00_ BB Flow.pdf`, 173980),
  'ics-file-audit': entry('ics-file-audit', `${WP}/01_CAD Standards/01_34_14_00-ICS File Audit Steps.pdf`, 380271),
  'shared-params-guide': entry('shared-params-guide', `${WP}/01_CAD Standards/01_SS_SS_SS-OWN_Shared-Parameters Revit Guide.pdf`, 383898),

  // 01_CAD Standards / Eagle
  'eagle-ics-layers': entry('eagle-ics-layers', `${WP}/01_CAD Standards/Eagle/01_34_14_00-ICS-Layers.xlsx`, 184022),
  'eagle-shared-params-guide': entry('eagle-shared-params-guide', `${WP}/01_CAD Standards/Eagle/01_34_14_00-INT_Shared-Parameters Revit Guide.docx`, 544346),
  'eagle-shared-params-txt': entry('eagle-shared-params-txt', `${WP}/01_CAD Standards/Eagle/01_34_14_00-INT_Shared-Parameters.txt`, 16178),
  'eagle-shared-params-xlsx': entry('eagle-shared-params-xlsx', `${WP}/01_CAD Standards/Eagle/01_34_14_00-INT_Shared-Parameters.xlsx`, 12607),
  'eagle-deliverables-index': entry('eagle-deliverables-index', `${WP}/01_CAD Standards/Eagle/01_34_14_00-Intel-Deliverables-Index.xlsx`, 40795),
  'eagle-linetypes': entry('eagle-linetypes', `${WP}/01_CAD Standards/Eagle/01_34_14_00-Intel-linetypes.zipx`, 66265),
  'eagle-rev-history': entry('eagle-rev-history', `${WP}/01_CAD Standards/Eagle/01_34_14_00-REV_HISTORY.xlsx`, 22146),
  'eagle-revit-warnings': entry('eagle-revit-warnings', `${WP}/01_CAD Standards/Eagle/01_34_14_00-RevitWarnings.xlsx`, 24245),
  'eagle-supplier-codes': entry('eagle-supplier-codes', `${WP}/01_CAD Standards/Eagle/01_34_14_00-SupplierCodes.xlsx`, 36881),
  'eagle-titles-examples': entry('eagle-titles-examples', `${WP}/01_CAD Standards/Eagle/01_34_14_00-TitlesExamples.docx`, 24921),
  'eagle-symbols': entry('eagle-symbols', `${WP}/01_CAD Standards/Eagle/01_34_14_00_Symbols.zipx`, 5088858),
  'eagle-linetype-examples': entry('eagle-linetype-examples', `${WP}/01_CAD Standards/Eagle/INTEL LINETYPE EXAMPLES (1).pdf`, 23618),
  'eagle-hcc-osm-pod': entry('eagle-hcc-osm-pod', `${WP}/01_CAD Standards/Eagle/HCC_OSM_POD.rfa`, 503808),
  'eagle-int-poc': entry('eagle-int-poc', `${WP}/01_CAD Standards/Eagle/INT_POC.rfa`, 475136),
  'eagle-ics-changelog': entry('eagle-ics-changelog', `${WP}/01_CAD Standards/Eagle/ICS-13.4-ChangeLog.xlsx`, 329201),
  'eagle-supplier-request': entry('eagle-supplier-request', `${WP}/01_CAD Standards/Eagle/ICS Supplier Code Request Short Form.docx`, 20342),
  'eagle-cad-change-request': entry('eagle-cad-change-request', `${WP}/01_CAD Standards/Eagle/Intel CAD Standard Change Request Form-Rev 2.docx`, 35459),
  'eagle-ics-variance': entry('eagle-ics-variance', `${WP}/01_CAD Standards/Eagle/Request for ICS Variance - Design Model Workflow Rev2.docx`, 821463),
  'eagle-readme': entry('eagle-readme', `${WP}/01_CAD Standards/Eagle/Read_Me.txt`, 1944),
  'eagle-acad-lin': entry('eagle-acad-lin', `${WP}/01_CAD Standards/Eagle/acad.lin`, 16112),

  // 01_CAD Standards / Paragon
  'paragon-cad-stds': entry('paragon-cad-stds', `${WP}/01_CAD Standards/Paragon/AppsLabsCADStdsRev3.doc`, 4253696),
  'paragon-shared-params': entry('paragon-shared-params', `${WP}/01_CAD Standards/Paragon/Revit_Shared-Parameters.txt`, 1260),

  // 02_EOR PEP and Supporting Document
  'a7-lod-matrix': entry('a7-lod-matrix', `${WP}/02_EOR PEP and Supporting Document/A-7_LOD_Matrix.xlsx`, 9784364),
  'a9-change-mgmt-pptx': entry('a9-change-mgmt-pptx', `${WP}/02_EOR PEP and Supporting Document/A-9_Change_Management.pptx`, 124629),
  'a11-deliverables': entry('a11-deliverables', `${WP}/02_EOR PEP and Supporting Document/A-11_Deliverables_Format_Table.pdf`, 210665),

  // 7.05 Specifications
  'pipe-supports-r3': entry('pipe-supports-r3', `${SPECS}/40 - Process Interconnections/40_05_19 - Pipe Supports and Anchors R3_Project Confluence.pdf`, 9917847),
  'span-tables-r0': entry('span-tables-r0', `${SPAN_TABLES}/40_05_19.01 -  Plastic and Metal Piping and Tubing Support Span Tables R0_Project Confluence.pdf`, 828300),

  // P&ID Legend Sheets
  'ocs-legend-1': entry('ocs-legend-1', `${LEGENDS}/OCS-G0-0001_ OCS - GENERAL MECHANICAL, PROCESS, & INSTRUMENTATION LEGEND SHEET 1 Rev.0.pdf`, 474288),
  'ocs-legend-2': entry('ocs-legend-2', `${LEGENDS}/OCS-G0-0002_ OCS - GENERAL MECHANICAL, PROCESS, & INSTRUMENTATION LEGEND SHEET 2 Rev.2 markup.pdf`, 856668),
  'ocs-legend-3': entry('ocs-legend-3', `${LEGENDS}/OCS-G0-0003_ OCS - GENERAL MECHANICAL, PROCESS, & INSTRUMENTATION LEGEND SHEET 3 Rev.1.pdf`, 521928),
  'ocs-legend-4': entry('ocs-legend-4', `${LEGENDS}/OCS-G0-0004_ OCS - GENERAL MECHANICAL, PROCESS, & INSTRUMENTATION LEGEND SHEET 4 Rev.3 markup.pdf`, 564952),

  // Plansrow Manuals
  'bim-manual-v2': entry('bim-manual-v2', 'Docs/Plansrow BIM Manual-2.pdf', 1039613),
  'bim-piping-cheat-sheet': entry('bim-piping-cheat-sheet', 'Docs/BIM_Piping_Cheat_Sheet.pdf', 14214),
  'a9-change-mgmt-pdf': entry('a9-change-mgmt-pdf', 'Docs/A-9_Change_Management.pdf', 283216),
  'bim-coordination-guide-root': entry('bim-coordination-guide-root', 'Docs/Project Confluence BIM Modeling and Coordination Guide.pdf', 331831),

  // GF Pipes Lib
  'gf-technical-handbook': entry('gf-technical-handbook', 'GF Pipes Lib/gfps-us-Technical Handbook-Contain-IT-Double-Containment-Piping-(2002)-en.pdf', 3114797),
  'gf-semiconductor-ref': entry('gf-semiconductor-ref', 'GF Pipes Lib/gfps-reference-case-sygef-plus-ending-corrosing-worries-in-semiconductor-wafer-cleaning-en.pdf', 1676346),
  'gf-support-companies': entry('gf-support-companies', 'GF Pipes Lib/pipe_support_companies.pdf', 4643),

  // ASME
  'asme-b31-3': entry('asme-b31-3', 'ASME B31.3-2024/638729037932906986ASME B31.3-2024.pdf', 12058370),

  // Reviews
  'cpep-review-highlights': entry('cpep-review-highlights', 'Docs/OneDrive_2025-11-03/07 - Engineering-Doc Control/2025.09.17_CPEP_BIM_3D_Design_WIP 1 Review and Highlights (1).pdf', 142524),
  'review-questions': entry('review-questions', 'Docs/OneDrive_2025-11-03/07 - Engineering-Doc Control/Review and Quesitons.pdf', 236247),

  // ── 00_BIM CPEP — Eagle ──
  'eagle-bim-req': entry('eagle-bim-req', `${BIM}/00_BIM CPEP and BIM Requirements/Eagle/Eagle/Hoffman BIM Requirements Rev4.4 2022-06-22.pdf`, 512000),
  'eagle-cpep': entry('eagle-cpep', `${BIM}/00_BIM CPEP and BIM Requirements/Eagle/Eagle/Hoffman EAGLE CPEP for BIM 3D Design 2022-05-17.pdf`, 680000),
  'eagle-osm-shared-params': entry('eagle-osm-shared-params', `${BIM}/00_BIM CPEP and BIM Requirements/Eagle/Eagle/Hoffman OSM Shared Parameters.pdf`, 145000),
  // ── 00_BIM CPEP — Paragon ──
  'paragon-bim-req': entry('paragon-bim-req', `${BIM}/00_BIM CPEP and BIM Requirements/Paragon/Hoffman BIM Requirements-2024-10-08.pdf`, 520000),
  'paragon-hpep': entry('paragon-hpep', `${BIM}/00_BIM CPEP and BIM Requirements/Paragon/Hoffman Paragon HPEP for BIM 3D Design 2024-06-17.pdf`, 710000),
  'paragon-coordination-guide': entry('paragon-coordination-guide', `${BIM}/00_BIM CPEP and BIM Requirements/Paragon/Project PARAGON BIM Modeling and Coordination Guide_2024-07-11.pdf`, 331831),

  // ── 02_EOR PEP — Eagle ──
  'eagle-a10-clash': entry('eagle-a10-clash', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-10_Clash_Detection.pptx`, 185000),
  'eagle-a11-deliverables': entry('eagle-a11-deliverables', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-11_Deliverables_Format_Table.pdf`, 210665),
  'eagle-a2-cad-std': entry('eagle-a2-cad-std', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-2.1_01_34_14_00.docx`, 204000),
  'eagle-a2-site-handbook': entry('eagle-a2-site-handbook', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-2.2_AZ-OC Site Handbook-Rev5.pdf`, 890000),
  'eagle-a4-bim-uses': entry('eagle-a4-bim-uses', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-4_BIM_Use_Definitions.docx`, 78000),
  'eagle-a5-rr': entry('eagle-a5-rr', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-5_R&R_Descriptions.docx`, 85000),
  'eagle-a6-workflow': entry('eagle-a6-workflow', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-6_Design_Workflow.pptx`, 175000),
  'eagle-a7-lod': entry('eagle-a7-lod', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-7_LOD_Matrix.xlsx`, 9784364),
  'eagle-a8-software': entry('eagle-a8-software', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-8_Authoring_Software.docx`, 52000),
  'eagle-a9-change': entry('eagle-a9-change', `${BIM}/02_EOR PEP and Supporting Document/Eagle/A-9_Change_Management.pptx`, 124629),
  'eagle-cable-tray': entry('eagle-cable-tray', `${BIM}/02_EOR PEP and Supporting Document/Eagle/Cable Tray Guidlines.pdf`, 320000),
  'eagle-clash-adjudications': entry('eagle-clash-adjudications', `${BIM}/02_EOR PEP and Supporting Document/Eagle/Clash_Adjudications.pptx`, 195000),
  'eagle-mepcon-colors': entry('eagle-mepcon-colors', `${BIM}/02_EOR PEP and Supporting Document/Eagle/MEPCon Color Schemes.pdf`, 240000),
  'eagle-bim-pep': entry('eagle-bim-pep', `${BIM}/02_EOR PEP and Supporting Document/Eagle/Project_Eagle_BIM_PEP.docx`, 420000),
  // ── 02_EOR PEP — Paragon ──
  'paragon-a1-definitions': entry('paragon-a1-definitions', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-1_BIM_Definitions.docx`, 68000),
  'paragon-a2-file-naming': entry('paragon-a2-file-naming', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-2_File_Naming.xlsx`, 95000),
  'paragon-a3-layers': entry('paragon-a3-layers', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-3_AppsLabsCADStdsRev3_LayersList.xlsx`, 120000),
  'paragon-a4-bim-uses': entry('paragon-a4-bim-uses', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-4_BIM_Use_Definitions.docx`, 78000),
  'paragon-a5-rr': entry('paragon-a5-rr', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-5_R&R_Descriptions.docx`, 85000),
  'paragon-a6-workflow': entry('paragon-a6-workflow', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-6_Design_Workflow.pptx`, 175000),
  'paragon-a7-lod': entry('paragon-a7-lod', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-7_LOD_Matrix.xlsx`, 9784364),
  'paragon-a8-software': entry('paragon-a8-software', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-8_Authoring_Software.docx`, 52000),
  'paragon-a9-change': entry('paragon-a9-change', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-9_Change_Management.pptx`, 124629),
  'paragon-a10-clash': entry('paragon-a10-clash', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-10_Clash_Detection.pptx`, 185000),
  'paragon-a11-deliverables-docx': entry('paragon-a11-deliverables-docx', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-11_Deliverables_Format_Table.docx`, 215000),
  'paragon-a11-deliverables-pdf': entry('paragon-a11-deliverables-pdf', `${BIM}/02_EOR PEP and Supporting Document/Paragon/A-11_Deliverables_Format_Table.pdf`, 210665),
  'paragon-bim-pep': entry('paragon-bim-pep', `${BIM}/02_EOR PEP and Supporting Document/Paragon/Project_Paragon_Design_BIM_PEP.docx`, 420000),

  // ── 03_CMC Guides ──
  'eagle-cmc-guide-docx': entry('eagle-cmc-guide-docx', `${BIM}/03_Certified Model Content (CMC) Guides/Eagle/Eagle certified model content guide_2022-10-27.docx`, 580000),
  'eagle-cmc-guide': entry('eagle-cmc-guide', `${BIM}/03_Certified Model Content (CMC) Guides/Eagle/Eagle certified model content guide_2022-10-27.pdf`, 620000),
  'paragon-cmc-guide': entry('paragon-cmc-guide', `${BIM}/03_Certified Model Content (CMC) Guides/Paragon/PARAGON CMC Certified Model Content Guide_2024-05-20.pdf`, 540000),

  // ── 04_File Naming & UPN ── Eagle
  'eagle-file-naming': entry('eagle-file-naming', `${BIM}/04_File Naming Guides and UPN lists/Eagle/EAGLE File Naming Guide.xlsx`, 350000),
  'eagle-upn-list-pdf': entry('eagle-upn-list-pdf', `${BIM}/04_File Naming Guides and UPN lists/Eagle/UPN List/EAGLE - UPN List.pdf`, 280000),
  'eagle-upn-list': entry('eagle-upn-list', `${BIM}/04_File Naming Guides and UPN lists/Eagle/UPN List/EAGLE - UPN List.xlsx`, 320000),
  'eagle-upn-layer-ref-pdf': entry('eagle-upn-layer-ref-pdf', `${BIM}/04_File Naming Guides and UPN lists/Eagle/UPN List/EAGLE - UPN-Layer Reference Document.pdf`, 260000),
  'eagle-upn-layer-ref': entry('eagle-upn-layer-ref', `${BIM}/04_File Naming Guides and UPN lists/Eagle/UPN List/EAGLE - UPN-Layer Reference Document.xlsx`, 290000),
  'eagle-building-elevations': entry('eagle-building-elevations', `${BIM}/04_File Naming Guides and UPN lists/Eagle/Building Elevations Maps/Eagle Building Levels and Elevations.pdf`, 310000),
  'eagle-supplier-codes-04': entry('eagle-supplier-codes-04', `${BIM}/04_File Naming Guides and UPN lists/Eagle/Author 3 Digit Code List/01_34_14_00-SupplierCodes.xlsx`, 36881),
  // ── 04_File Naming & UPN ── Paragon
  'paragon-file-naming': entry('paragon-file-naming', `${BIM}/04_File Naming Guides and UPN lists/Paragon/PARAGON File Naming Guide.xlsx`, 350000),
  'paragon-2d-codes': entry('paragon-2d-codes', `${BIM}/04_File Naming Guides and UPN lists/Paragon/PARAGON 2D Drawing Codes.xlsx`, 95000),
  'paragon-cm-map': entry('paragon-cm-map', `${BIM}/04_File Naming Guides and UPN lists/Paragon/Project PARAGON CM Map_2025-03-06.pdf`, 420000),
  'paragon-fm-map': entry('paragon-fm-map', `${BIM}/04_File Naming Guides and UPN lists/Paragon/Project PARAGON FM Map_2025-03-06.pdf`, 380000),

  // ── 05_Grids & Coordinates ──
  'eagle-coordinates-guide': entry('eagle-coordinates-guide', `${BIM}/05_RVT DWG Grids and Site Coordinates Guide/Eagle/BIM Acquiring Project Coordinates Guide_2022-06-15.docx`, 245000),

  // ── 06_Navisworks Config ── Eagle
  'eagle-quick-props-dict': entry('eagle-quick-props-dict', `${BIM}/06_Navisworks Configuration Files/Eagle/Global Quick Properties/00_Quick Properties Dictionary.xlsx`, 148000),
  'eagle-navis-shortcuts-docx': entry('eagle-navis-shortcuts-docx', `${BIM}/06_Navisworks Configuration Files/Eagle/Navisworks Roamer Commands/Navisworks Shortcut Quick Key Command List.docx`, 95000),
  'eagle-navis-shortcuts-pdf': entry('eagle-navis-shortcuts-pdf', `${BIM}/06_Navisworks Configuration Files/Eagle/Navisworks Roamer Commands/Navisworks Shortcut Quick Key Command List.pdf`, 82000),
  'eagle-roamer-2025': entry('eagle-roamer-2025', `${BIM}/06_Navisworks Configuration Files/Eagle/Navisworks Roamer Commands/2025/Roamer Command Standard-2025.pdf`, 78000),
  'eagle-roamer-2024': entry('eagle-roamer-2024', `${BIM}/06_Navisworks Configuration Files/Eagle/Navisworks Roamer Commands/2024/Roamer Command Standard-2024.pdf`, 78000),
  // ── 06_Navisworks Config ── Paragon
  'paragon-quick-props-dict': entry('paragon-quick-props-dict', `${BIM}/06_Navisworks Configuration Files/Paragon/Global Quick Properties/Quick Properties Dictionary.xlsx`, 148000),
  'paragon-global-options-doc': entry('paragon-global-options-doc', `${BIM}/06_Navisworks Configuration Files/Paragon/Global Options/HCC Navis Global Options 2024.docx`, 120000),

  // ── 07_BIM 360 Guide ──
  'eagle-bim360-guide': entry('eagle-bim360-guide', `${BIM}/07_BIM 360 Guide/Eagle/Eagle BIM 360 Docs 2021-12-10.pdf`, 420000),
  'paragon-bim360-guide': entry('paragon-bim360-guide', `${BIM}/07_BIM 360 Guide/Paragon/PARAGON BIM360 Docs and ADC_2024-04-25.pdf`, 450000),

  // ── 08_BIM Track Guide ── Eagle
  'eagle-bt-sec1': entry('eagle-bt-sec1', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 1 \u2022 Invitations_Accounts_Add-ins_2022-06-10.pdf`, 310000),
  'eagle-bt-sec2': entry('eagle-bt-sec2', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 2 \u2022 Navis add-in_Data Parameters_Creating Issues_2022-03-14.pdf`, 580000),
  'eagle-bt-sec3': entry('eagle-bt-sec3', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 3 \u2022 BIM Track Web Interface_2021-12-23.pdf`, 420000),
  'eagle-bt-sec4-hcc': entry('eagle-bt-sec4-hcc', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 4 \u2022 DM Pkg Review Guide \u2022 HCC_2021-12-27.pdf`, 390000),
  'eagle-bt-sec4-jeg': entry('eagle-bt-sec4-jeg', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 4 \u2022 DM Pkg Review Guide \u2022 JEG_2021-12-27.pdf`, 390000),
  'eagle-bt-sec5': entry('eagle-bt-sec5', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 5 \u2022 Construction Coordination Issue Management_2021-04-28.pdf`, 340000),
  'eagle-bt-sec6': entry('eagle-bt-sec6', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 6 \u2022 Issue Reporting Req for IFF Submittal_2022-01-10.pdf`, 280000),
  'eagle-bt-sec7-sub': entry('eagle-bt-sec7-sub', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 7_1 \u2022 Pre-IFC Design Queries_SUB team_2022-05-18.pdf`, 290000),
  'eagle-bt-sec7-cm': entry('eagle-bt-sec7-cm', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 7_2 \u2022 Pre-IFC Design Queries_CM team_2022-05-18.pdf`, 290000),
  'eagle-bt-sec7-dm': entry('eagle-bt-sec7-dm', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 7_3 \u2022 Pre-IFC Design Queries_DM team_2022-05-18.pdf`, 290000),
  'eagle-bt-sec8-sub': entry('eagle-bt-sec8-sub', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 8_1 \u2022 Post-IFC Design Issues_SUB team_2022-09-30.pdf`, 310000),
  'eagle-bt-sec8-cm': entry('eagle-bt-sec8-cm', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Guide \u2022 Sec 8_2 \u2022 Post-IFC Design Issues_CM team_2022-09-30.pdf`, 310000),
  'eagle-bt-quickbase': entry('eagle-bt-quickbase', `${BIM}/08_BIM Track Guide/Eagle/BIM Track Quickbase Design Package Training-Eagle.pdf`, 420000),
  // ── 08_BIM Track Guide ── Paragon (Newforma Konekt)
  'paragon-nfk-sec1': entry('paragon-nfk-sec1', `${BIM}/08_BIM Track Guide/Paragon/PARAGON Newforma Konekt Guide \u2022 Sec 1 \u2022 Invitations_Accounts_Add-ins_2024-03-12.pdf`, 380000),
  'paragon-nfk-sec3': entry('paragon-nfk-sec3', `${BIM}/08_BIM Track Guide/Paragon/PARAGON Newforma Konekt Guide \u2022 Sec 3 \u2022 Web Interface_2024-03-21.pdf`, 450000),
  'paragon-nfk-sec5': entry('paragon-nfk-sec5', `${BIM}/08_BIM Track Guide/Paragon/PARAGON Newforma Konekt Guide \u2022 Sec 5 \u2022  Design Issues_2025-02-07.pdf`, 320000),
  'paragon-nfk-naming': entry('paragon-nfk-naming', `${BIM}/08_BIM Track Guide/Paragon/PARAGON Newforma Konekt issue naming guide_2024-03-18.pdf`, 95000),

  // ── 09_Search Sets Guide ──
  'eagle-search-sets': entry('eagle-search-sets', `${BIM}/09_Search Sets Guide/Eagle/HCC Eagle Search and Selection Sets 2021-12-16.pdf`, 380000),

  // ── 10_BIM Workflow Documents ── Eagle
  'eagle-wf-design-delivery': entry('eagle-wf-design-delivery', `${BIM}/10_BIM Workflow Documents/Eagle/Appendix 4_1 Design Delivery Workflow_2022-03-20.pdf`, 185000),
  'eagle-wf-fm-structure': entry('eagle-wf-fm-structure', `${BIM}/10_BIM Workflow Documents/Eagle/Appendix 4_2 Federated Model Structure_2022-04-18.pdf`, 165000),
  'eagle-wf-best-value': entry('eagle-wf-best-value', `${BIM}/10_BIM Workflow Documents/Eagle/Appendix 6_2 Best Value Heat Sheet Workflow_2022-03-20.pdf`, 145000),
  'eagle-wf-collaboration': entry('eagle-wf-collaboration', `${BIM}/10_BIM Workflow Documents/Eagle/Appendix 6_3 BIM Collaboration Workflow_2022-03-20.pdf`, 175000),
  'eagle-wf-design-query': entry('eagle-wf-design-query', `${BIM}/10_BIM Workflow Documents/Eagle/Appendix 6_4 BIM Track Pre-IFC Design Query Workflow_2022-03-20.pdf`, 190000),
  'eagle-wf-iff': entry('eagle-wf-iff', `${BIM}/10_BIM Workflow Documents/Eagle/Appendix 7_1 IFF Submittal Procedure_2022-03-20.pdf`, 155000),
  'eagle-wf-field-quality': entry('eagle-wf-field-quality', `${BIM}/10_BIM Workflow Documents/Eagle/Appendix 8_1 Model to Field Quality Review Process_2022-05-10.pdf`, 185000),
  'eagle-wf-tool-install': entry('eagle-wf-tool-install', `${BIM}/10_BIM Workflow Documents/Eagle/Intel SPARROW-EAGLE Tool Install & Base Build Coordination.pdf`, 520000),
  // ── 10_BIM Workflow Documents ── Paragon
  'paragon-wf-collaboration': entry('paragon-wf-collaboration', `${BIM}/10_BIM Workflow Documents/Paragon/PARAGON BIM collaboration workflow_2024-03-20.pdf`, 175000),
  'paragon-wf-iff': entry('paragon-wf-iff', `${BIM}/10_BIM Workflow Documents/Paragon/PARAGON IFF submittal procedure workflow_2024-03-20.pdf`, 155000),
  'paragon-wf-design-delivery': entry('paragon-wf-design-delivery', `${BIM}/10_BIM Workflow Documents/Paragon/PARAGON design delivery workflow_2024-0320.pdf`, 175000),
  'paragon-wf-fm-structure': entry('paragon-wf-fm-structure', `${BIM}/10_BIM Workflow Documents/Paragon/PARAGON federated model structure_2024-03-20.pdf`, 165000),
  'paragon-wf-field-quality': entry('paragon-wf-field-quality', `${BIM}/10_BIM Workflow Documents/Paragon/PARAGON model to field quality review workflow_2024-03-20.pdf`, 175000),

  // ── 11_Meeting Schedules ──
  'eagle-meeting-schedule': entry('eagle-meeting-schedule', `${BIM}/11_Meeting Schedules/Eagle/EAGLE BIM Coordination Meeting Schedule.pdf`, 145000),

  // ── 12_IFF Submittal Guide ── Eagle
  'eagle-iff-workflow': entry('eagle-iff-workflow', `${BIM}/12_IFF Submittal Guide/Eagle/Eagle IFF Workflow SUB Rev.14.pdf`, 780000),
  'eagle-iff-checklist': entry('eagle-iff-checklist', `${BIM}/12_IFF Submittal Guide/Eagle/IFF Submission Checklist for CMs Rev3.pdf`, 320000),
  'eagle-mod2-schedule': entry('eagle-mod2-schedule', `${BIM}/12_IFF Submittal Guide/Eagle/Eagle MOD 2 Scheduling.pdf`, 280000),
  'eagle-procore-template': entry('eagle-procore-template', `${BIM}/12_IFF Submittal Guide/Eagle/ProCore IFF Description (Copy and Paste).txt`, 450),
  // ── 12_IFF Submittal Guide ── Paragon
  'paragon-iff-sec1': entry('paragon-iff-sec1', `${BIM}/12_IFF Submittal Guide/Paragon/PARAGON IFF Submittal Guide \u2022 Sec 1\u2022 Subcontractor_2025-02-07.pdf`, 680000),
  'paragon-iff-sec2': entry('paragon-iff-sec2', `${BIM}/12_IFF Submittal Guide/Paragon/PARAGON IFF Submittal Guide \u2022 Sec 2\u2022 CM_2024-11-11.pdf`, 720000),
  'paragon-iff-sec3': entry('paragon-iff-sec3', `${BIM}/12_IFF Submittal Guide/Paragon/PARAGON IFF Submittal Guide \u2022 Sec 3\u2022 Shops_2025-04-23.pdf`, 560000),
  'paragon-iff-checklist': entry('paragon-iff-checklist', `${BIM}/12_IFF Submittal Guide/Paragon/PARAGON IFF Submittal Checklist for SUBS_2024-11-06.pdf`, 310000),
  'paragon-iff-cm-checklist': entry('paragon-iff-cm-checklist', `${BIM}/12_IFF Submittal Guide/Paragon/PARAGON IFF Submittal Guide \u2022 Sec 2\u2022 CM_checklist_2025-02-28.pdf`, 295000),

  // ── 13_Clash Reporting Process ──
  'eagle-clash-part1': entry('eagle-clash-part1', `${BIM}/13_Clash Reporting Process/Eagle/Clash Report Guide \u2022 Part 1 \u2022 IFF Setup_2023-05-17.pdf`, 640000),
  'eagle-clash-part2': entry('eagle-clash-part2', `${BIM}/13_Clash Reporting Process/Eagle/Clash Report Guide \u2022 Part 2 \u2022 Clash Report_2022-01-10.pdf`, 580000),
  'eagle-clash-part3': entry('eagle-clash-part3', `${BIM}/13_Clash Reporting Process/Eagle/Clash Report Guide \u2022 Part 3 \u2022 Rereview of the Same IFF_2022-01-10.pdf`, 390000),

  // ── 14_NSFP ──
  'eagle-nfpa13': entry('eagle-nfpa13', `${BIM}/14_NSFP (Fire Protection Head Code)/Eagle/Eagle NFPA 13 Training Package Master.pdf`, 1250000),

  // ── 15_Close Out ──
  'eagle-closeout-guide': entry('eagle-closeout-guide', `${BIM}/15_Close Out/Eagle/Closeout Guide \u2022 Subs \u2022 2025-05-01.pdf`, 480000),
  'eagle-closeout-workflow': entry('eagle-closeout-workflow', `${BIM}/15_Close Out/Eagle/Closeout Workflow \u2022 2025-05-01.pdf`, 220000),
  'paragon-closeout': entry('paragon-closeout', `${BIM}/15_Close Out/Paragon/PARAGON BIM closeout_2025-06-04.pdf`, 520000),
};

export function resolveDocumentPath(id: string): string | null {
  const entry = DOCUMENT_MANIFEST[id];
  if (!entry) return null;
  const fullPath = path.join(DOCUMENTS_ROOT, entry.relativePath);
  try {
    const stat = fs.statSync(fullPath);
    if (stat.size === 0) return null;
    return fullPath;
  } catch {
    return null;
  }
}

export function getDocumentEntry(id: string): DocumentEntry | null {
  return DOCUMENT_MANIFEST[id] || null;
}

// Supabase Storage only accepts S3-safe object keys. Several BIM filenames
// contain a "•" (U+2022) bullet and other non-ASCII characters that the
// Storage API rejects with "Invalid key". This maps a manifest relativePath
// to a safe, deterministic object key. It MUST be used identically by both the
// uploader and the API route so reads line up with writes. Path separators are
// preserved; every other unsafe character becomes "_".
export function toStorageObjectKey(relativePath: string): string {
  return relativePath.replace(/[^A-Za-z0-9/!\-.*'()&$@=;:+,?_ ]/g, "_");
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
