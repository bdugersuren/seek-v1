'use client';

import { useState, useEffect } from 'react';
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
  // AssessmentContext API
  fetchAssessmentContexts,
  createAssessmentContext,
  updateAssessmentContext,
  deleteAssessmentContext,
  // Difficulty API
  fetchDifficultyScales,
  createDifficultyScale,
  updateDifficultyScale,
  deleteDifficultyScale,
  fetchDifficultyLevels,
  createDifficultyLevel,
  updateDifficultyLevel,
  deleteDifficultyLevel,
  // Competency API
  fetchCompetenceFrameworks,
  createCompetenceFramework,
  updateCompetenceFramework,
  deleteCompetenceFramework,
  fetchCompetenceTypes,
  createCompetenceType,
  updateCompetenceType,
  deleteCompetenceType,
  // Audience API
  fetchAudienceLevels,
  createAudienceLevel,
  updateAudienceLevel,
  deleteAudienceLevel,
  fetchAudienceTypes,
  createAudienceType,
  updateAudienceType,
  deleteAudienceType,
  // Cognitive API
  fetchCognitiveLevels,
  createCognitiveLevel,
  updateCognitiveLevel,
  deleteCognitiveLevel,
} from '@/features/assessor-workspace/api';

type TabType = 'CONTEXT' | 'COMPETENCY' | 'DIFFICULTY' | 'AUDIENCE' | 'COGNITIVE';

