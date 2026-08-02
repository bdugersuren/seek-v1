"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Heading, Input, Stack, Text, Button, FieldWrapper, PasswordInput, Alert } from "@seek/ui";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identity, setIdentity] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const identityParam = searchParams.get("identity");
    if (identityParam) {
      setIdentity(identityParam);
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !token || !password || !confirmPassword) {
      setErrorMsg("Бүх талбарыг бөглөнө үү.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Нууц үг зөрүүтэй байна.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Gateway-ийн /api/v1/auth/reset-password руу илгээнэ.
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity,
          token,
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Нууц үг шинэчлэхэд алдаа гарлаа.");
      }

      setSuccessMsg("Нууц үг амжилттай шинэчлэгдлээ! Нэвтрэх хуудас руу шилжиж байна...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Нууц үг шинэчлэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <Stack gap={5}>
        <Stack gap={2} className="text-center">
          <Heading level={1} className="text-2xl font-bold">
            Шинэ нууц үг тохируулах
          </Heading>
          <Text variant="muted">
            Таны хүлээн авсан код болон шинэ нууц үгээ тохируулна уу
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

        <FieldWrapper id="reset-identity" label="Имэйл эсвэл Утасны дугаар" required>
          <Input
            type="text"
            placeholder="name@example.com эсвэл 99xxxxxx"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper id="reset-token" label="Баталгаажуулах код (OTP)" required>
          <Input
            type="text"
            placeholder="Ирсэн кодыг оруулна уу"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper id="reset-password" label="Шинэ нууц үг" required>
          <PasswordInput
            placeholder="Шинэ нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper id="reset-confirm-password" label="Шинэ нууц үг давтах" required>
          <PasswordInput
            placeholder="Шинэ нууц үгээ дахин оруулна уу"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FieldWrapper>

        <Button type="submit" variant="primary" className="w-full mt-seek-2" disabled={loading}>
          {loading ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}
        </Button>

        <div className="text-center text-sm">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Нэвтрэх хэсэг рүү буцах
          </Link>
        </div>
      </Stack>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-seek-4 sm:p-seek-6">
      <Card className="w-full max-w-lg shadow-seek-lg">
        <Suspense fallback={<div>Ачаалж байна...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}
