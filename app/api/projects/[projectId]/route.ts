import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Use RPC to get project with drawings
    const { data: project, error } = await supabase.rpc('get_pidflow_project', {
      p_id: projectId,
    });

    if (error) {
      console.error("RPC error:", error);
      throw error;
    }

    if (!project || project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const p = project[0] || project;

    // Transform to match expected format
    const transformedProject = {
      id: p.id,
      name: p.name,
      description: p.description,
      clientName: p.client_name,
      projectNumber: p.project_number,
      status: p.status,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      drawings: (p.drawings || []).map((d: any) => ({
        id: d.id,
        fileName: d.filename,
        originalUrl: d.original_url,
        status: d.status,
        drawingNumber: d.drawing_number,
        revision: d.revision,
        confidenceScore: d.confidence_score,
        processedAt: d.processed_at,
        createdAt: d.created_at,
        extractedLines: [], // Will be populated when fetching individual drawing
      })),
    };

    return NextResponse.json({ project: transformedProject });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const { error } = await supabase
      .from('pidflow_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
