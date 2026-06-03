import type { Metadata } from "next";
import { Hanken_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontDisplay = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const PhaseProgress = dynamic(() => import("@/components/phase-progress"), { ssr: false });

export const metadata: Metadata = {
  title: "PIDFlow - P&ID Intelligence Platform",
  description: "Convert P&ID drawings into Revit models with AI-powered extraction and full citation tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <PhaseProgress />
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
