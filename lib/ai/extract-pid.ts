// Claude AI P&ID Extraction Service
// Uses Claude's vision capabilities to read P&ID drawings

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Types for extracted data
export interface ExtractedLine {
  lineNumber: string;
  serviceCode: string;
  serviceName: string;
  size: string;
  material: string;
  lineClass: string;
  connectedEquipment: string[];
  valves: string[];
  fittings: string[];
  notes: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractionResult {
  success: boolean;
  lines: ExtractedLine[];
  drawingInfo: {
    drawingNumber: string;
    revision: string;
    title: string;
    area: string;
  };
  summary: {
    totalLines: number;
    avgConfidence: number;
    needsReview: number;
  };
  rawResponse?: string;
  error?: string;
}

// Service code to name mapping
const SERVICE_CODE_MAP: Record<string, string> = {
  'PW': 'Process Water',
  'CW': 'Chilled Water',
  'HW': 'Hot Water',
  'DI': 'Deionized Water',
  'WW': 'Waste Water',
  'N2': 'Nitrogen',
  'CA': 'Compressed Air',
  'IA': 'Instrument Air',
  'VA': 'Vacuum',
  'ST': 'Steam',
  'CD': 'Condensate',
  'CDA': 'Clean Dry Air',
  'PCW': 'Process Cooling Water',
  'EX': 'Exhaust',
  'VE': 'Vent',
  'DR': 'Drain',
  'FP': 'Fire Protection',
};

// Line class to material mapping
const LINE_CLASS_MAP: Record<string, { material: string; schedule?: string }> = {
  'PV': { material: 'PVC', schedule: 'Schedule 80' },
  'PU': { material: 'PVC', schedule: 'Schedule 40' },
  'CP': { material: 'CPVC' },
  'PP': { material: 'Polypropylene' },
  'PF': { material: 'PVDF' },
  'CC': { material: 'Carbon Steel' },
  'SA': { material: 'Stainless Steel', schedule: '316L' },
  'SS': { material: 'Stainless Steel', schedule: '304' },
  'BK': { material: 'Copper' },
  'HD': { material: 'HDPE' },
};

// The extraction prompt for Claude
const EXTRACTION_PROMPT = `You are an expert P&ID (Piping and Instrumentation Diagram) analyzer. Analyze this P&ID drawing and extract ALL piping lines visible.

For EACH piping line, extract:

1. **Line Number**: The complete line designation (format varies but typically like "PW1-241-04-A01" or "2"-CW-101")
2. **Service Code**: The service identifier (PW, CW, N2, CA, etc.) - usually first letters
3. **Pipe Size**: Nominal pipe size in inches (1/2", 3/4", 1", 2", 3", 4", 6", 8", etc.)
4. **Line Class**: Material designation code (PV, CP, CC, SA, SS, etc.)
5. **Connected Equipment**: Any equipment this line connects to (tanks, pumps, vessels, etc.)
6. **Valves**: Any valves on this line (type and tag if visible)
7. **Fittings**: Notable fittings (elbows, tees, reducers)
8. **Notes**: Any special notes or callouts for this line

Also extract drawing information:
- Drawing Number
- Revision
- Title
- Area/Unit

Return your response as valid JSON in this exact format:
{
  "drawingInfo": {
    "drawingNumber": "string",
    "revision": "string", 
    "title": "string",
    "area": "string"
  },
  "lines": [
    {
      "lineNumber": "string",
      "serviceCode": "string",
      "size": "string",
      "lineClass": "string",
      "connectedEquipment": ["string"],
      "valves": ["string"],
      "fittings": ["string"],
      "notes": "string",
      "confidence": 0.0-1.0
    }
  ]
}

Important:
- Extract EVERY visible piping line, even partial ones
- Set confidence based on how clearly you can read the information (1.0 = very clear, 0.5 = partially visible)
- If you can't read something clearly, include your best guess and lower the confidence
- Include the units for pipe size (e.g., "2"" or "2 inch")
- Be thorough - missing a line is worse than including an uncertain one`;

/**
 * Extract piping data from a P&ID image or PDF using Claude Vision
 */
export async function extractPidData(
  fileUrl: string,
  fileBase64?: string,
  mimeType: string = "image/png"
): Promise<ExtractionResult> {
  try {
    // Determine if this is a PDF or image
    const isPdf = mimeType === "application/pdf" || fileUrl.toLowerCase().endsWith('.pdf');
    
    // Prepare the content block based on file type
    let contentBlock: any;
    
    if (isPdf) {
      // Use document block for PDFs
      if (fileBase64) {
        contentBlock = {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: fileBase64,
          },
        };
      } else {
        contentBlock = {
          type: "document",
          source: {
            type: "url",
            url: fileUrl,
          },
        };
      }
    } else {
      // Use image block for images
      if (fileBase64) {
        contentBlock = {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: fileBase64,
          },
        };
      } else {
        contentBlock = {
          type: "image",
          source: {
            type: "url",
            url: fileUrl,
          },
        };
      }
    }