export default function MetadataManagementPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('CONTEXT');
  const [loading, setLoading] = useState(true);

  // Data states
  const [contexts, setContexts] = useState<any[]>([]);
  const [difficultyScales, setDifficultyScales] = useState<any[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]);
  const [competenceFrameworks, setCompetenceFrameworks] = useState<any[]>([]);
  const [competenceTypes, setCompetenceTypes] = useState<any[]>([]);
  const [audienceLevels, setAudienceLevels] = useState<any[]>([]);
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]);
  const [cognitiveLevels, setCognitiveLevels] = useState<any[]>([]);

  // Form states
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [rank, setRank] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  // Extra select references for foreign keys
  const [selectedRefId, setSelectedRefId] = useState<string>('');
  const [selectedRef2Id, setSelectedRef2Id] = useState<string>('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        ctxs,
        diffScales,
        diffLevels,
        compFrames,
        compTypes,
        audLevels,
        audTypes,
        cogLevels,
      ] = await Promise.all([
        fetchAssessmentContexts(),
        fetchDifficultyScales(),
        fetchDifficultyLevels(),
        fetchCompetenceFrameworks(),
        fetchCompetenceTypes(),
        fetchAudienceLevels(),
        fetchAudienceTypes(),
        fetchCognitiveLevels(),
      ]);

      setContexts(ctxs);
      setDifficultyScales(diffScales);
      setDifficultyLevels(diffLevels);
      setCompetenceFrameworks(compFrames);
      setCompetenceTypes(compTypes);
      setAudienceLevels(audLevels);
      setAudienceTypes(audTypes);
      setCognitiveLevels(cogLevels);
    } catch (err: any) {
      console.error(err);
      showToast('Өгөгдлийг уншиж чадсангүй.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setSelectedItem(null);
    setName('');
    setCode('');
    setRank(1);
    setSelectedRefId('');
    setSelectedRef2Id('');
  };

  const handleSelectItem = (item: any) => {
    setIsCreating(false);
    setSelectedItem(item);
    setName(item.name || item.title || '');
    setCode(item.code || '');
    setRank(item.rank || 1);
    setSelectedRefId('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Нэрийг оруулна уу.', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (activeTab === 'CONTEXT') {
        if (isCreating) {
          await createAssessmentContext({
            name: name.trim(),
            code: code.trim() || undefined,
            audienceTypeId: selectedRefId || undefined,
            difficultyScaleId: selectedRef2Id || undefined,
          });
          showToast('Үнэлгээний контекст амжилттай үүслээ.', 'success');
        } else {
          await updateAssessmentContext(selectedItem.id, {
            name: name.trim(),
          });
          showToast('Үнэлгээний контекст шинэчлэгдлээ.', 'success');
        }
      } else if (activeTab === 'COMPETENCY') {
        // Framework vs Type (selectedRefId байвал Type үүсгэнэ)
        if (selectedRefId) {
          if (isCreating) {
            await createCompetenceType({
              competenceFrameworkId: selectedRefId,
              name: name.trim(),
              code: code.trim() || undefined,
            });
            showToast('Дэд чадамж амжилттай үүслээ.', 'success');
          } else {
            await updateCompetenceType(selectedItem.id, { name: name.trim() });
            showToast('Дэд чадамж шинэчлэгдлээ.', 'success');
          }
        } else {
          if (isCreating) {
            await createCompetenceFramework({
              name: name.trim(),
              code: code.trim() || undefined,
            });
            showToast('Чадамжийн бүтэц амжилттай үүслээ.', 'success');
          } else {
            await updateCompetenceFramework(selectedItem.id, { name: name.trim() });
            showToast('Чадамжийн бүтэц шинэчлэгдлээ.', 'success');
          }
        }
      } else if (activeTab === 'DIFFICULTY') {
        // Scale vs Level (selectedRefId байвал Level үүсгэнэ)
        if (selectedRefId) {
          if (isCreating) {
            await createDifficultyLevel({
              name: name.trim(),
              code: code.trim() || undefined,
              rank,
            });
            showToast('Хэцүүгийн түвшин амжилттай үүслээ.', 'success');
          } else {
            await updateDifficultyLevel(selectedItem.id, { name: name.trim(), rank });
            showToast('Хэцүүгийн түвшин шинэчлэгдлээ.', 'success');
          }
        } else {
          if (isCreating) {
            await createDifficultyScale({
              name: name.trim(),
              code: code.trim() || undefined,
            });
            showToast('Хэцүүгийн шатлал амжилттай үүслээ.', 'success');
          } else {
            await updateDifficultyScale(selectedItem.id, { name: name.trim() });
            showToast('Хэцүүгийн шатлал шинэчлэгдлээ.', 'success');
          }
        }
      } else if (activeTab === 'AUDIENCE') {
        // Type vs Level
        if (selectedRefId === 'LEVEL') {
          if (isCreating) {
            await createAudienceLevel({
              name: name.trim(),
              code: code.trim() || undefined,
              rank,
            });
            showToast('Зорилтот бүлгийн түвшин үүслээ.', 'success');
          } else {
            await updateAudienceLevel(selectedItem.id, { name: name.trim(), rank });
            showToast('Зорилтот бүлгийн түвшин шинэчлэгдлээ.', 'success');
          }
        } else {
          if (isCreating) {
            await createAudienceType({
              name: name.trim(),
              code: code.trim() || undefined,
            });
            showToast('Зорилтот бүлгийн төрөл үүслээ.', 'success');
          } else {
            await updateAudienceType(selectedItem.id, { name: name.trim() });
            showToast('Зорилтот бүлгийн төрөл шинэчлэгдлээ.', 'success');
          }
        }
      } else if (activeTab === 'COGNITIVE') {
        if (isCreating) {
          await createCognitiveLevel({
            name: name.trim(),
            code: code.trim() || undefined,
            rank,
          });
          showToast('Bloom түвшин амжилттай үүслээ.', 'success');
        } else {
          await updateCognitiveLevel(selectedItem.id, {
            name: name.trim(),
            rank,
          });
          showToast('Bloom түвшин шинэчлэгдлээ.', 'success');
        }
      }

      setIsCreating(false);
      setSelectedItem(null);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Алдаа гарлаа.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, type?: string) => {
    if (!window.confirm('Та устгахдаа итгэлтэй байна уу? Сонгосон өгөгдлийг устгаснаар бусад холбоотой бүх даалгавруудад нөлөөлөх боломжтой.')) {
      return;
    }

    try {
      if (activeTab === 'CONTEXT') {
        await deleteAssessmentContext(id);
      } else if (activeTab === 'COMPETENCY') {
        if (type === 'TYPE') await deleteCompetenceType(id);
        else await deleteCompetenceFramework(id);
      } else if (activeTab === 'DIFFICULTY') {
        if (type === 'LEVEL') await deleteDifficultyLevel(id);
        else await deleteDifficultyScale(id);
      } else if (activeTab === 'AUDIENCE') {
        if (type === 'LEVEL') await deleteAudienceLevel(id);
        else await deleteAudienceType(id);
      } else if (activeTab === 'COGNITIVE') {
        await deleteCognitiveLevel(id);
      }
      showToast('Амжилттай устгагдлаа.', 'success');
      setSelectedItem(null);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Устгаж чадсангүй.', 'danger');
    }
  };

  const listItems = activeTab === 'DIFFICULTY' ? difficultyLevels : cognitiveLevels;

  return (
    <div className="space-y-seek-6 p-seek-6">
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-xl font-bold text-slate-900">Түвшний тохиргоо удирдлага</Text>
          <Text variant="muted" className="text-sm">Даалгаврын сан болон үнэлгээний системийн бүх төрлийн мета-тохиргоонуудыг удирдах</Text>
        </div>
        <Button 
          type="button" 
          variant="primary" 
          onClick={handleOpenCreate}
          className="flex items-center gap-seek-2 active:scale-95 transition-all bg-slate-950 text-white hover:bg-slate-900"
        >
          <Icons.Settings className="h-4 w-4 stroke-[1.8]" />
          <span>Шинэ өгөгдөл үүсгэх</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-seek-4 overflow-x-auto">
        {(['CONTEXT', 'COMPETENCY', 'DIFFICULTY', 'AUDIENCE', 'COGNITIVE'] as TabType[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setSelectedItem(null);
              setIsCreating(false);
            }}
            className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {tab === 'CONTEXT' && 'Хичээл & Контекст (Context)'}
            {tab === 'COMPETENCY' && 'Чадамж (Competence)'}
            {tab === 'DIFFICULTY' && 'Хэцүүгийн түвшин (Difficulty)'}
            {tab === 'AUDIENCE' && 'Зорилтот бүлэг (Audience)'}
            {tab === 'COGNITIVE' && 'Танин мэдэхүй (Cognitive)'}
          </button>
        ))}
      </div>

      <div className="grid gap-seek-6 md:grid-cols-2">
        {/* Жагсаалт */}
        <Card className="p-seek-5 space-y-seek-4">
          <div className="flex items-center justify-between border-b border-border pb-seek-3">
            <Text className="font-bold text-slate-800">Бүртгэлтэй жагсаалт</Text>
            <Button type="button" variant="outline" onClick={loadAllData} className="h-7 w-7 p-0" title="Шинэчлэх">
              <Icons.Recycle className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Text variant="muted">Уншиж байна...</Text>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-seek-2">
              {/* Context Render */}
              {activeTab === 'CONTEXT' && (
                <div className="space-y-2">
                  {contexts.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectItem(c)}
                      className={`flex items-center justify-between py-3 px-seek-4 rounded-seek-md cursor-pointer border transition-all ${selectedItem?.id === c.id ? 'bg-primary/5 border-primary/20 text-primary font-semibold' : 'bg-surface border-border hover:border-slate-300'}`}
                    >
                      <div>
                        <Text className="font-bold text-slate-800">{c.name}</Text>
                        <Text variant="muted" className="text-[10px]">{c.code}</Text>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-danger rounded-seek-md">
                        <Icons.Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Competency Render */}
              {activeTab === 'COMPETENCY' && (
                <div className="space-y-4">
                  {competenceFrameworks.map((cf) => (
                    <div key={cf.id} className="space-y-2 border border-border p-3 rounded-seek-lg bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text className="font-bold text-slate-900">{cf.name}</Text>
                          <Text variant="muted" className="text-[10px]">{cf.code}</Text>
                        </div>
                        <button type="button" onClick={() => handleDelete(cf.id, 'FRAMEWORK')} className="p-1 text-slate-400 hover:text-danger">
                          <Icons.Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1 pl-4 border-l border-slate-200">
                        {competenceTypes.filter(t => t.competenceFrameworkId === cf.id).map(t => (
                          <div key={t.id} onClick={() => handleSelectItem(t)} className="flex items-center justify-between text-xs py-1.5 px-2 hover:bg-slate-100 rounded cursor-pointer">
                            <span>{t.name} ({t.code})</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(t.id, 'TYPE'); }} className="p-0.5 text-slate-400 hover:text-danger">
                              <Icons.Trash className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Difficulty Render */}
              {activeTab === 'DIFFICULTY' && (
                <div className="space-y-4">
                  {difficultyScales.map((ds) => (
                    <div key={ds.id} className="space-y-2 border border-border p-3 rounded-seek-lg bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text className="font-bold text-slate-900">{ds.name}</Text>
                          <Text variant="muted" className="text-[10px]">{ds.code}</Text>
                        </div>
                        <button type="button" onClick={() => handleDelete(ds.id, 'SCALE')} className="p-1 text-slate-400 hover:text-danger">
                          <Icons.Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1 pl-4 border-l border-slate-200">
                        {difficultyLevels.filter(l => l.difficultyScaleId === ds.id).map(l => (
                          <div key={l.id} onClick={() => handleSelectItem(l)} className="flex items-center justify-between text-xs py-1.5 px-2 hover:bg-slate-100 rounded cursor-pointer">
                            <span>{l.name} (Rank: {l.rank})</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(l.id, 'LEVEL'); }} className="p-0.5 text-slate-400 hover:text-danger">
                              <Icons.Trash className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Audience Render */}
              {activeTab === 'AUDIENCE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Text className="font-bold text-slate-700">Төрлүүд (Audience Types)</Text>
                    {audienceTypes.map(at => (
                      <div key={at.id} onClick={() => handleSelectItem(at)} className="flex items-center justify-between p-2 border border-border rounded text-xs hover:border-slate-300 cursor-pointer">
                        <span>{at.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(at.id, 'TYPE'); }} className="p-0.5 text-slate-400 hover:text-danger">
                          <Icons.Trash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Text className="font-bold text-slate-700">Түвшнүүд (Audience Levels)</Text>
                    {audienceLevels.map(al => (
                      <div key={al.id} onClick={() => handleSelectItem(al)} className="flex items-center justify-between p-2 border border-border rounded text-xs hover:border-slate-300 cursor-pointer">
                        <span>{al.name} (Rank: {al.rank})</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(al.id, 'LEVEL'); }} className="p-0.5 text-slate-400 hover:text-danger">
                          <Icons.Trash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cognitive Render */}
              {activeTab === 'COGNITIVE' && (
                <div className="space-y-2">
                  {cognitiveLevels.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`flex items-center justify-between py-3 px-seek-4 rounded-seek-md cursor-pointer border transition-all ${selectedItem?.id === item.id ? 'bg-primary/5 border-primary/20 text-primary font-semibold' : 'bg-surface border-border hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-seek-3">
                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {item.rank}
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-danger rounded-seek-md">
                        <Icons.Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Форм (Үүсгэх / Засах) */}
        <Card className="p-seek-5">
          <div className="flex items-center justify-between border-b border-border pb-seek-3 mb-seek-4">
            <Text className="font-bold text-slate-800">
              {isCreating ? 'Шинэ өгөгдөл нэмэх' : selectedItem ? 'Мэдээлэл засах' : 'Сонголт хийнэ үү'}
            </Text>
          </div>

          {!isCreating && !selectedItem ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Icons.Settings className="h-12 w-12 text-slate-300 stroke-[1.2] mb-3" />
              <Text className="font-semibold text-slate-600">Сонголт хийгдээгүй байна</Text>
              <Text variant="muted" className="text-xs max-w-[250px] mt-1">
                Зүүн талын жагсаалтаас засах өгөгдлийг сонгох эсвэл "Шинэ өгөгдөл үүсгэх" товчлуурыг дарна уу.
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-seek-4 text-xs">
              {/* Type selector (Only when creating in MULTI-models tabs) */}
              {isCreating && activeTab === 'COMPETENCY' && (
                <div className="space-y-1">
                  <Text className="font-semibold text-slate-700">Төрөл сонгох *</Text>
                  <Select
                    value={selectedRefId}
                    onChange={(e) => setSelectedRefId(e.target.value)}
                    options={[
                      { value: '', label: 'Чадамжийн бүтэц (Framework)' },
                      ...competenceFrameworks.map(f => ({ value: f.id, label: `Дэд чадамж -> ${f.name}` })),
                    ]}
                  />
                </div>
              )}

              {isCreating && activeTab === 'DIFFICULTY' && (
                <div className="space-y-1">
                  <Text className="font-semibold text-slate-700">Төрөл сонгох *</Text>
                  <Select
                    value={selectedRefId}
                    onChange={(e) => setSelectedRefId(e.target.value)}
                    options={[
                      { value: '', label: 'Хэцүүгийн шатлал (Scale)' },
                      ...difficultyScales.map(s => ({ value: s.id, label: `Хэцүүгийн түвшин -> ${s.name}` })),
                    ]}
                  />
                </div>
              )}

              {isCreating && activeTab === 'AUDIENCE' && (
                <div className="space-y-1">
                  <Text className="font-semibold text-slate-700">Төрөл сонгох *</Text>
                  <Select
                    value={selectedRefId}
                    onChange={(e) => setSelectedRefId(e.target.value)}
                    options={[
                      { value: '', label: 'Зорилтот бүлгийн төрөл (Type)' },
                      { value: 'LEVEL', label: 'Зорилтот бүлгийн түвшин (Level)' },
                    ]}
                  />
                </div>
              )}

              {isCreating && activeTab === 'CONTEXT' && (
                <>
                  <div className="space-y-1">
                    <Text className="font-semibold text-slate-700">Зорилтот бүлэг сонгох *</Text>
                    <Select
                      value={selectedRefId}
                      onChange={(e) => setSelectedRefId(e.target.value)}
                      options={audienceTypes.map(t => ({ value: t.id, label: t.name }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Text className="font-semibold text-slate-700">Хэцүүгийн шатлал сонгох *</Text>
                    <Select
                      value={selectedRef2Id}
                      onChange={(e) => setSelectedRef2Id(e.target.value)}
                      options={difficultyScales.map(s => ({ value: s.id, label: s.name }))}
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <Text className="font-semibold text-slate-700">Код (Unique) *</Text>
                <Input
                  value={code}
                  disabled={!isCreating}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                  placeholder="Жишээ: CODE-1"
                />
              </div>

              <div className="space-y-1">
                <Text className="font-semibold text-slate-700">Нэр (Гарчиг) *</Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Жишээ: Хэрэглээ, Сурагч"
                />
              </div>

              {/* Rank (Only for levels) */}
              {((activeTab === 'DIFFICULTY' && selectedRefId) || 
                (activeTab === 'AUDIENCE' && selectedRefId === 'LEVEL') || 
                activeTab === 'COGNITIVE') && (
                <div className="space-y-1">
                  <Text className="font-semibold text-slate-700">Эрэмбэ (Rank) *</Text>
                  <Input
                    type="number"
                    min={1}
                    value={rank}
                    onChange={(e) => setRank(Number(e.target.value))}
                  />
                </div>
              )}

              <div className="flex justify-end gap-seek-2 border-t border-border pt-seek-4">
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
                  className="bg-slate-950 text-white hover:bg-slate-900 flex items-center justify-center gap-seek-2 active:scale-95 transition-all"
                  disabled={saving}
                >
                  {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
