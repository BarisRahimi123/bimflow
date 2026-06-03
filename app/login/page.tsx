import { Suspense } from "react";
import Link from "next/link";
import { FileText, ShieldCheck, ArrowLeft } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in — PIDFlow",
  description: "Sign in to your PIDFlow workspace.",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        </div>

        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
            <FileText className="h-5 w-5 text-brand-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">PIDFlow</span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-pretty text-3xl font-bold leading-tight">
            From P&ID drawing to Revit-ready piping.
          </h2>
          <p className="mt-4 text-primary-foreground/70">
            AI extraction, spec-grounded support calculations, and a guided modeler playbook —
            all in one workspace.
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-sm text-primary-foreground/60">
          <ShieldCheck className="h-4 w-4" />
          Invite-only access · Built by VoltShift
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-brand" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">PIDFlow</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-2 sm:px-12">
          <div className="w-full max-w-sm">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>

            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Welcome back. Enter your credentials to access your workspace.
              </p>
            </div>

            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-secondary" />}>
              <LoginForm />
            </Suspense>

            <p className="mt-8 rounded-xl border border-border bg-card px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
              PIDFlow is invite-only. Need an account?{" "}
              <span className="font-medium text-foreground">Contact your PlansRow administrator</span>{" "}
              to get access provisioned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
