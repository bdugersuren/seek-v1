"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { setAccessToken } from "@/lib/auth-client";
import {
  enrichUserWithMockRole,
  findMockUser,
  mockCredentials,
  mockUserEmails,
  backendDemoAccount,
  saveMockSession,
} from "@/features/auth/mock-users";
import {
  Card,
  Stack,
  Heading,
  Text,
  FieldWrapper,
  Input,
  PasswordInput,
  Button,
  Alert,
  Select,
  Badge,
  Divider,
} from "@seek/ui";
import { locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/use-t";
import {
  loginWithPassword,
  resendVerificationEmail,
} from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { locale, setLocale, t } = useI18n();
  const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "false";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [canResendVerification, setCanResendVerification] = useState(false);

  const fillCredentials = (
    nextEmail: string,
    nextPassword: string,
    roleLabel: string,
  ) => {
    setEmail(nextEmail);
    setPassword(nextPassword);
    setSelectedRole(roleLabel);
    setErrorMsg(null);
    setResendMsg(null);
    setCanResendVerification(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(t("login.required"));
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setResendMsg(null);
    setCanResendVerification(false);

    try {

      if (enableMock) {
        const mockUser = findMockUser(email, password);

        if (mockUser) {
          setAccessToken(null);
          saveMockSession(mockUser);
          dispatch(loginSuccess(mockUser));
          router.push(mockUser.homePath);
          return;
        }

        if (mockUserEmails.includes(email.trim().toLowerCase())) {
          throw new Error(t("login.mockPasswordWrong"));
        }
      }

      const data = await loginWithPassword(email, password);
      const portalUser = enrichUserWithMockRole(data.user);
      setAccessToken(data.accessToken);
      dispatch(loginSuccess(portalUser));

      router.push(portalUser.homePath);
    } catch (err: any) {
      const message = err.message || t("login.failed");
      setErrorMsg(message);
      setCanResendVerification(
        !enableMock &&
          email.includes("@") &&
          (message.includes("баталгаажуул") ||
            message.toLowerCase().includes("verify")),
      );
      dispatch(loginFailure(err.message || "Error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;

    setResending(true);
    setResendMsg(null);

    try {
      await resendVerificationEmail(email);
      setResendMsg(t("login.resendSuccess" as any));
    } catch (err: any) {
      setErrorMsg(err.message || t("login.resendFailed" as any));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-seek-4 sm:p-seek-6">
      <div className="absolute right-seek-6 top-seek-6 w-24">
        <Select
          aria-label={t("common.language")}
          value={locale}
          onChange={(event) => setLocale(event.target.value as Locale)}
          options={locales.map((item) => ({
            value: item,
            label: item.toUpperCase(),
          }))}
        />
      </div>
      <div className={`grid w-full gap-seek-4 ${enableMock ? "max-w-5xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_24rem]" : "max-w-md grid-cols-1"}`}>
        <Card className="w-full shadow-seek-lg">
          <form onSubmit={handleLogin}>
            <Stack gap={6}>
              <Stack gap={2} className="text-center">
                <Heading level={1} className="text-2xl font-bold">
                  {t("login.title")}
                </Heading>
                <Text variant="muted">{t("login.subtitle")}</Text>
              </Stack>

              {selectedRole && (
                <div className="rounded-seek-md border border-border bg-muted-background px-seek-4 py-seek-3">
                  <Text className="text-sm font-medium">
                    {t("login.selectedRole")}
                  </Text>
                  <Text variant="muted" className="text-sm">
                    {selectedRole}
                  </Text>
                </div>
              )}

              {errorMsg && (
                <Alert type="danger" title="Алдаа">
                  {errorMsg}
                </Alert>
              )}

              {resendMsg && (
                <Alert type="success" title="OK">
                  {resendMsg}
                </Alert>
              )}

              <Stack gap={4}>
                <FieldWrapper
                  id="login-email"
                  label={t("login.email")}
                  required
                >
                  <Input
                    type="email"
                    placeholder="example@seek.mn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FieldWrapper>
                <FieldWrapper
                  id="login-password"
                  label={t("login.password")}
                  required
                >
                  <PasswordInput
                    placeholder={t("login.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FieldWrapper>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-seek-2"
                  disabled={loading}
                >
                  {loading ? t("login.loading") : t("login.submit")}
                </Button>
                {canResendVerification && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={resending}
                    onClick={handleResendVerification}
                  >
                    {resending
                      ? t("login.loading")
                      : t("login.resendVerification" as any)}
                  </Button>
                )}
                <Text variant="muted" className="text-xs">
                  {t("login.prototypeHint")}
                </Text>
                <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <Text variant="muted">
                    {t("login.noAccount")}{" "}
                    <Link
                      href="/register"
                      className="font-medium text-primary hover:underline"
                    >
                      {t("login.registerLink")}
                    </Link>
                  </Text>
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary hover:underline"
                  >
                    {t("login.forgotPasswordLink")}
                  </Link>
                </div>
              </Stack>
            </Stack>
          </form>
        </Card>

        {enableMock && (
          <Card className="w-full shadow-seek-md">
            <Stack gap={4}>
              <Stack gap={1}>
                <Heading level={2} className="text-xl">
                  {t("login.rolePanelTitle")}
                </Heading>
                <Text variant="muted" className="text-sm">
                  {t("login.rolePanelSubtitle")}
                </Text>
              </Stack>
              <Divider />
              <Stack gap={3}>
                {mockCredentials.map((credential) => (
                  <button
                    key={credential.user.email}
                    type="button"
                    className="rounded-seek-md border border-border bg-surface px-seek-3 py-seek-3 text-left transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() =>
                      fillCredentials(
                        credential.user.email,
                        credential.password,
                        credential.user.roleLabel,
                      )
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Text className="font-medium">
                          {credential.user.roleLabel}
                        </Text>
                        <Text variant="muted" className="text-xs">
                          {credential.user.email}
                        </Text>
                      </div>
                      <Badge>{credential.user.homePath}</Badge>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  className="rounded-seek-md border border-border bg-surface px-seek-3 py-seek-3 text-left transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() =>
                    fillCredentials(
                      backendDemoAccount.email,
                      backendDemoAccount.password,
                      backendDemoAccount.roleLabel,
                    )
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Text className="font-medium">
                        {t("login.backendAccount")}
                      </Text>
                      <Text variant="muted" className="text-xs">
                        {backendDemoAccount.email}
                      </Text>
                    </div>
                    <Badge>{backendDemoAccount.homePath}</Badge>
                  </div>
                </button>
              </Stack>
            </Stack>
          </Card>
        )}
      </div>
    </div>
  );
}
