import { prisma } from "@/lib/db";

export interface ToleranceLookupResult {
  tolerance: string;
  citation: {
    document: string;
    page: number | null;
    table: string | null;
    row: string | null;
  };
}

export async function lookupTolerance(
  discipline: string,
  elementType: string
): Promise<ToleranceLookupResult | null> {
  // Try exact match first
  let spec = await prisma.toleranceSpec.findFirst({
    where: { discipline, elementType },
  });

  // Fall back to partial match
  if (!spec) {
    spec = await prisma.toleranceSpec.findFirst({
      where: {
        discipline,
        elementType: { contains: elementType, mode: "insensitive" },
      },
    });
  }

  // Default tolerance for pipe runs
  if (!spec && elementType.toLowerCase().includes("pipe")) {
    spec = await prisma.toleranceSpec.findFirst({
      where: { discipline, elementType: "Individual pipe runs" },
    });
  }

  if (!spec) return null;

  return {
    tolerance: spec.tolerance,
    citation: {
      document: spec.sourceDocument,
      page: spec.sourcePage,
      table: spec.sourceTable,
      row: spec.sourceRow,
    },
  };
}

export async function getToleranceForLine(
  discipline: string = "Process"
): Promise<ToleranceLookupResult | null> {
  return lookupTolerance(discipline, "Individual pipe runs");
}
