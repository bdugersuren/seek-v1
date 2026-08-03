"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Icons, Input, PageContainer, Text, useToast } from "@seek/ui";
import {
  getCandidateProfile,
  updateCandidateProfile,
} from "@/features/profile/api";

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [country, setCountry] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const redirectTo = useMemo(() => {
    const value = searchParams.get("redirect");
    return value?.startsWith("/") ? value : "/catalog";
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    getCandidateProfile()
      .then((profile) => {
        if (!mounted) return;
        setDisplayName(profile.displayName || "");
        setPhoneNumber(profile.phoneNumber || "");
        setOrganisation(profile.organisation || "");
        setCountry(profile.country || "Монгол");
        setPreferredLanguage(profile.preferredLanguage || "mn");
      })
      .catch(() => {
        showToast("Профайл мэдээлэл уншихад алдаа гарлаа.", "danger");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [showToast]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const profile = await updateCandidateProfile({
        displayName,
        phoneNumber,
        organisation,
        country,
        preferredLanguage,
      });

      if (!profile.isComplete) {
        showToast("Шаардлагатай талбаруудыг бүрэн бөглөнө үү.", "warning");
        setSaving(false);
        return;
      }

      showToast("Профайл мэдээлэл хадгалагдлаа.", "success");
      router.push(redirectTo);
    } catch {
      showToast("Профайл хадгалахад алдаа гарлаа. Дахин оролдоно уу.", "danger");
      setSaving(false);
    }
  };

  return (
    <PageContainer className="max-w-3xl py-seek-8">
      <div className="mb-seek-6">
        <div className="mb-seek-3 inline-flex h-11 w-11 items-center justify-center rounded-seek-md bg-primary/10 text-primary">
          <Icons.User className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="font-sans text-3xl font-bold text-foreground">
          Профайл мэдээлэл
        </h1>
        <Text variant="muted" className="mt-seek-2">
          Үнэлгээнд орохын өмнө үндсэн мэдээллээ баталгаажуулна.
        </Text>
      </div>

      <form
        className="space-y-seek-5 rounded-seek-md border border-border bg-surface p-seek-5"
        onSubmit={handleSubmit}
      >
        <Field label="Овог нэр" required>
          <Input
            value={displayName}
            disabled={loading || saving}
            required
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </Field>

        <Field label="Утасны дугаар" required>
          <Input
            value={phoneNumber}
            disabled={loading || saving}
            required
            inputMode="tel"
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </Field>

        <Field label="Улс" required>
          <Input
            value={country}
            disabled={loading || saving}
            required
            onChange={(event) => setCountry(event.target.value)}
          />
        </Field>

        <Field label="Сонгох хэл" required>
          <select
            value={preferredLanguage}
            disabled={loading || saving}
            required
            className="flex h-10 w-full rounded-seek-md border border-input border-border bg-surface px-seek-3 py-seek-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(event) => setPreferredLanguage(event.target.value)}
          >
            <option value="mn">Монгол хэл</option>
            <option value="en">English</option>
          </select>
        </Field>

        <Field label="Байгууллага / сургууль">
          <Input
            value={organisation}
            disabled={loading || saving}
            onChange={(event) => setOrganisation(event.target.value)}
          />
        </Field>

        <div className="flex flex-col-reverse gap-seek-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => router.push(redirectTo)}
          >
            Дараа бөглөх
          </Button>
          <Button type="submit" disabled={loading || saving}>
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-seek-2">
      <span className="text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
