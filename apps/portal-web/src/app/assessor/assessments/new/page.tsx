"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Card,
  FieldWrapper,
  Heading,
  Input,
  PageContainer,
  PageTitle,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@seek/ui";
import { validateAssessmentDraft } from "@/features/assessments/api";
import type { AssessmentDraftInput } from "@/features/assessments/types";

export default function NewAssessmentPage() {
  const { showToast } = useToast();
  const [draft, setDraft] = useState<AssessmentDraftInput>({
    title: "Demo assessment",
    description: "Markdown болон KaTeX preview-тэй assessment draft.",
    durationMinutes: 60,
    questionCount: 20,
  });
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateAssessmentDraft(draft), [draft]);
  const hasErrors = Object.keys(errors).length > 0;

  const saveDraft = () => {
    setSubmitted(true);
    if (hasErrors) {
      showToast("Draft validation алдаатай байна.", "warning");
      return;
    }

    showToast("Assessment draft хадгалагдлаа.", "success");
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle
          title="Шинэ assessment"
          subtitle="Basic info, question count, duration болон content preview тохируулах wizard."
        />
        <Badge variant="secondary">Step 1 / 3</Badge>
      </div>

      <section className="grid grid-cols-1 gap-seek-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <Stack gap={5}>
            {submitted && hasErrors && (
              <Alert type="danger" title="Validation">
                Assessment draft дээр бөглөх шаардлагатай талбар байна.
              </Alert>
            )}
            <FieldWrapper id="assessment-title" label="Гарчиг" required>
              <Input
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                error={submitted && Boolean(errors.title)}
              />
            </FieldWrapper>
            <FieldWrapper id="assessment-description" label="Тайлбар" required>
              <Textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                error={submitted && Boolean(errors.description)}
              />
            </FieldWrapper>
            <div className="grid grid-cols-1 gap-seek-4 md:grid-cols-2">
              <FieldWrapper id="assessment-duration" label="Хугацаа / минут">
                <Input
                  type="number"
                  value={draft.durationMinutes}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      durationMinutes: Number(event.target.value),
                    }))
                  }
                  error={submitted && Boolean(errors.durationMinutes)}
                />
              </FieldWrapper>
              <FieldWrapper id="assessment-questions" label="Асуултын тоо">
                <Input
                  type="number"
                  value={draft.questionCount}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      questionCount: Number(event.target.value),
                    }))
                  }
                  error={submitted && Boolean(errors.questionCount)}
                />
              </FieldWrapper>
            </div>
            <div className="flex flex-col gap-seek-3 sm:flex-row">
              <Button type="button" onClick={saveDraft}>
                Draft хадгалах
              </Button>
              <Link
                href="/assessments"
                className="inline-flex items-center justify-center rounded-seek-md border border-border bg-surface px-seek-4 py-seek-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Буцах
              </Link>
            </div>
          </Stack>
        </Card>

        <Card>
          <Stack gap={5}>
            <Heading level={2} className="text-xl">
              Preview
            </Heading>
            <div className="rounded-seek-md border border-border bg-muted-background p-seek-4">
              <Stack gap={3}>
                <Heading level={3} className="text-lg">
                  {draft.title || "Assessment title"}
                </Heading>
                <Text variant="muted">{draft.description}</Text>
                <Text className="font-mono text-sm">
                  Example math: $score = correct / total * 100$
                </Text>
              </Stack>
            </div>
            <Text variant="muted" className="text-sm">
              Markdown/KaTeX renderer дараагийн content rendering task дээр
              бодитоор холбогдоно.
            </Text>
          </Stack>
        </Card>
      </section>
    </PageContainer>
  );
}
