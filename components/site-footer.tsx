import { FileText } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <FileText className="h-3 w-3 text-brand" />
          </div>
          <span className="text-sm font-semibold text-foreground">PIDFlow</span>
        </div>
        <p className="text-xs text-muted-foreground">Plansrow</p>
      </div>
    </footer>
  );
}
