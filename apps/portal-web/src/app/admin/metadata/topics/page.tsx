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
  Select,
} from "@seek/ui";
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  fetchAssessmentContexts,
} from "@/features/assessor-workspace/api";
import type { Topic } from "@/features/assessments/types";

export default function TopicsManagementPage() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  // Contexts states
  const [contexts, setContexts] = useState<any[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedNode, setDraggedNode] = useState<Topic | null>(null);

  const loadData = async (contextId?: string) => {
    setLoading(true);
    try {
      const data = await fetchTopics(contextId);
      setTopics(data || []);
    } catch (err) {
      console.error(err);
      showToast("Сэдвийн мэдээллийг татаж чадсангүй.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadContexts = async () => {
      try {
        const data = await fetchAssessmentContexts();
        setContexts(data || []);
        if (data && data.length > 0) {
          setSelectedContextId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        showToast("Үнэлгээний контекстийг татаж чадсангүй.", "danger");
      }
    };
    loadContexts();
  }, []);

  useEffect(() => {
    if (selectedContextId) {
      loadData(selectedContextId);
    }
  }, [selectedContextId]);

  // Topics tree build
  const buildTree = (nodes: Topic[], pId: string | null = null): Topic[] => {
    return nodes
      .filter((n) => n.parentId === pId)
      .map((n) => ({
        ...n,
        children: buildTree(nodes, n.id),
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const topicTree = buildTree(topics);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Нэр заавал шаардлагатай.", "warning");
      return;
    }

    try {
      if (isEditMode && selectedTopic) {
        await updateTopic(selectedTopic.id, {
          title: name,
          name,
          description,
          parentId,
          assessmentContextId: selectedContextId,
        });
        showToast("Сэдэв амжилттай засагдлаа.", "success");
        setSelectedTopic(null);
      } else {
        await createTopic({
          title: name,
          name,
          code: code || `TOPIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          description,
          parentId,
          depth: parentId ? 1 : 0,
          orderIndex: topics.filter((t) => t.parentId === parentId).length + 1,
          assessmentContextId: selectedContextId,
        });
        showToast("Шинэ сэдэв үүсгэлээ.", "success");
      }
      resetForm();
      loadData(selectedContextId);
    } catch (err) {
      console.error(err);
      showToast("Үйлдэл амжилтгүй боллоо.", "danger");
    }
  };

  const handleDelete = (id: string) => {
    showDialog({
      title: "Сэдэв устгах уу?",
      description: "Энэ сэдвийг устгаснаар түүнд харьяалагдах дэд сэдвүүд хамт устгагдах эсвэл хамааралгүй болох эрсдэлтэй.",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteTopic(id);
          showToast("Сэдэв амжилттай устгагдлаа.", "success");
          if (selectedTopic?.id === id) {
            setSelectedTopic(null);
            resetForm();
          }
          loadData(selectedContextId);
        } catch (err) {
          console.error(err);
          showToast("Устгах үйлдэл амжилтгүй боллоо.", "danger");
        }
      },
    });
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setDescription("");
    setParentId(null);
    setIsEditMode(false);
  };

  const selectForEdit = (topic: Topic) => {
    setSelectedTopic(topic);
    setName(topic.title || topic.name || "");
    setCode(topic.code || "");
    setDescription(topic.description || "");
    setParentId(topic.parentId || null);
    setIsEditMode(true);
  };

  const selectForAddChild = (parent: Topic) => {
    resetForm();
    setParentId(parent.id);
    setSelectedTopic(parent);
    setIsEditMode(false);
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, node: Topic) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetNode: Topic) => {
    e.preventDefault();
    if (!draggedNode || draggedNode.id === targetNode.id) return;

    let p = targetNode.parentId;
    while (p) {
      if (p === draggedNode.id) {
        showToast("Сэдвийг өөрийнх нь дэд сэдэв рүү шилжүүлэх боломжгүй.", "warning");
        return;
      }
      const parentNode = topics.find((t) => t.id === p);
      p = parentNode ? parentNode.parentId : null;
    }

    try {
      await updateTopic(draggedNode.id, {
        parentId: targetNode.id,
        assessmentContextId: selectedContextId,
      });
      showToast(`${draggedNode.title || draggedNode.name} сэдвийг ${targetNode.title || targetNode.name}-ийн дэд сэдэв болголоо.`, "success");
      loadData(selectedContextId);
    } catch (err) {
      console.error(err);
      showToast("Байршил өөрчилж чадсангүй.", "danger");
    } finally {
      setDraggedNode(null);
    }
  };

  // Recursive Tree Node
  const TreeNode = ({ node, depth = 0 }: { node: Topic; depth: number }) => {
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
            selectedTopic?.id === node.id && isEditMode
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
            <Icons.Menu className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-sans font-medium text-foreground">{node.title || node.name}</span>
              <span className="ml-seek-2 font-mono text-xs text-muted-foreground">{node.code}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              ariaLabel="Дэд сэдэв нэмэх"
              className="hover:bg-surface-hover text-foreground"
              onClick={() => selectForAddChild(node)}
            >
              <Icons.FilePlus size={16} />
            </IconButton>
            <IconButton
              ariaLabel="Засах"
              className="hover:bg-surface-hover text-foreground"
              onClick={() => selectForEdit(node)}
            >
              <Icons.SavePen size={16} />
            </IconButton>
            <IconButton
              ariaLabel="Устгах"
              onClick={() => handleDelete(node.id)}
              className="text-danger hover:bg-danger-background"
            >
              <Icons.Trash size={16} />
            </IconButton>
          </div>
        </div>
        {!collapsed && hasChildren && (
          <div>
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-seek-4">
        <PageTitle
          title="Сэдвийн сан удирдлага"
          subtitle="Даалгаврын сэдэв, агуулгыг олон түвшинт шатлалтайгаар чирч удирдах (Drag-and-drop) боломжтой цэс."
        />
        <Button onClick={resetForm} className="flex items-center gap-seek-2">
          <Icons.FilePlus size={16} />
          <span>Сэдэв нэмэх</span>
        </Button>
      </div>

      <div className="mt-seek-4 max-w-xs col-span-2">
        <Text className="font-semibold text-slate-700 text-xs mb-seek-1">Үнэлгээний контекст</Text>
        <Select
          value={selectedContextId}
          onChange={(e) => setSelectedContextId(e.target.value)}
          options={contexts.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[1fr_22rem] mt-seek-4">
        <Card className="min-h-[400px]">
          <Stack gap={4}>
            <Heading level={3}>Сэдвийн мод бүтэц</Heading>
            <Text variant="muted" className="text-sm">
              Сэдвийг шилжүүлэхдээ чирээд (drag) өөр сэдэв дээр тавихад (drop) харьяалал нь солигдоно.
            </Text>
            
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Text variant="muted">Уншиж байна...</Text>
              </div>
            ) : topics.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
                <Icons.Menu size={40} className="text-muted-foreground" />
                <Text className="font-semibold mt-seek-3">Сэдэв байхгүй байна</Text>
                <Text variant="muted" className="mt-1 text-sm">Шинээр сэдэв нэмж эхэлнэ үү.</Text>
              </div>
            ) : (
              <div className="space-y-seek-2 max-h-[600px] overflow-y-auto pr-seek-2">
                {topicTree.map((node) => (
                  <TreeNode key={node.id} node={node} depth={0} />
                ))}
              </div>
            )}
          </Stack>
        </Card>

        <Card className="h-fit sticky top-seek-5">
          <form onSubmit={handleSave}>
            <Stack gap={5}>
              <Heading level={3}>
                {isEditMode ? "Сэдэв засах" : parentId ? `${selectedTopic?.title || selectedTopic?.name}-д дэд сэдэв нэмэх` : "Шинэ сэдэв үүсгэх"}
              </Heading>

              {parentId && (
                <div className="rounded-seek-md border border-info-border bg-info-background px-seek-3 py-seek-2 flex items-center justify-between">
                  <Text className="text-xs font-semibold text-info-foreground">
                    Эцэг сэдэв: {selectedTopic?.title || selectedTopic?.name}
                  </Text>
                  <button 
                    type="button" 
                    onClick={() => setParentId(null)}
                    className="text-xs underline text-info-foreground"
                  >
                    Цэвэрлэх
                  </button>
                </div>
              )}

              <label className="space-y-seek-2">
                <span className="font-sans text-sm font-medium text-foreground">Сэдвийн нэр (MN)</span>
                <Input
                  required
                  placeholder="Сэдвийн гарчиг оруулна уу"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="space-y-seek-2">
                <span className="font-sans text-sm font-medium text-foreground">Сэдвийн код (Unique)</span>
                <Input
                  placeholder="Жишээ: MATH-ALG-01"
                  disabled={isEditMode}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>

              <label className="space-y-seek-2">
                <span className="font-sans text-sm font-medium text-foreground">Тайлбар</span>
                <Textarea
                  placeholder="Сэдвийн дэлгэрэнгүй тайлбар..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              <div className="flex gap-seek-2 pt-seek-2">
                <Button type="submit" className="flex-1">
                  {isEditMode ? "Засах" : "Хадгалах"}
                </Button>
                {(isEditMode || parentId) && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Болих
                  </Button>
                )}
              </div>
            </Stack>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
