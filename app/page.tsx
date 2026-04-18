import Link from "next/link";
import { 
  FileUp, 
  FolderOpen, 
  FileText, 
  CheckCircle, 
  Calculator,
  ArrowRight,
  Shield,
  Building2,
  FileSpreadsheet,
  Layers,
  Ruler,
  Clock,
  LayoutGrid,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PIDFlow</span>
            <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Projects
            </Link>
            <Link href="/guide">
              <Button variant="outline" size="sm" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Guide
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Resources
              </Button>
            </Link>
            <Link href="/designer">
              <Button variant="outline" size="sm" className="gap-2">
                <LayoutGrid className="w-4 h-4" />
                Designer
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" size="sm" className="gap-2">
                <Calculator className="w-4 h-4" />
                Calculator
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/20">
                <FileUp className="w-4 h-4" />
                Upload P&ID
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
              P&ID Intelligence Platform
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Extract piping data from P&ID drawings instantly. Get tolerances, support spans, 
              LOD requirements, and vendor products — <span className="font-semibold text-slate-800">all with full document citations.</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/upload">
                <Button size="lg" className="gap-2 h-12 px-6 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25">
                  <FileUp className="w-5 h-5" />
                  Upload Your First P&ID
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/designer">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  <LayoutGrid className="w-5 h-5" />
                  Visual Pipe Designer
                </Button>
              </Link>
              <Link href="/calculator">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                  <Calculator className="w-5 h-5" />
                  Pipe Support Calculator
                </Button>
              </Link>
              <Link href="/guide">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <GraduationCap className="w-5 h-5" />
                  Modeler Playbook
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base border-purple-200 text-purple-700 hover:bg-purple-50">
                  <BookOpen className="w-5 h-5" />
                  BIM Resources
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Upload Card */}
        <section className="container mx-auto px-6 pb-24">
          <Link href="/upload">
            <div className="group relative max-w-3xl mx-auto border-2 border-dashed border-slate-200 rounded-3xl p-12 hover:border-blue-400 transition-all cursor-pointer bg-white/50 hover:bg-blue-50/50 hover:shadow-xl hover:shadow-blue-500/5">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <FileUp className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold mb-2">Drag & Drop P&ID Here</p>
                  <p className="text-slate-500">or click to browse your files</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">PDF</Badge>
                  <Badge variant="secondary">PNG</Badge>
                  <Badge variant="secondary">JPG</Badge>
                  <Badge variant="secondary">TIFF</Badge>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Upload a P&ID and get complete piping specifications in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Extract */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Extraction</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Upload your P&ID and we automatically extract all piping lines with line numbers, 
                service codes, sizes, and materials.
              </p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Step 1
              </Badge>
            </div>

            {/* Lookup */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <Ruler className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Spec Lookup</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Automatically look up tolerances, pipe spans, and LOD requirements 
                from your project documents with full citations.
              </p>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Step 2
              </Badge>
            </div>

            {/* Vendor Products */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Vendor Products</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Get direct links to matching products from Georg Fischer, Spears, Anvil, 
                and other preferred vendors.
              </p>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Step 3
              </Badge>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-slate-900 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Built for BIM Modelers</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Everything you need to go from P&ID to Revit model faster
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <BenefitCard
                icon={<Shield className="w-6 h-6" />}
                title="Full Citations"
                description="Every spec cites the source document, page, and table. Fully auditable."
              />
              <BenefitCard
                icon={<FileSpreadsheet className="w-6 h-6" />}
                title="Export Ready"
                description="Download to Excel, CSV, or Revit schedule format with one click."
              />
              <BenefitCard
                icon={<Building2 className="w-6 h-6" />}
                title="Vendor Links"
                description="Direct links to product pages and datasheets from preferred vendors."
              />
              <BenefitCard
                icon={<Clock className="w-6 h-6" />}
                title="Save Hours"
                description="What used to take hours of manual lookup now takes seconds."
              />
            </div>
          </div>
        </section>

        {/* Calculator CTA */}
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Pipe Support Calculator</h3>
                  <p className="text-slate-400 mb-0 md:mb-0">
                    Calculate support requirements with automatic vendor product recommendations. 
                    Get hangers, guides, and anchors matched to your specs.
                  </p>
                </div>
                <Link href="/calculator">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 gap-2">
                    Open Calculator
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Save Hours?</h2>
            <p className="text-xl text-slate-600 mb-10">
              Upload a P&ID and get complete piping specifications in under a minute.
            </p>
            <Link href="/upload">
              <Button size="lg" className="gap-2 h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25">
                <FileUp className="w-6 h-6" />
                Start Extracting
                <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Recent Projects */}
        <section className="container mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/upload">
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group h-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-600 group-hover:text-slate-900">Create New Project</p>
                    <p className="text-sm text-slate-500">Upload a P&ID to get started</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">PIDFlow</span>
            </div>
            <p className="text-sm text-slate-500">
              Built by PlansRow • Project Confluence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
