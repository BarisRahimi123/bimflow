"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToleranceItem {
  scope: string;
  tolerance: string;
  critical: boolean;
  note?: string;
}

interface DisciplineData {
  name: string;
  color: string;
  items: ToleranceItem[];
}

const TOLERANCE_DATA: DisciplineData[] = [
  {
    name: 'Process',
    color: 'blue',
    items: [
      { scope: 'Subfab lateral racks', tolerance: '0"', critical: true, note: 'ZERO tolerance -- exact placement required' },
      { scope: 'Process piping (in EOR racks)', tolerance: '1/2"', critical: true },
      { scope: 'Utility mains & sub-mains', tolerance: '1"', critical: false },
      { scope: 'Equipment/panel datums (excl. subfab)', tolerance: '1/2"', critical: true },
      { scope: 'Equipment feeders / utility branches', tolerance: '6"', critical: false },
      { scope: 'Individual pipe runs incl. branch fittings', tolerance: '6"', critical: false },
      { scope: 'In-line components', tolerance: '6" axially', critical: false },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
  {
    name: 'Architectural',
    color: 'purple',
    items: [
      { scope: 'Building shell & interiors', tolerance: '0"', critical: true },
      { scope: 'Cleanroom ceiling grid & raised access floor', tolerance: '0"', critical: true },
      { scope: 'Modeled openings (doors, windows, louvers, penetrations)', tolerance: '1/8"', critical: true },
      { scope: 'Non-cleanroom interior partitions', tolerance: '1/8"', critical: true },
      { scope: 'Cleanroom interior partitions', tolerance: '0"', critical: true },
      { scope: 'Fire extinguishers', tolerance: 'N/A', critical: false, note: 'Design intent only' },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
  {
    name: 'Structural',
    color: 'amber',
    items: [
      { scope: 'Subfab lateral racks', tolerance: '0"', critical: true },
      { scope: 'Main building steel & structure', tolerance: '0"', critical: true },
      { scope: 'Cleanroom ceiling grid', tolerance: '0"', critical: true },
      { scope: 'Slotted channel framing in EOR-designed racks', tolerance: '1"', critical: false },
      { scope: 'Kicker/seismic bracing', tolerance: 'Per details', critical: false },
      { scope: 'EOR-designed pipe supports', tolerance: '6"', critical: false },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
  {
    name: 'Mechanical',
    color: 'emerald',
    items: [
      { scope: 'Subfab lateral rack exhaust laterals', tolerance: '0"', critical: true },
      { scope: 'Mechanical equipment', tolerance: '0"', critical: true, note: 'Design intent' },
      { scope: 'Ductwork mains (not in lateral/EOR racks)', tolerance: '6"', critical: false },
      { scope: 'Ductwork branches', tolerance: '6"', critical: false },
      { scope: 'Air terminals (drop ceiling)', tolerance: 'Align to grid', critical: false },
      { scope: 'Air terminals (wall/hard ceiling)', tolerance: '6" or as required', critical: false },
      { scope: 'Mechanical piping (in EOR racks)', tolerance: '1"', critical: false },
      { scope: 'Mechanical piping (not in EOR racks)', tolerance: '6"', critical: false },
      { scope: 'Plumbing mains and drains', tolerance: '6"', critical: false },
      { scope: 'Plumbing branches', tolerance: '12"', critical: false },
      { scope: 'Plumbing underground', tolerance: '2"', critical: false },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
  {
    name: 'Electrical',
    color: 'yellow',
    items: [
      { scope: 'Raceways in subfab lateral racks', tolerance: '1"', critical: true },
      { scope: 'Raceways (in EOR racks)', tolerance: '2"', critical: false },
      { scope: 'Raceways (not in EOR racks)', tolerance: '6"', critical: false },
      { scope: 'Site/underground conduit duct banks', tolerance: '6"', critical: false },
      { scope: 'Major equipment datums (excl. subfab = 0")', tolerance: '1/2"', critical: true },
      { scope: 'Branch distribution equipment datums', tolerance: '2"', critical: false },
      { scope: 'Individual conduits', tolerance: '6"', critical: false },
      { scope: 'Receptacles, disconnects, lighting', tolerance: 'N/A', critical: false, note: 'Design intent only' },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
  {
    name: 'Telecom',
    color: 'indigo',
    items: [
      { scope: 'Tray/conduit in subfab lateral racks', tolerance: '0"', critical: true },
      { scope: 'Cable/ladder tray (in or out of EOR racks)', tolerance: '1"', critical: false },
      { scope: 'Site/underground conduit duct banks', tolerance: '4"', critical: false },
      { scope: 'Equipment/panel datums (excl. subfab)', tolerance: '1/2"', critical: true },
      { scope: 'Individual conduit/trunking runs', tolerance: '6"', critical: false },
      { scope: 'Telecom outlets, WAP, antenna', tolerance: 'N/A', critical: false, note: 'Design intent only' },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
  {
    name: 'Life Safety (LSS)',
    color: 'red',
    items: [
      { scope: 'Tray/conduit in subfab lateral racks', tolerance: '0"', critical: true },
      { scope: 'Cable/ladder tray', tolerance: '1"', critical: false },
      { scope: 'Site/underground conduit duct banks', tolerance: '4"', critical: false },
      { scope: 'Equipment/panel datums (excl. subfab)', tolerance: '1/2"', critical: true },
      { scope: 'VESDA panels, detection tubing, fire alarm devices', tolerance: '6"', critical: false, note: 'Design intent' },
      { scope: 'Security cameras', tolerance: '2"', critical: false },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
  {
    name: 'I&C (Instrumentation & Controls)',
    color: 'slate',
    items: [
      { scope: 'Tray/conduit in subfab lateral racks', tolerance: '0"', critical: true },
      { scope: 'Cable/ladder tray', tolerance: '1"', critical: false },
      { scope: 'Site/underground conduit duct banks', tolerance: '4"', critical: false },
      { scope: 'Equipment/panel datums (excl. subfab)', tolerance: '1/2"', critical: true },
      { scope: 'Instrumentation devices', tolerance: '6"', critical: false, note: 'If design intent met' },
      { scope: 'All remaining components', tolerance: '2"', critical: false },
    ],
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export default function ToleranceLookupPage() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('Process');

  const discipline = TOLERANCE_DATA.find((d) => d.name === selectedDiscipline) || TOLERANCE_DATA[0];
  const colors = COLOR_MAP[discipline.color] || COLOR_MAP.slate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/resources" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 dark:text-slate-100">Tolerance Lookup</h1>
                <p className="text-xs text-slate-500">A-9 Change Management</p>
              </div>
            </div>
          </div>
          <Link href="/api/documents/a9-change-mgmt-pdf" target="_blank" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700">
            <FileText className="w-3.5 h-3.5" /> View A-9 Document <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Construction Model Tolerances
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            How far can you deviate from the design model? Select your discipline to see the tolerance for each scope item.
            Deviations within tolerance and without trade conflicts do not require an RFI.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Rules that apply to ALL tolerances:</strong></p>
              <ul className="list-disc list-inside text-xs space-y-0.5 text-blue-700 dark:text-blue-300">
                <li>Tolerances only apply when the design model cannot be constructed as shown</li>
                <li>Every alteration must be tracked as a viewpoint in BIM Track</li>
                <li>Changes outside tolerance require RFI and/or BIM Track coordination</li>
                <li>If an adjustment within tolerance causes a conflict with other trades, it may NOT be adjusted</li>
                <li>Elements below LOD threshold (per A-7 BEP) have greater flexibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Discipline Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TOLERANCE_DATA.map((d) => {
            const c = COLOR_MAP[d.color] || COLOR_MAP.slate;
            return (
              <button
                key={d.name}
                onClick={() => setSelectedDiscipline(d.name)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                  selectedDiscipline === d.name
                    ? `${c.bg} ${c.text} ${c.border} shadow-sm`
                    : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                )}
              >
                {d.name}
              </button>
            );
          })}
        </div>

        {/* Tolerance Table */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className={cn("px-5 py-3 border-b", colors.bg, colors.border)}>
            <h3 className={cn("font-semibold", colors.text)}>{discipline.name} Discipline Tolerances</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {discipline.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.scope}</div>
                  {item.note && <div className="text-xs text-slate-500 mt-0.5">{item.note}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn(
                    "text-sm font-bold px-3 py-1 rounded-lg",
                    item.tolerance === '0"'
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : item.critical
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  )}>
                    {item.tolerance}
                  </span>
                  {item.tolerance === '0"' ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : item.critical ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Management Workflow */}
        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Change Management Decision Flow</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Within tolerance + No trade conflict</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">No RFI needed. Track in BIM Track. No design model update required.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-amber-800 dark:text-amber-300">Outside tolerance + Minor change</div>
                <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Resolve in BIM workgroup meeting. BIM Track item created. DM updated upon IFF receipt (2-4 week window).</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-800 dark:text-red-300">Outside tolerance + Major change</div>
                <div className="text-xs text-red-700 dark:text-red-400 mt-0.5">RFI required. DM updated. IFF coordinated. DRB (Design Review Board) may be required.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
