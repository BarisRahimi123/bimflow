"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FileUp,
  Calculator,
  LayoutGrid,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TweaksPanel } from "@/components/tweaks-panel";
import { AccountMenu } from "@/components/account-menu";

const NAV = [
  { href: "/guide", label: "Playbook" },
  { href: "/academy", label: "Academy" },
  { href: "/projects", label: "Projects" },
];

const TOOLS = [
  { href: "/calculator", label: "Support Calculator", description: "Span, hardware & vendors", icon: Calculator },
  { href: "/designer", label: "Visual Designer", description: "Draw pipe runs", icon: LayoutGrid },
  { href: "/resources", label: "BIM Resources", description: "Tolerances, spans, LOD", icon: BookOpen },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const toolsActive = TOOLS.some((t) => isActive(t.href));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/home" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-brand" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">PIDFlow</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Tools dropdown — CSS hover, no JS */}
          <div className="relative group">
            <button
              className={cn(
                "flex select-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                toolsActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Tools
              <ChevronDown className="mt-px h-3.5 w-3.5 opacity-60" />
            </button>
            <div className="invisible absolute right-0 top-full z-50 mt-1 w-60 rounded-xl border border-border bg-popover p-1.5 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-start gap-3 rounded-lg px-2.5 py-2 hover:bg-accent"
                >
                  <tool.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-popover-foreground">{tool.label}</span>
                    <span className="block text-xs text-muted-foreground">{tool.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-1 hidden sm:block">
            <TweaksPanel />
          </div>

          <Link href="/upload" className="ml-1">
            <Button size="sm" className="gap-1.5 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
              <FileUp className="h-3.5 w-3.5" />
              Upload P&ID
            </Button>
          </Link>

          <AccountMenu />
        </nav>
      </div>
    </header>
  );
}
