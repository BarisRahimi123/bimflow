"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, FolderOpen, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  drawings: Array<{ id: string; createdAt: string }>;
  _count: { drawings: number };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Projects</span>
            </div>
          </div>
          <Link href="/projects/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6">Create your first project to start analyzing P&ID drawings</p>
            <Link href="/projects/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-6 rounded-xl border bg-white dark:bg-slate-900/50 hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground truncate mt-1">{project.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {project._count?.drawings || 0} drawings
                      {project.updatedAt && (
                        <> • Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            
            <Link
              href="/projects/new"
              className="block p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors group"
            >
              <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-medium text-muted-foreground group-hover:text-foreground">Create New Project</p>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
