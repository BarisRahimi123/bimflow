import { prisma } from "@/lib/db";

export interface PipeSpanResult {
  maxSpan: number;
  material: string;
  pipeSize: string;
  temperature: number;
  citation: {
    document: string;
    page: number | null;
    table: string | null;
    description: string | null;
  };
}

export async function lookupPipeSpan(
  material: string,
  pipeSize: string,
  temperature: number = 68
): Promise<PipeSpanResult | null> {
  // Try exact match
  let spec = await prisma.pipeSpanSpec.findFirst({
    where: { material, pipeSize, temperature },
  });

  // Try with closest temperature
  if (!spec) {
    spec = await prisma.pipeSpanSpec.findFirst({
      where: { material, pipeSize },
      orderBy: { temperature: "asc" },
    });
  }

  // Try partial material match
  if (!spec) {
    spec = await prisma.pipeSpanSpec.findFirst({
      where: {
        material: { contains: material.split(" ")[0], mode: "insensitive" },
        pipeSize,
      },
    });
  }

  if (!spec) return null;

  return {
    maxSpan: Number(spec.maxSpan),
    material: spec.material,
    pipeSize: spec.pipeSize,
    temperature: spec.temperature,
    citation: {
      document: spec.sourceDocument,
      page: spec.sourcePage,
      table: spec.sourceTable,
      description: spec.sourceDescription,
    },
  };
}

export async function calculateCorrectedSpan(
  material: string,
  pipeSize: string,
  temperature: number = 68,
  specificGravity: number = 1.0
): Promise<{ span: number; baseCitation: object; sgCitation: object | null }> {
  const baseSpan = await lookupPipeSpan(material, pipeSize, temperature);
  if (!baseSpan) throw new Error(`No span data found for ${material} ${pipeSize}`);

  if (specificGravity <= 1.0) {
    return { span: baseSpan.maxSpan, baseCitation: baseSpan.citation, sgCitation: null };
  }

  const sgFactor = await prisma.sGCorrectionFactor.findFirst({
    where: { material, specificGravity: { gte: specificGravity } },
    orderBy: { specificGravity: "asc" },
  });

  if (!sgFactor) {
    return { span: baseSpan.maxSpan, baseCitation: baseSpan.citation, sgCitation: null };
  }

  const correctedSpan = baseSpan.maxSpan * Number(sgFactor.correctionFactor);
  return {
    span: Math.round(correctedSpan * 10) / 10,
    baseCitation: baseSpan.citation,
    sgCitation: { document: sgFactor.sourceDocument, page: sgFactor.sourcePage, table: sgFactor.sourceTable },
  };
}
