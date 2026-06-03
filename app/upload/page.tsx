"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileUp,
  FileText,
  X,
  Check,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  File,
  Layers,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  drawingId?: string;
  projectId?: string;
  error?: string;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/tiff",
  "image/webp",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [autoProcess, setAutoProcess] = useState(true);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const validFiles = Array.from(newFiles).filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        console.warn(`Invalid file type: ${file.type}`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        console.warn(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    const uploadFiles: UploadFile[] = validFiles.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);

    // Auto-start uploads
    uploadFiles.forEach((uf) => {
      uploadFile(uf);
    });
  }, []);

  const uploadFile = async (uploadFile: UploadFile) => {
    try {
      // Update status
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading", progress: 10 } : f
        )
      );

      // Create project first (or use existing)
      const projectRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `P&ID Upload - ${new Date().toLocaleDateString()}`,
          description: "Auto-created from upload",
        }),
      });

      if (!projectRes.ok) throw new Error("Failed to create project");
      const { project } = await projectRes.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, progress: 20, projectId: project.id } : f
        )
      );

      // Upload file to Supabase Storage
      const formData = new FormData();
      formData.append("file", uploadFile.file);
      formData.append("projectId", project.id);

      const storageRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!storageRes.ok) {
        const errData = await storageRes.json();
        throw new Error(errData.error || "Failed to upload file to storage");
      }

      const storageData = await storageRes.json();
      console.log("File uploaded to storage:", storageData);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, progress: 50 } : f
        )
      );

      // Create drawing record with the real storage URL
      const drawingRes = await fetch("/api/drawings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          fileName: uploadFile.file.name,
          originalUrl: storageData.fileUrl, // Real Supabase Storage URL
        }),
      });

      if (!drawingRes.ok) {
        const errData = await drawingRes.json();
        throw new Error(errData.error || "Failed to create drawing");
      }
      const { drawing } = await drawingRes.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, progress: 70, drawingId: drawing.id }
            : f
        )
      );

      // Auto-process if enabled
      if (autoProcess) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "processing", progress: 80 } : f
          )
        );

        const processRes = await fetch(`/api/drawings/${drawing.id}/process`, {
          method: "POST",
        });

        if (!processRes.ok) {
          const data = await processRes.json();
          throw new Error(data.error || "Processing failed");
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: 100 } : f
          )
        );
      }

      // Complete
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "complete", progress: 100 } : f
        )
      );
    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const completedFiles = files.filter((f) => f.status === "complete");

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="container max-w-4xl flex-1 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Upload P&ID Drawings</h1>
          <p className="text-slate-500">
            Drop your P&ID files and let AI extract piping data with full citations
          </p>
        </div>

        {/* Upload Zone */}
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-slate-200 hover:border-primary hover:bg-primary/5"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="py-16">
            <div className="text-center">
              <div
                className={cn(
                  "w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all",
                  isDragging
                    ? "bg-primary/10 scale-110"
                    : "bg-gradient-to-br from-slate-100 to-slate-50"
                )}
              >
                <FileUp
                  className={cn(
                    "w-10 h-10 transition-colors",
                    isDragging ? "text-primary" : "text-slate-400"
                  )}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {isDragging ? "Drop files here" : "Drag & drop P&ID files"}
              </h3>
              <p className="text-slate-500 mb-4">or click to browse</p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Badge variant="secondary">PDF</Badge>
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">TIFF</Badge>
                <span className="text-slate-300">•</span>
                <span>Max 50MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        {/* Auto-process toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoProcess}
              onChange={(e) => setAutoProcess(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-600">
              Automatically process with AI after upload
            </span>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Uploads ({files.length})</h2>
              {completedFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const f = completedFiles[0];
                    if (f.projectId && f.drawingId) {
                      router.push(`/projects/${f.projectId}/drawings/${f.drawingId}`);
                    }
                  }}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {files.map((f) => (
                <FileItem key={f.id} file={f} onRemove={() => removeFile(f.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <Card className="mt-12 border-0 bg-gradient-to-br from-slate-50 to-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                Use high-resolution scans (300+ DPI) for accurate line number extraction
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                Ensure line designations are clearly visible and not cropped
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                PDF files with selectable text yield better results
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                Include the title block for drawing number and revision extraction
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}

// File Item Component
function FileItem({
  file,
  onRemove,
}: {
  file: UploadFile;
  onRemove: () => void;
}) {
  const router = useRouter();

  const getIcon = () => {
    if (file.file.type.includes("pdf")) {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    if (file.file.type.includes("image")) {
      return <ImageIcon className="w-6 h-6 text-primary" />;
    }
    return <File className="w-6 h-6 text-slate-400" />;
  };

  const getStatusBadge = () => {
    switch (file.status) {
      case "uploading":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Uploading
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            <Layers className="w-3 h-3 mr-1" />
            Extracting
          </Badge>
        );
      case "complete":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <Check className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all",
        file.status === "complete"
          ? "bg-emerald-50/50 border-emerald-200 cursor-pointer hover:bg-emerald-50"
          : file.status === "error"
          ? "bg-red-50/50 border-red-200"
          : "bg-white hover:shadow-sm"
      )}
      onClick={() => {
        if (file.status === "complete" && file.projectId && file.drawingId) {
          router.push(`/projects/${file.projectId}/drawings/${file.drawingId}`);
        }
      }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium truncate">{file.file.name}</p>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-slate-500">{formatBytes(file.file.size)}</p>
        {file.error && (
          <p className="text-sm text-red-600 mt-1">{file.error}</p>
        )}
        {(file.status === "uploading" || file.status === "processing") && (
          <Progress
            value={file.status === "processing" ? undefined : file.progress}
            className={cn(
              "h-1 mt-2",
              file.status === "processing" && "animate-pulse"
            )}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {file.status === "complete" && (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/5"
          >
            View Results →
          </Button>
        )}
        {(file.status === "pending" || file.status === "error") && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-slate-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
