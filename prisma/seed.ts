import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PIDFlow database seed...\n');

  // 1. TOLERANCE SPECS (A-9)
  console.log('📄 Seeding Tolerance Specs...');
  await prisma.toleranceSpec.deleteMany();
  const toleranceSpecs = [
    { discipline: 'Process', elementType: 'Subfab lateral racks', tolerance: '0 inch', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'Subfab lateral racks' },
    { discipline: 'Process', elementType: 'Process piping (in EOR racks)', tolerance: '1/2 inch', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'Process piping (in EOR racks)' },
    { discipline: 'Process', elementType: 'Utility mains & sub-mains', tolerance: '1 inch', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'Utility mains & sub-mains' },
    { discipline: 'Process', elementType: 'Equipment/panel datums', tolerance: '1/2 inch', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'Equipment/panel datums' },
    { discipline: 'Process', elementType: 'Equipment feeders / utility branches', tolerance: '6 inch', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'Equipment feeders / utility branches' },
    { discipline: 'Process', elementType: 'Individual pipe runs', tolerance: '6 inch', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'Individual pipe runs' },
    { discipline: 'Process', elementType: 'In-line component location', tolerance: '6 inch axially', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'In-line component location' },
    { discipline: 'Process', elementType: 'EOR designed pipe supports', tolerance: '6 inch', sourcePage: 5, sourceTable: 'Process Tolerance Table', sourceRow: 'EOR designed pipe supports' },
    { discipline: 'Mechanical', elementType: 'Subfab lateral rack exhaust', tolerance: '0 inch', sourcePage: 4, sourceTable: 'Mechanical Tolerance Table', sourceRow: 'Subfab lateral rack exhaust' },
    { discipline: 'Mechanical', elementType: 'Mechanical equipment', tolerance: '0 inch', sourcePage: 4, sourceTable: 'Mechanical Tolerance Table', sourceRow: 'Mechanical equipment' },
    { discipline: 'Mechanical', elementType: 'Ductwork mains', tolerance: '6 inch', sourcePage: 4, sourceTable: 'Mechanical Tolerance Table', sourceRow: 'Ductwork mains' },
    { discipline: 'Mechanical', elementType: 'Mechanical piping (in racks)', tolerance: '1 inch', sourcePage: 4, sourceTable: 'Mechanical Tolerance Table', sourceRow: 'Mechanical piping (in racks)' },
    { discipline: 'Mechanical', elementType: 'Mechanical piping (not in racks)', tolerance: '6 inch', sourcePage: 4, sourceTable: 'Mechanical Tolerance Table', sourceRow: 'Mechanical piping (not in racks)' },
    { discipline: 'Electrical', elementType: 'Individual conduits', tolerance: '6 inch', sourcePage: 6, sourceTable: 'Electrical Tolerance Table', sourceRow: 'Individual conduits' },
    { discipline: 'Structural', elementType: 'Subfab lateral racks', tolerance: '0 inch', sourcePage: 3, sourceTable: 'Structural Tolerance Table', sourceRow: 'Subfab lateral racks' },
  ];
  await prisma.toleranceSpec.createMany({ data: toleranceSpecs });
  console.log(`   ✓ ${toleranceSpecs.length} tolerance specs\n`);

  // 2. PIPE SPAN SPECS (40_05_19.01)
  console.log('📄 Seeding Pipe Span Specs...');
  await prisma.pipeSpanSpec.deleteMany();
  const pipeSpanSpecs = [
    { material: 'PVC Schedule 80', service: 'Water', pipeSize: '1/2 inch', temperature: 68, maxSpan: 2.5, sourcePage: 4, sourceTable: 'Table 1.13', sourceDescription: 'PVC Schedule 80 Water Service' },
    { material: 'PVC Schedule 80', service: 'Water', pipeSize: '1 inch', temperature: 68, maxSpan: 3.5, sourcePage: 4, sourceTable: 'Table 1.13', sourceDescription: 'PVC Schedule 80 Water Service' },
    { material: 'PVC Schedule 80', service: 'Water', pipeSize: '2 inch', temperature: 68, maxSpan: 5.0, sourcePage: 4, sourceTable: 'Table 1.13', sourceDescription: 'PVC Schedule 80 Water Service' },
    { material: 'PVC Schedule 80', service: 'Water', pipeSize: '3 inch', temperature: 68, maxSpan: 6.3, sourcePage: 4, sourceTable: 'Table 1.13', sourceDescription: 'PVC Schedule 80 Water Service' },
    { material: 'PVC Schedule 80', service: 'Water', pipeSize: '4 inch', temperature: 68, maxSpan: 7.1, sourcePage: 4, sourceTable: 'Table 1.13', sourceDescription: 'PVC Schedule 80 Water Service' },
    { material: 'PVC Schedule 40', service: 'Water', pipeSize: '2 inch', temperature: 68, maxSpan: 4.7, sourcePage: 3, sourceTable: 'Table 1.11', sourceDescription: 'PVC Schedule 40 Water Service' },
    { material: 'PVC Schedule 40', service: 'Water', pipeSize: '4 inch', temperature: 68, maxSpan: 6.6, sourcePage: 3, sourceTable: 'Table 1.11', sourceDescription: 'PVC Schedule 40 Water Service' },
    { material: 'CPVC Schedule 80', service: 'Water', pipeSize: '2 inch', temperature: 68, maxSpan: 4.9, sourcePage: 6, sourceTable: 'Table 1.21', sourceDescription: 'CPVC Schedule 80 Water Service' },
    { material: 'CPVC Schedule 80', service: 'Water', pipeSize: '4 inch', temperature: 68, maxSpan: 7.0, sourcePage: 6, sourceTable: 'Table 1.21', sourceDescription: 'CPVC Schedule 80 Water Service' },
    { material: 'Carbon Steel Standard Weight', service: 'Water', pipeSize: '2 inch', temperature: 68, maxSpan: 13.5, sourcePage: 9, sourceTable: 'Table 1.50', sourceDescription: 'Carbon Steel Standard Weight' },
    { material: 'Carbon Steel Standard Weight', service: 'Water', pipeSize: '4 inch', temperature: 68, maxSpan: 19.0, sourcePage: 9, sourceTable: 'Table 1.50', sourceDescription: 'Carbon Steel Standard Weight' },
    { material: 'Stainless Steel', service: 'Water', pipeSize: '2 inch', temperature: 68, maxSpan: 12.0, sourcePage: 9, sourceTable: 'Table 1.60', sourceDescription: 'Stainless Steel' },
    { material: 'Stainless Steel', service: 'Water', pipeSize: '4 inch', temperature: 68, maxSpan: 15.5, sourcePage: 10, sourceTable: 'Table 1.60', sourceDescription: 'Stainless Steel' },
  ];
  await prisma.pipeSpanSpec.createMany({ data: pipeSpanSpecs });
  console.log(`   ✓ ${pipeSpanSpecs.length} pipe span specs\n`);

  // 3. SG CORRECTION FACTORS
  console.log('📄 Seeding SG Correction Factors...');
  await prisma.sGCorrectionFactor.deleteMany();
  const sgFactors = [
    { material: 'PVC Schedule 40', specificGravity: 1.25, correctionFactor: 0.92, sourcePage: 10, sourceTable: 'SG Correction Table' },
    { material: 'PVC Schedule 40', specificGravity: 1.5, correctionFactor: 0.86, sourcePage: 10, sourceTable: 'SG Correction Table' },
    { material: 'PVC Schedule 80', specificGravity: 1.25, correctionFactor: 0.96, sourcePage: 10, sourceTable: 'SG Correction Table' },
    { material: 'PVC Schedule 80', specificGravity: 1.5, correctionFactor: 0.91, sourcePage: 10, sourceTable: 'SG Correction Table' },
  ];
  await prisma.sGCorrectionFactor.createMany({ data: sgFactors });
  console.log(`   ✓ ${sgFactors.length} SG correction factors\n`);

  // 4. LOD REQUIREMENTS (A-7)
  console.log('📄 Seeding LOD Requirements...');
  await prisma.lODRequirement.deleteMany();
  const lodRequirements = [
    { discipline: 'Process', elementType: 'Process piping ≥2"', sizeThreshold: '≥2 inch', includeInModel: true, requiredMetadata: ['Name', 'Line Number', 'Size (nominal)', 'Length', 'Layer', 'Package Name'], excludedItems: [], sourceSheet: 'Process', sourceRows: 'Row 52-58' },
    { discipline: 'Process', elementType: 'Valves', sizeThreshold: null, includeInModel: true, requiredMetadata: ['Name', 'Line Number', 'Size (nominal)', 'Layer'], excludedItems: [], sourceSheet: 'Process', sourceRows: 'Row 52-58' },
    { discipline: 'Process', elementType: 'Process piping <2"', sizeThreshold: '<2 inch', includeInModel: false, requiredMetadata: [], excludedItems: ['Piping <2" unless designated stress lines'], sourceSheet: 'Process', sourceRows: 'Row 52-58' },
    { discipline: 'Mechanical', elementType: 'Mechanical piping', sizeThreshold: null, includeInModel: true, requiredMetadata: ['Name', 'System', 'Size', 'Length', 'Layer'], excludedItems: [], sourceSheet: 'Mechanical', sourceRows: 'Row 40-50' },
  ];
  await prisma.lODRequirement.createMany({ data: lodRequirements });
  console.log(`   ✓ ${lodRequirements.length} LOD requirements\n`);

  // 5. LINE CLASSES
  console.log('📄 Seeding Line Classes...');
  await prisma.lineClass.deleteMany();
  const lineClasses = [
    { code: 'PV', material: 'PVC', schedule: 'Schedule 80', description: 'PVC Schedule 80 piping' },
    { code: 'PU', material: 'PVC', schedule: 'Schedule 40', description: 'PVC Schedule 40 piping' },
    { code: 'CC', material: 'CPVC', schedule: 'Schedule 80', description: 'CPVC Schedule 80 piping' },
    { code: 'SA', material: 'Stainless Steel', schedule: null, description: 'Stainless steel piping' },
    { code: 'CS', material: 'Carbon Steel', schedule: 'Standard Weight', description: 'Carbon steel piping' },
  ];
  await prisma.lineClass.createMany({ data: lineClasses });
  console.log(`   ✓ ${lineClasses.length} line classes\n`);

  // 6. SERVICE CODES
  console.log('📄 Seeding Service Codes...');
  await prisma.serviceCode.deleteMany();
  const serviceCodes = [
    { code: 'PW', service: 'Process Water', typicalMaterial: 'PVC, CPVC, SS' },
    { code: 'CW', service: 'Chilled Water', typicalMaterial: 'Carbon Steel, CPVC' },
    { code: 'HW', service: 'Hot Water', typicalMaterial: 'Carbon Steel, CPVC' },
    { code: 'DI', service: 'Deionized Water', typicalMaterial: 'PVC, PVDF, PP' },
    { code: 'N2', service: 'Nitrogen', typicalMaterial: 'Stainless Steel' },
    { code: 'CA', service: 'Compressed Air', typicalMaterial: 'Carbon Steel, Copper' },
    { code: 'EXH', service: 'Exhaust', typicalMaterial: 'PVC, CPVC, SS' },
    { code: 'WW', service: 'Waste Water', typicalMaterial: 'PVC, CPVC' },
  ];
  await prisma.serviceCode.createMany({ data: serviceCodes });
  console.log(`   ✓ ${serviceCodes.length} service codes\n`);

  // 7. VENDOR PRODUCTS
  console.log('📄 Seeding Vendor Products...');
  await prisma.vendorProduct.deleteMany();
  const vendorProducts = [
    { vendor: 'George Fischer', productName: 'PVC-U Pipe Schedule 80', productUrl: 'https://www.gfps.com/us/products/pvc-u-schedule-80-pipe', material: 'PVC Schedule 80', pipeSize: '4 inch', isPreferred: true },
    { vendor: 'Spears Manufacturing', productName: 'PVC Schedule 80 Pipe', productUrl: 'https://www.spearsmfg.com/products/pvc-schedule-80', material: 'PVC Schedule 80', pipeSize: '4 inch', isPreferred: false },
    { vendor: 'NIBCO', productName: 'CPVC Schedule 80 Pipe', productUrl: 'https://www.nibco.com/products/cpvc-schedule-80', material: 'CPVC Schedule 80', pipeSize: '4 inch', isPreferred: true },
  ];
  await prisma.vendorProduct.createMany({ data: vendorProducts });
  console.log(`   ✓ ${vendorProducts.length} vendor products\n`);

  console.log('✅ PIDFlow database seed completed!');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
