'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  Input,
  Text,
  Icons,
  useToast,
  Select,
} from '@seek/ui';
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  fetchAssessmentContexts,
} from '@/features/assessor-workspace/api';

interface TopicNode {
  id: string;
  code: string;
  title: string;
  parentId: string | null;
  children: TopicNode[];
}

export default function TopicsManagementPage() {
  const { showToast } = useToast();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Сонгогдсон сэдэв (засах эсвэл дэд сэдэв нэмэхэд зориулав)
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  // Contexts states
  const [contexts, setContexts] = useState<any[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string>("");

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Ачаалах функц
  const loadTopics = async (contextId?: string) => {
    setLoading(true);
    try {
      const data = await fetchTopics(contextId);
      setTopics(data);
    } catch (err: any) {
      console.error(err);
      showToast('Сэдвийн жагсаалтыг уншиж чадсангүй.', 'danger');
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
      loadTopics(selectedContextId);
    }
  }, [selectedContextId]);

  // Хавтгай жагсаалтыг Мод (Tree) хэлбэрт оруулах
  const topicTree = useMemo(() => {
    const nodesMap: Record<string, TopicNode> = {};
    const roots: TopicNode[] = [];

    topics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        code: t.code,
        title: t.title,
        parentId: t.parentId,
        children: [],
      };
    });

    topics.forEach((t) => {
      const node = nodesMap[t.id];
      if (t.parentId && nodesMap[t.parentId]) {
        nodesMap[t.parentId].children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [topics]);

  // Шинээр үүсгэх маягтыг нээх
  const handleOpenCreate = (parent: any | null = null) => {
    setIsCreating(true);
    setSelectedTopic(null);
    setTitle('');
    setCode(`TOPIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
    setParentId(parent ? parent.id : null);
  };

  // Сэдэв дээр дарах (засах горимд шилжих)
  const handleSelectTopic = (topic: any) => {
    setIsCreating(false);
    setSelectedTopic(topic);
    setTitle(topic.title);
    setCode(topic.code);
    setParentId(topic.parentId);
  };

  // Хадгалах (үүсгэх эсвэл засах)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Сэдвийн нэрийг оруулна уу.', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        await createTopic({
          title: title.trim(),
          code: code.trim(),
          parentId: parentId,
          assessmentContextId: selectedContextId,
        });
        showToast('Шинэ сэдэв амжилттай үүслээ.', 'success');
      } else {
        await updateTopic(selectedTopic.id, {
          title: title.trim(),
          parentId: parentId,
          assessmentContextId: selectedContextId,
        });
        showToast('Сэдвийн мэдээлэл шинэчлэгдлээ.', 'success');
      }
      setIsCreating(false);
      setSelectedTopic(null);
      loadTopics(selectedContextId);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Сэдэв хадгалахад алдаа гарлаа.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // Устгах
  const handleDelete = async (id: string) => {
    if (!window.confirm('Та энэ сэдвийг устгахдаа итгэлтэй байна уу? Сэдэвтэй холбоотой дэд сэдвүүд мөн устах боломжтой.')) {
      return;
    }

    try {
      await deleteTopic(id);
      showToast('Сэдвийг амжилттай устгалаа.', 'success');
      setSelectedTopic(null);
      loadTopics(selectedContextId);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Сэдэв устгаж чадсангүй.', 'danger');
    }
  };

  // Модыг рендер хийх рекурсив компонент
  const renderTopicNode = (node: TopicNode, depth = 0) => {
    const isSelected = selectedTopic?.id === node.id || (isCreating && parentId === node.id);
    return (
      <div key={node.id} className="space-y-1">
        <div 
          onClick={() => handleSelectTopic(node)}
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
          className={`flex items-center justify-between py-2 px-3 rounded-seek-md cursor-pointer transition-all hover:bg-slate-50 active:scale-[0.99] ${isSelected ? 'bg-primary/5 border border-primary/20 text-primary font-semibold' : 'text-slate-700'}`}
        >
          <div className="flex items-center gap-seek-2">
            <Icons.Menu className="h-4 w-4 text-slate-400 stroke-[1.8]" />
            <span>{node.title}</span>
            <span className="text-[10px] text-slate-400 font-normal">({node.code})</span>
          </div>
          <div className="flex items-center gap-seek-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCreate(node);
              }}
              className="p-1 rounded-seek-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              title="Дэд сэдэв нэмэх"
            >
              <Icons.Menu className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(node.id);
              }}
              className="p-1 rounded-seek-md hover:bg-slate-100 text-slate-400 hover:text-danger transition-colors"
              title="Устгах"
            >
              <Icons.Trash className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {node.children.length > 0 && (
          <div className="border-l border-slate-100 ml-4 pl-1 space-y-1">
            {node.children.map((child) => renderTopicNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-seek-6 p-seek-6">
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-xl font-bold text-slate-900">Сэдвийн сан удирдлага</Text>
          <Text variant="muted" className="text-sm">Асуултын ангилал болон дэд сэдвүүдийг удирдах хэсэг</Text>
        </div>
        <Button 
          type="button" 
          variant="primary" 
          onClick={() => handleOpenCreate(null)}
          className="flex items-center gap-seek-2 active:scale-95 transition-all bg-slate-950 text-white hover:bg-slate-900"
        >
          <Icons.Menu className="h-4 w-4 stroke-[1.8]" />
          <span>Шинэ сэдэв үүсгэх</span>
        </Button>
      </div>

      <div className="max-w-xs">
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

      <div className="grid gap-seek-6 md:grid-cols-2">
        {/* Зүүн тал: Сэдвүүдийн мод */}
        <Card className="p-seek-5 space-y-seek-4">
          <div className="flex items-center justify-between border-b border-border pb-seek-3">
            <Text className="font-bold text-slate-800">Сэдвүүд</Text>
            <Button
              type="button"
              variant="outline"
              onClick={() => loadTopics(selectedContextId)}
              className="h-7 w-7 p-0"
              title="Шинэчлэх"
            >
              <Icons.Recycle className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Text variant="muted">Сэдвийн санг уншиж байна...</Text>
            </div>
          ) : topicTree.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-seek-lg bg-slate-50">
              <Text className="font-semibold text-slate-600">Сэдэв байхгүй байна</Text>
              <Text variant="muted" className="text-xs mt-1">Баруун дээд булан дахь товчийг даран сэдэв нэмнэ үү.</Text>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-seek-2">
              {topicTree.map((root) => renderTopicNode(root))}
            </div>
          )}
        </Card>

        {/* Баруун тал: Үүсгэх / Засах хэсэг */}
        <Card className="p-seek-5">
          <div className="flex items-center justify-between border-b border-border pb-seek-3 mb-seek-4">
            <Text className="font-bold text-slate-800">
              {isCreating ? 'Шинэ сэдэв нэмэх' : selectedTopic ? 'Сэдэв засах' : 'Сонголт хийнэ үү'}
            </Text>
            {selectedTopic && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDelete(selectedTopic.id)}
                className="h-8 px-seek-3 text-xs text-danger border-danger/20 hover:bg-danger/5"
              >
                Сэдвийг устгах
              </Button>
            )}
          </div>

          {!isCreating && !selectedTopic ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Icons.Menu className="h-12 w-12 text-slate-300 stroke-[1.2] mb-3" />
              <Text className="font-semibold text-slate-600">Үйлдэл сонгогдоогүй байна</Text>
              <Text variant="muted" className="text-xs max-w-[250px] mt-1">
                Зүүн талын жагсаалтаас сэдэв сонгон засах эсвэл "Шинэ сэдэв үүсгэх" товчлуурыг дарна уу.
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-seek-4 text-xs">
              <div className="space-y-1">
                <Text className="font-semibold text-slate-700">Сэдвийн код (Unique) *</Text>
                <Input
                  value={code}
                  disabled={!isCreating}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                  placeholder="Жишээ: MATH-FRACTIONS"
                />
              </div>

              <div className="space-y-1">
                <Text className="font-semibold text-slate-700">Сэдвийн нэр (Гарчиг) *</Text>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Жишээ: Энгийн бутархай хуваах"
                />
              </div>

              <div className="space-y-1">
                <Text className="font-semibold text-slate-700">Эцэг сэдэв</Text>
                <div className="p-3 bg-slate-50 border border-border rounded-seek-md flex items-center justify-between text-slate-600">
                  <span>
                    {parentId 
                      ? topics.find(t => t.id === parentId)?.title || 'Сонгосон сэдэв'
                      : 'Байхгүй (Үндсэн сэдэв)'}
                  </span>
                  {parentId && isCreating && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setParentId(null)}
                      className="h-6 px-seek-2 text-[10px]"
                    >
                      Цэвэрлэх
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-seek-2 border-t border-border pt-seek-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedTopic(null);
                  }}
                  disabled={saving}
                >
                  Болих
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-slate-950 text-white hover:bg-slate-900 flex items-center justify-center gap-seek-2 active:scale-95 transition-all"
                  disabled={saving}
                >
                  {saving ? (
                    'Хадгалж байна...'
                  ) : (
                    <>
                      <Icons.SavePen className="h-4 w-4 stroke-[1.8]" />
                      <span>{isCreating ? 'Үүсгэх' : 'Хадгалах'}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
