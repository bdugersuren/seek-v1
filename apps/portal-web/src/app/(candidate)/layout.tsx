"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RoleGuard } from "@/components/auth/role-guard";
import { Icons, Text, IconButton } from "@seek/ui";
import { RootState } from "@/store"; // Check if store is defined here, yes it was imported in other parts of portal-web
import { PortalUser } from "@/features/auth/mock-users";
import { clearMockSession } from "@/features/auth/mock-users";
import { setAccessToken } from "@/lib/auth-client";
import { logout as logoutAction } from "@/store/slices/authSlice";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as PortalUser | null;

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setAccessToken(null);
    dispatch(logoutAction());

    const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "false";
    if (enableMock) {
      clearMockSession();
    } else {
      try {
        await fetch("/api/v1/auth/logout", { method: "POST" });
      } catch (e) {
        console.error("Failed to call logout API", e);
      }
    }
    window.location.href = "/login";
  };

  const navLinks = [
    { href: "/catalog", label: "Нүүр хуудас" },
    { href: "/my-assessments", label: "Миний үнэлгээ" },
    { href: "/payments", label: "Төлбөрүүд" },
    { href: "/support", label: "Тусламж" },
  ];

  return (
    <RoleGuard allowedRoles={["candidate"]}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-seek-6 py-3 shadow-seek-xs">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-seek-4">
            
            {/* Left: Logo */}
            <Link href="/catalog" className="flex items-center gap-seek-2.5 flex-shrink-0">
              <div className="h-9 w-9 bg-primary rounded-seek-lg flex items-center justify-center text-white">
                <Icons.Dashboard className="h-5 w-5" />
              </div>
              <span className="font-sans font-bold text-lg text-primary tracking-wide hidden sm:inline">
                seek.mn PORTAL
              </span>
              <span className="font-sans font-bold text-lg text-primary tracking-wide sm:hidden">
                seek.mn
              </span>
            </Link>

            {/* Middle: Search Box (Desktop Only) */}
            <div className="hidden md:flex items-center flex-1 max-w-md relative mx-seek-4">
              <div className="absolute left-seek-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400">
                <Icons.Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Хайлт хийх"
                className="w-full bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white border border-slate-200/50 rounded-full py-2 pl-11 pr-seek-4 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-200 transition-all"
              />
            </div>

            {/* Right: Notifications, Avatar and Mobile Menu */}
            <div className="flex items-center gap-seek-4 flex-shrink-0">
              
              {/* Mobile Search Indicator icon */}
              <button type="button" className="md:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center">
                <div className="h-4 w-4 bg-slate-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                  {/* Circle shape as shown in mobile screenshot */}
                </div>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <IconButton ariaLabel="Notifications" className="text-slate-500 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-50 relative">
                  <Icons.Settings className="h-5 w-5" /> {/* Bell representation */}
                  <span className="absolute -top-1 -right-1 bg-danger text-white rounded-full text-[9px] font-bold px-1.5 py-0.5 shadow-seek-xs">
                    5
                  </span>
                </IconButton>
              </div>

              {/* User Avatar dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-seek-2.5 p-1 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
                    {user?.name?.slice(0, 2) || "AD"}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-slate-800">
                    {user?.name || "Admin"} <span className="text-[10px] text-slate-400 ml-0.5">▾</span>
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-dropdown w-56 overflow-hidden rounded-seek-xl border border-slate-200 bg-white shadow-seek-lg py-1">
                    <div className="border-b border-slate-100 px-seek-4 py-seek-3">
                      <Text className="font-bold text-xs text-slate-800 leading-tight">
                        {user?.name || "Хэрэглэгч"}
                      </Text>
                      <Text variant="muted" className="text-[10px] mt-0.5 text-slate-500 truncate">
                        {user?.email || "candidate@seek.mn"}
                      </Text>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center justify-between rounded-seek-lg px-seek-3 py-seek-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Миний профайл
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center justify-between rounded-seek-lg px-seek-3 py-seek-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Тохиргоо
                      </Link>
                      <Link
                        href="/wallet"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center justify-between rounded-seek-lg px-seek-3 py-seek-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Хэтэвч
                      </Link>
                      <Link
                        href="/certificates"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center justify-between rounded-seek-lg px-seek-3 py-seek-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Сертификат
                      </Link>
                      <button
                        type="button"
                        className="w-full mt-1 flex items-center justify-between rounded-seek-lg px-seek-3 py-seek-2 text-left text-xs font-bold text-danger hover:bg-danger/5 transition-colors border-t border-slate-100 pt-2"
                        onClick={handleLogout}
                      >
                        Системээс гарах
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu burger toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-500 hover:text-slate-800"
              >
                <Icons.Menu size={20} />
              </button>

            </div>
          </div>
        </header>

        {/* Mobile Nav Links drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-seek-6 py-2 flex flex-col gap-2 shadow-seek-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-bold py-2 ${isActive ? "text-primary" : "text-slate-600"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Subheader Navigation (Desktop and Mobile Horizontal layout) */}
        <section className="bg-white border-b border-slate-100/80 px-seek-6">
          <div className="max-w-[1400px] mx-auto flex items-center gap-seek-8 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold py-2.5 border-b-2 transition-all ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

      </div>
    </RoleGuard>
  );
}
