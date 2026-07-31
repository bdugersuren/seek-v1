"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  AppShell,
  Badge,
  Button,
  IconButton,
  Icons,
  Select,
  Text,
  useDialog,
  useTheme,
  useToast,
  type Theme,
} from "@seek/ui";
import type { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { setAccessToken } from "@/lib/auth-client";
import type { PortalRole, PortalUser } from "@/features/auth/mock-users";
import { clearMockSession } from "@/features/auth/mock-users";
import {
  CATALOG_CART_UPDATED_EVENT,
  readCatalogCart,
} from "@/features/catalog/cart";
import { locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/use-t";
import type { TranslationKey } from "@/i18n/dictionaries";

type PortalIcon = (typeof Icons)[keyof typeof Icons];

const navItems: Array<{
  href: string;
  labelKey: TranslationKey;
  icon: PortalIcon;
  roles: PortalRole[];
}> = [
  {
    href: "/dashboard",
    labelKey: "nav.dashboard",
    icon: Icons.Dashboard,
    roles: [
      "super_admin",
      "organisation_admin",
      "assessor",
      "candidate",
      "reviewer_hr",
    ],
  },
  {
    href: "/admin",
    labelKey: "nav.admin",
    icon: Icons.Shield,
    roles: ["super_admin"],
  },
  {
    href: "/organisations",
    labelKey: "nav.organisations",
    icon: Icons.Menu,
    roles: ["super_admin", "organisation_admin"],
  },
  {
    href: "/assessments",
    labelKey: "nav.assessments",
    icon: Icons.Check,
    roles: ["organisation_admin", "assessor"],
  },
  {
    href: "/question-bank",
    labelKey: "nav.questionBank",
    icon: Icons.Menu,
    roles: ["assessor"],
  },
  {
    href: "/blueprints",
    labelKey: "nav.blueprints",
    icon: Icons.Dashboard,
    roles: ["assessor"],
  },
  {
    href: "/quizzes",
    labelKey: "nav.quizzes",
    icon: Icons.Calendar,
    roles: ["assessor"],
  },
  {
    href: "/catalog",
    labelKey: "nav.catalog",
    icon: Icons.Search,
    roles: ["candidate"],
  },
  {
    href: "/join-assessment",
    labelKey: "nav.joinAssessment",
    icon: Icons.Info,
    roles: ["candidate"],
  },
  {
    href: "/my-assessments",
    labelKey: "nav.myAssessments",
    icon: Icons.Check,
    roles: ["candidate"],
  },
  {
    href: "/certificates",
    labelKey: "nav.certificates",
    icon: Icons.Calendar,
    roles: ["candidate"],
  },
  {
    href: "/payments",
    labelKey: "nav.payments",
    icon: Icons.Dashboard,
    roles: ["candidate"],
  },
  {
    href: "/wallet",
    labelKey: "nav.wallet",
    icon: Icons.Shield,
    roles: ["candidate"],
  },
  {
    href: "/groups",
    labelKey: "nav.groups",
    icon: Icons.User,
    roles: ["candidate"],
  },
  {
    href: "/notifications",
    labelKey: "nav.notifications",
    icon: Icons.Warning,
    roles: ["candidate"],
  },
  {
    href: "/support",
    labelKey: "nav.support",
    icon: Icons.Info,
    roles: ["candidate"],
  },
  {
    href: "/results",
    labelKey: "nav.results",
    icon: Icons.Calendar,
    roles: ["organisation_admin", "assessor", "reviewer_hr"],
  },
  {
    href: "/profile",
    labelKey: "nav.profile",
    icon: Icons.User,
    roles: [
      "super_admin",
      "organisation_admin",
      "assessor",
      "candidate",
      "reviewer_hr",
    ],
  },
  {
    href: "/settings",
    labelKey: "nav.settings",
    icon: Icons.Settings,
    roles: [
      "super_admin",
      "organisation_admin",
      "assessor",
      "candidate",
      "reviewer_hr",
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  return (
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [cartSummary, setCartSummary] = useState({ count: 0, total: 0 });
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as PortalUser | null;
  const currentRole = user?.role || "assessor";
  const visibleItems = navItems.filter((item) =>
    item.roles.includes(currentRole),
  );

  useEffect(() => {
    setMobileNavOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncCart = () => {
      const items = readCatalogCart();
      setCartSummary({
        count: items.length,
        total: items.reduce((sum, item) => sum + item.price, 0),
      });
    };

    syncCart();
    window.addEventListener(CATALOG_CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CATALOG_CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const openDemoDialog = () => {
    showDialog({
      title: t("shell.demoDialogTitle"),
      description: t("shell.demoDialogDescription"),
      confirmLabel: t("common.confirm"),
      cancelLabel: t("common.cancel"),
      onConfirm: () => showToast(t("shell.demoDialogConfirmed"), "success"),
    });
  };

  const handleLogout = () => {
    clearMockSession();
    setAccessToken(null);
    dispatch(logout());
    showToast("Системээс гарлаа.", "success");
    router.push("/login");
  };

  const sidebarLinks = (
    <nav className="flex flex-col gap-2">
      <div className="px-4 pb-4">
        <Text className="font-semibold">{user?.organisation || "seek.mn"}</Text>
        <div className="mt-2">
          <Badge>{user?.roleLabel || "Assessor"}</Badge>
        </div>
      </div>
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-seek-md font-sans text-sm font-medium ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-surface-hover"
            }`}
          >
            <Icon size={18} />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <AppShell
      headerLogo={
        <div className="flex items-center gap-3">
          <IconButton
            ariaLabel="Open navigation"
            className="md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Icons.Menu size={20} />
          </IconButton>
          <span className="font-sans font-bold text-lg text-primary">
            {t("app.name")}
          </span>
        </div>
      }
      headerActions={
        <div className="flex items-center gap-2">
          {currentRole === "candidate" && (
            <Link
              href="/catalog"
              className="relative inline-flex min-h-10 items-center gap-2 rounded-seek-md border border-border bg-surface px-seek-3 py-seek-2 text-sm font-semibold text-foreground hover:bg-surface-hover"
              aria-label="Сагс харах"
            >
              <span>Сагс</span>
              <Badge variant={cartSummary.count > 0 ? "primary" : "secondary"}>
                {cartSummary.count}
              </Badge>
              {cartSummary.total > 0 && (
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {cartSummary.total.toLocaleString()}₮
                </span>
              )}
            </Link>
          )}
          <Select
            aria-label={t("common.language")}
            className="w-20 text-sm"
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
            options={locales.map((item) => ({
              value: item,
              label: item.toUpperCase(),
            }))}
          />
          <Select
            aria-label={t("common.theme")}
            className="hidden sm:block w-28 text-sm"
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
            options={[
              { value: "system", label: t("common.theme.system") },
              { value: "light", label: t("common.theme.light") },
              { value: "dark", label: t("common.theme.dark") },
            ]}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hidden lg:inline-flex"
            onClick={openDemoDialog}
          >
            {t("common.demoModal")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="hidden lg:inline-flex"
            onClick={() => showToast(t("shell.demoNotification"), "info")}
          >
            {t("common.demoToast")}
          </Button>
          <div className="relative">
            <button
              type="button"
              className="flex min-h-10 items-center gap-3 rounded-seek-md border border-border bg-surface px-seek-3 py-seek-2 text-left hover:bg-surface-hover"
              onClick={() => setProfileMenuOpen((current) => !current)}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 font-sans text-sm font-bold text-primary">
                {(user?.name || user?.email || "U").slice(0, 1)}
              </span>
              <span className="hidden xl:block">
                <Text className="font-medium">{user?.name || user?.email}</Text>
                <Text variant="muted" className="text-xs">
                  {user?.roleLabel || user?.email}
                </Text>
              </span>
              <Icons.ChevronRight
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  profileMenuOpen ? "rotate-90" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-dropdown w-64 overflow-hidden rounded-seek-lg border border-border bg-surface shadow-seek-lg">
                <div className="border-b border-border px-seek-4 py-seek-3">
                  <Text className="font-semibold">
                    {user?.name || "Хэрэглэгч"}
                  </Text>
                  <Text variant="muted" className="text-xs">
                    {user?.email || user?.roleLabel}
                  </Text>
                </div>
                <div className="p-seek-2">
                  <ProfileMenuLink href="/profile" label="Миний профайл" />
                  <ProfileMenuLink href="/settings" label="Тохиргоо" />
                  {currentRole === "candidate" && (
                    <>
                      <ProfileMenuLink href="/wallet" label="Хэтэвч" />
                      <ProfileMenuLink
                        href="/certificates"
                        label="Сертификат"
                      />
                    </>
                  )}
                  <button
                    type="button"
                    className="mt-seek-2 flex w-full items-center justify-between rounded-seek-md px-seek-3 py-seek-2 text-left text-sm font-semibold text-danger hover:bg-danger-background"
                    onClick={handleLogout}
                  >
                    Системээс гарах
                    <Icons.LogOut className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      sidebarContent={sidebarLinks}
    >
      {mobileNavOpen && (
        <div className="fixed inset-0 z-modal md:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative h-full w-[min(20rem,85vw)] bg-surface border-r border-border p-seek-4 shadow-seek-lg">
            <div className="flex items-center justify-between pb-4">
              <Text className="font-bold">{t("app.name")}</Text>
              <IconButton
                ariaLabel="Close navigation"
                onClick={() => setMobileNavOpen(false)}
              >
                <Icons.Close size={20} />
              </IconButton>
            </div>
            {sidebarLinks}
            <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
              <Button type="button" variant="outline" onClick={openDemoDialog}>
                {t("common.demoModal")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => showToast(t("shell.demoNotification"), "info")}
              >
                {t("common.demoToast")}
              </Button>
            </div>
          </aside>
        </div>
      )}
      {children}
    </AppShell>
  );
}

function ProfileMenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-seek-md px-seek-3 py-seek-2 text-sm font-medium text-foreground hover:bg-surface-hover"
    >
      {label}
      <Icons.ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
