"use client";

import React from "react";
import { Card, Badge, Button, Textarea, Text, Icons } from "@seek/ui";
import { CollapsibleCard, SummaryTile } from "../builders/HelperComponents";
import { questionTypeLabels, bloomLabels, competencyLabels, difficultyLabels, statusLabels } from "../mock-data";
import type { QuestionWizardState, BloomLevel, CompetencyType, DifficultyLevel } from "../types";

interface StepThreeProps {
  state: QuestionWizardState;
  validation: {
    items: Array<{ label: string; ok: boolean }>;
    ready: boolean;
  };
  mode: "new" | "edit";
  submitted: boolean;
  onCommentChange: (comment: string) => void;
  onSave: () => void;
  onSubmit: () => void;
}

/**
 * StepThree - Wizard-ийн 3-р шат: Асуултын үр дүнг хянах, чанарын checklist шалгах, workflow тэмдэглэл бичиж илгээх хуудас.
 */
export function StepThree({
  state,
  validation,
  mode,
  submitted,
  onCommentChange,
  onSave,
  onSubmit,
}: StepThreeProps) {
  return (
    <div className="grid gap-seek-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <main className="space-y-seek-4">
        <CollapsibleCard
          title="Батлуулах хүсэлтийн тойм"
          subtitle="Илгээхийн өмнө үндсэн мэдээлэл болон чанарын checklist-ийг шалгана."
          icon={Icons.Dashboard}
        >
          <div className="grid gap-seek-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryTile label="Гарчиг" value={state.title || "Нэргүй"} />
            <SummaryTile label="Төрөл" value={questionTypeLabels[state.type]} />
            <SummaryTile label="Оноо/хугацаа" value={`${state.defaultMaxScore} оноо · ${state.defaultTimeSeconds} сек`} />
            <SummaryTile label="Сэдэв" value={`${state.mappings.length} mapping`} />
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Чанарын шалгах хуудас (Validation checklist)" icon={Icons.ListChecks}>
          <div className="space-y-2">
            {validation.items.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-seek-md border p-seek-3 ${
                  item.ok ? "border-success bg-success-background" : "border-warning bg-warning-background"
                }`}
              >
                <Text className="font-semibold">{item.label}</Text>
                <Badge variant={item.ok ? "success" : "warning"}>
                  {item.ok ? "OK" : "Дутуу"}
                </Badge>
              </div>
            ))}
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Илгээх тэмдэглэл (Workflow comment)" subtitle="Батлуулах хүсэлтэд хавсаргах нэмэлт тайлбар." icon={Icons.SavePen}>
          <Textarea
            rows={5}
            value={state.workflowComment}
            onChange={(event) => onCommentChange(event.target.value)}
            placeholder="Батлуулах хүсэлтийн тайлбар бичнэ..."
          />
          <div className="mt-seek-4 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={onSave}>
              Ноорог хадгалах
            </Button>
            <Button type="button" onClick={onSubmit}>
              {mode === "edit" ? "Дахин батлуулах хүсэлт" : "Батлуулах хүсэлт илгээх"}
            </Button>
            {mode === "edit" && (
              <Button type="button" variant="secondary">
                Архивлах
              </Button>
            )}
          </div>
        </CollapsibleCard>
      </main>

      <aside className="space-y-seek-4 xl:sticky xl:top-28 xl:self-start">
        <Card className="bg-gradient-to-br from-purple-700 to-primary p-seek-5 text-white">
          <div className="flex items-center gap-seek-2">
            <Icons.Info className="h-5 w-5 text-white stroke-[1.8]" />
            <Text className="font-bold">Workflow төлөв</Text>
          </div>
          <Text className="mt-2 text-3xl font-bold">
            {submitted ? "Илгээгдсэн" : statusLabels[state.status]}
          </Text>
          <Text className="mt-2 text-sm opacity-90">
            {submitted
              ? "Mock workflow history-д хүсэлт бүртгэгдсэн."
              : "Checklist бүрэн бол батлуулах хүсэлт илгээж болно."}
          </Text>
        </Card>
        <CollapsibleCard title="Сэдвийн mapping" icon={Icons.Settings}>
          <div className="space-y-2">
            {state.mappings.map((mapping) => (
              <div key={mapping.topicId} className="rounded-seek-md bg-muted-background p-seek-3">
                <Text className="font-semibold">{mapping.topicName}</Text>
                <Text variant="muted" className="text-xs">
                  {bloomLabels[mapping.bloomLevel as BloomLevel]} · {competencyLabels[mapping.competencyType as CompetencyType]} · {difficultyLabels[mapping.difficulty as DifficultyLevel]}
                </Text>
              </div>
            ))}
          </div>
        </CollapsibleCard>
      </aside>
    </div>
  );
}
