import React from "react";
import clsx from "clsx";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

interface AppShellProps {
  headerLogo?: React.ReactNode;
  headerActions?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({
  headerLogo,
  headerActions,
  sidebarContent,
  children,
  className,
}: AppShellProps) {
  return (
    <div
      className={clsx("min-h-screen bg-background flex flex-col", className)}
    >
      <Header logo={headerLogo} actions={headerActions} />
      <div className="flex flex-1">
        {sidebarContent && <Sidebar>{sidebarContent}</Sidebar>}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
