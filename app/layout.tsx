import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Assistant } from "@/components/ui/Assistant";

export const metadata: Metadata = {
  title: "IRIS AI — InfraRed Intelligent Satellite Enhancement System",
  description:
    "AI-powered enhancement, semantic-guided colorization, and explainable computer vision for next-generation Earth observation.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-void text-ink">
        {children}
        <CommandPalette />
        <Assistant />
      </body>
    </html>
  );
}
