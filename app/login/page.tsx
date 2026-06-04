import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, ShieldCheck, ArrowLeft } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in — PIDFlow",
  description: "Sign in to your PIDFlow workspace.",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — full-bleed product render */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <Image
          src="/loginpage.jpeg"
          alt="PIDFlow 3D piping model with live spec-compliance checks"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0px"
          className="object-cover"
        />
        {/* feather the seam into the dark sign-in side */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-primary/30" />
      </div>

      {/* Right — dark, glowy sign-in */}
      <div className="relative flex flex-col overflow-hidden bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between px-6 py-6 sm:px-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
              <FileText className="h-5 w-5 text-brand-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">PIDFlow</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/60 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-6 pb-12 pt-2 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
              <p className="mt-1.5 text-sm text-primary-foreground/70">
                Welcome back. Enter your credentials to access your workspace.
              </p>
            </div>

            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-white/5" />}>
              <LoginForm />
            </Suspense>

            <p className="mt-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs leading-relaxed text-primary-foreground/70">
              PIDFlow is invite-only. Need an account?{" "}
              <span className="font-medium text-primary-foreground">
                Contact your Plansrow administrator
              </span>{" "}
              to get access provisioned.
            </p>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-primary-foreground/50">
              <ShieldCheck className="h-3.5 w-3.5" />
              Invite-only access · Plansrow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
