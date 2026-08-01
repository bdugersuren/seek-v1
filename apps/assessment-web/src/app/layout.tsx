import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: "seek.mn Assessment",
  description: "Competency Assessment Platform Assessment Engine",
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
