import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Verify or reject an extracted line
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ drawingId: string }> }
) {
  try {
    const { drawingId } = await params;
    const body = await request.json();
    const { lineId, action, corrections, verifiedBy = "user" } = body;

    if (!lineId) {
      return NextResponse.json({ error: "lineId is required" }, { status: 400 });
    }

    // Verify the line belongs to this drawing
    const line = await prisma.extractedLine.findFirst({
      where: {
        id: lineId,
        drawingId,
      },
    });

    if (!line) {
      return NextResponse.json({ error: "Line not found" }, { status: 404 });
    }

    if (action === "verify") {
      // Update line as verified, optionally with corrections
      const updatedLine = await prisma.extractedLine.update({
        where: { id: lineId },
        data: {
          verified: true,
          verifiedBy,
          verifiedAt: new Date(),
          // Apply any corrections
          ...(corrections?.lineNumber && { lineNumber: corrections.lineNumber }),
          ...(corrections?.serviceCode && { serviceCode: corrections.serviceCode }),
          ...(corrections?.size && { size: corrections.size }),
          ...(corrections?.material && { material: corrections.material }),
          ...(corrections?.lineClass && { lineClass: corrections.lineClass }),
        },
        include: { vendorProducts: true },
      });

      return NextResponse.json({
        success: true,
        line: updatedLine,
        message: "Line verified successfully",
      });
    }

    if (action === "reject") {
      // Delete the line
      await prisma.extractedLine.delete({
        where: { id: lineId },
      });

      return NextResponse.json({
        success: true,
        message: "Line rejected and removed",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}

// Bulk verify all high-confidence lines
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ drawingId: string }> }
) {
  try {
    const { drawingId } = await params;
    const body = await request.json();
    const { minConfidence = 0.95, verifiedBy = "auto" } = body;

    // Update all high-confidence unverified lines
    const result = await prisma.extractedLine.updateMany({
      where: {
        drawingId,
        verified: false,
        confidence: { gte: minConfidence },
      },
      data: {
        verified: true,
        verifiedBy,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      verifiedCount: result.count,
      message: `Auto-verified ${result.count} high-confidence lines`,
    });
  } catch (error) {
    console.error("Bulk verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bulk verification failed" },
      { status: 500 }
    );
  }
}
