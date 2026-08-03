"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "@seek/ui";
import { useI18n } from "@/i18n/use-t";
import {
  registerAccount,
  resendVerificationEmail,
} from "@/lib/auth-client";

export default function RegisterPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !phoneNumber) {
      setErrorMsg(t("register.requiredFields" as any) || "Бүх талбарыг бөглөнө үү.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(t("register.passwordMismatch" as any) || "Нууц үг зөрүүтэй байна.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg(t("register.passwordLength" as any) || "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await registerAccount(email, password);
      setSubmittedEmail(email.trim().toLowerCase());
    } catch (err: any) {
      setErrorMsg(err.message || "Бүртгэл амжилтгүй боллоо.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;

    setResending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await resendVerificationEmail(submittedEmail);
      setSuccessMsg(t("register.resendSuccess" as any));
    } catch (err: any) {
      setErrorMsg(err.message || t("register.resendFailed" as any));
    } finally {
      setResending(false);
    }
  };

  if (submittedEmail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-seek-4 sm:p-seek-6">
        <Card className="w-full max-w-lg shadow-seek-lg">
          <Stack gap={6}>
            <Stack gap={2} className="text-center">
              <Heading level={1} className="text-2xl font-bold">
                {t("register.confirmTitle" as any)}
              </Heading>
              <Text variant="muted">
                {t("register.confirmDescription" as any)}
              </Text>
              <Text className="font-medium">{submittedEmail}</Text>
            </Stack>

            {errorMsg && (
              <Alert type="danger" title={t("login.errorTitle")}>
                {errorMsg}
              </Alert>
            )}

            {successMsg && (
              <Alert type="success" title="OK">
                {successMsg}
              </Alert>
            )}

            <Stack gap={3}>
              <Button
                type="button"
                variant="primary"
                className="w-full"
                disabled={resending}
                onClick={handleResend}
              >
                {resending ? t("login.loading") : t("register.resend" as any)}
              </Button>
              <Link
                href="/login"
                className="text-center text-sm font-medium text-primary hover:underline"
              >
                {t("register.backToLogin")}
              </Link>
            </Stack>
          </Stack>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-seek-4 sm:p-seek-6">
      <Card className="w-full max-w-lg shadow-seek-lg">
        <form onSubmit={handleRegister}>
          <Stack gap={6}>
            <Stack gap={2} className="text-center">
              <Heading level={1} className="text-2xl font-bold">
                {t("register.title") || "Бүртгүүлэх"}
              </Heading>
              <Text variant="muted">
                {t("register.subtitle") || "Шинэ хэрэглэгчийн бүртгэл үүсгэх"}
              </Text>
            </Stack>

            {errorMsg && (
              <Alert type="danger" title="Алдаа">
                {errorMsg}
              </Alert>
            )}

            {successMsg && (
              <Alert type="success" title="Амжилттай">
                {successMsg}
              </Alert>
            )}

            <Stack gap={4}>
              <FieldWrapper id="reg-name" label="Бүтэн нэр">
                <Input
                  type="text"
                  placeholder="Бат-Эрдэнэ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FieldWrapper>

              <FieldWrapper id="reg-email" label="Имэйл хаяг" required>
                <Input
                  type="email"
                  placeholder="example@seek.mn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FieldWrapper>

              <FieldWrapper id="reg-phone" label="Утасны дугаар" required>
                <Input
                  type="tel"
                  placeholder="99112233"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </FieldWrapper>

              <FieldWrapper id="reg-password" label="Нууц үг" required>
                <PasswordInput
                  placeholder="Нэвтрэх нууц үг"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FieldWrapper>

              <FieldWrapper id="reg-confirm-password" label="Нууц үг давтах" required>
                <PasswordInput
                  placeholder="Нууц үгээ дахин оруулна уу"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FieldWrapper>

                <Button
                type="submit"
                variant="primary"
                className="w-full mt-seek-2"
                disabled={loading}
              >
                {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
              </Button>

              <div className="text-center text-sm">
                <Text variant="muted">
                  Акаунттай юу?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Нэвтрэх хэсэг рүү очих
                  </Link>
                </Text>
              </div>
            </Stack>
          </Stack>
        </form>
      </Card>
    </div>
  );
}
