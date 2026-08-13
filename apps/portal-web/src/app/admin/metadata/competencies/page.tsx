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
  fetchCompetenceFrameworks,
  createCompetenceFramework,
  updateCompetenceFramework,
  deleteCompetenceFramework,
  fetchCompetenceTypes,
  createCompetenceType,
  updateCompetenceType,
  deleteCompetenceType,
} from "@/features/assessor-workspace/api";
import type { CompetenceFramework, CompetenceType } from "@/features/assessments/types";

export default function CompetenciesManagementPage() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const [frameworks, setFrameworks] = useState<CompetenceFramework[]>([]);
  const [competencies, setCompetencies] = useState<CompetenceType[]>([]);
  const [loadingFrameworks, setLoadingFrameworks] = useState(true);
  const [loadingCompetencies, setLoadingCompetencies] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<CompetenceFramework | null>(null);
  const [selectedCompetence, setSelectedCompetence] = useState<CompetenceType | null>(null);

  // Framework form states
  const [frameName, setFrameName] = useState("");
  const [frameCode, setFrameCode] = useState("");
  const [frameVersion, setFrameVersion] = useState("1.0");
  const [frameDescription, setFrameDescription] = useState("");
  const [isFrameEdit, setIsFrameEdit] = useState(false);

  // Competence form states
  const [compName, setCompName] = useState("");
  const [compCode, setCompCode] = useState("");
  const [compDescription, setCompDescription] = useState("");
  const [compParentId, setCompParentId] = useState<string | null>(null);
  const [isCompEdit, setIsCompEdit] = useState(false);
  const [draggedNode, setDraggedNode] = useState<CompetenceType | null>(null);

  const loadFrameworks = async () => {
    setLoadingFrameworks(true);
    try {
      const data = await fetchCompetenceFrameworks();
      setFrameworks(data || []);
      if (data && data.length > 0 && !selectedFramework) {
        setSelectedFramework(data[0]);
      }
    } catch (err) {
      console.error(err);
      showToast("Ур чадварын хүрээг татаж чадсангүй.", "danger");
    } finally {
      setLoadingFrameworks(false);
    }
  };

  const loadCompetencies = async (frameworkId: string) => {
    setLoadingCompetencies(true);
    try {
      const data = await fetchCompetenceTypes();
      // Зөвхөн тухайн framework-д хамаарах компетенцуудыг шүүх
      const filtered = (data || []).filter((c) => c.competenceFrameworkId === frameworkId);
      setCompetencies(filtered);
    } catch (err) {
      console.error(err);
      showToast("Ур чадваруудыг татаж чадсангүй.", "danger");
    } finally {
      setLoadingCompetencies(false);
    }
  };

  useEffect(() => {
    loadFrameworks();
  }, []);

  useEffect(() => {
    if (selectedFramework) {
      loadCompetencies(selectedFramework.id);
      resetCompForm();
    }
  }, [selectedFramework]);

  // Framework actions
  const handleSaveFramework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frameName.trim()) {
      showToast("Нэр заавал оруулна.", "warning");
      return;
    }

    try {
      if (isFrameEdit && selectedFramework) {
        await updateCompetenceFramework(selectedFramework.id, {
          name: frameName,
          description: frameDescription,
        });
        showToast("Ур чадварын хүрээ засагдлаа.", "success");
      } else {
        await createCompetenceFramework({
          name: frameName,
          code: frameCode || `FRAME-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          version: frameVersion,
          description: frameDescription,
        });
        showToast("Шинэ ур чадварын хүрээ үүсгэлээ.", "success");
      }
      resetFrameForm();
      loadFrameworks();
    } catch (err) {
      console.error(err);
      showToast("Хадгалж чадсангүй.", "danger");
    }
  };

  const handleDeleteFramework = (id: string) => {
    showDialog({
      title: "Ур чадварын хүрээг устгах уу?",
      description: "Энэ хүрээг устгаснаар түүнд хамаарах бүх ур чадвар устгагдах болно.",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteCompetenceFramework(id);
          showToast("Хүрээ устгагдлаа.", "success");
          if (selectedFramework?.id === id) {
            setSelectedFramework(null);
          }
          loadFrameworks();
        } catch (err) {
          console.error(err);
          showToast("Устгаж чадсангүй.", "danger");
        }
      },
    });
  };

  // Competence actions
  const handleSaveCompetence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFramework) return;
    if (!compName.trim()) {
      showToast("Ур чадварын нэр заавал байна.", "warning");
      return;
    }

    try {
      if (isCompEdit && selectedCompetence) {
        await updateCompetenceType(selectedCompetence.id, {
          name: compName,
          description: compDescription,
          parentId: compParentId,
        });
        showToast("Ур чадвар амжилттай засагдлаа.", "success");
      } else {
        await createCompetenceType({
          competenceFrameworkId: selectedFramework.id,
          name: compName,
          code: compCode || `COMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          description: compDescription,
          parentId: compParentId,
        });
        showToast("Ур чадвар нэмэгдлээ.", "success");
      }
      resetCompForm();
      loadCompetencies(selectedFramework.id);
    } catch (err) {
      console.error(err);
      showToast("Үйлдэл амжилтгүй боллоо.", "danger");
    }
  };

  const handleDeleteCompetence = (id: string) => {
    if (!selectedFramework) return;
    showDialog({
      title: "Ур чадварыг устгах уу?",
      description: "Энэ ур чадвар болон түүний дэд ур чадварууд устгагдах болно.",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteCompetenceType(id);
          showToast("Ур чадвар устгагдлаа.", "success");
          if (selectedCompetence?.id === id) {
            setSelectedCompetence(null);
          }
          loadCompetencies(selectedFramework.id);
        } catch (err) {
          console.error(err);
          showToast("Устгаж чадсангүй.", "danger");
        }
      },
    });
  };

  const resetFrameForm = () => {
    setFrameName("");
    setFrameCode("");
    setFrameVersion("1.0");
    setFrameDescription("");
    setIsFrameEdit(false);
  };

  const resetCompForm = () => {
    setCompName("");
    setCompCode("");
    setCompDescription("");
    setCompParentId(null);
    setSelectedCompetence(null);
    setIsCompEdit(false);
  };

  const selectFrameForEdit = (frame: CompetenceFramework) => {
    setSelectedFramework(frame);
    setFrameName(frame.name);
    setFrameCode(frame.code);
    setFrameVersion(frame.version);
    setFrameDescription(frame.description || "");
    setIsFrameEdit(true);
  };

  const selectCompForEdit = (comp: CompetenceType) => {
    setSelectedCompetence(comp);
    setCompName(comp.name);
    setCompCode(comp.code);
    setCompDescription(comp.description || "");
    setCompParentId(comp.parentId || null);
    setIsCompEdit(true);
  };

  const selectCompForAddChild = (parent: CompetenceType) => {
    resetCompForm();
    setCompParentId(parent.id);
    setSelectedCompetence(parent);
    setIsCompEdit(false);
  };

  // Competence tree construction
  const buildCompTree = (nodes: CompetenceType[], pId: string | null = null): CompetenceType[] => {
    return nodes
      .filter((n) => n.parentId === pId)
      .map((n) => ({
        ...n,
        children: buildCompTree(nodes, n.id),
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const competenceTree = buildCompTree(competencies);

  // Drag and drop logic for competencies
  const handleDragStart = (e: React.DragEvent, node: CompetenceType) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetNode: CompetenceType) => {
    e.preventDefault();
    if (!draggedNode || draggedNode.id === targetNode.id || !selectedFramework) return;

    let p = targetNode.parentId;
    while (p) {
      if (p === draggedNode.id) {
        showToast("Ур чадварыг өөрийнх нь дэд хэсэг рүү шилжүүлэх боломжгүй.", "warning");
        return;
      }
      const parentNode = competencies.find((c) => c.id === p);
      p = parentNode ? parentNode.parentId : null;
    }

    try {
      await updateCompetenceType(draggedNode.id, {
        parentId: targetNode.id,
      });
      showToast(`${draggedNode.name} ур чадварыг ${targetNode.name}-ийн дэд болголоо.`, "success");
      loadCompetencies(selectedFramework.id);
    } catch (err) {
      console.error(err);
      showToast("Байршил өөрчилж чадсангүй.", "danger");
    } finally {
      setDraggedNode(null);
    }
  };

  // Recursive Comp Node Component
  const CompNode = ({ node, depth = 0 }: { node: CompetenceType; depth: number }) => {
    const hasChildren = node.children && node.children.length > 0;
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div
        className="select-none"
        draggable
        onDragStart={(e) => handleDragStart(e, node)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, node)}
      >
        <div
          className={`flex items-center justify-between gap-seek-2 rounded-seek-md border px-seek-3 py-seek-2 transition-all cursor-grab active:cursor-grabbing mb-seek-2 ${
            selectedCompetence?.id === node.id && isCompEdit
              ? "border-primary bg-primary/5"
              : "border-border bg-surface hover:bg-surface-hover"
          }`}
          style={{ marginLeft: `${depth * 1.5}rem` }}
        >
          <div className="flex items-center gap-seek-2">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1 rounded hover:bg-muted-background ${hasChildren ? "opacity-100" : "opacity-0 cursor-default"}`}
            >
              <Icons.ChevronRight className={`h-4 w-4 transition-transform ${!collapsed && hasChildren ? "rotate-90" : ""}`} />
            </button>
            <Icons.Dashboard className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-sans font-medium text-foreground">{node.name}</span>
              <span className="ml-seek-2 font-mono text-xs text-muted-foreground">{node.code}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              ariaLabel="Дэд ур чадвар нэмэх"
              className="hover:bg-surface-hover text-foreground"
              onClick={() => selectCompForAddChild(node)}
            >
              <Icons.FilePlus size={16} />
            </IconButton>
            <IconButton
              ariaLabel="Засах"
              className="hover:bg-surface-hover text-foreground"
              onClick={() => selectCompForEdit(node)}
            >
              <Icons.SavePen size={16} />
            </IconButton>
            <IconButton
              ariaLabel="Устгах"
              onClick={() => handleDeleteCompetence(node.id)}
              className="text-danger hover:bg-danger-background"
            >
              <Icons.Trash size={16} />
            </IconButton>
          </div>
        </div>
        {!collapsed && hasChildren && (
          <div>
            {node.children!.map((child) => (
              <CompNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <PageTitle
        title="Ур чадварын сан удирдлага"
        subtitle="Ур чадварын стандартуудыг (Framework) үүсгэх болон тэдгээрт хамаарах нарийвчилсан ур чадварыг шатлалаар удирдах цонх."
      />

      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[18rem_1fr_22rem] mt-seek-4">
        {/* ЗҮҮН ТАЛ: Frameworks List */}
        <Card className="min-h-[400px]">
          <Stack gap={4}>
            <Heading level={3}>Чадамжийн хүрээ</Heading>
            {loadingFrameworks ? (
              <Text variant="muted">Уншиж байна...</Text>
            ) : (
              <div className="flex flex-col gap-seek-2">
                {frameworks.map((f) => (
                  <div
                    key={f.id}
                    className={`flex items-center justify-between gap-seek-2 px-seek-3 py-seek-2 rounded-seek-md border transition-all cursor-pointer ${
                      selectedFramework?.id === f.id
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-surface hover:bg-surface-hover"
                    }`}
                    onClick={() => setSelectedFramework(f)}
                  >
                    <div>
                      <Text className="text-sm">{f.name}</Text>
                      <Text variant="muted" className="text-xs">
                        v{f.version} · {f.code}
                      </Text>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton
                        ariaLabel="Засах"
                        className="hover:bg-surface-hover text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectFrameForEdit(f);
                        }}
                      >
                        <Icons.SavePen size={14} />
                      </IconButton>
                      <IconButton
                        ariaLabel="Устгах"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFramework(f.id);
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
                  onClick={resetFrameForm}
                  className="mt-seek-2"
                >
                  Шинэ хүрээ үүсгэх
                </Button>
              </div>
            )}
          </Stack>
        </Card>

        {/* ДУНД ТАЛ: Competencies Tree View */}
        <Card className="min-h-[400px]">
          <Stack gap={4}>
            <Heading level={3}>
              {selectedFramework ? `"${selectedFramework.name}" - Ур чадварууд` : "Сонгогдсон хүрээ байхгүй"}
            </Heading>
            <Text variant="muted" className="text-sm">
              Ур чадварын олон түвшинт шатлалыг чирж удирдах (Drag-and-drop) боломжтой.
            </Text>

            {loadingCompetencies ? (
              <div className="flex h-48 items-center justify-center">
                <Text variant="muted">Уншиж байна...</Text>
              </div>
            ) : !selectedFramework ? (
              <Text variant="muted" className="text-center py-12">
                Ур чадварыг харахын тулд эхлээд зүүн талаас хүрээ сонгоно уу.
              </Text>
            ) : competencies.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
                <Icons.Dashboard size={40} className="text-muted-foreground" />
                <Text className="font-semibold mt-seek-3">Ур чадвар байхгүй байна</Text>
                <Text variant="muted" className="mt-1 text-sm">
                  Энэ хүрээнд шинээр ур чадвар нэмнэ үү.
                </Text>
              </div>
            ) : (
              <div className="space-y-seek-2 max-h-[600px] overflow-y-auto pr-seek-2">
                {competenceTree.map((node) => (
                  <CompNode key={node.id} node={node} depth={0} />
                ))}
              </div>
            )}
          </Stack>
        </Card>

        {/* БАРУУН ТАЛ: Формууд */}
        <Card className="h-fit sticky top-seek-5">
          <Stack gap={6}>
            {/* FRAMEWORK FORM */}
            {!isCompEdit && (
              <form onSubmit={handleSaveFramework}>
                <Stack gap={5}>
                  <Heading level={3}>
                    {isFrameEdit ? "Хүрээ засах" : "Шинэ хүрээ үүсгэх"}
                  </Heading>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Хүрээний нэр</span>
                    <Input
                      required
                      placeholder="Жишээ: IT Specialist Core Standards"
                      value={frameName}
                      onChange={(e) => setFrameName(e.target.value)}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-seek-3">
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Код</span>
                      <Input
                        placeholder="IT-STD-01"
                        disabled={isFrameEdit}
                        value={frameCode}
                        onChange={(e) => setFrameCode(e.target.value)}
                      />
                    </label>
                    <label className="space-y-seek-2">
                      <span className="font-sans text-sm font-medium text-foreground">Хувилбар</span>
                      <Input
                        required
                        placeholder="1.0"
                        value={frameVersion}
                        onChange={(e) => setFrameVersion(e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Тайлбар</span>
                    <Textarea
                      placeholder="Хүрээний дэлгэрэнгүй тодорхойлолт..."
                      rows={3}
                      value={frameDescription}
                      onChange={(e) => setFrameDescription(e.target.value)}
                    />
                  </label>
                  <div className="flex gap-seek-2 pt-seek-1">
                    <Button type="submit" className="flex-1">
                      {isFrameEdit ? "Хүрээ засах" : "Хүрээ үүсгэх"}
                    </Button>
                    {isFrameEdit && (
                      <Button type="button" variant="outline" onClick={resetFrameForm}>
                        Болих
                      </Button>
                    )}
                  </div>
                </Stack>
              </form>
            )}

            {/* COMPETENCE FORM */}
            {selectedFramework && (
              <form onSubmit={handleSaveCompetence}>
                <Stack gap={5} className="border-t border-border pt-seek-5">
                  <Heading level={3}>
                    {isCompEdit
                      ? "Ур чадвар засах"
                      : compParentId
                      ? `Дэд ур чадвар нэмэх`
                      : "Ур чадвар нэмэх"}
                  </Heading>

                  {compParentId && (
                    <div className="rounded-seek-md border border-info-border bg-info-background px-seek-3 py-seek-2 flex items-center justify-between">
                      <Text className="text-xs font-semibold text-info-foreground">
                        Эцэг: {selectedCompetence?.name}
                      </Text>
                      <button
                        type="button"
                        onClick={() => setCompParentId(null)}
                        className="text-xs underline text-info-foreground"
                      >
                        Цэвэрлэх
                      </button>
                    </div>
                  )}

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Ур чадварын нэр</span>
                    <Input
                      required
                      placeholder="Жишээ: React хөгжүүлэлт"
                      value={compName}
                      onChange={(e) => setCompName(e.target.value)}
                    />
                  </label>

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Код</span>
                    <Input
                      placeholder="Жишээ: FE-REACT-01"
                      disabled={isCompEdit}
                      value={compCode}
                      onChange={(e) => setCompCode(e.target.value)}
                    />
                  </label>

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Тайлбар</span>
                    <Textarea
                      placeholder="Чадамжийн хүлээгдэж буй үр дүн, тодорхойлолт..."
                      rows={3}
                      value={compDescription}
                      onChange={(e) => setCompDescription(e.target.value)}
                    />
                  </label>

                  <div className="flex gap-seek-2 pt-seek-1">
                    <Button type="submit" className="flex-1">
                      {isCompEdit ? "Засах" : "Нэмэх"}
                    </Button>
                    {(isCompEdit || compParentId) && (
                      <Button type="button" variant="outline" onClick={resetCompForm}>
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
