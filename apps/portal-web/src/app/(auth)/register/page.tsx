"use client";

import Link from "next/link";
import { Card, Heading, Stack, Text } from "@seek/ui";
import { useI18n } from "@/i18n/use-t";

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-seek-4 sm:p-seek-6">
      <Card className="w-full max-w-lg shadow-seek-lg">
        <Stack gap={5}>
          <Stack gap={2} className="text-center">
            <Heading level={1} className="text-2xl font-bold">
              {t("register.title")}
            </Heading>
            <Text variant="muted">{t("register.subtitle")}</Text>
          </Stack>
          <Text>{t("register.description")}</Text>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-seek-md bg-primary px-seek-4 py-seek-2 font-sans font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {t("register.backToLogin")}
          </Link>
        </Stack>
      </Card>
    </div>
  );
}
