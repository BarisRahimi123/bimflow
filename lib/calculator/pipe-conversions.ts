// Pipe Size Conversion Tables
// Maps Imperial NPS (Nominal Pipe Size) to Metric OD for different materials
// Used to find correct hardware products from metric-based manufacturers like Georg Fischer

export interface PipeSizeConversion {
  nps: string;           // Nominal Pipe Size (imperial)
  npsDecimal: number;    // NPS as decimal inches
  dn: number;            // DN (Diameter Nominal) - metric designation
  odInches: number;      // Actual Outside Diameter in inches
  odMm: number;          // Actual Outside Diameter in mm
  gfMetricSize: number;  // Corresponding GF Stress Less size (mm)
  gfProductCode?: string; // GF catalog number for guide
}

// PVC Schedule 40/80 - ASTM D1785
export const PVC_SIZE_CHART: PipeSizeConversion[] = [
  { nps: '1/2"',   npsDecimal: 0.5,  dn: 15,  odInches: 0.840,  odMm: 21.3,  gfMetricSize: 20,  gfProductCode: '155 484 500' },
  { nps: '3/4"',   npsDecimal: 0.75, dn: 20,  odInches: 1.050,  odMm: 26.7,  gfMetricSize: 25,  gfProductCode: '155 484 501' },
  { nps: '1"',     npsDecimal: 1,    dn: 25,  odInches: 1.315,  odMm: 33.4,  gfMetricSize: 32,  gfProductCode: '155 484 502' },
  { nps: '1-1/4"', npsDecimal: 1.25, dn: 32,  odInches: 1.660,  odMm: 42.2,  gfMetricSize: 40,  gfProductCode: '155 484 503' },
  { nps: '1-1/2"', npsDecimal: 1.5,  dn: 40,  odInches: 1.900,  odMm: 48.3,  gfMetricSize: 50,  gfProductCode: '155 484 504' },
  { nps: '2"',     npsDecimal: 2,    dn: 50,  odInches: 2.375,  odMm: 60.3,  gfMetricSize: 63,  gfProductCode: '155 484 505' },
  { nps: '2-1/2"', npsDecimal: 2.5,  dn: 65,  odInches: 2.875,  odMm: 73.0,  gfMetricSize: 75,  gfProductCode: '155 484 506' },
  { nps: '3"',     npsDecimal: 3,    dn: 80,  odInches: 3.500,  odMm: 88.9,  gfMetricSize: 90,  gfProductCode: '155 484 507' },
  { nps: '4"',     npsDecimal: 4,    dn: 100, odInches: 4.500,  odMm: 114.3, gfMetricSize: 110, gfProductCode: '155 484 508' },
  { nps: '5"',     npsDecimal: 5,    dn: 125, odInches: 5.563,  odMm: 141.3, gfMetricSize: 140, gfProductCode: '155 484 519' },
  { nps: '6"',     npsDecimal: 6,    dn: 150, odInches: 6.625,  odMm: 168.3, gfMetricSize: 160, gfProductCode: '155 484 509' },
];

// CPVC Schedule 40/80 - ASTM F441 (same OD as PVC)
export const CPVC_SIZE_CHART: PipeSizeConversion[] = PVC_SIZE_CHART;

