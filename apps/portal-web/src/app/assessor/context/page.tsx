"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  Checkbox,
  Icons,
  PageTitle,
  Text,
  useToast,
} from "@seek/ui";
import { fetchAssessmentContexts, fetchAudienceTypes } from "@/features/assessor-workspace/api";

export default function AssessorContextPage() {
  const { showToast } = useToast();
  const [contexts, setContexts] = useState<any[]>([]);
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]);
  const [selectedAudienceTypeIds, setSelectedAudienceTypeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [contextData, audienceData] = await Promise.all([
          fetchAssessmentContexts(),
          fetchAudienceTypes(),
        ]);
        setContexts(contextData || []);
        setAudienceTypes(audienceData || []);
      } catch (err) {
        console.error(err);
        showToast("Мэдээллийг татаж чадсангүй.", "danger");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleToggleAudienceType = (id: string) => {
    setSelectedAudienceTypeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredContexts = useMemo(() => {
    if (selectedAudienceTypeIds.length === 0) return contexts;
    return contexts.filter((c) => selectedAudienceTypeIds.includes(c.audienceTypeId));
  }, [contexts, selectedAudienceTypeIds]);

  return (
    <div className="p-seek-6 grid gap-seek-6 lg:grid-cols-[1fr_18rem]">
      <main className="space-y-seek-6">
        <PageTitle
          title="Үнэлгээний контекст сонгох"
          subtitle="Даалгавар боловсруулахын тулд эхлээд ажиллах үнэлгээний контекстоо сонгоно уу."
        />

        <div>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Text variant="muted">Уншиж байна...</Text>
            </div>
          ) : filteredContexts.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
              <Icons.Warning size={40} className="text-muted-foreground" />
              <Text className="font-semibold mt-seek-3">Үнэлгээний контекст олдсонгүй</Text>
              <Text variant="muted" className="mt-1 text-sm">
                Сонгосон шүүлтүүрт тохирох үнэлгээний контекст байхгүй байна.
              </Text>
            </div>
          ) : (
            <div className="grid gap-seek-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredContexts.map((context) => (
                <Link
                  key={context.id}
                  href={`/assessor/context/${context.id}`}
                  className="group block transition-all"
                >
                  <Card className="p-seek-5 h-full border border-border group-hover:border-primary group-hover:shadow-seek-md transition-all space-y-seek-3">
                    <div className="flex items-start justify-between">
                      <div className="p-seek-2 rounded-seek-md bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Icons.Settings size={24} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        
                        {context.audienceType && (
                          <span className="text-seek-xxs px-seek-2 py-0.5 rounded-seek-full bg-primary/10 text-primary font-semibold">
                            {context.audienceType.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-seek-1">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-all">
                        {context.name}
                      </h3>
                      <Text variant="muted" className="text-sm line-clamp-2">
                        {context.description || "Тайлбар оруулаагүй байна."}
                      </Text>
                    </div>

                    <div className="pt-seek-3 border-t border-border/50 grid grid-cols-2 gap-seek-2 text-xs font-mono text-muted-foreground">
                      <div>
                        <span className="block text-seek-xxs text-foreground/50 uppercase">Хүндрэлийн шатлал</span>
                        <span className="truncate block font-semibold text-foreground">
                          {context.difficultyScale?.name || "Тохируулаагүй"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-seek-xxs text-foreground/50 uppercase">Когнитив хүрээ</span>
                        <span className="truncate block font-semibold text-foreground">
                          {context.cognitiveFramework?.name || "Тохируулаагүй"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <aside className="rounded-seek-lg border border-border bg-surface p-seek-4 h-fit space-y-seek-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-seek-2 mb-seek-3">
          <Text className="font-bold text-sm">Шүүлтүүрүүд</Text>
          {selectedAudienceTypeIds.length > 0 && (
            <button
              type="button"
              className="text-xs font-semibold text-primary"
              onClick={() => setSelectedAudienceTypeIds([])}
            >
              Цэвэрлэх
            </button>
          )}
        </div>

        <div>
          <Text className="text-xs font-bold text-muted-foreground mb-seek-3 uppercase block">Зорилтот бүлэг</Text>
          <div className="space-y-seek-2">
            {audienceTypes.map((type) => {
              const isChecked = selectedAudienceTypeIds.includes(type.id);
              const count = contexts.filter((c) => c.audienceTypeId === type.id).length;
              return (
                <label
                  key={type.id}
                  className="flex items-center justify-between gap-seek-2 text-sm font-semibold text-foreground cursor-pointer select-none py-1 hover:text-primary transition-all"
                >
                  <div className="flex items-center gap-seek-2">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleToggleAudienceType(type.id)}
                    />
                    <span>{type.name}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground bg-muted-background px-1.5 py-0.5 rounded">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
