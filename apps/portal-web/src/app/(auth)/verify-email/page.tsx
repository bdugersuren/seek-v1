"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Card, Heading, Stack, Text } from "@seek/ui";
import { useI18n } from "@/i18n/use-t";
import { verifyEmailToken } from "@/lib/auth-client";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!token) {
        setState("error");
        setMessage(t("verify.missingToken" as any));
        return;
      }

      try {
        await verifyEmailToken(token);
        if (!cancelled) {
          setState("success");
        }
      } catch (err: any) {
        if (!cancelled) {
          setState("error");
          setMessage(err.message || t("verify.errorDescription" as any));
        }
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [token, t]);

  const isSuccess = state === "success";
  const isLoading = state === "loading";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-seek-4 sm:p-seek-6">
      <Card className="w-full max-w-lg shadow-seek-lg">
        <Stack gap={6}>
          <Stack gap={2} className="text-center">
            <Heading level={1} className="text-2xl font-bold">
              {isLoading
                ? t("verify.title" as any)
                : isSuccess
                  ? t("verify.successTitle" as any)
                  : t("verify.errorTitle" as any)}
            </Heading>
            <Text variant="muted">
              {isLoading
                ? t("verify.loading" as any)
                : isSuccess
                  ? t("verify.successDescription" as any)
                  : t("verify.errorDescription" as any)}
            </Text>
          </Stack>

          {!isLoading && (
            <Alert type={isSuccess ? "success" : "danger"} title={isSuccess ? "OK" : t("login.errorTitle")}>
              {isSuccess
                ? t("verify.successDescription" as any)
                : message || t("verify.errorDescription" as any)}
            </Alert>
          )}

          <Stack gap={3}>
            <Link href="/login">
              <Button type="button" variant="primary" className="w-full">
                {t("register.backToLogin")}
              </Button>
            </Link>
            {!isSuccess && !isLoading && (
              <Link
                href="/register"
                className="text-center text-sm font-medium text-primary hover:underline"
              >
                {t("login.registerLink")}
              </Link>
            )}
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}