// Polypropylene (PP) - GF Progef Standard (metric OD)
export const PP_SIZE_CHART: PipeSizeConversion[] = [
  { nps: '1/2"',   npsDecimal: 0.5,  dn: 15,  odInches: 0.787,  odMm: 20,    gfMetricSize: 20,  gfProductCode: '155 484 500' },
  { nps: '3/4"',   npsDecimal: 0.75, dn: 20,  odInches: 0.984,  odMm: 25,    gfMetricSize: 25,  gfProductCode: '155 484 501' },
  { nps: '1"',     npsDecimal: 1,    dn: 25,  odInches: 1.260,  odMm: 32,    gfMetricSize: 32,  gfProductCode: '155 484 502' },
  { nps: '1-1/4"', npsDecimal: 1.25, dn: 32,  odInches: 1.575,  odMm: 40,    gfMetricSize: 40,  gfProductCode: '155 484 503' },
  { nps: '1-1/2"', npsDecimal: 1.5,  dn: 40,  odInches: 1.969,  odMm: 50,    gfMetricSize: 50,  gfProductCode: '155 484 504' },
  { nps: '2"',     npsDecimal: 2,    dn: 50,  odInches: 2.480,  odMm: 63,    gfMetricSize: 63,  gfProductCode: '155 484 505' },
  { nps: '2-1/2"', npsDecimal: 2.5,  dn: 65,  odInches: 2.953,  odMm: 75,    gfMetricSize: 75,  gfProductCode: '155 484 506' },
  { nps: '3"',     npsDecimal: 3,    dn: 80,  odInches: 3.543,  odMm: 90,    gfMetricSize: 90,  gfProductCode: '155 484 507' },
  { nps: '4"',     npsDecimal: 4,    dn: 100, odInches: 4.331,  odMm: 110,   gfMetricSize: 110, gfProductCode: '155 484 508' },
  { nps: '5"',     npsDecimal: 5,    dn: 125, odInches: 4.921,  odMm: 125,   gfMetricSize: 125, gfProductCode: '155 484 518' },
  { nps: '6"',     npsDecimal: 6,    dn: 150, odInches: 6.299,  odMm: 160,   gfMetricSize: 160, gfProductCode: '155 484 509' },
];

// PVDF (Polyvinylidene Fluoride) - similar to PP metric
export const PVDF_SIZE_CHART: PipeSizeConversion[] = PP_SIZE_CHART;

// Carbon Steel / Stainless Steel - ASME B36.10M / B36.19M
export const STEEL_SIZE_CHART: PipeSizeConversion[] = [
  { nps: '1/2"',   npsDecimal: 0.5,  dn: 15,  odInches: 0.840,  odMm: 21.3,  gfMetricSize: 20 },
  { nps: '3/4"',   npsDecimal: 0.75, dn: 20,  odInches: 1.050,  odMm: 26.7,  gfMetricSize: 25 },
  { nps: '1"',     npsDecimal: 1,    dn: 25,  odInches: 1.315,  odMm: 33.4,  gfMetricSize: 32 },
  { nps: '1-1/4"', npsDecimal: 1.25, dn: 32,  odInches: 1.660,  odMm: 42.2,  gfMetricSize: 40 },
  { nps: '1-1/2"', npsDecimal: 1.5,  dn: 40,  odInches: 1.900,  odMm: 48.3,  gfMetricSize: 50 },
  { nps: '2"',     npsDecimal: 2,    dn: 50,  odInches: 2.375,  odMm: 60.3,  gfMetricSize: 63 },
  { nps: '2-1/2"', npsDecimal: 2.5,  dn: 65,  odInches: 2.875,  odMm: 73.0,  gfMetricSize: 75 },
  { nps: '3"',     npsDecimal: 3,    dn: 80,  odInches: 3.500,  odMm: 88.9,  gfMetricSize: 90 },
  { nps: '4"',     npsDecimal: 4,    dn: 100, odInches: 4.500,  odMm: 114.3, gfMetricSize: 110 },
  { nps: '5"',     npsDecimal: 5,    dn: 125, odInches: 5.563,  odMm: 141.3, gfMetricSize: 140 },
  { nps: '6"',     npsDecimal: 6,    dn: 150, odInches: 6.625,  odMm: 168.3, gfMetricSize: 160 },
  { nps: '8"',     npsDecimal: 8,    dn: 200, odInches: 8.625,  odMm: 219.1, gfMetricSize: 225 },
  { nps: '10"',    npsDecimal: 10,   dn: 250, odInches: 10.750, odMm: 273.1, gfMetricSize: 280 },
  { nps: '12"',    npsDecimal: 12,   dn: 300, odInches: 12.750, odMm: 323.9, gfMetricSize: 315 },
];

