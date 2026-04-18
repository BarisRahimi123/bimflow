import { prisma } from "@/lib/db";

export interface LODResult {
  includeInModel: boolean;
  requiredMetadata: string[];
  excludedItems: string[];
  citation: {
    document: string;
    sheet: string | null;
    rows: string | null;
  };
}

export async function lookupLOD(
  discipline: string,
  elementType: string,
  size?: string
): Promise<LODResult | null> {
  // Parse size to determine threshold
  const sizeNum = size ? parseFloat(size.replace(/[^0-9.]/g, "")) : null;

  // Get all matching requirements
  const requirements = await prisma.lODRequirement.findMany({
    where: { discipline },
  });

  // Find best match
  let match = requirements.find((r) => {
    if (!r.elementType.toLowerCase().includes(elementType.toLowerCase())) return false;
    if (!r.sizeThreshold || !sizeNum) return true;

    const isGreaterThan = r.sizeThreshold.includes("≥") || r.sizeThreshold.includes(">=");
    const isLessThan = r.sizeThreshold.includes("<");
    const threshold = parseFloat(r.sizeThreshold.replace(/[^0-9.]/g, ""));

    if (isGreaterThan && sizeNum >= threshold) return true;
    if (isLessThan && sizeNum < threshold) return true;
    return false;
  });

  // Fallback to any matching element type
  if (!match) {
    match = requirements.find((r) =>
      r.elementType.toLowerCase().includes(elementType.toLowerCase())
    );
  }

  if (!match) return null;

  return {
    includeInModel: match.includeInModel,
    requiredMetadata: match.requiredMetadata,
    excludedItems: match.excludedItems,
    citation: {
      document: match.sourceDocument,
      sheet: match.sourceSheet,
      rows: match.sourceRows,
    },
  };
}

export async function shouldIncludeInModel(
  discipline: string,
  elementType: string,
  size?: string
): Promise<boolean> {
  const lod = await lookupLOD(discipline, elementType, size);
  return lod?.includeInModel ?? true;
}
