"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  Droplets,
  Wind,
  Thermometer,
  Ruler,
  MapPin,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowDown,
  ArrowUp,
  LayoutGrid,
  Layers,
  Square,
  PanelRight,
  Gauge,
  Package,
  ClipboardList,
  ExternalLink,
  ShoppingBag,
  Info,
  Download,
  Anchor,
  Factory,
  CornerDownRight,
  Navigation,
  Wrench,
  MoveHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MATERIAL_OPTIONS,
  PIPE_SIZES,
  MOUNTING_METHOD_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  CalculatorOutput,
} from "@/lib/calculator/types";
import {
  convertPipeSizeToMetric,
  getGFProductInfo,
} from "@/lib/calculator/pipe-conversions";
import {
  generateSupportLayout,
  COMMON_SCENARIOS,
  type PipeEndType,
  type SupportLayout,
  type PipeRunConfig,
} from "@/lib/calculator/support-layout";

const SUPPORT_EXPLANATIONS: Record<string, string> = {
  hanger: "Suspends pipe from structure above. Carries deadweight (vertical load). Standard choice for horizontal runs.",
  guide: "Controls lateral (side-to-side) movement while allowing the pipe to slide axially for thermal expansion.",
  anchor: "Prevents ALL pipe movement. Fixed reference point. Thermal expansion radiates outward from here.",
  slide: "Vertical support only. Allows both lateral and axial movement. Used at expansion loops and seismic interfaces.",
  riser_clamp: "Supports vertical pipe weight. Placed near the top of a riser. Carries the full deadweight of the vertical run.",
  rack_support: "Pipe rests on rack structure. Standard for pipe rack installations.",
  braced_hanger: "Hanger with lateral bracing for additional restraint. Prevents side-to-side movement while suspending pipe.",
};

function SupportTypeLabel({ type }: { type: string }) {
  const displayName = type.replace(/_/g, ' ');
  const explanation = SUPPORT_EXPLANATIONS[type];
  if (!explanation) {
    return <span className="capitalize">{displayName}</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="capitalize">{displayName}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
          {explanation}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}

// Cupertino-style Card component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30",
      className
    )}>
      {children}
    </div>
  );
}

// Cupertino-style Select
function Select({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  placeholder = "Select...",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  icon?: React.ComponentType<{ className?: string }>;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-12 px-4 rounded-xl appearance-none cursor-pointer",
            "bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-900 dark:text-slate-100",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
            "transition-all duration-200"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// Cupertino-style Input
function Input({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  unit,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full h-12 px-4 rounded-xl",
            "bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-900 dark:text-slate-100",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
            "transition-all duration-200",
            unit && "pr-12"
          )}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// Cupertino-style Toggle
function Toggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-7 rounded-full transition-all duration-300 ease-out",
          checked
            ? "bg-gradient-to-r from-blue-500 to-blue-600"
            : "bg-slate-200 dark:bg-slate-700"
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-out",
            checked ? "left-6" : "left-1"
          )}
        />
      </div>
    </label>
  );
}

// Mounting Method Card
function MountingMethodCard({
  option,
  selected,
  onClick,
}: {
  option: typeof MOUNTING_METHOD_OPTIONS[0];
  selected: boolean;
  onClick: () => void;
}) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    ArrowDown,
    LayoutGrid,
    Layers,
    Square,
    PanelRight,
  };
  const Icon = icons[option.icon] || ArrowDown;

  return (
    <button
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl text-left transition-all duration-200",
        "border-2",
        selected
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/50 dark:bg-slate-800/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          selected
            ? "bg-blue-500 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className={cn(
            "font-semibold text-sm",
            selected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
          )}>
            {option.label}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {option.description}
          </p>
        </div>
      </div>
    </button>
  );
}

// Vendor Products Section
interface VendorProductsProps {
  deadweight?: { success: boolean; products: any[] };
  lateral?: { success: boolean; products: any[] };
  axial?: { success: boolean; products: any[] };
}

