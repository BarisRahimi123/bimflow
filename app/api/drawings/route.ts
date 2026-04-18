import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const createDrawingSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  // Accept both fileName and filename
  fileName: z.string().min(1, "Filename is required").optional(),
  filename: z.string().min(1, "Filename is required").optional(),
  // Accept both fileUrl and originalUrl
  fileUrl: z.string().optional(),
  originalUrl: z.string().optional(),
  // Optional fields
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  drawingNumber: z.string().optional(),
  revision: z.string().optional(),
}).refine(data => data.fileName || data.filename, {
  message: "Filename is required (fileName or filename)",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Creating drawing with body:", body);
    
    const validated = createDrawingSchema.parse(body);
    
    // Normalize field names
    const filename = validated.fileName || validated.filename || '';
    const originalUrl = validated.fileUrl || validated.originalUrl || null;

    console.log("Creating drawing via RPC:", {
      projectId: validated.projectId,
      filename,
      originalUrl,
    });

    // Use RPC to bypass schema cache
    const { data: drawing, error } = await supabase.rpc('create_pidflow_drawing', {
      p_project_id: validated.projectId,
      p_filename: filename,
      p_original_url: originalUrl,
      p_drawing_number: validated.drawingNumber || null,
      p_revision: validated.revision || null,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      throw error;
    }

    console.log("Drawing created:", drawing);

    // Transform to match expected format
    const transformedDrawing = {
      id: drawing.id,
      projectId: drawing.project_id,
      fileName: drawing.filename,
      originalUrl: drawing.original_url,
      status: drawing.status,
      drawingNumber: drawing.drawing_number,
      revision: drawing.revision,
      createdAt: drawing.created_at,
    };

    return NextResponse.json({ drawing: transformedDrawing }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to create drawing:", error);
    return NextResponse.json({ error: "Failed to create drawing" }, { status: 500 });
  }
}
