"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Heading,
  Icons,
  Input,
  PageContainer,
  PageTitle,
  Select,
  Stack,
  Text,
  useToast,
} from "@seek/ui";
import {
  fetchAssessmentContexts,
  createAssessmentContext,
  updateAssessmentContext,
  deleteAssessmentContext,
  fetchAudienceTypes,
  fetchDifficultyScales,
  fetchCognitiveFrameworks,
  fetchCompetenceFrameworks,
} from "@/features/assessor-workspace/api";

export default function AssessmentContextsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [contexts, setContexts] = useState<any[]>([]);
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]);
  const [difficultyScales, setDifficultyScales] = useState<any[]>([]);
  const [cognitiveFrameworks, setCognitiveFrameworks] = useState<any[]>([]);
  const [competenceFrameworks, setCompetenceFrameworks] = useState<any[]>([]);

  // Form states
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [selectedAudienceId, setSelectedAudienceId] = useState("");
  const [selectedDifficultyId, setSelectedDifficultyId] = useState("");
  const [selectedCognitiveId, setSelectedCognitiveId] = useState("");
  const [selectedCompetenceId, setSelectedCompetenceId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        ctxs,
        audTypes,
        diffScales,
        cogFrames,
        compFrames,
      ] = await Promise.all([
        fetchAssessmentContexts(),
        fetchAudienceTypes(),
        fetchDifficultyScales(),
        fetchCognitiveFrameworks(),
        fetchCompetenceFrameworks(),
      ]);

      setContexts(ctxs || []);
      setAudienceTypes(audTypes || []);
      setDifficultyScales(diffScales || []);
      setCognitiveFrameworks(cogFrames || []);
      setCompetenceFrameworks(compFrames || []);
    } catch (err: any) {
      console.error(err);
      showToast("Мэдээллийг татаж чадсангүй.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setSelectedItem(null);
    setName("");
    setCode("");
    setSelectedAudienceId(audienceTypes[0]?.id || "");
    setSelectedDifficultyId(difficultyScales[0]?.id || "");
    setSelectedCognitiveId(cognitiveFrameworks[0]?.id || "");
    setSelectedCompetenceId(competenceFrameworks[0]?.id || "");
    setIsActive(true);
  };

  const handleSelectItem = (item: any) => {
    setIsCreating(false);
    setSelectedItem(item);
    setName(item.name || "");
    setCode(item.code || "");
    setSelectedAudienceId(item.audienceTypeId || "");
    setSelectedDifficultyId(item.difficultyScaleId || "");
    setSelectedCognitiveId(item.cognitiveFrameworkId || "");
    setSelectedCompetenceId(item.competenceFrameworkId || "");
    setIsActive(item.isActive !== false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Контекстийн нэрийг оруулна уу.", "warning");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        if (!selectedAudienceId || !selectedDifficultyId || !selectedCognitiveId || !selectedCompetenceId) {
          showToast("Шаардлагатай бүх лавлах өгөгдлийг сонгоно уу.", "warning");
          setSaving(false);
          return;
        }

        await createAssessmentContext({
          name: name.trim(),
          code: code.trim() || undefined,
          audienceTypeId: selectedAudienceId,
          difficultyScaleId: selectedDifficultyId,
          cognitiveFrameworkId: selectedCognitiveId,
          competenceFrameworkId: selectedCompetenceId,
        });
        showToast("Үнэлгээний контекст амжилттай үүслээ.", "success");
      } else if (selectedItem) {
        await updateAssessmentContext(selectedItem.id, {
          name: name.trim(),
          isActive,
          audienceTypeId: selectedAudienceId,
          difficultyScaleId: selectedDifficultyId,
          cognitiveFrameworkId: selectedCognitiveId,
          competenceFrameworkId: selectedCompetenceId,
        });
        showToast("Үнэлгээний контекст шинэчлэгдлээ.", "success");
      }

      setIsCreating(false);
      setSelectedItem(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Хадгалахад алдаа гарлаа.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Та энэ үнэлгээний контекстийг устгахдаа итгэлтэй байна уу? Устгаснаар үүнд холбогдсон бүх сэдэв болон асуултуудын ангилалд нөлөөлнө."
      )
    ) {
      return;
    }

    try {
      await deleteAssessmentContext(id);
      showToast("Амжилттай устгагдлаа.", "success");
      setSelectedItem(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Устгаж чадсангүй.", "danger");
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle
          title="Үнэлгээний контекст удирдлага"
          subtitle="Үнэлгээний системийн журам, зорилтот бүлэг, хүндрэлийн шатлал болон чадамжийн бүтцийн холбоосыг тохируулах"
        />
        <Button
          type="button"
          variant="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-seek-2 active:scale-95 transition-all bg-slate-950 text-white hover:bg-slate-900 shadow-seek-sm"
        >
          <Icons.Settings className="h-4 w-4 stroke-[1.8]" />
          <span>Шинэ контекст үүсгэх</span>
        </Button>
      </div>

      <div className="grid gap-seek-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Жагсаалт */}
        <Card className="p-seek-5 space-y-seek-4">
          <div className="flex items-center justify-between border-b border-border pb-seek-3">
            <Heading level={2} className="text-lg font-bold text-slate-800">
              Бүртгэлтэй контекстүүд
            </Heading>
            <Button
              type="button"
              variant="outline"
              onClick={loadData}
              className="h-8 w-8 p-0 flex items-center justify-center"
              title="Шинэчлэх"
            >
              <Icons.Recycle className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Text variant="muted">Уншиж байна...</Text>
            </div>
          ) : contexts.length === 0 ? (
            <div className="text-center py-16">
              <Text variant="muted">Одоогоор ямар нэгэн контекст бүртгэгдээгүй байна.</Text>
            </div>
          ) : (
            <div className="space-y-seek-3 max-h-[600px] overflow-y-auto pr-seek-2">
              {contexts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectItem(c)}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-seek-3 p-seek-4 rounded-seek-lg cursor-pointer border transition-all ${
                    selectedItem?.id === c.id
                      ? "bg-slate-50 border-slate-950 shadow-seek-sm"
                      : "bg-surface border-border hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-seek-1">
                    <div className="flex items-center gap-seek-2">
                      <Text className="font-bold text-slate-900 text-sm">
                        {c.name}
                      </Text>
                      {c.isActive !== false ? (
                        <Badge variant="success">Идэвхтэй</Badge>
                      ) : (
                        <Badge variant="secondary">Идэвхгүй</Badge>
                      )}
                    </div>
                    <Text variant="muted" className="text-xs font-mono">
                      {c.code}
                    </Text>
                    <div className="flex flex-wrap gap-seek-2 mt-seek-2 text-[10px] text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">
                        Зорилтот бүлэг: {c.audienceType?.name || c.audienceTypeId}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">
                        Хүндрэл: {c.difficultyScale?.name || c.difficultyScaleId}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">
                        Танин мэдэхүй: {c.cognitiveFramework?.name || c.cognitiveFrameworkId}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">
                        Чадамж: {c.competenceFramework?.name || c.competenceFrameworkId}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(c.id);
                      }}
                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-seek-md transition-colors"
                      title="Устгах"
                    >
                      <Icons.Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Засварлах / Үүсгэх Form */}
        <Card className="p-seek-5 h-fit">
          <div className="flex items-center justify-between border-b border-border pb-seek-3 mb-seek-4">
            <Heading level={2} className="text-base font-bold text-slate-800">
              {isCreating
                ? "Шинэ контекст үүсгэх"
                : selectedItem
                ? "Контекст мэдээлэл засах"
                : "Сонголт хийнэ үү"}
            </Heading>
          </div>

          {!isCreating && !selectedItem ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-seek-3">
              <Icons.Settings className="h-10 w-10 text-slate-300 stroke-[1.2]" />
              <div>
                <Text className="font-semibold text-slate-700 text-sm">
                  Контекст сонгоогүй байна
                </Text>
                <Text variant="muted" className="text-xs max-w-[200px] mt-1 mx-auto">
                  Зүүн талын жагсаалтаас сонгож засах эсвэл шинээр үүсгэнэ үү.
                </Text>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-seek-4">
              <div className="space-y-seek-2">
                <Text className="font-semibold text-slate-700 text-xs">
                  Контекстийн нэр *
                </Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Жишээ: Төрийн албаны ерөнхий шалгалт"
                  required
                />
              </div>

              <div className="space-y-seek-2">
                <Text className="font-semibold text-slate-700 text-xs">
                  Код (Unique) {isCreating && "*"}
                </Text>
                <Input
                  value={code}
                  disabled={!isCreating}
                  onChange={(e) =>
                    setCode(
                      e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9-]/g, "")
                    )
                  }
                  placeholder="Жишээ: CIVIL-SERVICE-STAGE-1"
                />
                {isCreating && (
                  <Text variant="muted" className="text-[10px]">
                    Хоосон орхивол систем автоматаар код үүсгэнэ.
                  </Text>
                )}
              </div>

              <div className="space-y-seek-2">
                <Text className="font-semibold text-slate-700 text-xs">
                  Зорилтот бүлгийн төрөл *
                </Text>
                <Select
                  value={selectedAudienceId}
                  onChange={(e) => setSelectedAudienceId(e.target.value)}
                  options={audienceTypes.map((t) => ({
                    value: t.id,
                    label: t.name,
                  }))}
                />
              </div>

              <div className="space-y-seek-2">
                <Text className="font-semibold text-slate-700 text-xs">
                  Хүндрэлийн шатлал *
                </Text>
                <Select
                  value={selectedDifficultyId}
                  onChange={(e) => setSelectedDifficultyId(e.target.value)}
                  options={difficultyScales.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                />
              </div>

              <div className="space-y-seek-2">
                <Text className="font-semibold text-slate-700 text-xs">
                  Танин мэдэхүйн бүтэц (Bloom) *
                </Text>
                <Select
                  value={selectedCognitiveId}
                  onChange={(e) => setSelectedCognitiveId(e.target.value)}
                  options={cognitiveFrameworks.map((f) => ({
                    value: f.id,
                    label: f.name,
                  }))}
                />
              </div>

              <div className="space-y-seek-2">
                <Text className="font-semibold text-slate-700 text-xs">
                  Чадамжийн бүтэц *
                </Text>
                <Select
                  value={selectedCompetenceId}
                  onChange={(e) => setSelectedCompetenceId(e.target.value)}
                  options={competenceFrameworks.map((f) => ({
                    value: f.id,
                    label: f.name,
                  }))}
                />
              </div>

              {!isCreating && (
                <div className="space-y-seek-2">
                  <Text className="font-semibold text-slate-700 text-xs">
                    Төлөв тохируулах
                  </Text>
                  <Select
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    options={[
                      { value: "true", label: "Идэвхтэй (Active)" },
                      { value: "false", label: "Идэвхгүй (Inactive)" },
                    ]}
                  />
                </div>
              )}

              <div className="flex justify-end gap-seek-2 border-t border-border pt-seek-4 mt-seek-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedItem(null);
                  }}
                  disabled={saving}
                >
                  Болих
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-slate-950 text-white hover:bg-slate-900 active:scale-95 transition-all"
                  disabled={saving}
                >
                  {saving ? "Хадгалж байна..." : "Хадгалах"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
