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
  fetchAudienceTypes,
  createAudienceType,
  updateAudienceType,
  deleteAudienceType,
  fetchAudienceLevels,
  createAudienceLevel,
  updateAudienceLevel,
  deleteAudienceLevel,
} from "@/features/assessor-workspace/api";
import type { AudienceType, AudienceLevel } from "@/features/assessments/types";

export default function AudienceTypesManagementPage() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const [types, setTypes] = useState<AudienceType[]>([]);
  const [levels, setLevels] = useState<AudienceLevel[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [selectedType, setSelectedType] = useState<AudienceType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<AudienceLevel | null>(null);

  // Type form states
  const [typeName, setTypeName] = useState("");
  const [typeCode, setTypeCode] = useState("");
  const [typeDescription, setTypeDescription] = useState("");
  const [isTypeEdit, setIsTypeEdit] = useState(false);

  // Level form states
  const [levelName, setLevelName] = useState("");
  const [levelCode, setLevelCode] = useState("");
  const [levelOrder, setLevelOrder] = useState(1);
  const [levelParentId, setLevelParentId] = useState<string | null>(null);
  const [isLevelEdit, setIsLevelEdit] = useState(false);
  const [draggedNode, setDraggedNode] = useState<AudienceLevel | null>(null);

  const loadTypes = async () => {
    setLoadingTypes(true);
    try {
      const data = await fetchAudienceTypes();
      setTypes(data || []);
      if (data && data.length > 0 && !selectedType) {
        setSelectedType(data[0]);
      }
    } catch (err) {
      console.error(err);
      showToast("Зорилтот бүлгийн төрлийг татаж чадсангүй.", "danger");
    } finally {
      setLoadingTypes(false);
    }
  };

  const loadLevels = async (typeId: string) => {
    setLoadingLevels(true);
    try {
      const data = await fetchAudienceLevels();
      const filtered = (data || []).filter((l) => l.audienceTypeId === typeId);
      setLevels(filtered);
    } catch (err) {
      console.error(err);
      showToast("Зорилтот бүлгийн түвшнүүдийг татаж чадсангүй.", "danger");
    } finally {
      setLoadingLevels(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      loadLevels(selectedType.id);
      resetLevelForm();
    }
  }, [selectedType]);

  // Type actions
  const handleSaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) {
      showToast("Нэр заавал оруулна.", "warning");
      return;
    }

    try {
      if (isTypeEdit && selectedType) {
        await updateAudienceType(selectedType.id, {
          name: typeName,
          description: typeDescription,
        });
        showToast("Зорилтот бүлгийн төрөл засагдлаа.", "success");
      } else {
        await createAudienceType({
          name: typeName,
          code: typeCode || `AUDIENCE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          description: typeDescription,
        });
        showToast("Шинэ зорилтот бүлгийн төрөл үүсгэлээ.", "success");
      }
      resetTypeForm();
      loadTypes();
    } catch (err) {
      console.error(err);
      showToast("Хадгалж чадсангүй.", "danger");
    }
  };

  const handleDeleteType = (id: string) => {
    showDialog({
      title: "Зорилтот бүлгийн төрлийг устгах уу?",
      description: "Энэ төрлийг устгаснаар түүнд хамаарах бүх зорилтот түвшин устах болно.",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteAudienceType(id);
          showToast("Төрөл устгагдлаа.", "success");
          if (selectedType?.id === id) {
            setSelectedType(null);
          }
          loadTypes();
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
    if (!selectedType) return;
    if (!levelName.trim() || !levelCode.trim()) {
      showToast("Нэр болон код заавал байна.", "warning");
      return;
    }

    try {
      if (isLevelEdit && selectedLevel) {
        await updateAudienceLevel(selectedLevel.id, {
          name: levelName,
          orderIndex: Number(levelOrder),
          parentId: levelParentId,
        });
        showToast("Түвшин амжилттай засагдлаа.", "success");
      } else {
        await createAudienceLevel({
          audienceTypeId: selectedType.id,
          name: levelName,
          code: levelCode,
          orderIndex: Number(levelOrder),
          parentId: levelParentId,
        });
        showToast("Түвшин нэмэгдлээ.", "success");
      }
      resetLevelForm();
      loadLevels(selectedType.id);
    } catch (err) {
      console.error(err);
      showToast("Түвшин хадгалж чадсангүй.", "danger");
    }
  };

  const handleDeleteLevel = (id: string) => {
    if (!selectedType) return;
    showDialog({
      title: "Зорилтот түвшнийг устгах уу?",
      description: "Энэ түвшинг устгахдаа итгэлтэй байна уу?",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteAudienceLevel(id);
          showToast("Түвшин устгагдлаа.", "success");
          if (selectedLevel?.id === id) {
            setSelectedLevel(null);
          }
          loadLevels(selectedType.id);
        } catch (err) {
          console.error(err);
          showToast("Устгаж чадсангүй.", "danger");
        }
      },
    });
  };

  const resetTypeForm = () => {
    setTypeName("");
    setTypeCode("");
    setTypeDescription("");
    setIsTypeEdit(false);
  };

  const resetLevelForm = () => {
    setLevelName("");
    setLevelCode("");
    setLevelOrder(levels.length + 1);
    setLevelParentId(null);
    setSelectedLevel(null);
    setIsLevelEdit(false);
  };

  const selectTypeForEdit = (type: AudienceType) => {
    setSelectedType(type);
    setTypeName(type.name);
    setTypeCode(type.code);
    setTypeDescription(type.description || "");
    setIsTypeEdit(true);
  };

  const selectLevelForEdit = (lvl: AudienceLevel) => {
    setSelectedLevel(lvl);
    setLevelName(lvl.name);
    setLevelCode(lvl.code);
    setLevelOrder(lvl.orderIndex);
    setLevelParentId(lvl.parentId || null);
    setIsLevelEdit(true);
  };

  const selectLevelForAddChild = (parent: AudienceLevel) => {
    resetLevelForm();
    setLevelParentId(parent.id);
    setSelectedLevel(parent);
    setIsLevelEdit(false);
  };

  // Build hierarchical audience levels tree
  const buildLevelTree = (nodes: AudienceLevel[], pId: string | null = null): AudienceLevel[] => {
    return nodes
      .filter((n) => n.parentId === pId)
      .map((n) => ({
        ...n,
        children: buildLevelTree(nodes, n.id),
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const levelTree = buildLevelTree(levels);

  // Drag and drop logic for audience levels
  const handleDragStart = (e: React.DragEvent, node: AudienceLevel) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetNode: AudienceLevel) => {
    e.preventDefault();
    if (!draggedNode || draggedNode.id === targetNode.id || !selectedType) return;

    let p = targetNode.parentId;
    while (p) {
      if (p === draggedNode.id) {
        showToast("Түвшнийг өөрийнх нь дэд түвшин рүү шилжүүлэх боломжгүй.", "warning");
        return;
      }
      const parentNode = levels.find((l) => l.id === p);
      p = parentNode ? parentNode.parentId : null;
    }

    try {
      await updateAudienceLevel(draggedNode.id, {
        parentId: targetNode.id,
      });
      showToast(`${draggedNode.name} түвшнийг ${targetNode.name}-ийн дэд болголоо.`, "success");
      loadLevels(selectedType.id);
    } catch (err) {
      console.error(err);
      showToast("Байршил өөрчилж чадсангүй.", "danger");
    } finally {
      setDraggedNode(null);
    }
  };

  // Recursive Level Node
  const LevelNode = ({ node, depth = 0 }: { node: AudienceLevel; depth: number }) => {
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
            selectedLevel?.id === node.id && isLevelEdit
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
            <Icons.User className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-sans font-medium text-foreground">{node.name}</span>
              <span className="ml-seek-2 font-mono text-xs text-muted-foreground">{node.code}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              ariaLabel="Дэд түвшин нэмэх"
              className="hover:bg-surface-hover text-foreground"
              onClick={() => selectLevelForAddChild(node)}
            >
              <Icons.FilePlus size={16} />
            </IconButton>
            <IconButton
              ariaLabel="Засах"
              className="hover:bg-surface-hover text-foreground"
              onClick={() => selectLevelForEdit(node)}
            >
              <Icons.SavePen size={16} />
            </IconButton>
            <IconButton
              ariaLabel="Устгах"
              onClick={() => handleDeleteLevel(node.id)}
              className="text-danger hover:bg-danger-background"
            >
              <Icons.Trash size={16} />
            </IconButton>
          </div>
        </div>
        {!collapsed && hasChildren && (
          <div>
            {node.children!.map((child) => (
              <LevelNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <PageTitle
        title="Зорилтот бүлгийн удирдлага"
        subtitle="Шалгуулагчдын зорилтот бүлгийн төрлийг (жишээ нь: Сургууль, Аж ахуйн нэгж) үүсгэх болон тэдгээрийн анги, түвшний шатлалыг удирдах цонх."
      />

      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[18rem_1fr_22rem] mt-seek-4">
        {/* SCALES LIST */}
        <Card className="min-h-[400px]">
          <Stack gap={4}>
            <Heading level={3}>Зорилтот бүлгүүд</Heading>
            {loadingTypes ? (
              <Text variant="muted">Уншиж байна...</Text>
            ) : (
              <div className="flex flex-col gap-seek-2">
                {types.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between gap-seek-2 px-seek-3 py-seek-2 rounded-seek-md border transition-all cursor-pointer ${
                      selectedType?.id === t.id
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-surface hover:bg-surface-hover"
                    }`}
                    onClick={() => setSelectedType(t)}
                  >
                    <div>
                      <Text className="text-sm">{t.name}</Text>
                      <Text variant="muted" className="text-xs">
                        {t.code}
                      </Text>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton
                        ariaLabel="Засах"
                        className="hover:bg-surface-hover text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectTypeForEdit(t);
                        }}
                      >
                        <Icons.SavePen size={14} />
                      </IconButton>
                      <IconButton
                        ariaLabel="Устгах"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteType(t.id);
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
                  onClick={resetTypeForm}
                  className="mt-seek-2"
                >
                  Шинэ төрөл үүсгэх
                </Button>
              </div>
            )}
          </Stack>
        </Card>

        {/* TREE VIEW */}
        <Card className="min-h-[400px]">
          <Stack gap={4}>
            <Heading level={3}>
              {selectedType ? `"${selectedType.name}" - Анги, түвшний шатлал` : "Сонгогдсон төрөл байхгүй"}
            </Heading>
            <Text variant="muted" className="text-sm">
              Түвшнүүдийг чирээд (drag) өөр түвшин дээр тавьснаар (drop) шатлалын бүтцийг удирдах боломжтой.
            </Text>

            {loadingLevels ? (
              <div className="flex h-48 items-center justify-center">
                <Text variant="muted">Уншиж байна...</Text>
              </div>
            ) : !selectedType ? (
              <Text variant="muted" className="text-center py-12">
                Түвшнүүдийг харахын тулд зүүн талаас төрөл сонгоно уу.
              </Text>
            ) : levels.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
                <Icons.User size={40} className="text-muted-foreground" />
                <Text className="font-semibold mt-seek-3">Анги, түвшний мэдээлэл байхгүй байна</Text>
                <Text variant="muted" className="mt-1 text-sm">
                  Энэ бүлэгт шинээр түвшин нэмнэ үү.
                </Text>
              </div>
            ) : (
              <div className="space-y-seek-2 max-h-[600px] overflow-y-auto pr-seek-2">
                {levelTree.map((node) => (
                  <LevelNode key={node.id} node={node} depth={0} />
                ))}
              </div>
            )}
          </Stack>
        </Card>

        {/* FORMS */}
        <Card className="h-fit sticky top-seek-5">
          <Stack gap={6}>
            {/* TYPE FORM */}
            {!isLevelEdit && (
              <form onSubmit={handleSaveType}>
                <Stack gap={5}>
                  <Heading level={3}>
                    {isTypeEdit ? "Төрөл засах" : "Шинэ төрөл үүсгэх"}
                  </Heading>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Бүлгийн нэр</span>
                    <Input
                      required
                      placeholder="Сургууль, Аж ахуйн нэгж г.м."
                      value={typeName}
                      onChange={(e) => setTypeName(e.target.value)}
                    />
                  </label>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Код</span>
                    <Input
                      placeholder="Жишээ: ACADEMIC, ENTERPRISE"
                      disabled={isTypeEdit}
                      value={typeCode}
                      onChange={(e) => setTypeCode(e.target.value)}
                    />
                  </label>
                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Тайлбар</span>
                    <Textarea
                      placeholder="Төрлийн тайлбар..."
                      rows={3}
                      value={typeDescription}
                      onChange={(e) => setTypeDescription(e.target.value)}
                    />
                  </label>
                  <div className="flex gap-seek-2 pt-seek-1">
                    <Button type="submit" className="flex-1">
                      {isTypeEdit ? "Засах" : "Хадгалах"}
                    </Button>
                    {isTypeEdit && (
                      <Button type="button" variant="outline" onClick={resetTypeForm}>
                        Болих
                      </Button>
                    )}
                  </div>
                </Stack>
              </form>
            )}

            {/* LEVEL FORM */}
            {selectedType && (
              <form onSubmit={handleSaveLevel}>
                <Stack gap={5} className="border-t border-border pt-seek-5">
                  <Heading level={3}>
                    {isLevelEdit ? "Түвшин засах" : levelParentId ? "Дэд түвшин нэмэх" : "Түвшин нэмэх"}
                  </Heading>

                  {levelParentId && (
                    <div className="rounded-seek-md border border-info-border bg-info-background px-seek-3 py-seek-2 flex items-center justify-between">
                      <Text className="text-xs font-semibold text-info-foreground">
                        Эцэг: {selectedLevel?.name}
                      </Text>
                      <button
                        type="button"
                        onClick={() => setLevelParentId(null)}
                        className="text-xs underline text-info-foreground"
                      >
                        Цэвэрлэх
                      </button>
                    </div>
                  )}

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Түвшний нэр</span>
                    <Input
                      required
                      placeholder="Жишээ: 1-р анги, Junior"
                      value={levelName}
                      onChange={(e) => setLevelName(e.target.value)}
                    />
                  </label>

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Код</span>
                    <Input
                      required
                      placeholder="Жишээ: GRADE-01, JUNIOR"
                      disabled={isLevelEdit}
                      value={levelCode}
                      onChange={(e) => setLevelCode(e.target.value)}
                    />
                  </label>

                  <label className="space-y-seek-2">
                    <span className="font-sans text-sm font-medium text-foreground">Дараалал (orderIndex)</span>
                    <Input
                      type="number"
                      required
                      value={levelOrder}
                      onChange={(e) => setLevelOrder(Number(e.target.value))}
                    />
                  </label>

                  <div className="flex gap-seek-2 pt-seek-1">
                    <Button type="submit" className="flex-1">
                      {isLevelEdit ? "Засах" : "Түвшин нэмэх"}
                    </Button>
                    {(isLevelEdit || levelParentId) && (
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
