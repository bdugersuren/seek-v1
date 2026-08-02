"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Heading, Input, Stack, Text, Button, FieldWrapper, Alert } from "@seek/ui";
import { useI18n } from "@/i18n/use-t";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setErrorMsg("Имэйл эсвэл Утасны дугаараа оруулна үү.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Gateway-ийн /api/v1/auth/forgot-password руу илгээнэ.
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: emailOrPhone }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Хүсэлт амжилтгүй боллоо.");
      }

      setSuccessMsg("Баталгаажуулах код амжилттай илгээгдлээ!");
      setTimeout(() => {
        // Баталгаажуулах код оруулах хуудас руу шилжих
        router.push(`/reset-password?identity=${encodeURIComponent(emailOrPhone)}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-seek-4 sm:p-seek-6">
      <Card className="w-full max-w-lg shadow-seek-lg">
        <form onSubmit={handleRequestOtp}>
          <Stack gap={5}>
            <Stack gap={2} className="text-center">
              <Heading level={1} className="text-2xl font-bold">
                {t("forgot.title") || "Нууц үг сэргээх"}
              </Heading>
              <Text variant="muted">
                {t("forgot.subtitle") || "Бүртгэлтэй имэйл эсвэл утасны дугаараа оруулна уу"}
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

            <FieldWrapper id="forgot-identity" label="Имэйл эсвэл Утасны дугаар" required>
              <Input
                type="text"
                placeholder="name@example.com эсвэл 99xxxxxx"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </FieldWrapper>

            <Text variant="muted" className="text-sm">
              Таны оруулсан хаяг руу нууц үг шинэчлэх түр код илгээгдэх болно.
            </Text>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Илгээж байна..." : "Код илгээх"}
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="font-medium text-primary hover:underline">
                {t("forgot.backToLogin") || "Нэвтрэх хэсэг рүү буцах"}
              </Link>
            </div>
          </Stack>
        </form>
      </Card>
    </div>
  );
}