    console.log(`Calling Claude API with ${isPdf ? 'PDF document' : 'image'} from URL: ${fileUrl}`);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse the JSON response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not find JSON in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Process and enrich the extracted lines
    const enrichedLines: ExtractedLine[] = parsed.lines.map((line: any) => {
      const serviceCode = line.serviceCode?.toUpperCase() || "";
      const lineClass = line.lineClass?.toUpperCase() || "";
      
      // Get service name from code
      const serviceName = SERVICE_CODE_MAP[serviceCode] || serviceCode;
      
      // Get material from line class
      const materialInfo = LINE_CLASS_MAP[lineClass];
      const material = materialInfo 
        ? `${materialInfo.material}${materialInfo.schedule ? ` ${materialInfo.schedule}` : ""}`
        : line.material || "Unknown";

      return {
        lineNumber: line.lineNumber || "",
        serviceCode,
        serviceName,
        size: line.size || "",
        material,
        lineClass,
        connectedEquipment: line.connectedEquipment || [],
        valves: line.valves || [],
        fittings: line.fittings || [],
        notes: line.notes || "",
        confidence: line.confidence || 0.8,
        boundingBox: line.boundingBox,
      };
    });

    // Calculate summary
    const avgConfidence = enrichedLines.length > 0
      ? enrichedLines.reduce((sum, line) => sum + line.confidence, 0) / enrichedLines.length
      : 0;
    
    const needsReview = enrichedLines.filter((line) => line.confidence < 0.85).length;

    return {
      success: true,
      lines: enrichedLines,
      drawingInfo: {
        drawingNumber: parsed.drawingInfo?.drawingNumber || "",
        revision: parsed.drawingInfo?.revision || "",
        title: parsed.drawingInfo?.title || "",
        area: parsed.drawingInfo?.area || "",
      },
      summary: {
        totalLines: enrichedLines.length,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        needsReview,
      },
      rawResponse: textContent.text,
    };
  } catch (error) {
    console.error("P&ID extraction error:", error);
    return {
      success: false,
      lines: [],
      drawingInfo: {
        drawingNumber: "",
        revision: "",
        title: "",
        area: "",
      },
      summary: {
        totalLines: 0,
        avgConfidence: 0,
        needsReview: 0,
      },
      error: error instanceof Error ? error.message : "Extraction failed",
    };
  }
}

/**
 * Process a PDF by converting pages to images first
 * Note: For production, use a PDF-to-image service
 */
export async function extractFromPdf(
  pdfUrl: string,
  pageNumber: number = 1
): Promise<ExtractionResult> {
  // For now, Claude can handle PDFs directly
  // In production, you might want to convert to images for better results
  
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "url",
                url: pdfUrl,
              },
            } as any,
            {
              type: "text",
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    // Process response same as image
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not find JSON in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Process lines (same as above)
    const enrichedLines: ExtractedLine[] = parsed.lines.map((line: any) => {
      const serviceCode = line.serviceCode?.toUpperCase() || "";
      const lineClass = line.lineClass?.toUpperCase() || "";
      const serviceName = SERVICE_CODE_MAP[serviceCode] || serviceCode;
      const materialInfo = LINE_CLASS_MAP[lineClass];
      const material = materialInfo 
        ? `${materialInfo.material}${materialInfo.schedule ? ` ${materialInfo.schedule}` : ""}`
        : line.material || "Unknown";

      return {
        lineNumber: line.lineNumber || "",
        serviceCode,
        serviceName,
        size: line.size || "",
        material,
        lineClass,
        connectedEquipment: line.connectedEquipment || [],
        valves: line.valves || [],
        fittings: line.fittings || [],
        notes: line.notes || "",
        confidence: line.confidence || 0.8,
      };
    });

    const avgConfidence = enrichedLines.length > 0
      ? enrichedLines.reduce((sum, line) => sum + line.confidence, 0) / enrichedLines.length
      : 0;

    return {
      success: true,
      lines: enrichedLines,
      drawingInfo: parsed.drawingInfo || {},
      summary: {
        totalLines: enrichedLines.length,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        needsReview: enrichedLines.filter((l) => l.confidence < 0.85).length,
      },
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    return {
      success: false,
      lines: [],
      drawingInfo: { drawingNumber: "", revision: "", title: "", area: "" },
      summary: { totalLines: 0, avgConfidence: 0, needsReview: 0 },
      error: error instanceof Error ? error.message : "PDF extraction failed",
    };
  }
}
