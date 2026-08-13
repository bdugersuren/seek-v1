'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Input,
  Text,
  Icons,
  useToast,
} from '@seek/ui';
import {
  fetchDbTables,
  fetchDbData,
  createDbData,
  updateDbData,
  deleteDbData,
} from '@/features/assessor-workspace/api';

interface FieldMeta {
  name: string;
  type: string;
  isRequired: boolean;
  isId: boolean;
  isUpdatedAt: boolean;
  isList: boolean;
  relationName?: string;
}

interface TableMeta {
  name: string;
  fields: FieldMeta[];
}

export default function DatabaseManagementPage() {
  const { showToast } = useToast();
  const [tables, setTables] = useState<TableMeta[]>([]);
  const [loading, setLoading] = useState(true);

  // Сонгогдсон хүснэгт
  const [selectedTable, setSelectedTable] = useState<TableMeta | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Form & CRUD states
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Хүснэгтүүдийн жагсаалт унших
  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await fetchDbTables();
      // Зөвхөн ашиглагдах боломжтой master мета өгөгдөл болон холбоос хүснэгтүүдийг харуулах
      setTables(data || []);
    } catch (err: any) {
      console.error(err);
      showToast('Хүснэгтүүдийн бүтцийг уншиж чадсангүй.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  // Хүснэгтийн бодит өгөгдөл унших
  const loadTableData = async (table: TableMeta) => {
    setLoadingData(true);
    try {
      const data = await fetchDbData(table.name);
      setTableData(data || []);
    } catch (err: any) {
      console.error(err);
      showToast(`${table.name} өгөгдлийг уншихад алдаа гарлаа.`, 'danger');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSelectTable = (table: TableMeta) => {
    setSelectedTable(table);
    setSelectedItem(null);
    setSearchTerm('');
    loadTableData(table);
  };

  const setSelectedItem = (row: any | null) => {
    setSelectedRow(row);
    setIsCreating(false);
    if (row) {
      // Form-ийг тухайн row-ийн утгуудаар дүүргэх
      const initialForm: Record<string, any> = {};
      selectedTable?.fields.forEach((f) => {
        if (!f.isList && !f.relationName) {
          initialForm[f.name] = row[f.name] ?? '';
        }
      });
      setFormData(initialForm);
    } else {
      setFormData({});
    }
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setSelectedRow(null);
    const initialForm: Record<string, any> = {};
    selectedTable?.fields.forEach((f) => {
      if (!f.isList && !f.relationName) {
        if (f.type === 'Boolean') initialForm[f.name] = false;
        else if (f.type === 'Int' || f.type === 'Float') initialForm[f.name] = 0;
        else initialForm[f.name] = '';
      }
    });
    setFormData(initialForm);
  };

  // Form handle change
  const handleInputChange = (fieldName: string, value: any, type: string) => {
    let parsedVal = value;
    if (type === 'Int') parsedVal = parseInt(value) || 0;
    else if (type === 'Float') parsedVal = parseFloat(value) || 0;
    else if (type === 'Boolean') parsedVal = value === true;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: parsedVal,
    }));
  };

  // Хадгалах (Үүсгэх / Засах)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;

    setSaving(true);
    try {
      // Илгээх өгөгдлийг цэвэрлэх
      const payload: Record<string, any> = {};
      selectedTable.fields.forEach((f) => {
        if (!f.isList && !f.relationName) {
          // id, createdAt, updatedAt-ийг үүсгэх үед явуулахгүй
          if (isCreating && (f.isId || f.name === 'createdAt' || f.name === 'updatedAt')) {
            return;
          }
          if (!isCreating && f.isId) {
            return; // Засах үед id-г body-д явуулах шаардлагагүй (where clause-д байгаа)
          }
          
          let val = formData[f.name];
          // Хоосон string байгаа тохиолдолд null-оор явуулах (optional талбар бол)
          if (typeof val === 'string' && val.trim() === '') {
            payload[f.name] = f.isRequired ? '' : null;
          } else if (f.type === 'DateTime' && val) {
            payload[f.name] = new Date(val).toISOString();
          } else {
            payload[f.name] = val;
          }
        }
      });

      if (isCreating) {
        await createDbData(selectedTable.name, payload);
        showToast('Шинэ бичлэг амжилттай үүслээ.', 'success');
      } else {
        await updateDbData(selectedTable.name, selectedRow.id, payload);
        showToast('Бичлэг амжилттай шинэчлэгдлээ.', 'success');
      }

      setIsCreating(false);
      setSelectedRow(null);
      loadTableData(selectedTable);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Бичлэг хадгалахад алдаа гарлаа.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // Устгах
  const handleDelete = async (row: any) => {
    if (!selectedTable) return;
    if (!window.confirm('Энэ бичлэгийг устгахдаа итгэлтэй байна уу? Үүнтэй холбоотой бусад өгөгдлүүд устах аюултай.')) {
      return;
    }

    try {
      await deleteDbData(selectedTable.name, row.id);
      showToast('Бичлэг амжилттай устлаа.', 'success');
      setSelectedItem(null);
      loadTableData(selectedTable);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Бичлэг устгаж чадсангүй.', 'danger');
    }
  };

  // Хайлтаар өгөгдлийг шүүх
  const filteredData = tableData.filter((row) => {
    if (!searchTerm.trim()) return true;
    return Object.values(row).some((val) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-seek-6 p-seek-6">
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-xl font-bold text-slate-900">Өгөгдлийн сан удирдах (Database Explorer)</Text>
          <Text variant="muted" className="text-sm">Баазын бүх хүснэгтийн бүтцийг динамикаар уншиж удирдах самбар</Text>
        </div>
      </div>

      <div className="grid gap-seek-6 md:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Зүүн тал: Хүснэгтүүдийн жагсаалт */}
        <Card className="p-seek-4 space-y-seek-3 h-[600px] overflow-y-auto">
          <Text className="font-bold text-slate-800 border-b border-border pb-seek-2">Хүснэгтүүд ({tables.length})</Text>
          {loading ? (
            <div className="py-20 text-center">
              <Text variant="muted">Уншиж байна...</Text>
            </div>
          ) : (
            <div className="space-y-1">
              {tables.map((t) => {
                const isSelected = selectedTable?.name === t.name;
                return (
                  <div
                    key={t.name}
                    onClick={() => handleSelectTable(t)}
                    className={`py-2 px-3 rounded-seek-md cursor-pointer transition-all hover:bg-slate-50 text-xs ${isSelected ? 'bg-primary/5 border border-primary/20 text-primary font-semibold' : 'text-slate-700'}`}
                  >
                    {t.name}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Баруун тал: Өгөгдөл харах болон форм */}
        <div className="space-y-seek-6">
          {!selectedTable ? (
            <Card className="p-seek-12 flex flex-col items-center justify-center text-center h-[600px]">
              <Icons.Shield className="h-16 w-16 text-slate-300 stroke-[1.2] mb-4" />
              <Text className="text-lg font-semibold text-slate-700">Database Explorer-т тавтай морилно уу</Text>
              <Text variant="muted" className="text-sm max-w-sm mt-1">
                Зүүн талын жагсаалтаас удирдаж, засахыг хүссэн хүснэгтээ сонгоно уу.
              </Text>
            </Card>
          ) : (
            <div className="grid gap-seek-6 xl:grid-cols-[1fr_20rem]">
              {/* Data Table */}
              <Card className="p-seek-5 space-y-seek-4">
                <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-seek-3">
                  <div>
                    <Text className="font-bold text-slate-900 text-base">{selectedTable.name}</Text>
                    <Text variant="muted" className="text-xs">Нийт {filteredData.length} бичлэг</Text>
                  </div>
                  <div className="flex items-center gap-seek-2">
                    <Input
                      placeholder="Шүүх..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-40 h-8 text-xs"
                    />
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleOpenCreate}
                      className="h-8 text-xs bg-slate-950 text-white hover:bg-slate-900 flex items-center gap-1 active:scale-95"
                    >
                      <Icons.Settings className="h-3.5 w-3.5" />
                      <span>Нэмэх</span>
                    </Button>
                  </div>
                </div>

                {loadingData ? (
                  <div className="flex items-center justify-center py-32">
                    <Text variant="muted">Уншиж байна...</Text>
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="text-center py-32 border border-dashed border-border rounded bg-slate-50">
                    <Text className="font-semibold text-slate-500">Бичлэг олдсонгүй</Text>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[450px] overflow-y-auto pr-seek-2">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-slate-50">
                          <th className="py-2 px-3 font-semibold text-slate-600 text-right">Үйлдэл</th>
                          {selectedTable.fields
                            .filter((f) => !f.isList && !f.relationName)
                            .map((f) => (
                              <th key={f.name} className="py-2 px-3 font-semibold text-slate-600 whitespace-nowrap">
                                {f.name}
                              </th>
                            ))}
                          
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((row, idx) => {
                          const isSelected = selectedRow?.id === row.id;
                          return (
                            <tr
                              key={row.id || idx}
                              onClick={() => setSelectedItem(row)}
                              className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${isSelected ? 'bg-primary/5 font-semibold text-primary' : ''}`}
                            >
                              <td className="py-2 px-3 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-danger"
                                  title="Устгах"
                                >
                                  <Icons.Trash className="h-3.5 w-3.5" />
                                </button>
                              </td>
                              {selectedTable.fields
                                .filter((f) => !f.isList && !f.relationName)
                                .map((f) => (
                                  <td key={f.name} className="py-2 px-3 max-w-[200px] truncate" title={String(row[f.name])}>
                                    {row[f.name] !== null && row[f.name] !== undefined
                                      ? typeof row[f.name] === 'object'
                                        ? JSON.stringify(row[f.name])
                                        : String(row[f.name])
                                      : <span className="text-slate-300">null</span>}
                                  </td>
                                ))}
                              
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {/* Dynamic Auto-Generated Form */}
              <Card className="p-seek-5 self-start">
                <div className="border-b border-border pb-seek-3 mb-seek-4">
                  <Text className="font-bold text-slate-800">
                    {isCreating ? 'Шинэ бичлэг' : selectedRow ? 'Засах горим' : 'Сонгоно уу'}
                  </Text>
                </div>

                {!isCreating && !selectedRow ? (
                  <div className="py-24 text-center">
                    <Icons.Settings className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <Text variant="muted" className="text-xs">Засах бичлэг эсвэл "Нэмэх" товчлуурыг дарна уу.</Text>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-seek-4 text-xs max-h-[500px] overflow-y-auto pr-seek-1">
                    {selectedTable.fields
                      .filter((f) => !f.isList && !f.relationName)
                      .map((f) => {
                        // id, createdAt, updatedAt-ийг үүсгэх үед харуулахгүй, засах үед disabled болгоно
                        const isSystemField = f.isId || f.name === 'createdAt' || f.name === 'updatedAt';
                        if (isCreating && isSystemField) return null;

                        return (
                          <div key={f.name} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Text className="font-semibold text-slate-700">{f.name} *</Text>
                              <span className="text-[10px] text-slate-400 font-normal">({f.type})</span>
                            </div>

                            {f.type === 'Boolean' ? (
                              <div className="flex items-center gap-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={!!formData[f.name]}
                                  disabled={isSystemField}
                                  onChange={(e) => handleInputChange(f.name, e.target.checked, f.type)}
                                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                                />
                                <span className="text-slate-600 text-xs">Идэвхтэй төлөв</span>
                              </div>
                            ) : f.type === 'DateTime' ? (
                              <Input
                                type="datetime-local"
                                value={formData[f.name] ? String(formData[f.name]).slice(0, 16) : ''}
                                disabled={isSystemField}
                                onChange={(e) => handleInputChange(f.name, e.target.value, f.type)}
                              />
                            ) : (
                              <Input
                                type={f.type === 'Int' || f.type === 'Float' ? 'number' : 'text'}
                                value={formData[f.name] ?? ''}
                                disabled={isSystemField}
                                onChange={(e) => handleInputChange(f.name, e.target.value, f.type)}
                                placeholder={`${f.name} оруулах`}
                              />
                            )}
                          </div>
                        );
                      })}

                    <div className="flex justify-end gap-seek-2 border-t border-border pt-seek-4">
                      <Button type="button" variant="outline" onClick={() => setSelectedItem(null)} disabled={saving}>
                        Болих
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="bg-slate-950 text-white hover:bg-slate-900 active:scale-95 transition-all"
                        disabled={saving}
                      >
                        {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