// Single Product Card with Image
function ProductCard({ product, type }: { product: any; type: string }) {
  const [imageError, setImageError] = useState(false);

  const TypeIcon = type === 'Guide' ? MoveHorizontal : type === 'Anchor' ? Anchor : Wrench;
  
  const typeColors: Record<string, { bg: string; border: string; text: string }> = {
    'Hanger/Support': { 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300'
    },
    'Guide': { 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-300'
    },
    'Anchor': { 
      bg: 'bg-amber-50 dark:bg-amber-900/20', 
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300'
    },
  };
  
  const colors = typeColors[type] || typeColors['Hanger/Support'];
  
  return (
    <div className={cn(
      "rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg",
      product.isPreferred ? colors.border : "border-slate-200 dark:border-slate-700",
      product.isPreferred ? colors.bg : "bg-white dark:bg-slate-800/50"
    )}>
      {/* Product Image */}
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-full object-contain p-4"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <TypeIcon className="w-10 h-10 mb-2" />
            <span className="text-xs uppercase tracking-wider">{type}</span>
          </div>
        )}
        
        {/* Type Badge */}
        <div className={cn(
          "absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold",
          colors.bg, colors.text
        )}>
          {type}
        </div>
        
        {/* Preferred Badge */}
        {product.isPreferred && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-blue-500 text-white text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Preferred
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">
          {product.vendor}
        </div>
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight mb-2">
          {product.productName}
        </h4>
        
        {/* Part Number & Assembly */}
        <div className="space-y-1 mb-3">
          {product.partNumber && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Part #:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{product.partNumber}</span>
            </div>
          )}
          {product.assemblyDrawing && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Assy:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{product.assemblyDrawing}</span>
            </div>
          )}
        </div>
        
        {/* Description (if available) */}
        {product.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {product.productUrl && (
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors text-xs font-medium"
            >
              View Product <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {product.datasheetUrl && (
            <a
              href={product.datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs font-medium"
              title="Download Datasheet"
            >
              <FileText className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function VendorProductsSection({ products }: { products: VendorProductsProps | null }) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  if (!products) return null;
  
  // Get the first (preferred) product from each category
  const hangerProduct = products.deadweight?.products?.[0];
  const guideProduct = products.lateral?.products?.[0];
  const anchorProduct = products.axial?.products?.[0];
  
  const hasProducts = hangerProduct || guideProduct || anchorProduct;
  
  if (!hasProducts) return null;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-blue-500" />
        Recommended Products
      </h3>
      
      {/* Product Grid - 3 columns for hanger, guide, anchor */}
      <div className="grid md:grid-cols-3 gap-4">
        {hangerProduct && (
          <ProductCard product={hangerProduct} type="Hanger/Support" />
        )}
        {guideProduct && (
          <ProductCard product={guideProduct} type="Guide" />
        )}
        {anchorProduct && (
          <ProductCard product={anchorProduct} type="Anchor" />
        )}
      </div>
      
      {/* Show additional products if available */}
      {((products.deadweight?.products?.length ?? 0) > 1 ||
        (products.lateral?.products?.length ?? 0) > 1 ||
        (products.axial?.products?.length ?? 0) > 1) && (
        <div className="mt-4">
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", showAlternatives && "rotate-180")} />
            {showAlternatives ? "Hide" : "Show"} alternative products
          </button>
          {showAlternatives && (
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {products.deadweight?.products?.slice(1).map((p, i) => (
                <ProductCard key={`hw-alt-${i}`} product={p} type="Hanger/Support" />
              ))}
              {products.lateral?.products?.slice(1).map((p, i) => (
                <ProductCard key={`gd-alt-${i}`} product={p} type="Guide" />
              ))}
              {products.axial?.products?.slice(1).map((p, i) => (
                <ProductCard key={`an-alt-${i}`} product={p} type="Anchor" />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// Size Conversion Card - Imperial to Metric
function SizeConversionCard({ pipeSize, material }: { pipeSize: string; material: string }) {
  const conversion = convertPipeSizeToMetric(pipeSize, material);
  const gfGuide = getGFProductInfo(pipeSize, material, 'guide');
  const gfHanger = getGFProductInfo(pipeSize, material, 'hanger');
  const gfAnchor = getGFProductInfo(pipeSize, material, 'anchor');
  
  if (!conversion.success || !conversion.conversion) {
    return null;
  }
  
  const conv = conversion.conversion;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Ruler className="w-5 h-5 text-blue-500" />
        Size Conversion for Ordering
      </h3>
      
      {/* Main Conversion Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Imperial (NPS)</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{conv.nps}</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
              = DN{conv.dn}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Metric Size</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{conv.gfMetricSize} mm</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-700/50 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Actual OD:</span>
            <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">{conv.odInches}" ({conv.odMm} mm)</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Material:</span>
            <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">{material}</span>
          </div>
        </div>
      </div>
      
      {/* GF Product Codes */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Georg Fischer Stress Less Product Codes:
        </div>
        
        <div className="grid md:grid-cols-3 gap-3">
          {gfGuide && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Guide</div>
              <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                {gfGuide.productCode || `Size ${gfGuide.metricSize}mm`}
              </div>
              {gfGuide.loadRatings && (
                <div className="text-xs text-slate-500 mt-1">
                  Load: {gfGuide.loadRatings.fz}
                </div>
              )}
            </div>
          )}
          
          {gfHanger && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Hanger</div>
              <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                Size {gfHanger.metricSize}mm
              </div>
            </div>
          )}
          
          {gfAnchor && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">Anchor</div>
              <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                Size {gfAnchor.metricSize}mm
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Reference Note */}
      <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <strong>Note:</strong> When ordering GF Stress Less products, use the metric size ({conv.gfMetricSize}mm) 
        that corresponds to the pipe OD. The guide insert has a 3mm designed gap to eliminate stress transfer.
        <br />
        <span className="text-slate-500">Source: GF Stress Less Pipe Guide Datasheet (valid from 5/23/25)</span>
      </div>
    </Card>
  );
}

// Support Layout Visual Display
interface SupportLayoutDisplayProps {
  layout: SupportLayout;
  pipeLength: number;
}

function SupportLayoutDisplay({ layout, pipeLength }: SupportLayoutDisplayProps) {
  const typeColors: Record<string, { bg: string; text: string; svgFill: string; svgStroke: string; label: string }> = {
    anchor: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', svgFill: '#fee2e2', svgStroke: '#ef4444', label: 'A' },
    guide: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', svgFill: '#d1fae5', svgStroke: '#10b981', label: 'G' },
    hanger: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', svgFill: '#dbeafe', svgStroke: '#3b82f6', label: 'H' },
    riser_clamp: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', svgFill: '#ede9fe', svgStroke: '#8b5cf6', label: 'RC' },
    slide: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', svgFill: '#fef3c7', svgStroke: '#f59e0b', label: 'S' },
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-500" />
        Support Layout
        <span className="text-sm font-normal text-slate-500">({layout.totalSupports} supports)</span>
        {layout.anchors > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-medium">
            {layout.anchors} Anchor{layout.anchors > 1 ? 's' : ''}
          </span>
        )}
      </h3>
      
      {/* CRITICAL: Anchor Required Warning */}
      {layout.anchorRequiredElsewhere && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="font-bold text-red-800 dark:text-red-200 text-sm">
                ANCHOR REQUIRED (Not On This Run)
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                This pipe run has <strong>NO anchor</strong>. Per 40 05 19, every piping system needs at least one anchor to control thermal expansion.
              </p>
              {layout.anchorLocation && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  Place anchor: <span className="font-normal">{layout.anchorLocation}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Visual Pipe Diagram - SVG */}
      <div className="mb-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 px-4 pt-4 pb-2">
        <svg viewBox="0 0 800 72" className="w-full overflow-visible" style={{ height: '72px' }}>
          <defs>
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          {/* Pipe body */}
          <rect x="24" y="42" width="752" height="10" rx="5" fill="url(#pipeGrad)" />
          {/* End caps */}
          <rect x="18" y="40" width="12" height="14" rx="3" fill="#94a3b8" />
          <rect x="770" y="40" width="12" height="14" rx="3" fill="#94a3b8" />
          {/* Support markers */}
          {layout.supports.map((support, idx) => {
            const rawX = 24 + (Math.min(Math.max(support.position / pipeLength, 0.04), 0.96)) * 752;
            const colors = typeColors[support.type] || typeColors.hanger;
            return (
              <g key={idx}>
                <line x1={rawX} y1="28" x2={rawX} y2="42" stroke={colors.svgStroke} strokeWidth="1.5" />
                <circle cx={rawX} cy="18" r="13" fill={colors.svgFill} stroke={colors.svgStroke} strokeWidth="2" />
                <text x={rawX} y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill={colors.svgStroke}>
                  {colors.label}
                </text>
                <text x={rawX} y="66" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="monospace">
                  {support.position.toFixed(1)}'
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0 ft</span>
          <span>{pipeLength} ft</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        {Object.entries(typeColors).map(([type, colors]) => {
          const count = layout.supports.filter(s => s.type === type).length;
          if (count === 0) return null;
          return (
            <div key={type} className="flex items-center gap-2">
              <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold", colors.bg, colors.text)}>
                {colors.label}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                {type.replace('_', ' ')} ({count})
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Support List */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Support Schedule:
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {layout.supports.map((support, idx) => {
            const colors = typeColors[support.type] || typeColors.hanger;
            return (
              <div 
                key={idx}
                className={cn(
                  "p-3 rounded-lg border flex items-start gap-3",
                  support.critical 
                    ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10" 
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                  colors.bg, colors.text
                )}>
                  {colors.label}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                      {support.type.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-slate-500 font-mono">
                      @ {support.position.toFixed(1)} ft
                    </span>
                    {support.critical && (
                      <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {support.reason}
                  </p>
                  {support.notes && support.notes.length > 0 && (
                    <ul className="mt-1 text-xs text-slate-500 list-disc list-inside">
                      {support.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Warnings */}
      {layout.warnings.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-sm font-medium mb-2">
            <AlertTriangle className="w-4 h-4" />
            Important Notes
          </div>
          <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
            {layout.warnings.map((warning, idx) => (
              <li key={idx}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

// Results Display
function ResultsDisplay({ 
  result, 
  vendorProducts,
  supportLayout,
  pipeLength 
}: { 
  result: CalculatorOutput; 
  vendorProducts?: VendorProductsProps | null;
  supportLayout?: SupportLayout | null;
  pipeLength?: number;
}) {
  const handleExportCSV = () => {
    const rows: string[][] = [
      ['Position (ft)', 'Support Type', 'Hardware', 'Manufacturer', 'Reason', 'Citation'],
    ];

    const hardwareMap: Record<string, { product: string; manufacturer: string }> = {};
    if (result.hardware.deadweight) {
      hardwareMap[result.supportTypes.deadweight] = {
        product: result.hardware.deadweight.productName,
        manufacturer: result.hardware.deadweight.manufacturer,
      };
    }
    if (result.hardware.lateral) {
      hardwareMap[result.supportTypes.lateral] = {
        product: result.hardware.lateral.productName,
        manufacturer: result.hardware.lateral.manufacturer,
      };
    }
    if (result.hardware.axial && result.supportTypes.axial) {
      hardwareMap[result.supportTypes.axial] = {
        product: result.hardware.axial.productName,
        manufacturer: result.hardware.axial.manufacturer,
      };
    }

    if (supportLayout) {
      for (const s of supportLayout.supports) {
        const hw = hardwareMap[s.type];
        rows.push([
          s.position.toFixed(1),
          s.type.replace(/_/g, ' '),
          hw?.product || '',
          hw?.manufacturer || '',
          s.reason,
          result.citations.hardware.document + ', ' + result.citations.hardware.section,
        ]);
      }
    } else {
      rows.push([
        '0.0',
        result.supportTypes.deadweight.replace(/_/g, ' '),
        hardwareMap[result.supportTypes.deadweight]?.product || '',
        hardwareMap[result.supportTypes.deadweight]?.manufacturer || '',
        'Start of run',
        result.citations.maxSpan.document + ', ' + result.citations.maxSpan.table,
      ]);
    }

    const csvContent = rows
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `support-schedule-${result.input?.material || 'pipe'}-${result.input?.pipeSize || ''}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isPlasticMaterial = result.input?.material && 
    ['PVC Schedule 40', 'PVC Schedule 80', 'CPVC', 'PP', 'PVDF'].some(
      m => result.input!.material.toLowerCase().includes(m.toLowerCase())
    );

  const toleranceDisplay = result.tolerance.placementToleranceInches === 'per_design'
    ? 'Per Design'
    : result.tolerance.placementToleranceInches === 0
      ? 'ZERO (exact placement)'
      : `+/- ${result.tolerance.placementToleranceInches}"`;

  const summaryBullets: string[] = [];

  summaryBullets.push(
    `Place ${result.calculations.numberOfSupports} supports spaced every ${result.calculations.adjustedMaxSpan} ft`
  );

  if (supportLayout && supportLayout.anchors > 0) {
    summaryBullets.push(
      `Start with an Anchor at 0 ft (prevents all movement)`
    );
  }

  if (result.calculations.guideSpacing) {
    summaryBullets.push(
      `Add Guides every ${result.calculations.guideSpacing} ft (controls lateral movement)`
    );
  }

  summaryBullets.push(
    `Fill remaining positions with ${result.supportTypes.deadweight.replace(/_/g, ' ')}s (carries weight)`
  );

  summaryBullets.push(`Tolerance: ${toleranceDisplay} (${result.tolerance.isCritical ? 'critical accuracy' : 'standard accuracy'})`);

  if (isPlasticMaterial) {
    summaryBullets.push('Use Georg Fischer Stress Less products for all plastic pipe supports');
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Plain-Language Summary */}
      <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
          For your {pipeLength ? `${pipeLength} ft, ` : ''}{result.input?.pipeSize || ''} {result.input?.material || ''} {result.input?.service || ''} pipe:
        </h3>
        <ul className="space-y-2">
          {summaryBullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              <span dangerouslySetInnerHTML={{ 
                __html: bullet.replace(/\b(Anchor|Guide|Hanger|Riser Clamp|Slide|riser clamp)\b/gi, '<strong>$1</strong>')
              }} />
            </li>
          ))}
        </ul>
      </Card>

      {/* Support Layout (if generated) */}
      {supportLayout && pipeLength && (
        <SupportLayoutDisplay layout={supportLayout} pipeLength={pipeLength} />
      )}
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Max Span</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {result.calculations.adjustedMaxSpan} <span className="text-base font-normal text-slate-500">ft</span>
          </div>
          {result.calculations.spanReductionApplied && (
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              ↓ Reduced from {result.calculations.baseMaxSpan} ft
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Guide Spacing</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {result.calculations.guideSpacing} <span className="text-base font-normal text-slate-500">ft</span>
          </div>
          {result.calculations.guideSpacingReduced && (
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              ↓ Reduced for long riser
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"># Supports</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {result.calculations.numberOfSupports}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ({result.calculations.numberOfSpans} spans)
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tolerance</div>
          <div className={cn(
            "text-2xl font-bold mt-1",
            result.tolerance.isCritical ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"
          )}>
            {result.tolerance.placementToleranceInches === 'per_design' 
              ? "Per Design" 
              : result.tolerance.placementToleranceInches === 0 
                ? '0"' 
                : `±${result.tolerance.placementToleranceInches}"`}
          </div>
          {result.tolerance.isCritical && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Critical
            </div>
          )}
        </Card>
      </div>

      {/* Thermal Expansion Calculations (if applicable) */}
      {(result.calculations.minGuideFromElbow || result.calculations.minSupportFromRiserElbow || result.calculations.minBranchGuideFromRun || result.calculations.canUseGuideAsAnchor) && (
        <Card className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Thermal Expansion Requirements
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.calculations.minGuideFromElbow && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800/50">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Min Guide from Elbow</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {result.calculations.minGuideFromElbow} ft
                </div>
                <div className="text-xs text-slate-500 mt-1">For thermal flexibility (40 05 19, Part 3.2)</div>
              </div>
            )}
            {result.calculations.minSupportFromRiserElbow && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800/50">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Min Support from Riser Elbow</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {result.calculations.minSupportFromRiserElbow} ft
                </div>
                <div className="text-xs text-slate-500 mt-1">Continuation flexibility (40 05 19, Part 4.4)</div>
              </div>
            )}
            {result.calculations.minBranchGuideFromRun && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800/50">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Min Branch Guide from Run</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {result.calculations.minBranchGuideFromRun} ft
                </div>
                <div className="text-xs text-slate-500 mt-1">Branch thermal flexibility (40 05 19, Part 5.3)</div>
              </div>
            )}
            {result.calculations.canUseGuideAsAnchor && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Short Run Option
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  Guide as Anchor
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Place guide within {result.calculations.guideAsAnchorDistance} ft of 90° elbow
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Support Types */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          Support Types
        </h3>
        <div className="p-3 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            Three types of support are recommended: one for <strong>vertical load</strong> (deadweight), 
            one for <strong>side-to-side control</strong> (lateral), and one for <strong>preventing lengthwise movement</strong> (axial restraint). 
            Hover the <Info className="w-3 h-3 inline" /> icon for details.
          </p>
        </div>
        <TooltipProvider delayDuration={200}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Deadweight</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
              <SupportTypeLabel type={result.supportTypes.deadweight} />
            </div>
            {result.hardware.deadweight && (
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {result.hardware.deadweight.productName}
                <div className="text-xs text-slate-500">{result.hardware.deadweight.manufacturer}</div>
              </div>
            )}
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Lateral</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
              <SupportTypeLabel type={result.supportTypes.lateral} />
            </div>
            {result.hardware.lateral && (
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {result.hardware.lateral.productName}
                <div className="text-xs text-slate-500">{result.hardware.lateral.manufacturer}</div>
              </div>
            )}
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Axial</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
              {result.supportTypes.axial 
                ? <SupportTypeLabel type={result.supportTypes.axial} />
                : <span className="text-slate-400">N/A</span>
              }
            </div>
            {result.hardware.axial && (
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {result.hardware.axial.productName}
                <div className="text-xs text-slate-500">{result.hardware.axial.manufacturer}</div>
              </div>
            )}
          </div>
        </div>
        </TooltipProvider>
        
        {/* Cush-a-Clamp eligibility */}
        <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-3">
          {result.flags.cushAClampEligible ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Cush-a-Clamp eligible</strong> - Multi-point anchoring available
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-500">
                Cush-a-Clamp <strong>not eligible</strong>
                {result.flags.isPlastic && " (plastic material)"}
              </span>
            </>
          )}
        </div>
      </Card>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <Card className="p-6 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Warnings & Notes ({result.warnings.length})
          </h3>
          <ul className="space-y-2">
            {result.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
                <span className="text-amber-500 mt-1">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Citations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Document Citations
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Max Span</div>
            <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">
              {result.citations.maxSpan.document}, {result.citations.maxSpan.table}
            </div>
            {result.citations.maxSpan.description && (
              <div className="text-xs text-slate-500 mt-1">{result.citations.maxSpan.description}</div>
            )}
          </div>
          
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Guide Spacing</div>
            <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">
              {result.citations.guideSpacing.document}, {result.citations.guideSpacing.section}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Hardware</div>
            <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">
              {result.citations.hardware.document}, {result.citations.hardware.section}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Tolerance</div>
            <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">
              {result.citations.tolerance.document}, Page {result.citations.tolerance.page}
            </div>
          </div>
          
          {result.citations.sgCorrection && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 md:col-span-2">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">SG Correction</div>
              <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                {result.citations.sgCorrection.document}, {result.citations.sgCorrection.table}
              </div>
              {result.citations.sgCorrection.description && (
                <div className="text-xs text-slate-500 mt-1">{result.citations.sgCorrection.description}</div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Vendor Products */}
      <VendorProductsSection products={vendorProducts} />

      {/* Size Conversion for Ordering */}
      {result.input?.pipeSize && result.input?.material && (
        <SizeConversionCard 
          pipeSize={result.input.pipeSize} 
          material={result.input.material} 
        />
      )}

      {/* Export Buttons */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Support Schedule (CSV)
        </button>
      </div>
    </div>
  );
}

function CalculatorPageInner() {
  const searchParams = useSearchParams();

  // Form state
  const [material, setMaterial] = useState("");
  const [pipeSize, setPipeSize] = useState("");
  const [service, setService] = useState<"water" | "vapor">("water");
  const [temperature, setTemperature] = useState("68");
  const [specificGravity, setSpecificGravity] = useState("1.0");
  const [pipeLength, setPipeLength] = useState("");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [mountingMethod, setMountingMethod] = useState("hanging");
  const [locationType, setLocationType] = useState("individual_run");
  
  // Environment
  const [isIndoor, setIsIndoor] = useState(true);
  const [isCorrosive, setIsCorrosive] = useState(false);
  const [isInsulated, setIsInsulated] = useState(false);
  
  // Conditions - Elbow & Thermal Expansion
  const [hasElbow, setHasElbow] = useState(false);
  const [anchorToElbowDistance, setAnchorToElbowDistance] = useState("");
  
  // Continuation from Riser
  const [isFromRiser, setIsFromRiser] = useState(false);
  const [riserLength, setRiserLength] = useState("");
  
  // In-line Components
  const [hasInlineComponent, setHasInlineComponent] = useState(false);
  const [componentWeight, setComponentWeight] = useState<"light" | "medium" | "heavy">("light");
  
  // Special Configurations
  const [hasFlexibleCoupling, setHasFlexibleCoupling] = useState(false);
  const [isEquipmentConnection, setIsEquipmentConnection] = useState(false);
  const [isExpansionLoop, setIsExpansionLoop] = useState(false);
  const [expansionLoopLeg, setExpansionLoopLeg] = useState<"offset" | "connecting">("offset");
  const [isSeismicInterface, setIsSeismicInterface] = useState(false);
  
  // Branch Piping
  const [isBranchPipe, setIsBranchPipe] = useState(false);
  const [branchDistanceFromAnchor, setBranchDistanceFromAnchor] = useState("");
  
  // Special Cases
  const [isPPDWSafetyShower, setIsPPDWSafetyShower] = useState(false);
  const [isDoubleWall, setIsDoubleWall] = useState(false);
  const [carrierPipeTemp, setCarrierPipeTemp] = useState("");
  
  // Plastic Piping (40 05 19, Section 1.5.K)
  const [hasPlasticFitting, setHasPlasticFitting] = useState(false);
  const [plasticFittingType, setPlasticFittingType] = useState<"elbow" | "tee" | "wye">("elbow");
  
  // Pipe Run Configuration (for support layout)
  const [startType, setStartType] = useState<PipeEndType>("anchor");
  const [endType, setEndType] = useState<PipeEndType>("equipment");
  const [showLayoutConfig, setShowLayoutConfig] = useState(true);
  
  // Mid-Run Fittings (elbows, tees, wyes along the pipe)
  const [hasMidRunFitting, setHasMidRunFitting] = useState(false);
  const [midRunFittingType, setMidRunFittingType] = useState<"elbow" | "tee" | "wye">("elbow");
  const [midRunFittingPosition, setMidRunFittingPosition] = useState("");
  
  // UI state
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculatorOutput | null>(null);
  const [vendorProducts, setVendorProducts] = useState<any>(null);
  const [supportLayout, setSupportLayout] = useState<SupportLayout | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mat = searchParams.get('material');
    const size = searchParams.get('size');
    const svc = searchParams.get('service');
    const temp = searchParams.get('temperature');

    if (mat) setMaterial(mat);
    if (size) setPipeSize(size);
    if (svc && (svc === 'water' || svc === 'vapor')) setService(svc);
    if (temp) setTemperature(temp);
  }, [searchParams]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);
    setResult(null);
    setVendorProducts(null);
    setSupportLayout(null);
    
    try {
      const isSimple = mode === 'simple';
      const response = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material,
          pipeSize,
          service,
          temperature: Number(temperature),
          specificGravity: Number(specificGravity),
          pipeLength: Number(pipeLength),
          orientation,
          mountingMethod: isSimple ? 'hanging' : mountingMethod,
          locationType,
          isIndoor: isSimple ? true : isIndoor,
          isCorrosive: isSimple ? false : isCorrosive,
          isInsulated: isSimple ? false : isInsulated,
          hasElbow: isSimple ? false : hasElbow,
          anchorToElbowDistance: !isSimple && hasElbow && anchorToElbowDistance ? Number(anchorToElbowDistance) : undefined,
          isFromRiser: isSimple ? false : isFromRiser,
          riserLength: !isSimple && isFromRiser && riserLength ? Number(riserLength) : undefined,
          hasInlineComponent: isSimple ? false : hasInlineComponent,
          componentWeight: !isSimple && hasInlineComponent ? componentWeight : undefined,
          hasFlexibleCoupling: isSimple ? false : hasFlexibleCoupling,
          isEquipmentConnection: isSimple ? false : isEquipmentConnection,
          isExpansionLoop: isSimple ? false : isExpansionLoop,
          expansionLoopLeg: !isSimple && isExpansionLoop ? expansionLoopLeg : undefined,
          isSeismicInterface: isSimple ? false : isSeismicInterface,
          isBranchPipe: isSimple ? false : isBranchPipe,
          branchDistanceFromAnchor: !isSimple && isBranchPipe && branchDistanceFromAnchor ? Number(branchDistanceFromAnchor) : undefined,
          branchOrientation: !isSimple && isBranchPipe ? 'horizontal_from_horizontal' : undefined,
          isDoubleWall: isSimple ? false : isDoubleWall,
          carrierPipeTemp: !isSimple && isDoubleWall && carrierPipeTemp ? Number(carrierPipeTemp) : undefined,
          isPPDWSafetyShower: isSimple ? false : isPPDWSafetyShower,
          hasPlasticFitting: isSimple ? false : (hasPlasticFitting || hasMidRunFitting),
          plasticFittingType: isSimple ? undefined : (hasMidRunFitting ? midRunFittingType : (hasPlasticFitting ? plasticFittingType : undefined)),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Calculation failed");
      }
      
      setResult(data.result);
      setVendorProducts(data.vendorProducts);
      
      // Generate support layout with the calculated values
      if (data.result) {
        const isPlastic = ['PVC Schedule 40', 'PVC Schedule 80', 'CPVC', 'PP', 'PVDF'].some(
          m => material.toLowerCase().includes(m.toLowerCase())
        );
        
        const layoutConfig: PipeRunConfig = {
          material,
          pipeSize,
          length: Number(pipeLength),
          orientation,
          maxSpan: data.result.calculations.adjustedMaxSpan,
          guideSpacing: data.result.calculations.guideSpacing,
          startType: isSimple ? 'anchor' : startType,
          endType: isSimple ? 'open' : endType,
          isPlastic,
          isEquipmentConnection: isSimple ? false : isEquipmentConnection,
          elbows: (() => {
            const elbowList: { position: number; direction: '90_horizontal' | '90_vertical' | '45' }[] = [];
            // From Advanced Conditions
            if (hasElbow && anchorToElbowDistance) {
              elbowList.push({ position: Number(anchorToElbowDistance), direction: '90_horizontal' });
            }
            // From Mid-Run Fitting (if it's an elbow)
            if (hasMidRunFitting && midRunFittingType === 'elbow' && midRunFittingPosition) {
              elbowList.push({ position: Number(midRunFittingPosition), direction: '90_horizontal' });
            }
            return elbowList.length > 0 ? elbowList : undefined;
          })(),
          plasticFittings: (() => {
            const fittingList: { position: number; type: 'elbow' | 'tee' | 'wye' }[] = [];
            // From Advanced Conditions (legacy)
            if (hasPlasticFitting) {
              fittingList.push({ position: Number(pipeLength) / 2, type: plasticFittingType });
            }
            // From Mid-Run Fitting (tee or wye, or elbow for plastic)
            if (hasMidRunFitting && midRunFittingPosition) {
              fittingList.push({ position: Number(midRunFittingPosition), type: midRunFittingType });
            }
            return fittingList.length > 0 ? fittingList : undefined;
          })(),
          flexCouplings: hasFlexibleCoupling 
            ? [{ position: Number(pipeLength) / 2 }] // Assume middle if not specified
            : undefined,
          inlineComponents: hasInlineComponent 
            ? [{ position: Number(pipeLength) / 2, type: 'component', weight: componentWeight }]
            : undefined,
        };
        
        const layout = generateSupportLayout(layoutConfig);
        setSupportLayout(layout);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsCalculating(false);
    }
  };

  // Form validation - includes conditional requirements
  const isBranchDistanceValid = !isBranchPipe || (branchDistanceFromAnchor && Number(branchDistanceFromAnchor) > 0);
  
  const isFormValid = material && pipeSize && pipeLength && Number(pipeLength) > 0 
    && isBranchDistanceValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 dark:text-slate-100">
                  Pipe Support Calculator
                </h1>
                <p className="text-xs text-slate-500">Section 40 05 19 Rev. 3</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setMode('simple')}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  mode === 'simple'
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                Simple
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  mode === 'advanced'
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                Advanced
              </button>
            </div>

            {/* Step 1: Pipe Properties */}
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">1</span>
                Pipe Properties
              </h2>
              <div className="space-y-4">
                <Select
                  label="Material"
                  value={material}
                  onChange={setMaterial}
                  options={MATERIAL_OPTIONS}
                  icon={Building2}
                  placeholder="Select material..."
                />
                
                <Select
                  label="Pipe Size"
                  value={pipeSize}
                  onChange={setPipeSize}
                  options={PIPE_SIZES.map((s) => ({ value: s, label: s }))}
                  icon={Ruler}
                  placeholder="Select size..."
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setService("water")}
                    className={cn(
                      "p-3 rounded-xl flex items-center gap-2 transition-all",
                      "border-2",
                      service === "water"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <Droplets className={cn(
                      "w-4 h-4",
                      service === "water" ? "text-blue-500" : "text-slate-400"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      service === "water" ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"
                    )}>
                      Water
                    </span>
                  </button>
                  <button
                    onClick={() => setService("vapor")}
                    className={cn(
                      "p-3 rounded-xl flex items-center gap-2 transition-all",
                      "border-2",
                      service === "vapor"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <Wind className={cn(
                      "w-4 h-4",
                      service === "vapor" ? "text-blue-500" : "text-slate-400"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      service === "vapor" ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"
                    )}>
                      Vapor
                    </span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Temperature"
                    value={temperature}
                    onChange={setTemperature}
                    type="number"
                    icon={Thermometer}
                    unit="°F"
                    min={32}
                    max={300}
                  />
                  <Input
                    label="Specific Gravity"
                    value={specificGravity}
                    onChange={setSpecificGravity}
                    type="number"
                    icon={Gauge}
                    min={1}
                    max={3}
                    step={0.1}
                  />
                </div>
              </div>
            </Card>

            {/* Step 2: Installation */}
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">2</span>
                Installation Details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Pipe Length"
                  value={pipeLength}
                  onChange={setPipeLength}
                  type="number"
                  icon={Ruler}
                  unit="ft"
                  placeholder="Enter length"
                  min={1}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrientation("horizontal")}
                    className={cn(
                      "p-3 rounded-xl flex flex-col items-center gap-1 transition-all",
                      "border-2",
                      orientation === "horizontal"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-1 rounded-full",
                      orientation === "horizontal" ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      orientation === "horizontal" ? "text-blue-700 dark:text-blue-300" : "text-slate-500"
                    )}>
                      Horizontal
                    </span>
                  </button>
                  <button
                    onClick={() => setOrientation("vertical")}
                    className={cn(
                      "p-3 rounded-xl flex flex-col items-center gap-1 transition-all",
                      "border-2",
                      orientation === "vertical"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <div className={cn(
                      "w-1 h-8 rounded-full",
                      orientation === "vertical" ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      orientation === "vertical" ? "text-blue-700 dark:text-blue-300" : "text-slate-500"
                    )}>
                      Vertical
                    </span>
                  </button>
                </div>
                
                {mode === 'advanced' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Mounting Method
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {MOUNTING_METHOD_OPTIONS.map((option) => (
                        <MountingMethodCard
                          key={option.value}
                          option={option}
                          selected={mountingMethod === option.value}
                          onClick={() => setMountingMethod(option.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <Select
                  label="Location Type"
                  value={locationType}
                  onChange={setLocationType}
                  options={LOCATION_TYPE_OPTIONS.map((l) => ({
                    value: l.value,
                    label: `${l.label} (${l.tolerance})`,
                  }))}
                  icon={MapPin}
                />
              </div>
            </Card>

            {/* Pipe Run Configuration */}
            {mode === 'advanced' && (
            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10">
              <button
                onClick={() => setShowLayoutConfig(!showLayoutConfig)}
                className="w-full flex items-center justify-between"
              >
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Pipe Run Configuration
                  <span className="text-xs font-normal text-blue-600 dark:text-blue-400 ml-2">
                    (for support layout)
                  </span>
                </h2>
                {showLayoutConfig ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              {showLayoutConfig && (
                <div className="mt-4 space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Tell us what this pipe connects to, and we'll show you exactly where to place each support.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Type */}
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Start Connection
                      </label>
                      <div className="space-y-1.5">
                        {[
                          { value: 'anchor', label: 'Fixed Anchor', desc: 'Fixed point in structure', icon: Anchor },
                          { value: 'equipment', label: 'Equipment', desc: 'Tank, pump, vessel', icon: Factory },
                          { value: 'elbow', label: 'From Elbow', desc: 'Continues from direction change', icon: CornerDownRight },
                          { value: 'riser_top', label: 'Riser Top', desc: 'Top of vertical pipe', icon: ArrowUp },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setStartType(opt.value as PipeEndType)}
                            className={cn(
                              "w-full p-2 rounded-lg text-left text-xs transition-all",
                              "border flex items-start gap-2",
                              startType === opt.value
                                ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            )}
                          >
                            <opt.icon className={cn("w-3.5 h-3.5 mt-0.5 flex-shrink-0", startType === opt.value ? "text-blue-600" : "text-slate-400")} />
                            <div>
                              <div className="font-medium">{opt.label}</div>
                              <div className="text-slate-500 text-[10px]">{opt.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* End Type */}
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        End Connection
                      </label>
                      <div className="space-y-1.5">
                        {[
                          { value: 'equipment', label: 'Equipment', desc: 'Tank, pump, vessel', icon: Factory },
                          { value: 'anchor', label: 'Fixed Anchor', desc: 'Fixed point in structure', icon: Anchor },
                          { value: 'elbow', label: 'To Elbow', desc: 'Changes direction', icon: CornerDownRight },
                          { value: 'open', label: 'Open/Continues', desc: 'Continues to another run', icon: Navigation },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setEndType(opt.value as PipeEndType)}
                            className={cn(
                              "w-full p-2 rounded-lg text-left text-xs transition-all",
                              "border flex items-start gap-2",
                              endType === opt.value
                                ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            )}
                          >
                            <opt.icon className={cn("w-3.5 h-3.5 mt-0.5 flex-shrink-0", endType === opt.value ? "text-blue-600" : "text-slate-400")} />
                            <div>
                              <div className="font-medium">{opt.label}</div>
                              <div className="text-slate-500 text-[10px]">{opt.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mid-Run Fittings */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Mid-Run Fittings (Elbow, Tee, Wye)
                    </label>
                    <Toggle
                      label="Has Fitting Along Pipe Run"
                      checked={hasMidRunFitting}
                      onChange={setHasMidRunFitting}
                      description="Add elbow, tee, or wye along the pipe"
                    />
                    {hasMidRunFitting && (
                      <div className="mt-3 space-y-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                              Fitting Type
                            </label>
                            <select
                              value={midRunFittingType}
                              onChange={(e) => setMidRunFittingType(e.target.value as "elbow" | "tee" | "wye")}
                              className="w-full h-10 px-3 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            >
                              <option value="elbow">90° Elbow</option>
                              <option value="tee">Tee</option>
                              <option value="wye">Wye</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                              Position (ft from start)
                            </label>
                            <input
                              type="number"
                              value={midRunFittingPosition}
                              onChange={(e) => setMidRunFittingPosition(e.target.value)}
                              placeholder="e.g., 10"
                              min={0}
                              className="w-full h-10 px-3 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                        
                        {/* Plastic Fitting Warning */}
                        {material && ['PVC Schedule 40', 'PVC Schedule 80', 'CPVC', 'PP', 'PVDF'].includes(material) && (
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                              Plastic Fitting: Support required within 18" of centerline
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                              Per 40 05 19, Section 1.5.K - {midRunFittingType === 'wye' ? 'Wye in horizontal or vertical plane' : `${midRunFittingType === 'elbow' ? 'Elbow' : 'Tee'} in horizontal plane`}
                            </p>
                          </div>
                        )}
                        
                        {/* Metal Elbow Info */}
                        {material && !['PVC Schedule 40', 'PVC Schedule 80', 'CPVC', 'PP', 'PVDF'].includes(material) && midRunFittingType === 'elbow' && (
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              <strong>Metal Elbow:</strong> Span reduced to 70% • Guide distance from elbow per 40 05 19, Part 3.2
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Scenario Warning */}
                  {startType === 'equipment' && endType === 'equipment' && (
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                      <span><strong>Equipment to Equipment:</strong> No anchors will be placed — thermal expansion must be accommodated at both ends.</span>
                    </div>
                  )}
                  {startType === 'anchor' && endType === 'anchor' && (
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-1.5">
                      <Ruler className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span><strong>Anchor to Anchor:</strong> This creates a fixed run. Consider if a thermal expansion loop is needed for long runs.</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
            )}

            {/* Step 3: Environment */}
            {mode === 'advanced' && (
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">3</span>
                Environment
              </h2>
              <div className="space-y-4">
                <Toggle
                  label="Indoor Installation"
                  checked={isIndoor}
                  onChange={setIsIndoor}
                  description="Affects Cush-a-Clamp eligibility"
                />
                <Toggle
                  label="Corrosive Area"
                  checked={isCorrosive}
                  onChange={setIsCorrosive}
                  description="Requires 316/316L SS hardware"
                />
                <Toggle
                  label="Insulated Pipe"
                  checked={isInsulated}
                  onChange={setIsInsulated}
                  description="Affects hardware selection"
                />
              </div>
            </Card>
            )}

            {/* Advanced Options */}
            {mode === 'advanced' && (
            <Card className="p-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  Advanced Conditions
                </span>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              {showAdvanced && (
                <div className="mt-4 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {/* Elbow & Thermal Expansion */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Thermal Expansion
                  </div>
                  <Toggle
                    label="Has Direction Change (Elbow)"
                    checked={hasElbow}
                    onChange={setHasElbow}
                    description="Reduces span to 70% for metal pipe"
                  />
                  {hasElbow && (
                    <Input
                      label="Anchor to Elbow Distance"
                      value={anchorToElbowDistance}
                      onChange={setAnchorToElbowDistance}
                      type="number"
                      unit="ft"
                      placeholder="Distance from anchor to elbow"
                      min={0}
                    />
                  )}
                  
                  {/* Continuation from Riser */}
                  {orientation === "horizontal" && (
                    <>
                      <Toggle
                        label="Continues from Vertical Riser"
                        checked={isFromRiser}
                        onChange={setIsFromRiser}
                        description="First support distance rules apply"
                      />
                      {isFromRiser && (
                        <Input
                          label="Riser Length"
                          value={riserLength}
                          onChange={setRiserLength}
                          type="number"
                          unit="ft"
                          placeholder="Length of the riser"
                          min={0}
                        />
                      )}
                    </>
                  )}
                  
                  {/* In-Line Components */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">
                    In-Line Components
                  </div>
                  <Toggle
                    label="Has In-Line Component"
                    checked={hasInlineComponent}
                    onChange={setHasInlineComponent}
                    description="Valve, strainer, etc."
                  />
                  {hasInlineComponent && (
                    <Select
                      label="Component Weight"
                      value={componentWeight}
                      onChange={(v) => setComponentWeight(v as "light" | "medium" | "heavy")}
                      options={[
                        { value: "light", label: "Light (<10% span weight)" },
                        { value: "medium", label: "Medium (10-30% span weight)" },
                        { value: "heavy", label: "Heavy (>30% span weight)" },
                      ]}
                    />
                  )}
                  
                  {/* Special Configurations */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">
                    Special Configurations
                  </div>
                  <Toggle
                    label="Has Flexible Coupling"
                    checked={hasFlexibleCoupling}
                    onChange={setHasFlexibleCoupling}
                    description="Requires independent supports & tie-rods"
                  />
                  <Toggle
                    label="Equipment Connection"
                    checked={isEquipmentConnection}
                    onChange={setIsEquipmentConnection}
                    description="No anchor on connection run"
                  />
                  <Toggle
                    label="Part of Expansion Loop"
                    checked={isExpansionLoop}
                    onChange={setIsExpansionLoop}
                    description="SLIDE on offset, GUIDE on connecting"
                  />
                  {isExpansionLoop && (
                    <Select
                      label="Expansion Loop Leg"
                      value={expansionLoopLeg}
                      onChange={(v) => setExpansionLoopLeg(v as "offset" | "connecting")}
                      options={[
                        { value: "offset", label: "Offset Leg (needs SLIDE)" },
                        { value: "connecting", label: "Connecting Leg (needs GUIDE)" },
                      ]}
                    />
                  )}
                  <Toggle
                    label="Seismic Movement Interface"
                    checked={isSeismicInterface}
                    onChange={setIsSeismicInterface}
                    description="Use SLIDE support at interface"
                  />
                  
                  {/* Branch Piping */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">
                    Branch Piping
                  </div>
                  <Toggle
                    label="Branch Pipe"
                    checked={isBranchPipe}
                    onChange={setIsBranchPipe}
                    description="Anchor goes on run pipe, not branch"
                  />
                  {isBranchPipe && (
                    <div className="space-y-1">
                      <Input
                        label="Distance from Run Anchor *"
                        value={branchDistanceFromAnchor}
                        onChange={setBranchDistanceFromAnchor}
                        type="number"
                        unit="ft"
                        placeholder="Required for guide calculation"
                        min={0}
                      />
                      {(!branchDistanceFromAnchor || Number(branchDistanceFromAnchor) <= 0) && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Required to calculate branch guide location (40 05 19, Part 5.3)
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Special Cases */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">
                    Special Cases
                  </div>
                  <Toggle
                    label="Double-Wall Piping"
                    checked={isDoubleWall}
                    onChange={setIsDoubleWall}
                    description="Containment pipe with carrier inside"
                  />
                  {isDoubleWall && (
                    <div className="space-y-1">
                      <Input
                        label="Carrier Pipe Temperature *"
                        value={carrierPipeTemp}
                        onChange={setCarrierPipeTemp}
                        type="number"
                        unit="°F"
                        placeholder="Temperature of inner (carrier) pipe"
                        min={0}
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Span based on containment pipe material with carrier pipe temperature (40 05 19, Part 6.2)
                      </p>
                    </div>
                  )}
                  <Toggle
                    label="3&quot; PPDW Safety Shower"
                    checked={isPPDWSafetyShower}
                    onChange={setIsPPDWSafetyShower}
                    description="Fixed 5-foot max span"
                  />
                  
                  {/* Plastic Piping Rules - Only show for plastic materials */}
                  {material && ['PVC Schedule 40', 'PVC Schedule 80', 'CPVC', 'PP', 'PVDF'].includes(material) && (
                    <>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Plastic Piping Rules (40 05 19, Section 1.5.K)
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-3">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          <strong>Automatic Rules Applied:</strong>
                        </p>
                        <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1 list-disc list-inside">
                          <li>No friction-type anchors (Cush-a-Clamp) - causes pipe stress</li>
                          <li>No metal in direct contact - use GF Stress Less or protective wrap</li>
                        </ul>
                      </div>
                      <Toggle
                        label="Has Plastic Fitting (Elbow/Tee/Wye)"
                        checked={hasPlasticFitting}
                        onChange={setHasPlasticFitting}
                        description="Support required within 18&quot; of centerline"
                      />
                      {hasPlasticFitting && (
                        <div className="space-y-3">
                          <Select
                            label="Fitting Type"
                            value={plasticFittingType}
                            onChange={(v) => setPlasticFittingType(v as "elbow" | "tee" | "wye")}
                            options={[
                              { value: "elbow", label: "90° Elbow (horizontal plane)" },
                              { value: "tee", label: "Tee (horizontal plane)" },
                              { value: "wye", label: "Wye (horizontal or vertical plane)" },
                            ]}
                          />
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                              Required: Support within 18" of fitting centerline
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                              Per 40 05 19, Section 1.5.K - unless detailed engineering justifies alternate support
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </Card>
            )}

            {/* Calculate Button — sticky at bottom of form column */}
            <div className="sticky bottom-4 z-20">
              <button
                onClick={handleCalculate}
                disabled={!isFormValid || isCalculating}
                className={cn(
                  "w-full h-14 rounded-xl font-semibold text-white transition-all duration-300",
                  "bg-gradient-to-r from-blue-500 to-indigo-600",
                  "hover:from-blue-600 hover:to-indigo-700",
                  "active:scale-[0.98]",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                  "shadow-xl shadow-blue-500/30",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isCalculating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calculate Support Requirements
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && (
              <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-300">Calculation Error</h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                  </div>
                </div>
              </Card>
            )}
            
            {isCalculating ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-32 rounded-2xl bg-slate-200/60 dark:bg-slate-700/40" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-slate-200/60 dark:bg-slate-700/40" />
                  ))}
                </div>
                <div className="h-48 rounded-2xl bg-slate-200/60 dark:bg-slate-700/40" />
                <div className="h-36 rounded-2xl bg-slate-200/60 dark:bg-slate-700/40" />
              </div>
            ) : result ? (
              <ResultsDisplay
                result={result}
                vendorProducts={vendorProducts}
                supportLayout={supportLayout}
                pipeLength={Number(pipeLength)}
              />
            ) : (
              <Card className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                  <Calculator className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  Ready to Calculate
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                  Fill in the pipe properties and installation details, then click Calculate to get support requirements with full citations.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <CalculatorPageInner />
    </Suspense>
  );
}
