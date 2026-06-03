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
  AlertTriangle,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-success/10 text-success hover:bg-success/10">Complete</Badge>;
      case "processing":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Processing</Badge>;
      case "error":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">Error</Badge>;
      default:
        return <Badge variant="secondary">Uploaded</Badge>;
    }
  };

  const filteredLines = drawing?.extractedLines.filter((line) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "verified") return line.verified;
    if (selectedTab === "review") return !line.verified && line.confidence < 0.95;
    return true;
  }) || [];

  // Calculate stats
  const stats = {
    total: drawing?.extractedLines.length || 0,
    verified: drawing?.extractedLines.filter((l) => l.verified).length || 0,
    needsReview: drawing?.extractedLines.filter((l) => !l.verified && Number(l.confidence) < 0.95).length || 0,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 mx-auto shadow-md">
            <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading Drawing</h2>
          <p className="text-muted-foreground">Fetching extraction results...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !drawing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Drawing</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
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
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/projects/${projectId}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <h1 className="font-semibold truncate max-w-[300px]">{drawing.fileName}</h1>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                  className="bg-primary hover:bg-primary/90"
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
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">Extraction in Progress</h3>
                    <p className="text-sm text-primary/80">Analyzing your P&ID drawing...</p>
                  </div>
                </div>
                <Progress value={66} className="h-2 bg-primary/10" />
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {drawing.status === "error" && (
            <Card className="mb-8 border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Extraction Failed</h3>
                    <p className="text-sm text-muted-foreground">{drawing.errorMessage || "An error occurred during processing"}</p>
                  </div>
                  <Button onClick={startProcessing} variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/5">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Strip */}
          {drawing.status === "complete" && (
            <Card className="border-0 shadow-sm mb-8">
              <CardContent className="py-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  {/* Hero: verification progress */}
                  <div className="md:w-72 md:shrink-0">
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Verification progress</p>
                      <p className="text-sm font-semibold tabular-nums">
                        {stats.verified}<span className="text-muted-foreground">/{stats.total}</span>
                      </p>
                    </div>
                    <Progress
                      value={stats.total ? Math.round((stats.verified / stats.total) * 100) : 0}
                      className="h-2"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {stats.needsReview > 0
                        ? `${stats.needsReview} line${stats.needsReview === 1 ? "" : "s"} still need review`
                        : "All lines reviewed"}
                    </p>
                  </div>

                  <Separator orientation="vertical" className="hidden md:block h-14" />

                  {/* Supporting metrics */}
                  <div className="grid grid-cols-3 flex-1 divide-x divide-border">
                    <div className="px-4 first:pl-0">
                      <p className="text-xs font-medium text-muted-foreground">Total lines</p>
                      <p className="text-2xl font-bold tabular-nums">{stats.total}</p>
                    </div>
                    <div className="px-4">
                      <p className="text-xs font-medium text-muted-foreground">Needs review</p>
                      {stats.needsReview > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand/15 px-2 py-0.5 text-2xl font-bold tabular-nums text-brand-foreground">
                          <AlertTriangle className="w-4 h-4 text-brand-foreground" />
                          {stats.needsReview}
                        </span>
                      ) : (
                        <p className="text-2xl font-bold tabular-nums text-foreground">0</p>
                      )}
                    </div>
                    <div className="px-4">
                      <p className="text-xs font-medium text-muted-foreground">Avg confidence</p>
                      <p className="text-2xl font-bold tabular-nums">{stats.avgConfidence}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                        <TabsList className="bg-muted">
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
                        <div className="text-center py-12 text-muted-foreground">
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
                    <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center overflow-hidden">
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
                        <FileText className="w-16 h-16 text-muted-foreground/40" />
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
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Layers className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready for Extraction</h3>
                  <p className="text-muted-foreground mb-6">
                    PIDFlow will analyze your P&ID drawing and extract all piping lines with
                    tolerances, support spans, and LOD requirements — fully cited.
                  </p>
                  <Button
                    onClick={startProcessing}
                    disabled={processing}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
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
    // Bands per DESIGN.md: high ≥0.95, medium 0.85–0.94, low <0.85.
    if (confidencePercent >= 95) {
      return (
        <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
          <CheckCircle2 className="w-3 h-3" />
          High · {confidencePercent}%
        </Badge>
      );
    }
    if (confidencePercent >= 85) {
      return (
        <Badge className="gap-1 bg-brand/10 text-brand-foreground hover:bg-brand/10">
          <AlertTriangle className="w-3 h-3" />
          Review · {confidencePercent}%
        </Badge>
      );
    }
    return (
      <Badge className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/10">
        <AlertCircle className="w-3 h-3" />
        Low · {confidencePercent}%
      </Badge>
    );
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
          <span className="inline-flex items-center gap-1 text-xs text-primary cursor-help">
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
      "border border-border rounded-xl transition-all",
      expanded ? "bg-background shadow-md" : "bg-surface hover:bg-background hover:shadow-sm"
    )}>
      {/* Header */}
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full px-4 py-3 flex items-center gap-4 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
          expanded ? "bg-primary/10" : "bg-muted"
        )}>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-primary" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground">{line.lineNumber}</span>
            {line.verified && (
              <CheckCircle2 className="w-4 h-4 text-success" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-1">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Tolerance</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{line.toleranceValue || "—"}</span>
                {renderCitation(line.toleranceCitation, "Tolerance Source")}
              </div>
            </div>

            {/* Max Span */}
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-1">
                <ThermometerSun className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Max Span</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{line.maxSpan ? `${line.maxSpan} ft` : "—"}</span>
                {renderCitation(line.spanCitation, "Span Source")}
              </div>
            </div>

            {/* LOD */}
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Include in Model</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {line.includeInModel === true ? "Yes" : line.includeInModel === false ? "No" : "—"}
                </span>
                {renderCitation(line.lodCitation, "LOD Source")}
              </div>
            </div>

            {/* Line Class */}
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Line Class</span>
              </div>
              <span className="font-semibold font-mono">{line.lineClass || "—"}</span>
            </div>
          </div>

          {/* Equipment & Valves */}
          {(line.connectedEquipment.length > 0 || line.valves.length > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {line.connectedEquipment.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Connected Equipment</p>
                  <div className="flex flex-wrap gap-1">
                    {line.connectedEquipment.map((eq, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{eq}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {line.valves.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Valves</p>
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
              <p className="text-xs font-medium text-muted-foreground mb-2">Vendor Products</p>
              <div className="space-y-2">
                {line.vendorProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {product.vendor}
                          {product.isPreferred && (
                            <Badge className="ml-2 bg-primary/10 text-primary text-xs">Preferred</Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.productName || product.modelNumber}</p>
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
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
            <Link
              href={`/calculator?${new URLSearchParams({
                ...(line.material ? { material: line.material } : {}),
                ...(line.size ? { size: line.size } : {}),
                ...(line.serviceCode ? { service: mapServiceToType(line.serviceCode) } : {}),
              }).toString()}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <Ruler className="w-3.5 h-3.5" />
              Calculate Supports
            </Link>
            <div className="flex items-center gap-2">
              {!line.verified && (
                <>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/5">
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={onVerify}
                    className="bg-success text-white hover:bg-success/90"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Verify
                  </Button>
                </>
              )}
              {line.verified && (
                <span className="text-xs text-success flex items-center gap-1">
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
