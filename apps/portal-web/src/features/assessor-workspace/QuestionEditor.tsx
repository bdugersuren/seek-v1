"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Icons,
  Input,
  PageTitle,
  Select,
  Text,
  Textarea,
  useToast,
} from "@seek/ui";
import { QuestionPreviewModal } from "./QuestionPreviewModal";
import { QuestionRichEditor } from "./editor/QuestionRichEditor";
import {
  bloomLabels,
  competencyLabels,
  difficultyLabels,
  questionTypeLabels,
} from "./mock-data";
import type { QuestionBankItem, QuestionOption, QuestionType } from "./types";

export function QuestionEditor({ mode = "edit" }: { mode?: "new" | "edit" }) {
  const { showToast } = useToast();
  const defaultQuestionContent =
    mode === "edit"
      ? "Дараах илэрхийллийг хялбарчил: $\\frac{x-1}{x^2-1}=?$\n\n|№|Асуулт|\n|---|---|\n|1|Хуваарийг үржигдэхүүн болгон задла.|\n|2|Ижил үржигдэхүүнийг хураа.|"
      : "";
  const [questionMarkdown, setQuestionMarkdown] = useState(
    "Дараах илэрхийллийг хялбарчил: $\\frac{x-1}{x^2-1}=?$\n\n|№|Асуулт|\n|---|---|\n|1|Хуваарийг үржигдэхүүн болгон задла.|\n|2|Ижил үржигдэхүүнийг хураа.|",
  );
  const [feedbackMarkdown, setFeedbackMarkdown] = useState(
    "$x^2-1=(x-1)(x+1)$ тул $x-1$ хураагдаж $\\frac{1}{x+1}$ үлдэнэ.",
  );
  const [optionsMarkdown, setOptionsMarkdown] = useState([
    "$\\frac{1}{x+1}$",
    "$\\frac{1}{x-1}$",
    "$x-1$",
    "$x+1$",
  ]);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionBankItem | null>(null);
  const [selectedType, setSelectedType] = useState<QuestionType>("multiple_choice");

  const openPreview = () => {
    setPreviewQuestion(
      buildPreviewQuestion({
        stem: questionMarkdown,
        feedback: feedbackMarkdown,
        options: optionsMarkdown,
        type: selectedType,
      }),
    );
  };

  return (
    <div className="space-y-seek-4">
      <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
        <PageTitle
          title={mode === "new" ? "Даалгавар үүсгэх" : "Даалгавар засах"}
          subtitle="Rich editor, metadata, answer key, scoring болон workflow comment нэг дэлгэц дээр."
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openPreview}
          >
            Урьдчилан харах
          </Button>
          <Link href="/question-bank">
            <Button type="button" variant="secondary">
              Хаах
            </Button>
          </Link>
          <Button
            type="button"
            onClick={() => showToast("Ноорог хадгалагдлаа.", "success")}
          >
            Хадгалах
          </Button>
        </div>
      </div>

      <div className="question-editor-shell">
        <aside className="question-editor-sidebar">
          <Card className="p-seek-4">
            <div className="mb-seek-3 flex items-center justify-between">
              <div>
                <Text className="font-semibold">Сэдвийн сан</Text>
                <Text variant="muted" className="text-xs">
                  Даалгаврын ангиллыг сонгоно
                </Text>
              </div>
              <Badge variant="secondary">5</Badge>
            </div>
            <TopicPicker />
          </Card>

          <Card className="p-seek-4">
            <Text className="mb-seek-3 font-semibold">Metadata</Text>
            <div className="space-y-seek-3">
              <FieldLabel label="Хүндрэлийн түвшин">
                <Select
                  defaultValue="medium"
                  options={Object.entries(difficultyLabels).map(
                    ([value, label]) => ({ value, label }),
                  )}
                />
              </FieldLabel>
              <FieldLabel label="Bloom-ийн түвшин">
                <Select
                  defaultValue="apply"
                  options={Object.entries(bloomLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </FieldLabel>
              <FieldLabel label="Чадамжийн төрөл">
                <Select
                  defaultValue="knowledge"
                  options={Object.entries(competencyLabels).map(
                    ([value, label]) => ({ value, label }),
                  )}
                />
              </FieldLabel>
              <FieldLabel label="Төлөв">
                <Select
                  defaultValue="draft"
                  options={[
                    { value: "draft", label: "Ноорог" },
                    { value: "approval_requested", label: "Батлуулах хүсэлт" },
                    { value: "approved", label: "Батлагдсан" },
                    { value: "published", label: "Нийтлэгдсэн" },
                  ]}
                />
              </FieldLabel>
            </div>
          </Card>

          <Card className="p-seek-4">
            <Text className="mb-seek-2 font-semibold">Storage</Text>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <StorageItem label="Primary" value="Tiptap JSON" />
              <StorageItem label="Preview" value="HTML + KaTeX" />
              <StorageItem label="Fallback" value="Markdown text" />
            </div>
          </Card>
        </aside>

        <main className="question-editor-main">
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-muted-background p-seek-4">
              <div className="flex flex-col gap-seek-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <Text className="text-lg font-bold">Үндсэн мэдээлэл</Text>
                  <Text variant="muted" className="text-sm">
                    Гарчиг, код, оноо, хугацаа болон асуултын төрлийг тохируулна.
                  </Text>
                </div>
                <Badge variant="warning">Ноорог</Badge>
              </div>
            </div>
            <div className="space-y-seek-4 p-seek-4">
              <div className="grid gap-seek-3 lg:grid-cols-[1fr_10rem_9rem_9rem]">
                <FieldLabel label="Гарчиг">
                  <Input
                    placeholder="Гарчиг"
                    defaultValue={
                      mode === "edit"
                        ? "Рационал илэрхийлэл хялбарчлах"
                        : ""
                    }
                  />
                </FieldLabel>
                <FieldLabel label="Код">
                  <Input placeholder="Код" defaultValue={mode === "edit" ? "MX-58" : ""} />
                </FieldLabel>
                <FieldLabel label="Оноо">
                  <Input type="number" placeholder="Оноо" defaultValue={3} />
                </FieldLabel>
                <FieldLabel label="Хугацаа">
                  <Input type="number" placeholder="Сек" defaultValue={90} />
                </FieldLabel>
              </div>
              <div>
                <Text className="mb-seek-2 text-sm font-semibold">
                  Асуултын төрөл
                </Text>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Object.entries(questionTypeLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedType(value as QuestionType)}
                      className={`min-h-11 rounded-seek-md border px-seek-3 py-seek-2 text-left text-sm font-semibold ${
                        value === selectedType
                          ? "border-primary bg-primary text-primary-foreground shadow-seek-sm"
                          : "border-border bg-surface hover:bg-surface-hover"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-seek-4">
            <SectionHeader
              title="Асуултын агуулга"
              subtitle="Markdown-like бичвэр, KaTeX томъёо, table, зураг/video/file placeholder оруулна."
            />
            <QuestionRichEditor
              label="Question editor"
              initialContent={defaultQuestionContent}
              minHeight="18rem"
              onChange={(value) => setQuestionMarkdown(value.markdown)}
            />
          </Card>

          <Card className="p-seek-4">
            <div className="mb-seek-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Text className="font-semibold">Хариултын хувилбарууд</Text>
                <Text variant="muted" className="text-sm">
                  Сонголт бүр rich content, оноо, зөв эсэх төлөвтэй байна.
                </Text>
              </div>
              <Badge variant="secondary">Сонголт бүрийн оноо</Badge>
            </div>
            {[
              "$\\frac{1}{x+1}$",
              "$\\frac{1}{x-1}$",
              "$x-1$",
              "$x+1$",
            ].map((answer, index) => (
              <div
                key={answer}
                className="mb-seek-3 rounded-seek-lg border border-border bg-surface p-seek-3"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-seek-3">
                  <Badge variant={index === 0 ? "success" : "secondary"}>
                    {String.fromCharCode(65 + index)}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked={index === 0} />
                      Зөв
                    </label>
                    <Input
                      className="w-24"
                      type="number"
                      defaultValue={index === 0 ? 3 : 0}
                      aria-label="Оноо"
                    />
                  </div>
                </div>
                <QuestionRichEditor
                  label={`Хариулт ${String.fromCharCode(65 + index)}`}
                  initialContent={`<p>${answer}</p>`}
                  minHeight="4rem"
                  onChange={(value) =>
                    setOptionsMarkdown((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? value.markdown : item,
                      ),
                    )
                  }
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm">
              + Сонголт нэмэх
            </Button>
          </Card>

          <Card className="p-seek-4">
            <SectionHeader
              title="Feedback ба rubric"
              subtitle="Зөв хариултын тайлбар, онооны задаргаа, assessor note бичнэ."
            />
            <QuestionRichEditor
              label="Rubric editor"
              initialContent="<p>$x^2-1=(x-1)(x+1)$ тул $x-1$ хураагдаж $\\frac{1}{x+1}$ үлдэнэ.</p>"
              minHeight="8rem"
              onChange={(value) => setFeedbackMarkdown(value.markdown)}
            />
          </Card>

          <div className="grid gap-seek-4 lg:grid-cols-[1fr_20rem]">
            <Card className="p-seek-4">
              <Text className="mb-2 font-semibold">Workflow comment</Text>
              <Textarea
                rows={4}
                placeholder="Өөрчлөлт, батлуулах тайлбар бичих..."
              />
              <div className="mt-seek-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => showToast("Ноорог хадгалагдлаа.", "success")}
                >
                  Ноорог хадгалах
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    showToast("Workflow comment бүртгэгдлээ.", "success")
                  }
                >
                  Батлуулах хүсэлт
                </Button>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-primary to-purple-600 p-seek-5 text-primary-foreground">
              <Text className="font-bold">Workflow төлөв</Text>
              <Text className="mt-2 text-3xl font-bold">Ноорог</Text>
              <Text className="mt-2 text-sm opacity-90">
                Save хийсний дараа батлуулах хүсэлт илгээх боломжтой.
              </Text>
            </Card>
          </div>
        </main>
      </div>
      {previewQuestion && (
        <QuestionPreviewModal
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
        />
      )}
    </div>
  );
}

function buildPreviewQuestion({
  stem,
  feedback,
  options,
  type,
}: {
  stem: string;
  feedback: string;
  options: string[];
  type: QuestionType;
}): QuestionBankItem {
  const previewOptions: QuestionOption[] = options.map((content, index) => ({
    id: String.fromCharCode(97 + index),
    label: String.fromCharCode(65 + index),
    content,
    isCorrect: index === 0,
    score: index === 0 ? 3 : 0,
  }));

  return {
    id: "preview-question",
    code: "MX-58",
    title: "Рационал илэрхийлэл хялбарчлах",
    stem,
    type,
    status: "draft",
    points: 3,
    durationSeconds: 90,
    bloomLevel: "apply",
    competencyType: "knowledge",
    topicId: "algebra",
    topicName: "Шугаман алгебр",
    difficulty: "medium",
    tags: ["preview", "markdown", "latex"],
    options: previewOptions,
    answerKey: "A",
    rubric: "Зөв хариулт 3 оноо.",
    feedback,
    media: [],
    createdBy: "Ассессор Б.",
    updatedBy: "Ассессор Б.",
    createdAt: "2026-07-31 10:00",
    updatedAt: "2026-07-31 10:00",
    workflowHistory: [
      {
        id: "preview-workflow",
        status: "draft",
        comment: "Raw markdown editor-оос урьдчилан харж байна.",
        actorId: "mock-assessor",
        actorName: "Ассессор Б.",
        actorRole: "Assessor",
        createdAt: "2026-07-31 10:00",
      },
    ],
  };
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">
        {label}
      </Text>
      {children}
    </label>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-seek-3">
      <Text className="font-semibold">{title}</Text>
      <Text variant="muted" className="text-sm">
        {subtitle}
      </Text>
    </div>
  );
}

function StorageItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-seek-md bg-muted-background p-seek-2">
      <span>{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function TopicPicker() {
  const topics = [
    {
      label: "Математик",
      children: ["Энгийн бутархай", "Шугаман алгебр"],
    },
    {
      label: "Зөөлөн ур чадвар",
      children: ["Харилцааны ур чадвар", "Манлайлал"],
    },
    {
      label: "Дижитал чадвар",
      children: ["Кибер аюулгүй байдал"],
    },
  ];

  return (
    <div className="space-y-seek-3">
      {topics.map((topic, index) => (
        <div key={topic.label}>
          <div className="flex items-center justify-between rounded-seek-md bg-muted-background px-seek-3 py-seek-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Checkbox defaultChecked={index === 0} />
              {topic.label}
            </label>
            <Icons.ChevronRight
              className={`h-4 w-4 text-muted-foreground ${
                index === 0 ? "rotate-90" : ""
              }`}
            />
          </div>
          {index === 0 && (
            <div className="ml-seek-4 mt-seek-2 space-y-2">
              {topic.children.map((child, childIndex) => (
                <label
                  key={child}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Checkbox defaultChecked={childIndex === 1} />
                  {child}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
