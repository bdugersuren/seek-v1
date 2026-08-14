"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Select, Input, Text, Icons, IconButton } from "@seek/ui";
import { FieldLabel, CollapsibleCard } from "../builders/HelperComponents";
import { ExplorerTopicTree } from "../../../components/workspace";
import { bloomLabels, competencyLabels, difficultyLabels } from "../mock-data";
import type { QuestionTopicMapping, TopicNode } from "../types";

interface StepTwoProps {
  mappings: QuestionTopicMapping[];
  setMappings: (mappings: QuestionTopicMapping[]) => void;
  validationTouched: boolean;
  topics: any[];
  difficultyLevels: any[];
  cognitiveLevels: any[];
  competenceTypes: any[];
  loading: boolean;
  assessmentContexts?: any[];
  difficultyScales?: any[];
  competenceFrameworks?: any[];
  cognitiveFrameworks?: any[];
  audienceTypes?: any[];
  audienceLevels?: any[];
  selectedContextId?: string;
  setSelectedContextId?: (id: string) => void;
}

/**
 * StepTwo - Wizard-ийн 2-р шат: Асуултыг сэдэвтэй холбож, хүндрэл, танин мэдэхүйн түвшин ба ур чадварын үнэлгээг тохируулах хуудас.
 */
export function StepTwo({
  mappings,
  setMappings,
  validationTouched,
  topics,
  difficultyLevels,
  cognitiveLevels,
  competenceTypes,
  loading,
  assessmentContexts = [],
  difficultyScales = [],
  competenceFrameworks = [],
  cognitiveFrameworks = [],
  audienceTypes = [],
  audienceLevels = [],
  selectedContextId = "",
  setSelectedContextId = () => {},
}: StepTwoProps) {
  const selectedIds = mappings.map((mapping) => mapping.topicId);
  const [openTopicIds, setOpenTopicIds] = useState<string[]>([]);
  const [selectedAudienceType, setSelectedAudienceType] = useState<string>("");
  const [openAudienceLevelIds, setOpenAudienceLevelIds] = useState<string[]>([]);

  useEffect(() => {
    if (topics && topics.length > 0 && openTopicIds.length === 0) {
      setOpenTopicIds(topics.map(t => t.id));
    }
  }, [topics]);

  useEffect(() => {
    if (audienceTypes && audienceTypes.length > 0 && !selectedAudienceType) {
      setSelectedAudienceType(audienceTypes[0].id);
    }
  }, [audienceTypes, selectedAudienceType]);

  const selectedAudienceLevelIds = useMemo(() => {
    return mappings.map(m => m.audienceLevelId).filter(Boolean) as string[];
  }, [mappings]);

  const nestedAudienceLevels = useMemo(() => {
    if (!selectedAudienceType || !audienceLevels || audienceLevels.length === 0) return [];
    
    const filteredLevels = audienceLevels.filter(al => al.audienceTypeId === selectedAudienceType);
    const nodesMap: Record<string, any> = {};
    const roots: any[] = [];

    filteredLevels.forEach((l) => {
      nodesMap[l.id] = {
        id: l.id,
        label: l.name || l.code,
        children: [],
      };
    });

    filteredLevels.forEach((l) => {
      const node = nodesMap[l.id];
      if (l.parentId && nodesMap[l.parentId]) {
        nodesMap[l.parentId].children = nodesMap[l.parentId].children || [];
        nodesMap[l.parentId].children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [selectedAudienceType, audienceLevels]);

  const toggleAudienceLevel = (lvlId: string) => {
    const isSelected = selectedAudienceLevelIds.includes(lvlId);
    setMappings(
      mappings.map(m => ({
        ...m,
        audienceLevelId: isSelected ? undefined : lvlId,
        audienceTypeId: isSelected ? undefined : selectedAudienceType,
      }))
    );
  };

  // Сэдвийн хавтгай жагсаалтыг мод (Tree) хэлбэрт хөрвүүлэх функц
  const computedTopicNodes = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    
    const nodesMap: Record<string, TopicNode> = {};
    const roots: TopicNode[] = [];

    topics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        label: t.title || t.name,
        children: [],
      };
    });

    topics.forEach((t) => {
      const node = nodesMap[t.id];
      if (t.parentId && nodesMap[t.parentId]) {
        nodesMap[t.parentId].children = nodesMap[t.parentId].children || [];
        nodesMap[t.parentId].children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [topics]);

  const getNestedSelectOptions = (items: any[], parentId: string | null = null, depth = 0): any[] => {
    const list: any[] = [];
    const roots = items.filter(i => i.parentId === parentId);
    roots.forEach(node => {
      list.push({
        value: node.id,
        label: `${"\u00A0".repeat(depth * 3)}${node.name || node.label || node.title || node.code}`,
      });
      const children = getNestedSelectOptions(items, node.id, depth + 1);
      list.push(...children);
    });
    return list;
  };

  const toggleTopic = (topic: { id: string; label: string }) => {
    if (selectedIds.includes(topic.id)) {
      setMappings(mappings.filter((mapping) => mapping.topicId !== topic.id));
      return;
    }
    const activeContext = assessmentContexts.find(c => c.id === selectedContextId);
    setMappings([
      ...mappings,
      {
        topicId: topic.id,
        topicName: topic.label,
        bloomLevel: "apply",
        competencyType: "knowledge",
        difficulty: "medium",
        weight: 1,
        assessmentContextId: selectedContextId,
        cognitiveFrameworkId: activeContext?.cognitiveFrameworkId || "",
        difficultyScaleId: activeContext?.difficultyScaleId || "",
        competenceFrameworkId: activeContext?.competenceFrameworkId || "",
        audienceTypeId: activeContext?.audienceTypeId || "",
        audienceLevelId: activeContext?.audienceLevelId || "",
        competencies: [],
      },
    ]);
  };

  const updateMapping = (topicId: string, patch: Partial<QuestionTopicMapping>) =>
    setMappings(
      mappings.map((mapping) =>
        mapping.topicId === topicId ? { ...mapping, ...patch } : mapping,
      ),
    );

  const addCompetence = (topicId: string, compId: string, compName: string) => {
    const mapping = mappings.find(m => m.topicId === topicId);
    if (!mapping) return;
    const comps = mapping.competencies || [];
    if (comps.some(c => c.competenceId === compId)) return;

    updateMapping(topicId, {
      competencies: [...comps, { competenceId: compId, weight: 1.0, name: compName }]
    });
  };

  const removeCompetence = (topicId: string, compId: string) => {
    const mapping = mappings.find(m => m.topicId === topicId);
    if (!mapping) return;
    const comps = mapping.competencies || [];

    updateMapping(topicId, {
      competencies: comps.filter(c => c.competenceId !== compId)
    });
  };

  const updateCompWeight = (topicId: string, compId: string, weight: number) => {
    const mapping = mappings.find(m => m.topicId === topicId);
    if (!mapping) return;
    const comps = mapping.competencies || [];

    updateMapping(topicId, {
      competencies: comps.map(c => c.competenceId === compId ? { ...c, weight } : c)
    });
  };

  return (
    <div className="space-y-seek-5">
      <div className="bg-surface border border-border rounded-seek-lg p-seek-4 shadow-seek-xs space-y-seek-2">
        <Text className="text-sm font-bold text-foreground block mb-2">Үнэлгээний Контекст</Text>
        <Select
          value={selectedContextId}
          onChange={(e) => setSelectedContextId(e.target.value)}
          options={[
            { value: "", label: "Контекст сонгох..." },
            ...assessmentContexts.map(c => ({ value: c.id, label: c.name }))
          ]}
        />
        <p className="text-xs text-muted">
          Сонгосон контекстоос хамааран хүндрэлийн шатлал, танин мэдэхүйн түвшин болон ур чадварын хүрээ автоматаар шүүгдэнэ.
        </p>
      </div>

      <div className="grid gap-seek-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="space-y-seek-4">
          <CollapsibleCard title="Сэдвийн сан" subtitle="Дэд сэдэв бүрийг олноор сонгож асуултанд холбоно." icon={Icons.Menu}>
            <div className="space-y-seek-3">
              {loading ? (
                <div className="flex items-center justify-center py-seek-8">
                  <Text variant="muted" className="text-xs">Сэдвийн санг уншиж байна...</Text>
                </div>
              ) : (
                <ExplorerTopicTree
                  nodes={computedTopicNodes as any}
                  selectedIds={selectedIds}
                  openIds={openTopicIds}
                  onToggle={(topicId: string) => {
                    const targetTopic = topics.find(t => t.id === topicId);
                    if (targetTopic) {
                      toggleTopic({ id: targetTopic.id, label: targetTopic.title || targetTopic.name });
                    }
                  }}
                  onToggleOpen={(topicId: string) => {
                    setOpenTopicIds(prev => 
                      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
                    );
                  }}
                />
              )}
            </div>
            {validationTouched && mappings.length === 0 && (
              <Text className="mt-seek-3 text-sm font-semibold text-danger">
                Дор хаяж нэг дэд сэдэв сонгоно уу.
              </Text>
            )}
          </CollapsibleCard>

          <CollapsibleCard title="Зорилтот бүлэг" subtitle="Зорилтот бүлгийн түвшинг сонгож холбоно." icon={Icons.User || Icons.Info}>
            <div className="space-y-seek-3">
              <Select
                value={selectedAudienceType}
                onChange={(e) => {
                  setSelectedAudienceType(e.target.value);
                }}
                options={[
                  { value: "", label: "Төрөл сонгох..." },
                  ...audienceTypes.map((t: any) => ({ value: t.id, label: t.name }))
                ]}
              />
              {selectedAudienceType && nestedAudienceLevels.length > 0 && (
                <div className="mt-seek-2 border border-border/40 rounded p-seek-2 bg-muted-background/10">
                  <ExplorerTopicTree
                    nodes={nestedAudienceLevels as any}
                    selectedIds={selectedAudienceLevelIds}
                    openIds={openAudienceLevelIds}
                    onToggle={(lvlId: string) => toggleAudienceLevel(lvlId)}
                    onToggleOpen={(lvlId: string) => {
                      setOpenAudienceLevelIds(prev => 
                        prev.includes(lvlId) ? prev.filter(id => id !== lvlId) : [...prev, lvlId]
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </CollapsibleCard>
        </div>

        <main className="space-y-seek-4">
          <CollapsibleCard title="Сонгосон дэд сэдвийн mapping" subtitle="Сонгосон сэдэв бүрийн хүндрэл, танин мэдэхүйн түвшин болон үнэлэх ур чадваруудыг нарийвчлан тохируулна." icon={Icons.Settings}>
            {mappings.length === 0 ? (
              <div className="rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
                <Text className="font-semibold">Сэдэв сонгоогүй байна</Text>
                <Text variant="muted" className="mt-1 text-sm">
                  Зүүн талын сэдвийн сангаас дэд сэдэв сонгоход энд тохиргоо гарна.
                </Text>
              </div>
            ) : (
              <div className="space-y-seek-4">
                {mappings.map((mapping) => {
                  const mappingComps = mapping.competencies || [];

                  return (
                    <div
                      key={mapping.topicId}
                      className="rounded-seek-lg border border-border bg-surface p-seek-4 shadow-seek-xs space-y-seek-4"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-border/50 pb-seek-3">
                        <div>
                          <Text className="font-bold text-foreground">{mapping.topicName}</Text>
                          <Text variant="muted" className="text-xs font-mono">
                            ID: {mapping.topicId}
                          </Text>
                        </div>
                        <IconButton
                          ariaLabel="Устгах"
                          onClick={() => toggleTopic({ id: mapping.topicId, label: mapping.topicName })}
                          className="text-danger hover:bg-danger-background hover:bg-surface-hover"
                        >
                          <Icons.Trash size={16} />
                        </IconButton>
                      </div>

                      {/* Classifications Grid for Frameworks & Scales */}
                      <div className="grid gap-seek-4 sm:grid-cols-2 md:grid-cols-4">
                        {/* Cognitive Framework & Level */}
                        <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Танин мэдэхүйн хүрээ</span>
                            <Select
                              value={mapping.cognitiveFrameworkId || ""}
                              onChange={(e) => {
                                const fwId = e.target.value;
                                updateMapping(mapping.topicId, { 
                                  cognitiveFrameworkId: fwId,
                                  bloomLevel: "" 
                                });
                              }}
                              options={[
                                { value: "", label: "Хүрээ сонгох..." },
                                ...cognitiveFrameworks.map((cf: any) => ({ value: cf.id, label: cf.name }))
                              ]}
                            />
                          </label>
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Танин мэдэхүйн түвшин</span>
                            <Select
                              value={mapping.bloomLevel}
                              onChange={(e) => updateMapping(mapping.topicId, { bloomLevel: e.target.value })}
                              options={[
                                { value: "", label: "Түвшин сонгох..." },
                                ...cognitiveLevels
                                  .filter((cl: any) => cl.cognitiveFrameworkId === mapping.cognitiveFrameworkId)
                                  .map((cl: any) => ({ value: cl.code, label: cl.name }))
                              ]}
                              disabled={!mapping.cognitiveFrameworkId}
                            />
                          </label>
                        </div>

                        {/* Difficulty Scale & Level */}
                        <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Хүндрэлийн шатлал</span>
                            <Select
                              value={mapping.difficultyScaleId || ""}
                              onChange={(e) => {
                                const dsId = e.target.value;
                                updateMapping(mapping.topicId, { 
                                  difficultyScaleId: dsId,
                                  difficulty: "" 
                                });
                              }}
                              options={[
                                { value: "", label: "Шатлал сонгох..." },
                                ...difficultyScales.map((ds: any) => ({ value: ds.id, label: ds.name }))
                              ]}
                            />
                          </label>
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Хүндрэлийн түвшин</span>
                            <Select
                              value={mapping.difficulty}
                              onChange={(e) => updateMapping(mapping.topicId, { difficulty: e.target.value })}
                              options={[
                                { value: "", label: "Түвшин сонгох..." },
                                ...difficultyLevels
                                  .filter((dl: any) => dl.difficultyScaleId === mapping.difficultyScaleId)
                                  .map((dl: any) => ({ value: dl.code, label: dl.name }))
                              ]}
                              disabled={!mapping.difficultyScaleId}
                            />
                          </label>
                        </div>

                        {/* Audience Type & Level */}
                        <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Зорилтот бүлгийн төрөл</span>
                            <Select
                              value={mapping.audienceTypeId || ""}
                              onChange={(e) => {
                                const atId = e.target.value;
                                updateMapping(mapping.topicId, { 
                                  audienceTypeId: atId,
                                  audienceLevelId: "" 
                                });
                              }}
                              options={[
                                { value: "", label: "Төрөл сонгох..." },
                                ...audienceTypes.map((at: any) => ({ value: at.id, label: at.name }))
                              ]}
                            />
                          </label>
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Зорилтот бүлгийн түвшин</span>
                            <Select
                              value={mapping.audienceLevelId || ""}
                              onChange={(e) => updateMapping(mapping.topicId, { audienceLevelId: e.target.value })}
                              options={[
                                { value: "", label: "Түвшин сонгох..." },
                                ...getNestedSelectOptions(
                                  audienceLevels.filter((al: any) => al.audienceTypeId === mapping.audienceTypeId),
                                  null
                                )
                              ]}
                              disabled={!mapping.audienceTypeId}
                            />
                          </label>
                        </div>

                        {/* Competence Framework & Weight */}
                        <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Ур чадварын хүрээ</span>
                            <Select
                              value={mapping.competenceFrameworkId || ""}
                              onChange={(e) => {
                                const cfId = e.target.value;
                                updateMapping(mapping.topicId, { 
                                  competenceFrameworkId: cfId,
                                  competencies: [] 
                                });
                              }}
                              options={[
                                { value: "", label: "Хүрээ сонгох..." },
                                ...competenceFrameworks.map((cf: any) => ({ value: cf.id, label: cf.name }))
                              ]}
                            />
                          </label>
                          <label className="space-y-seek-1 block">
                            <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Жин (Weight)</span>
                            <Input
                              type="number"
                              min={0.1}
                              max={1.0}
                              step={0.1}
                              value={mapping.weight}
                              onChange={(event) =>
                                updateMapping(mapping.topicId, {
                                  weight: Number(event.target.value),
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>

                      {/* Competence Mapping Section */}
                      <div className="bg-muted-background/40 p-seek-3 rounded-seek-md space-y-seek-3 border border-border/40">
                        <div className="flex items-center justify-between">
                          <Text className="text-xs font-bold text-foreground">Үнэлэх ур чадварууд (Competencies)</Text>
                          
                          <div className="relative w-48">
                            <Select
                              value=""
                              aria-label="Ур чадвар нэмэх"
                              onChange={(e) => {
                                const val = e.target.value;
                                if (!val) return;
                                const targetComp = competenceTypes.find(c => c.id === val);
                                if (targetComp) {
                                  addCompetence(mapping.topicId, targetComp.id, targetComp.name);
                                }
                              }}
                              options={[
                                { value: "", label: "+ Ур чадвар нэмэх" },
                                ...competenceTypes
                                  .filter(c => c.competenceFrameworkId === mapping.competenceFrameworkId && !mappingComps.some(mc => mc.competenceId === c.id))
                                  .map(c => ({ value: c.id, label: c.name }))
                              ]}
                              disabled={!mapping.competenceFrameworkId}
                            />
                          </div>
                        </div>

                        {mappingComps.length === 0 ? (
                          <Text variant="muted" className="text-xs italic py-seek-2">
                            Ур чадвар холбоогүй байна. Баруун талын цэснээс сонгож нэмнэ үү.
                          </Text>
                        ) : (
                          <div className="space-y-seek-2">
                            {mappingComps.map((c) => (
                              <div 
                                key={c.competenceId} 
                                className="flex items-center justify-between gap-seek-4 bg-surface px-seek-3 py-seek-2 rounded border border-border/80 text-xs"
                              >
                                <div className="flex-1">
                                  <span className="font-medium text-foreground">{c.name}</span>
                                  <span className="ml-seek-2 font-mono text-[10px] text-muted-foreground">ID: {c.competenceId}</span>
                                </div>
                                <div className="flex items-center gap-seek-3">
                                  <span className="text-muted-foreground text-[10px] font-semibold">Жин:</span>
                                  <Input
                                    type="number"
                                    min={0.1}
                                    max={1.0}
                                    step={0.1}
                                    className="w-20 text-xs h-7 py-1 px-2"
                                    value={c.weight}
                                    onChange={(e) => updateCompWeight(mapping.topicId, c.competenceId, Number(e.target.value))}
                                  />
                                  <IconButton
                                    ariaLabel="Ур чадвар хасах"
                                    onClick={() => removeCompetence(mapping.topicId, c.competenceId)}
                                    className="text-danger hover:bg-danger-background hover:bg-surface-hover h-7 w-7"
                                  >
                                    <Icons.Close size={14} />
                                  </IconButton>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CollapsibleCard>
        </main>
      </div>
    </div>
  );
}
