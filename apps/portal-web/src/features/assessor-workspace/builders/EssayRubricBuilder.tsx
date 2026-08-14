"use client";

import React from "react";
import { Button, Input, Textarea, Badge } from "@seek/ui";

interface EssayRubricBuilderProps {
  rubric: any[];
  onChange: (rubrics: any[]) => void;
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
      <span className="mb-1 block text-xs font-bold uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

/**
 * EssayRubricBuilder - Эссэ асуултыг гараар үнэлэхэд ашиглах шалгуурууд (rubric) болон оноог тохируулах компонент.
 */
export function EssayRubricBuilder({
  rubric,
  onChange,
}: EssayRubricBuilderProps) {
  const addCriterion = () => {
    onChange([
      ...rubric,
      {
        id: `c_${Date.now()}_${rubric.length + 1}`,
        criteria: "",
        maxScore: 1,
        description: "",
      },
    ]);
  };

  const removeCriterion = (idx: number) => {
    onChange(rubric.filter((_, i) => i !== idx));
  };

  const updateCriterion = (idx: number, patch: any) => {
    onChange(rubric.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  return (
    <div className="space-y-seek-4">
      {rubric.length === 0 ? (
        <div className="rounded-seek-md border border-dashed border-border p-seek-6 text-center text-muted-foreground text-sm">
          Үнэлгээний рубрик хоосон байна. Багш асуултыг засахдаа шалгуур нэмнэ үү.
        </div>
      ) : (
        rubric.map((rub, index) => (
          <div key={rub.id || index} className="rounded-seek-lg border border-border bg-surface p-seek-4 space-y-seek-3 shadow-seek-xs">
            <div className="flex items-center justify-between">
              <Badge variant="success">Шалгуур {index + 1}</Badge>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeCriterion(index)}
              >
                ✕
              </Button>
            </div>
            <div className="grid gap-seek-4 md:grid-cols-[2fr_1fr]">
              <FieldLabel label="Шалгуурын нэр">
                <Input
                  placeholder="Жишээ нь: Бодолтын явц"
                  value={rub.criteria}
                  onChange={(e) => updateCriterion(index, { criteria: e.target.value })}
                />
              </FieldLabel>
              <FieldLabel label="Авах дээд оноо">
                <Input
                  type="number"
                  value={rub.maxScore}
                  onChange={(e) => updateCriterion(index, { maxScore: Number(e.target.value) })}
                />
              </FieldLabel>
            </div>
            <FieldLabel label="Шалгуурын тайлбар ба түвшний удирдамж">
              <Textarea
                rows={2}
                placeholder="Жишээ нь: Бодолтын алхмуудыг бүрэн зөв хийсэн байдал..."
                value={rub.description}
                onChange={(e) => updateCriterion(index, { description: e.target.value })}
              />
            </FieldLabel>
          </div>
        ))
      )}
      <Button type="button" variant="outline" onClick={addCriterion}>
        + Шалгуур нэмэх
      </Button>
    </div>
  );
}