// Copper Tubing - Type K, L, M (ASTM B88)
export const COPPER_SIZE_CHART: PipeSizeConversion[] = [
  { nps: '1/2"',   npsDecimal: 0.5,  dn: 15,  odInches: 0.625,  odMm: 15.9,  gfMetricSize: 20 },
  { nps: '3/4"',   npsDecimal: 0.75, dn: 20,  odInches: 0.875,  odMm: 22.2,  gfMetricSize: 25 },
  { nps: '1"',     npsDecimal: 1,    dn: 25,  odInches: 1.125,  odMm: 28.6,  gfMetricSize: 32 },
  { nps: '1-1/4"', npsDecimal: 1.25, dn: 32,  odInches: 1.375,  odMm: 34.9,  gfMetricSize: 40 },
  { nps: '1-1/2"', npsDecimal: 1.5,  dn: 40,  odInches: 1.625,  odMm: 41.3,  gfMetricSize: 40 },
  { nps: '2"',     npsDecimal: 2,    dn: 50,  odInches: 2.125,  odMm: 54.0,  gfMetricSize: 50 },
  { nps: '2-1/2"', npsDecimal: 2.5,  dn: 65,  odInches: 2.625,  odMm: 66.7,  gfMetricSize: 63 },
  { nps: '3"',     npsDecimal: 3,    dn: 80,  odInches: 3.125,  odMm: 79.4,  gfMetricSize: 75 },
  { nps: '4"',     npsDecimal: 4,    dn: 100, odInches: 4.125,  odMm: 104.8, gfMetricSize: 110 },
];

// GF Stress Less Product Types and their base codes
export const GF_STRESS_LESS_PRODUCTS = {
  guide: {
    name: 'Stress Less Pipe Guide',
    baseCode: '155 484',
    description: 'Engineered 3mm gap eliminates stress transfer from thermal expansion',
  },
  hanger: {
    name: 'Stress Less Clevis Hanger',
    baseCode: '155 486',
    description: 'Clevis hanger with plastic insert for deadweight support',
  },
  anchor: {
    name: 'Stress Less Clamp Fixpoint',
    baseCode: '155 485',
    description: 'Fixed anchor point for axial restraint',
  },
  riserClamp: {
    name: 'Stress Less Riser Clamp',
    baseCode: '155 487',
    description: 'Vertical pipe support with load transfer capability',
  },
};

/**
 * Get the appropriate size chart for a material
 */
export function getSizeChartForMaterial(material: string): PipeSizeConversion[] {
  const materialLower = material.toLowerCase();
  
  if (materialLower.includes('pvc') && !materialLower.includes('cpvc')) {
    return PVC_SIZE_CHART;
  }
  if (materialLower.includes('cpvc')) {
    return CPVC_SIZE_CHART;
  }
  if (materialLower.includes('pp') || materialLower.includes('polypropylene')) {
    return PP_SIZE_CHART;
  }
  if (materialLower.includes('pvdf')) {
    return PVDF_SIZE_CHART;
  }
  if (materialLower.includes('copper')) {
    return COPPER_SIZE_CHART;
  }
  // Default to steel for carbon steel, stainless steel, etc.
  return STEEL_SIZE_CHART;
}

/**
 * Convert imperial pipe size to metric for hardware ordering
 */
