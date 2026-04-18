import { NextRequest, NextResponse } from "next/server";
import { lookupTolerance, lookupPipeSpan, lookupLOD } from "@/lib/specs";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  
  try {
    switch (type) {
      case "tolerance": {
        const discipline = searchParams.get("discipline") || "Process";
        const elementType = searchParams.get("elementType") || "Individual pipe runs";
        const result = await lookupTolerance(discipline, elementType);
        return NextResponse.json({ tolerance: result });
      }
      
      case "span": {
        const material = searchParams.get("material");
        const size = searchParams.get("size");
        const temp = parseInt(searchParams.get("temperature") || "68");
        
        if (!material || !size) {
          return NextResponse.json({ error: "material and size required" }, { status: 400 });
        }
        
        const result = await lookupPipeSpan(material, size, temp);
        return NextResponse.json({ span: result });
      }
      
      case "lod": {
        const discipline = searchParams.get("discipline") || "Process";
        const elementType = searchParams.get("elementType") || "Process piping";
        const size = searchParams.get("size") || undefined;
        const result = await lookupLOD(discipline, elementType, size);
        return NextResponse.json({ lod: result });
      }
      
      case "services": {
        const services = await prisma.serviceCode.findMany({ orderBy: { code: "asc" } });
        return NextResponse.json({ services });
      }
      
      case "lineClasses": {
        const lineClasses = await prisma.lineClass.findMany({ orderBy: { code: "asc" } });
        return NextResponse.json({ lineClasses });
      }
      
      default:
        return NextResponse.json({ 
          error: "Invalid type. Use: tolerance, span, lod, services, lineClasses",
          examples: {
            tolerance: "/api/specs?type=tolerance&discipline=Process&elementType=Individual pipe runs",
            span: "/api/specs?type=span&material=PVC Schedule 80&size=4 inch&temperature=68",
            lod: "/api/specs?type=lod&discipline=Process&elementType=Process piping&size=4 inch",
            services: "/api/specs?type=services",
            lineClasses: "/api/specs?type=lineClasses",
          }
        }, { status: 400 });
    }
  } catch (error) {
    console.error("Spec lookup failed:", error);
    return NextResponse.json({ error: "Spec lookup failed" }, { status: 500 });
  }
}
