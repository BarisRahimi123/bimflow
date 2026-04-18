import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  clientName: z.string().optional(),
  projectNumber: z.string().optional(),
});

export async function GET() {
  try {
    console.log("Fetching projects via RPC...");
    const { data, error } = await supabase.rpc('get_pidflow_projects');
    
    console.log("RPC result:", { data, error });
    
    if (error) {
      console.error("RPC error:", error);
      throw error;
    }

    return NextResponse.json({ 
      projects: (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        clientName: p.client_name,
        projectNumber: p.project_number,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        drawings: [],
        _count: { drawings: 0 },
      }))
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createProjectSchema.parse(body);

    console.log("Creating project via RPC with:", {
      p_name: validated.name,
      p_description: validated.description || null,
      p_client_name: validated.clientName || null,
      p_project_number: validated.projectNumber || null,
    });

    // Use raw SQL through RPC to bypass schema cache
    const { data, error } = await supabase.rpc('create_pidflow_project', {
      p_name: validated.name,
      p_description: validated.description || null,
      p_client_name: validated.clientName || null,
      p_project_number: validated.projectNumber || null,
    });

    console.log("RPC result:", { data, error });

    if (error) {
      console.error("RPC error code:", error.code, "message:", error.message);
      throw error;
    }

    const project = data;

    console.log("Created project:", project);

    return NextResponse.json({ 
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        clientName: project.client_name,
        projectNumber: project.project_number,
        status: project.status,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
