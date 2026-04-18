"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink, 
  Building2,
  Ruler,
  ThermometerSun,
  Layers,
  Download,
  RefreshCw,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Info,
  FileSpreadsheet,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types
interface Citation {
  document: string;
  page?: number;
  table?: string;
  row?: string;
  sheet?: string;
  description?: string;
}

interface VendorProduct {
  id: string;
  vendor: string;
  productName?: string;
  modelNumber?: string;
  productUrl?: string;
  datasheetUrl?: string;
  imageUrl?: string;
  isPreferred: boolean;
}

interface ExtractedLine {
  id: string;
  lineNumber: string;
  serviceCode?: string;
  serviceName?: string;
  area?: string;
  size?: string;
  material?: string;
  lineClass?: string;
  connectedEquipment: string[];
  valves: string[];
  notes?: string;
  toleranceValue?: string;
  toleranceCitation?: Citation;
  maxSpan?: number;
  spanCitation?: Citation;
  includeInModel?: boolean;
  requiredMetadata: string[];
  lodCitation?: Citation;
  confidence: number;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  vendorProducts: VendorProduct[];
}

interface DrawingData {
  id: string;
  fileName: string;
  fileUrl: string;
  status: string;
  pageCount: number;
  createdAt: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  errorMessage?: string;
  extractedLines: ExtractedLine[];
}

