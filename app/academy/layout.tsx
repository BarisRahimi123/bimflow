import { SiteHeader } from "@/components/site-header";
import { AcademyAudioProvider } from "@/components/academy/audio-context";
import { AudioOverridesProvider } from "@/components/academy/audio-overrides-context";
import { ReviewedProvider } from "@/components/academy/reviewed-context";
import { AcademySidebar } from "@/components/academy/sidebar";
import { MiniPlayer } from "@/components/academy/mini-player";

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReviewedProvider>
      <AcademyAudioProvider>
        <AudioOverridesProvider>
          <div className="flex min-h-screen bg-background">
            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
              <AcademySidebar />
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
              <SiteHeader />
              <main className="min-w-0 flex-1">{children}</main>
              <MiniPlayer />
            </div>
          </div>
        </AudioOverridesProvider>
      </AcademyAudioProvider>
    </ReviewedProvider>
  );
}
