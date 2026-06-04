"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface SessionUser {
  email: string;
  name: string;
}

export function AccountMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        const authUser = data.user;
        if (!authUser) {
          setUser(null);
          return;
        }
        setUser({
          email: authUser.email ?? "",
          name:
            (authUser.user_metadata?.name as string | undefined) ??
            authUser.email ??
            "",
        });
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Try again.");
      setLoggingOut(false);
    }
  }

  if (!user) return null;

  const initials = (user.name || user.email)
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group relative ml-1">
      <button
        className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
        aria-label="Account menu"
      >
        {initials || <User className="h-4 w-4" />}
      </button>
      <div className="invisible absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-popover p-1.5 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="border-b border-border px-2.5 py-2">
          <div className="truncate text-sm font-semibold text-popover-foreground">{user.name}</div>
          <div className="truncate text-xs text-muted-foreground">{user.email}</div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-popover-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
