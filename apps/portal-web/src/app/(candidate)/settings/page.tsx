"use client";

import React from "react";
import {
  Button,
  Card,
  Heading,
  PageContainer,
  PageTitle,
  Select,
  Stack,
  Switch,
  Text,
  useTheme,
  useToast,
} from "@seek/ui";
import { useI18n } from "@/i18n/use-t";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useI18n();
  const { showToast } = useToast();

  return (
    <PageContainer>
      <PageTitle
        title="Тохиргоо"
        subtitle="Хэл, theme, notification болон application preference тохируулна."
      />

      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-2">
        <Card>
          <Stack gap={5}>
            <Stack gap={2}>
              <Heading level={3}>Хэл ба харагдац</Heading>
              <Text variant="muted">
                Profile identity биш, application preference энд хадгалагдана.
              </Text>
            </Stack>

            <div className="grid grid-cols-1 gap-seek-4 sm:grid-cols-2">
              <label className="space-y-seek-2">
                <span className="font-sans text-sm font-medium text-foreground">
                  Хэл
                </span>
                <Select
                  value={locale}
                  options={[
                    { value: "mn", label: "Монгол" },
                    { value: "en", label: "English" },
                  ]}
                  onChange={(event) => {
                    setLocale(event.target.value as "mn" | "en");
                    showToast("Хэлний тохиргоо хадгалагдлаа.", "success");
                  }}
                />
              </label>

              <label className="space-y-seek-2">
                <span className="font-sans text-sm font-medium text-foreground">
                  Theme
                </span>
                <Select
                  value={theme}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System" },
                  ]}
                  onChange={(event) => {
                    setTheme(event.target.value as "light" | "dark" | "system");
                    showToast("Theme тохиргоо хадгалагдлаа.", "success");
                  }}
                />
              </label>
            </div>
          </Stack>
        </Card>

        <Card>
          <Stack gap={5}>
            <Stack gap={2}>
              <Heading level={3}>Notification preference</Heading>
              <Text variant="muted">
                Assessment invite, verification, security event зэрэг мэдэгдлийн
                сувгийг тохируулна.
              </Text>
            </Stack>

            <PreferenceToggle label="Имэйл мэдэгдэл" defaultChecked />
            <PreferenceToggle label="Browser notification" />
            <PreferenceToggle
              label="Security alert заавал авах"
              defaultChecked
            />

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                showToast("Notification preference хадгалагдлаа.", "success")
              }
            >
              Preference хадгалах
            </Button>
          </Stack>
        </Card>

        <Card className="xl:col-span-2">
          <div className="grid grid-cols-1 gap-seek-5 md:grid-cols-3">
            <SettingSummary
              title="Profile"
              description="Хувийн мэдээлэл, харьяалал, бичиг баримтыг /profile дээр удирдана."
            />
            <SettingSummary
              title="Session"
              description="Active session болон MFA тохиргоог profile security tab дээр харуулна."
            />
            <SettingSummary
              title="Data export"
              description="Backend phase дээр privacy/data export workflow эндээс эхэлнэ."
            />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

function PreferenceToggle({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-seek-4 rounded-seek-md border border-border px-seek-4 py-seek-3">
      <Text>{label}</Text>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function SettingSummary({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-seek-md border border-border bg-muted-background p-seek-4">
      <p className="font-sans text-base font-bold text-foreground">{title}</p>
      <Text variant="muted" className="mt-seek-2 text-sm">
        {description}
      </Text>
    </div>
  );
}
