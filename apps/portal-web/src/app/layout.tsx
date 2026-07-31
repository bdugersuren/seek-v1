import React from "react";
import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: "seek.mn Portal",
  description: "Competency Assessment Platform Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
