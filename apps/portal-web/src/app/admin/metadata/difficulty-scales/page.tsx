"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  Icons,
  Input,
  PageContainer,
  PageTitle,
  Stack,
  Text,
  Textarea,
  useDialog,
  useToast,
  IconButton,
} from "@seek/ui";
import {
  fetchDifficultyScales,
  createDifficultyScale,
  updateDifficultyScale,
  deleteDifficultyScale,
  fetchDifficultyLevels,
  createDifficultyLevel,
  updateDifficultyLevel,
  deleteDifficultyLevel,
} from "@/features/assessor-workspace/api";
import type { DifficultyScale, DifficultyLevel } from "@/features/assessments/types";

export default function DifficultyScalesManagementPage() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const [scales, setScales] = useState<DifficultyScale[]>([]);
  const [levels, setLevels] = useState<DifficultyLevel[]>([]);
  const [loadingScales, setLoadingScales] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [selectedScale, setSelectedScale] = useState<DifficultyScale | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);

  // Scale form states
  const [scaleName, setScaleName] = useState("");
  const [scaleCode, setScaleCode] = useState("");
  const [scaleDescription, setScaleDescription] = useState("");
  const [isScaleEdit, setIsScaleEdit] = useState(false);

  // Level form states
  const [levelName, setLevelName] = useState("");
  const [levelCode, setLevelCode] = useState("");
  const [levelRank, setLevelRank] = useState(1);
  const [levelValue, setLevelValue] = useState("0");
  const [levelMinAbility, setLevelMinAbility] = useState("-3");
  const [levelMaxAbility, setLevelMaxAbility] = useState("3");
  const [levelColor, setLevelColor] = useState("#000000");
  const [levelDescription, setLevelDescription] = useState("");
  const [isLevelEdit, setIsLevelEdit] = useState(false);

  const loadScales = async () => {
    setLoadingScales(true);
    try {
      const data = await fetchDifficultyScales();
      setScales(data || []);
      if (data && data.length > 0 && !selectedScale) {
        setSelectedScale(data[0]);
      }
    } catch (err) {
      console.error(err);
      showToast("Хүндрэлийн хэмжүүрийг татаж чадсангүй.", "danger");
    } finally {
      setLoadingScales(false);
    }
  };

  const loadLevels = async (scaleId: string) => {
    setLoadingLevels(true);
    try {
      const data = await fetchDifficultyLevels();
      const filtered = (data || []).filter((l) => l.difficultyScaleId === scaleId);
      setLevels(filtered.sort((a, b) => a.rank - b.rank));
    } catch (err) {
      console.error(err);
      showToast("Хүндрэлийн түвшнүүдийг татаж чадсангүй.", "danger");
    } finally {
      setLoadingLevels(false);
    }
  };

  useEffect(() => {
    loadScales();
  }, []);

  useEffect(() => {
    if (selectedScale) {
      loadLevels(selectedScale.id);
      resetLevelForm();
    }
  }, [selectedScale]);

  // Scale actions
  const handleSaveScale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scaleName.trim()) {
      showToast("Нэр заавал оруулна.", "warning");
      return;
    }

    try {
      if (isScaleEdit && selectedScale) {
        await updateDifficultyScale(selectedScale.id, {
          name: scaleName,
          description: scaleDescription,
        });
        showToast("Хэмжүүр засагдлаа.", "success");
      } else {
        await createDifficultyScale({
          name: scaleName,
          code: scaleCode || `SCALE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          description: scaleDescription,
        });
        showToast("Шинэ хүндрэлийн шатлал үүсгэлээ.", "success");
      }
      resetScaleForm();
      loadScales();
    } catch (err) {
      console.error(err);
      showToast("Хадгалж чадсангүй.", "danger");
    }
  };

  const handleDeleteScale = (id: string) => {
    showDialog({
      title: "Хүндрэлийн хэмжүүрийг устгах уу?",
      description: "Энэ хэмжүүрийг устгаснаар түүнд хамаарах бүх хүндрэлийн түвшин устах болно.",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteDifficultyScale(id);
          showToast("Хэмжүүр устгагдлаа.", "success");
          if (selectedScale?.id === id) {
            setSelectedScale(null);
          }
          loadScales();
        } catch (err) {
          console.error(err);
          showToast("Устгаж чадсангүй.", "danger");
        }
      },
    });
  };

  // Level actions
  const handleSaveLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScale) return;
    if (!levelName.trim() || !levelCode.trim()) {
      showToast("Нэр болон код заавал байна.", "warning");
      return;
    }

    try {
      if (isLevelEdit && selectedLevel) {
        await updateDifficultyLevel(selectedLevel.id, {
          name: levelName,
          rank: Number(levelRank),
          numericValue: Number(levelValue),
          minAbility: Number(levelMinAbility),
          maxAbility: Number(levelMaxAbility),
          color: levelColor,
          description: levelDescription,
        });
        showToast("Түвшин амжилттай засагдлаа.", "success");
      } else {
        await createDifficultyLevel({
          difficultyScaleId: selectedScale.id,
          name: levelName,
          code: levelCode,
          rank: Number(levelRank),
          numericValue: Number(levelValue),
          minAbility: Number(levelMinAbility),
          maxAbility: Number(levelMaxAbility),
          color: levelColor,
          description: levelDescription,
        });
        showToast("Хүндрэлийн түвшин нэмэгдлээ.", "success");
      }
      resetLevelForm();
      loadLevels(selectedScale.id);
    } catch (err) {
      console.error(err);
      showToast("Түвшин хадгалж чадсангүй.", "danger");
    }
  };

  const handleDeleteLevel = (id: string) => {
    if (!selectedScale) return;
    showDialog({
      title: "Хүндрэлийн түвшинг устгах уу?",
      description: "Энэ түвшинг устгахад итгэлтэй байна уу?",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteDifficultyLevel(id);
          showToast("Хүндрэлийн түвшин устгагдлаа.", "success");
          if (selectedLevel?.id === id) {
            setSelectedLevel(null);
          }
          loadLevels(selectedScale.id);
        } catch (err) {
          console.error(err);
          showToast("Устгаж чадсангүй.", "danger");
        }
      },
    });
  };

  const resetScaleForm = () => {
    setScaleName("");
    setScaleCode("");
    setScaleDescription("");
    setIsScaleEdit(false);
  };

  const resetLevelForm = () => {
    setLevelName("");
    setLevelCode("");
    setLevelRank(levels.length + 1);
    setLevelValue("0");
    setLevelMinAbility("-3");
    setLevelMaxAbility("3");
    setLevelColor("#000000");
    setLevelDescription("");
    setSelectedLevel(null);
    setIsLevelEdit(false);
  };

  const selectScaleForEdit = (scale: DifficultyScale) => {
    setSelectedScale(scale);
    setScaleName(scale.name);
    setScaleCode(scale.code);
    setScaleDescription(scale.description || "");
    setIsScaleEdit(true);
  };

  const selectLevelForEdit = (lvl: DifficultyLevel) => {
    setSelectedLevel(lvl);
    setLevelName(lvl.name);
    setLevelCode(lvl.code);
    setLevelRank(lvl.rank);
    setLevelValue(String(lvl.numericValue || 0));
    setLevelMinAbility(String(lvl.minAbility || -3));
    setLevelMaxAbility(String(lvl.maxAbility || 3));
    setLevelColor(lvl.color || "#000000");
    setLevelDescription(lvl.description || "");
    setIsLevelEdit(true);
  };

  return (
    <PageContainer>
      <PageTitle
        title="Хүндрэлийн шатлал удирдлага"
        subtitle="Асуултуудын хүндрэлийг хэмжих шатлал үүсгэх, түвшин бүрийн оноо, ранк болон өнгийг тохируулах цэс."
      />

      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[18rem_1fr_22rem] mt-seek-4">
        {/* SCALES LIST */}
        <Card className="min-h-[400px]">
          <Stack gap={4}>
            <Heading level={3}>Хүндрэлийн шатлал</Heading>
            {loadingScales ? (
              <Text variant="muted">Уншиж байна...</Text>
            ) : (
              <div className="flex flex-col gap-seek-2">
                {scales.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between gap-seek-2 px-seek-3 py-seek-2 rounded-seek-md border transition-all cursor-pointer ${
                      selectedScale?.id === s.id
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-surface hover:bg-surface-hover"
                    }`}
                    onClick={() => setSelectedScale(s)}
                  >
                    <div>
                      <Text className="text-sm">{s.name}</Text>
                      <Text variant="muted" className="text-xs">
                        {s.code}
                      </Text>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton
                        ariaLabel="Засах"
                        className="hover:bg-surface-hover text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectScaleForEdit(s);
                        }}
                      >
                        <Icons.SavePen size={14} />
                      </IconButton>
                      <IconButton
                        ariaLabel="Устгах"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScale(s.id);
                        }}
                        className="text-danger hover:bg-danger-background"
                      >
                        <Icons.Trash size={14} />
                      </IconButton>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetScaleForm}
                  className="mt-seek-2"
                >
                  Шинэ шатлал үүсгэх
                </Button>
              </div>
            )}
          </Stack>
        </Card>

        {/* LEVELS TABLE VIEW */}
        <Card className="min-h-[400px]">
          <Stack gap={4}>
            <Heading level={3}>
              {selectedScale ? `"${selectedScale.name}" - Хүндрэлийн түвшнүүд` : "Сонгогдсон шатлал байхгүй"}
            </Heading>
            
            {loadingLevels ? (
              <div className="flex h-48 items-center justify-center">
                <Text variant="muted">Уншиж байна...</Text>
              </div>
            ) : !selectedScale ? (
              <Text variant="muted" className="text-center py-12">
                Түвшнүүдийг харахын тулд зүүн талаас шатлал сонгоно уу.
              </Text>
            ) : levels.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
                <Icons.Warning size={40} className="text-muted-foreground" />
                <Text className="font-semibold mt-seek-3">Хүндрэлийн түвшин байхгүй байна</Text>
                <Text variant="muted" className="mt-1 text-sm">
                  Энэ шатлалд шинээр түвшин нэмнэ үү.
                </Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase bg-muted-background/40">
                      <th className="py-seek-3 px-seek-4">Ранк</th>
                      <th className="py-seek-3 px-seek-4">Түвшний нэр</th>
                      <th className="py-seek-3 px-seek-4">Код</th>
                      <th className="py-seek-3 px-seek-4">Numeric Value</th>
                      <th className="py-seek-3 px-seek-4">Ability хүрээ</th>
                      <th className="py-seek-3 px-seek-4">Өнгө</th>
                      <th className="py-seek-3 px-seek-4 text-right">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((lvl) => (
                      <tr 
                        key={lvl.id}
                        className={`border-b border-border text-sm hover:bg-surface-hover/50 ${
                          selectedLevel?.id === lvl.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="py-seek-3 px-seek-4 font-mono font-bold">#{lvl.rank}</td>
                        <td className="py-seek-3 px-seek-4 font-medium">{lvl.name}</td>
                        <td className="py-seek-3 px-seek-4 font-mono text-xs">{lvl.code}</td>
                        <td className="py-seek-3 px-seek-4">{String(lvl.numericValue || 0)}</td>
                        <td className="py-seek-3 px-seek-4 text-xs font-mono">
                          {String(lvl.minAbility || -3)} ── {String(lvl.maxAbility || 3)}
                        </td>
                        <td className="py-seek-3 px-seek-4">
                          <div className="flex items-center gap-seek-2">
                            <span 
                              className="w-4 h-4 rounded-full border border-border shadow-seek-xs" 
                              style={{ backgroundColor: lvl.color || "#000" }} 
                            />
                            <span className="font-mono text-xs uppercase">{lvl.color || "-"}</span>
                          </div>
                        </td>
                        <td className="py-seek-3 px-seek-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IconButton
                              ariaLabel="Засах"
                              className="hover:bg-surface-hover text-foreground"
                              onClick={() => selectLevelForEdit(lvl)}
                            >
                              <Icons.SavePen size={14} />
                            </IconButton>
                            <IconButton
                              ariaLabel="Устгах"
                              onClick={() => handleDeleteLevel(lvl.id)}
                              className="text-danger hover:bg-danger-background"
                            >
                              <Icons.Trash size={14} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Stack>
        </Card>

        {/* FORMS */}
        <Card className="h-fit sticky top-seek-5">
          <Stack gap={6}>
            {/* SCALE FORM */}
            {!isLevelEdit && (
              <form onSubmit={handleSaveScale}>
                <Stack gap={5}>
                  <Heading level={3}>
                    {isScaleEdit ? "Шатлал засах" : "Шинэ шатлал үүсгэх"}
                  </Heading>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Шатлалын нэр</span>
                    <Input
                      required
                      placeholder="Жишээ: 5-Level standard"
                      value={scaleName}
                      onChange={(e) => setScaleName(e.target.value)}
                    />
                  </label>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Код</span>
                    <Input
                      placeholder="Жишээ: COG-SCALE-3"
                      disabled={isScaleEdit}
                      value={scaleCode}
                      onChange={(e) => setScaleCode(e.target.value)}
                    />
                  </label>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Тайлбар</span>
                    <Textarea
                      placeholder="Шатлалын тайлбар..."
                      rows={3}
                      value={scaleDescription}
                      onChange={(e) => setScaleDescription(e.target.value)}
                    />
                  </label>
                  <div className="flex gap-seek-2 pt-seek-1">
                    <Button type="submit" className="flex-1">
                      {isScaleEdit ? "Засах" : "Хадгалах"}
                    </Button>
                    {isScaleEdit && (
                      <Button type="button" variant="outline" onClick={resetScaleForm}>
                        Болих
                      </Button>
                    )}
                  </div>
                </Stack>
              </form>
            )}

            {/* LEVEL FORM */}
            {selectedScale && (
              <form onSubmit={handleSaveLevel}>
                <Stack gap={5} className="border-t border-border pt-seek-5">
                  <Heading level={3}>
                    {isLevelEdit ? "Түвшин засах" : "Түвшин нэмэх"}
                  </Heading>

                  <div className="grid grid-cols-2 gap-seek-3">
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Түвшний нэр</span>
                      <Input
                        required
                        placeholder="Easy, Hard г.м."
                        value={levelName}
                        onChange={(e) => setLevelName(e.target.value)}
                      />
                    </label>
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Код</span>
                      <Input
                        required
                        placeholder="EASY, HARD"
                        disabled={isLevelEdit}
                        value={levelCode}
                        onChange={(e) => setLevelCode(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-seek-3">
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Дараалал (Rank)</span>
                      <Input
                        type="number"
                        required
                        value={levelRank}
                        onChange={(e) => setLevelRank(Number(e.target.value))}
                      />
                    </label>
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Numeric Value</span>
                      <Input
                        type="number"
                        step="0.1"
                        required
                        value={levelValue}
                        onChange={(e) => setLevelValue(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-seek-3">
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Min Ability</span>
                      <Input
                        type="number"
                        step="0.1"
                        value={levelMinAbility}
                        onChange={(e) => setLevelMinAbility(e.target.value)}
                      />
                    </label>
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Max Ability</span>
                      <Input
                        type="number"
                        step="0.1"
                        value={levelMaxAbility}
                        onChange={(e) => setLevelMaxAbility(e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Харагдах өнгө</span>
                    <div className="flex gap-seek-3 items-center">
                      <input 
                        type="color" 
                        className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                        value={levelColor}
                        onChange={(e) => setLevelColor(e.target.value)}
                      />
                      <Input
                        placeholder="#HEX өнгө"
                        className="flex-1 font-mono uppercase"
                        value={levelColor}
                        onChange={(e) => setLevelColor(e.target.value)}
                      />
                    </div>
                  </label>

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Тайлбар</span>
                    <Textarea
                      placeholder="Түвшний шалгуур үзүүлэлт..."
                      rows={3}
                      value={levelDescription}
                      onChange={(e) => setLevelDescription(e.target.value)}
                    />
                  </label>

                  <div className="flex gap-seek-2 pt-seek-1">
                    <Button type="submit" className="flex-1">
                      {isLevelEdit ? "Засах" : "Түвшин нэмэх"}
                    </Button>
                    {isLevelEdit && (
                      <Button type="button" variant="outline" onClick={resetLevelForm}>
                        Болих
                      </Button>
                    )}
                  </div>
                </Stack>
              </form>
            )}
          </Stack>
        </Card>
      </div>
    </PageContainer>
  );
}
