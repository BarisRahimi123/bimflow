import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ drawingId: string }> }
) {
  try {
    const { drawingId } = await params;

    const { data: drawing, error } = await supabase
      .from('pidflow_drawings')
      .select(`
        *,
        pidflow_extracted_lines (*)
      `)
      .eq('id', drawingId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Drawing not found" }, { status: 404 });
      }
      throw error;
    }

    // Transform to match expected format
    // Map "completed" to "complete" for UI consistency
    const normalizedStatus = drawing.status === "completed" ? "complete" : drawing.status;
    
    const transformedDrawing = {
      id: drawing.id,
      projectId: drawing.project_id,
      fileName: drawing.filename,
      fileUrl: drawing.original_url, // UI expects fileUrl
      originalUrl: drawing.original_url,
      status: normalizedStatus,
      drawingNumber: drawing.drawing_number,
      revision: drawing.revision,
      confidenceScore: drawing.confidence_score,
      extractedData: drawing.extracted_data,
      processedAt: drawing.processed_at,
      createdAt: drawing.created_at,
      pageCount: 1, // Default
      extractedLines: (drawing.pidflow_extracted_lines || []).map((l: any) => {
        const rawData = l.raw_extraction || {};
        return {
          id: l.id,
          lineNumber: l.line_number,
          lineClass: l.line_class,
          material: l.material,
          size: l.pipe_size, // UI expects "size" not "pipeSize"
          service: l.service,
          serviceCode: rawData.serviceCode || l.service?.substring(0, 2)?.toUpperCase(),
          serviceName: rawData.serviceName || l.service,
          area: rawData.area,
          fromEquipment: l.from_equipment,
          toEquipment: l.to_equipment,
          connectedEquipment: rawData.connectedEquipment || [l.from_equipment, l.to_equipment].filter(Boolean),
          valves: rawData.valves || [],
          notes: rawData.notes,
          confidence: parseFloat(l.confidence_score) || 0.85,
          verified: l.verification_status === "verified",
          verificationStatus: l.verification_status,
          verifiedBy: l.verified_by,
          verifiedAt: l.verified_at,
          // Include spec lookups if available
          toleranceValue: rawData.toleranceValue,
          toleranceCitation: rawData.toleranceCitation,
          maxSpan: rawData.maxSpan,
          spanCitation: rawData.spanCitation,
          includeInModel: rawData.includeInModel,
          requiredMetadata: rawData.requiredMetadata || [],
          lodCitation: rawData.lodCitation,
          vendorProducts: [], // Will be populated separately
          rawExtraction: l.raw_extraction,
        };
      }),
    };

    return NextResponse.json({ drawing: transformedDrawing });
  } catch (error) {
    console.error("Failed to fetch drawing:", error);
    return NextResponse.json({ error: "Failed to fetch drawing" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ drawingId: string }> }
) {
  try {
    const { drawingId } = await params;

    const { error } = await supabase
      .from('pidflow_drawings')
      .delete()
      .eq('id', drawingId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete drawing:", error);
    return NextResponse.json({ error: "Failed to delete drawing" }, { status: 500 });
  }
}