export default function DrawingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const drawingId = params.drawingId as string;
  const projectId = params.projectId as string;

  const [drawing, setDrawing] = useState<DrawingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());
  const [selectedTab, setSelectedTab] = useState("all");

  const fetchDrawing = useCallback(async () => {
    try {
      const response = await fetch(`/api/drawings/${drawingId}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setDrawing(data.drawing);
      
      // If processing, poll for updates
      if (data.drawing?.status === "processing") {
        setTimeout(fetchDrawing, 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [drawingId]);

  useEffect(() => {
    fetchDrawing();
  }, [fetchDrawing]);

  const startProcessing = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/drawings/${drawingId}/process`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setDrawing(data.drawing);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const verifyLine = async (lineId: string) => {
    // TODO: Implement verification API
    console.log("Verify line:", lineId);
  };

  const toggleLineExpanded = (lineId: string) => {
    setExpandedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      return next;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (confidence >= 0.7) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Complete</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Error</Badge>;
      default:
        return <Badge variant="secondary">Uploaded</Badge>;
    }
  };

  const filteredLines = drawing?.extractedLines.filter((line) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "verified") return line.verified;
    if (selectedTab === "review") return !line.verified && line.confidence < 0.9;
    return true;
  }) || [];

  // Calculate stats
  const stats = {
    total: drawing?.extractedLines.length || 0,
    verified: drawing?.extractedLines.filter((l) => l.verified).length || 0,
    needsReview: drawing?.extractedLines.filter((l) => !l.verified && Number(l.confidence) < 0.9).length || 0,
    avgConfidence: drawing?.extractedLines.length
      ? Math.round(
          (drawing.extractedLines.reduce((sum, l) => sum + Number(l.confidence), 0) /
            drawing.extractedLines.length) * 100
        )
      : 0,
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/25">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading Drawing</h2>
          <p className="text-slate-500">Fetching extraction results...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !drawing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Drawing</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Button onClick={() => router.push(`/projects/${projectId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
          </Button>
        </div>
      </div>
    );
  }

  if (!drawing) return null;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/projects/${projectId}`}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold truncate max-w-[300px]">{drawing.fileName}</h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {getStatusBadge(drawing.status)}
                    <span>•</span>
                    <span>{format(new Date(drawing.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {drawing.status === "uploaded" && (
                <Button
                  onClick={startProcessing}
                  disabled={processing}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 mr-2" />
                      Start Extraction
                    </>
                  )}
                </Button>
              )}
              {drawing.status === "complete" && (
                <>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={fetchDrawing}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Processing State */}
          {drawing.status === "processing" && (
            <Card className="mb-8 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">Extraction in Progress</h3>
                    <p className="text-sm text-blue-700">Analyzing your P&ID drawing...</p>
                  </div>
                </div>
                <Progress value={66} className="h-2 bg-blue-100" />
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {drawing.status === "error" && (
            <Card className="mb-8 border-red-200 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900">Extraction Failed</h3>
                    <p className="text-sm text-red-700">{drawing.errorMessage || "An error occurred during processing"}</p>
                  </div>
                  <Button onClick={startProcessing} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          {drawing.status === "complete" && (
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Total Lines</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Verified</p>
                      <p className="text-3xl font-bold text-emerald-600">{stats.verified}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Needs Review</p>
                      <p className="text-3xl font-bold text-amber-600">{stats.needsReview}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Avg Confidence</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.avgConfidence}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          {drawing.status === "complete" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Lines List */}
              <div className="xl:col-span-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle>Extracted Piping Lines</CardTitle>
                      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                        <TabsList className="bg-slate-100">
                          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                          <TabsTrigger value="verified">Verified ({stats.verified})</TabsTrigger>
                          <TabsTrigger value="review">Review ({stats.needsReview})</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {filteredLines.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                          <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
                          <p>No lines in this category</p>
                        </div>
                      ) : (
                        filteredLines.map((line) => (
                          <LineCard
                            key={line.id}
                            line={line}
                            expanded={expandedLines.has(line.id)}
                            onToggle={() => toggleLineExpanded(line.id)}
                            onVerify={() => verifyLine(line.id)}
                          />
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Drawing Preview */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Drawing Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[4/3] rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                      {drawing.fileUrl ? (
                        <img
                          src={drawing.fileUrl}
                          alt={drawing.fileName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <FileText className="w-16 h-16 text-slate-300" />
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {drawing.fileUrl && (
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a href={drawing.fileUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Full Size
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Export Data</CardTitle>
                    <CardDescription>Download extraction results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileSpreadsheet className="w-4 h-4 mr-3" />
                      Export to Excel
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-3" />
                      Export to CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-3" />
                      Revit Schedule Format
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Empty State */}
          {drawing.status === "uploaded" && (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-16">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto mb-6">
                    <Layers className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready for Extraction</h3>
                  <p className="text-slate-500 mb-6">
                    PIDFlow will analyze your P&ID drawing and extract all piping lines with
                    tolerances, support spans, and LOD requirements — fully cited.
                  </p>
                  <Button
                    onClick={startProcessing}
                    disabled={processing}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Starting Extraction...
                      </>
                    ) : (
                      <>
                        <Layers className="w-5 h-5 mr-2" />
                        Start Extraction
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}

function mapServiceToType(serviceCode: string): string {
  const lower = serviceCode.toLowerCase();
  if (lower.includes('steam') || lower.includes('gas') || lower.includes('air') || lower.includes('vapor') || lower.includes('vap')) {
    return 'vapor';
  }
  return 'water';
}

// Line Card Component
function LineCard({
  line,
  expanded,
  onToggle,
  onVerify,
}: {
  line: ExtractedLine;
  expanded: boolean;
  onToggle: () => void;
  onVerify: () => void;
}) {
  const confidencePercent = Math.round(Number(line.confidence) * 100);
  
  const getConfidenceBadge = () => {
    if (confidencePercent >= 90) {
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{confidencePercent}%</Badge>;
    }
    if (confidencePercent >= 70) {
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{confidencePercent}%</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{confidencePercent}%</Badge>;
  };

  const renderCitation = (citation?: Citation, label?: string) => {
    if (!citation) return null;
    
    const parts = [];
    if (citation.document) parts.push(citation.document);
    if (citation.page) parts.push(`p.${citation.page}`);
    if (citation.table) parts.push(`Table ${citation.table}`);
    if (citation.row) parts.push(`Row ${citation.row}`);
    if (citation.sheet) parts.push(`Sheet: ${citation.sheet}`);
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 text-xs text-blue-600 cursor-help">
            <Info className="w-3 h-3" />
            <span className="underline underline-offset-2 decoration-dotted">Cited</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium mb-1">{label || "Source"}</p>
          <p className="text-slate-300">{parts.join(" • ")}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className={cn(
      "border rounded-xl transition-all",
      expanded ? "bg-white shadow-md" : "bg-slate-50/50 hover:bg-white hover:shadow-sm"
    )}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-4 text-left"
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
          expanded ? "bg-blue-100" : "bg-slate-100"
        )}>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-slate-900">{line.lineNumber}</span>
            {line.verified && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {line.serviceCode && (
              <Badge variant="outline" className="font-mono text-xs">{line.serviceCode}</Badge>
            )}
            <span>{line.serviceName || "—"}</span>
            <span>•</span>
            <span>{line.size || "—"}</span>
            <span>•</span>
            <span>{line.material || "—"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getConfidenceBadge()}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4">
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Tolerance */}
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <Ruler className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Tolerance</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{line.toleranceValue || "—"}</span>
                {renderCitation(line.toleranceCitation, "Tolerance Source")}
              </div>
            </div>

            {/* Max Span */}
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <ThermometerSun className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Max Span</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{line.maxSpan ? `${line.maxSpan} ft` : "—"}</span>
                {renderCitation(line.spanCitation, "Span Source")}
              </div>
            </div>

            {/* LOD */}
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Include in Model</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {line.includeInModel === true ? "Yes" : line.includeInModel === false ? "No" : "—"}
                </span>
                {renderCitation(line.lodCitation, "LOD Source")}
              </div>
            </div>

            {/* Line Class */}
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Line Class</span>
              </div>
              <span className="font-semibold font-mono">{line.lineClass || "—"}</span>
            </div>
          </div>

          {/* Equipment & Valves */}
          {(line.connectedEquipment.length > 0 || line.valves.length > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {line.connectedEquipment.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Connected Equipment</p>
                  <div className="flex flex-wrap gap-1">
                    {line.connectedEquipment.map((eq, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{eq}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {line.valves.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Valves</p>
                  <div className="flex flex-wrap gap-1">
                    {line.valves.map((v, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{v}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vendor Products */}
          {line.vendorProducts.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-500 mb-2">Vendor Products</p>
              <div className="space-y-2">
                {line.vendorProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {product.vendor}
                          {product.isPreferred && (
                            <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Preferred</Badge>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">{product.productName || product.modelNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.productUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t">
            <Link
              href={`/calculator?${new URLSearchParams({
                ...(line.material ? { material: line.material } : {}),
                ...(line.size ? { size: line.size } : {}),
                ...(line.serviceCode ? { service: mapServiceToType(line.serviceCode) } : {}),
              }).toString()}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Ruler className="w-3.5 h-3.5" />
              Calculate Supports
            </Link>
            <div className="flex items-center gap-2">
              {!line.verified && (
                <>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={onVerify}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Verify
                  </Button>
                </>
              )}
              {line.verified && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                  {line.verifiedAt && ` on ${format(new Date(line.verifiedAt), "MMM d")}`}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
