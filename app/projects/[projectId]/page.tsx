"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, FileUp, ArrowLeft, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Drawing {
  id: string;
  fileName: string;
  status: string;
  createdAt: string;
  extractedLines?: any[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  drawings: Drawing[];
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.status === 404) {
          setError("Project not found");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch project");
        const data = await res.json();
        setProject(data.project);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    }
    if (projectId) fetchProject();
  }, [projectId]);

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Pending" },
    uploaded: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Pending" },
    processing: { icon: Loader2, color: "text-blue-600", bg: "bg-blue-100", label: "Processing" },
    completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Complete" },
    complete: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Complete" },
    failed: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Error" },
    error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Error" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-lg">{error || "Project not found"}</p>
        <Link href="/projects" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">{project.name}</h1>
                <p className="text-xs text-muted-foreground">{project.drawings?.length || 0} drawings</p>
              </div>
            </div>
          </div>
          <Link href="/upload" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors">
            <FileUp className="w-4 h-4" />
            Upload Drawing
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {project.description && (
          <p className="text-muted-foreground mb-8">{project.description}</p>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Drawings</h2>
          
          {(!project.drawings || project.drawings.length === 0) ? (
            <div className="text-center py-12 border rounded-xl bg-white/50 dark:bg-slate-900/50">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No drawings uploaded yet</p>
              <Link href="/upload" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700">
                <FileUp className="w-4 h-4" />
                Upload First Drawing
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {project.drawings.map((drawing) => {
                const status = statusConfig[drawing.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;
                
                return (
                  <Link
                    key={drawing.id}
                    href={`/projects/${project.id}/drawings/${drawing.id}`}
                    className="block p-4 rounded-xl border bg-white dark:bg-slate-900/50 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-slate-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{drawing.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {drawing.extractedLines?.length || 0} lines extracted • {formatDistanceToNow(new Date(drawing.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${status.color} ${drawing.status === 'processing' ? 'animate-spin' : ''}`} />
                        <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