export function convertPipeSizeToMetric(
  imperialSize: string,
  material: string
): {
  success: boolean;
  conversion?: PipeSizeConversion;
  error?: string;
} {
  const sizeChart = getSizeChartForMaterial(material);
  
  // Normalize the size string
  const normalizedSize = imperialSize
    .replace(/\s+/g, '')
    .replace(/inch(es)?/i, '"')
    .replace(/"/g, '"')
    .replace(/'/g, '"');
  
  // Find matching size
  const conversion = sizeChart.find(s => 
    s.nps.replace(/\s+/g, '') === normalizedSize ||
    s.nps.replace(/\s+/g, '').replace('"', '') === normalizedSize.replace('"', '') ||
    normalizedSize.includes(s.npsDecimal.toString())
  );
  
  if (!conversion) {
    return {
      success: false,
      error: `No conversion found for ${imperialSize} in ${material}`,
    };
  }
  
  return {
    success: true,
    conversion,
  };
}

/**
 * Get GF Stress Less product info for a given pipe size and material
 */
export function getGFProductInfo(
  imperialSize: string,
  material: string,
  productType: 'guide' | 'hanger' | 'anchor' | 'riserClamp'
): {
  metricSize: number;
  productCode?: string;
  productName: string;
  pipeOdMm: number;
  pipeOdInches: number;
  loadRatings?: {
    fy: string;
    fz: string;
    fMinusZ: string;
  };
} | null {
  const result = convertPipeSizeToMetric(imperialSize, material);
  
  if (!result.success || !result.conversion) {
    return null;
  }
  
  const conv = result.conversion;
  const product = GF_STRESS_LESS_PRODUCTS[productType];
  
  // Load ratings from the datasheet (based on size)
  const loadRatings = getLoadRatings(conv.gfMetricSize);
  
  return {
    metricSize: conv.gfMetricSize,
    productCode: conv.gfProductCode,
    productName: product.name,
    pipeOdMm: conv.odMm,
    pipeOdInches: conv.odInches,
    loadRatings,
  };
}

/**
 * Get load ratings from GF datasheet based on metric size
 */
function getLoadRatings(metricSize: number): {
  fy: string;
  fz: string;
  fMinusZ: string;
} {
  // From the GF Stress Less Pipe Guide datasheet
  const ratings: Record<number, { fy: string; fz: string; fMinusZ: string }> = {
    20:  { fz: '150lbs / 660N',  fMinusZ: '180lbs / 800N',   fy: '150lbs / 660N' },
    25:  { fz: '150lbs / 660N',  fMinusZ: '180lbs / 800N',   fy: '150lbs / 660N' },
    32:  { fz: '150lbs / 660N',  fMinusZ: '180lbs / 800N',   fy: '150lbs / 660N' },
    40:  { fz: '150lbs / 660N',  fMinusZ: '180lbs / 800N',   fy: '150lbs / 660N' },
    50:  { fz: '150lbs / 660N',  fMinusZ: '180lbs / 800N',   fy: '150lbs / 660N' },
    63:  { fz: '200lbs / 800N',  fMinusZ: '240lbs / 880N',   fy: '200lbs / 800N' },
    75:  { fz: '300lbs / 1300N', fMinusZ: '360lbs / 1600N',  fy: '300lbs / 1300N' },
    90:  { fz: '450lbs / 2000N', fMinusZ: '540lbs / 2400N',  fy: '450lbs / 2000N' },
    110: { fz: '650lbs / 2800N', fMinusZ: '780lbs / 3400N',  fy: '600lbs / 2670N' },
    125: { fz: '700lbs / 3100N', fMinusZ: '840lbs / 3700N',  fy: '600lbs / 2670N' },
    140: { fz: '700lbs / 3100N', fMinusZ: '840lbs / 3700N',  fy: '600lbs / 2670N' },
    160: { fz: '900lbs / 4000N', fMinusZ: '1080lbs / 4800N', fy: '600lbs / 2670N' },
  };
  
  return ratings[metricSize] || { fy: 'N/A', fz: 'N/A', fMinusZ: 'N/A' };
}

/**
 * Generate a quick reference table for a material
 */
export function generateSizeReferenceTable(material: string): string {
  const chart = getSizeChartForMaterial(material);
  
  let table = `| Imperial (NPS) | DN | OD (inches) | OD (mm) | GF Size (mm) | GF Code |\n`;
  table += `|----------------|-----|-------------|---------|--------------|----------|\n`;
  
  for (const row of chart) {
    table += `| ${row.nps.padEnd(8)} | ${row.dn.toString().padStart(3)} | ${row.odInches.toFixed(3).padStart(6)} | ${row.odMm.toFixed(1).padStart(6)} | ${row.gfMetricSize.toString().padStart(6)} | ${row.gfProductCode || 'N/A'} |\n`;
  }
  
  return table;
}
