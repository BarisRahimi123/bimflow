import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function parseLineNumber(lineNumber: string) {
  const parts = lineNumber.split("-");
  if (parts.length >= 4) {
    const serviceMatch = parts[0].match(/^([A-Za-z]+)/);
    return {
      service: serviceMatch ? serviceMatch[1].toUpperCase() : null,
      area: parts[1] || null,
      size: parts[2] || null,
      sequence: parts[3] || null,
      raw: lineNumber,
    };
  }
  return { service: null, area: null, size: null, sequence: null, raw: lineNumber };
}

export function getConfidenceLevel(confidence: number) {
  const percentage = `${Math.round(confidence * 100)}%`;
  if (confidence >= 0.95) return { label: "High", color: "high" as const, percentage };
  if (confidence >= 0.8) return { label: "Medium", color: "medium" as const, percentage };
  return { label: "Low", color: "low" as const, percentage };
}

export function formatCitation(citation: { document?: string; page?: number; table?: string; sheet?: string; rows?: string; row?: string } | null): string {
  if (!citation) return "No citation";
  const parts: string[] = [];
  if (citation.document) parts.push(citation.document);
  if (citation.page) parts.push(`Page ${citation.page}`);
  if (citation.sheet) parts.push(`Sheet: ${citation.sheet}`);
  if (citation.table) parts.push(citation.table);
  if (citation.rows) parts.push(`Rows ${citation.rows}`);
  else if (citation.row) parts.push(`"${citation.row}"`);
  return parts.join(", ");
}
