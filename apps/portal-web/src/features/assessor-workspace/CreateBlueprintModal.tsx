'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Input,
  Text,
  Icons,
  useToast,
} from '@seek/ui';
import { createBlueprint } from './api';

interface CreateBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (blueprintId: string) => void;
  contextId: string;
  rawTopics: any[];
}

export function CreateBlueprintModal({
  isOpen,
  onClose,
  onSuccess,
  contextId,
  rawTopics,
}: CreateBlueprintModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [description, setDescription] = useState('');

  // Сэдвийн Custom Dropdown төлөвүүд
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const topicDropdownRef = useRef<HTMLDivElement>(null);

  // Санамсаргүй код үүсгэх туслах функц
  const generateRandomCode = () => {
    setCode(`BP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  };

  // 1. Escape товчлуураар хаах логик
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 2. Гадна дарах үед dropdown-уудыг хаах
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target as Node)) {
        setShowTopicDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 3. Нээгдэх үед шинэ код үүсгэх логик
  useEffect(() => {
    if (isOpen) {
      generateRandomCode();
      setTitle('');
      setDescription('');
      setError('');
      
      if (rawTopics && rawTopics.length > 0) {
        setSelectedTopicId(rawTopics[0].id);
      } else {
        setSelectedTopicId('');
      }
    }
  }, [isOpen, rawTopics]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Blueprint кодыг оруулна уу.');
      return;
    }
    if (!title.trim()) {
      setError('Blueprint нэрийг оруулна уу.');
      return;
    }
    if (!selectedTopicId) {
      setError('Сэдэв сонгоно уу.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const selectedTopic = rawTopics.find(t => t.id === selectedTopicId);
      
      const res = await createBlueprint({
        name: title.trim(),
        code: code.trim(),
        description: description.trim(),
        assessmentContextId: contextId,
        topicId: selectedTopicId,
        topicName: selectedTopic ? (selectedTopic.title || selectedTopic.name) : 'Default Topic',
        sections: [],
      });

      showToast('Шинэ Blueprint амжилттай үүслээ.', 'success');
      onSuccess(res.id);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || '';
      if (msg.includes('already exists') || msg.includes('давхардсан') || msg.includes('conflict')) {
        setError(`Давхардал: Blueprint код "${code}" аль хэдийн бүртгэгдсэн байна. Та өөр код оруулна уу.`);
      } else {
        setError(msg || 'Blueprint үүсгэхэд алдаа гарлаа.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedTopic = rawTopics.find(t => t.id === selectedTopicId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div 
        className="w-full max-w-md rounded-seek-lg bg-surface shadow-seek-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Windows маягийн саарал толгой хэсэг */}
        <div className="flex items-center justify-between bg-slate-100 px-seek-5 py-seek-3 border-b border-border">
          <div className="flex items-center">
            <Icons.FilePlusCorner className="h-4 w-4 text-slate-600 mr-seek-2 stroke-[1.8]" />
            <Text className="text-sm font-bold text-slate-900">Шинэ Blueprint үүсгэх</Text>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="h-6 w-6 p-0 text-xs hover:bg-slate-200 border-none bg-transparent rounded-seek-md text-slate-500 hover:text-slate-800"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-seek-5 space-y-seek-4 text-xs">
          
          {/* Blueprint нэр оруулах талбар */}
          <div className="space-y-1">
            <Text className="font-semibold text-slate-700">Blueprint нэр *</Text>
            <div className="relative">
              <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Icons.Type className="h-4 w-4 text-slate-400 stroke-[1.8]" />
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Жишээ: Математик 6-р анги суурь үнэлгээ"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Blueprint код оруулах талбар */}
          <div className="space-y-1">
            <Text className="font-semibold text-slate-700">Blueprint код *</Text>
            <div className="relative">
              <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Icons.Hash className="h-4 w-4 text-slate-400 stroke-[1.8]" />
              </div>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                placeholder="Жишээ: BP-MATH-6"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="absolute right-seek-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 rounded-seek-md hover:bg-slate-100 active:scale-95 transition-all"
                title="Шинэ код үүсгэх"
              >
                <Icons.Recycle className="h-4 w-4 stroke-[1.8]" />
              </button>
            </div>
          </div>

          {/* Сэдэв сонгох Custom Dropdown */}
          {rawTopics && rawTopics.length > 0 && (
            <div className="space-y-1" ref={topicDropdownRef}>
              <Text className="font-semibold text-slate-700">Сэдэв сонгох *</Text>
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-seek-md border border-input bg-background px-seek-3 py-seek-2 text-left shadow-seek-sm focus:outline-none focus:ring-1 focus:ring-ring active:scale-[0.99] transition-transform"
                  onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                >
                  <div className="flex items-center gap-seek-2">
                    <Icons.Settings className="h-4 w-4 text-primary stroke-[1.8]" />
                    <span className="text-slate-800 font-medium">
                      {selectedTopic ? (selectedTopic.title || selectedTopic.name) : 'Сэдэв сонгох'}
                    </span>
                  </div>
                  <Icons.ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                </button>

                {showTopicDropdown && (
                  <div className="absolute left-0 right-0 mt-1 z-50 max-h-48 overflow-y-auto rounded-seek-md border border-border bg-background py-1 shadow-seek-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    {rawTopics.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`w-full flex items-center gap-seek-3 px-seek-3 py-2 text-left hover:bg-slate-50 transition-colors ${selectedTopicId === t.id ? 'bg-primary/5 font-semibold text-primary' : 'text-slate-700'}`}
                        onClick={() => {
                          setSelectedTopicId(t.id);
                          setShowTopicDropdown(false);
                        }}
                      >
                        <Icons.Settings className={`h-4 w-4 stroke-[1.8] ${selectedTopicId === t.id ? 'text-primary' : 'text-slate-500'}`} />
                        <span>{t.title || t.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Тайлбар оруулах талбар */}
          <div className="space-y-1">
            <Text className="font-semibold text-slate-700">Тайлбар</Text>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Blueprint-ийн ерөнхий зорилго, тайлбар..."
            />
          </div>

          {error && (
            <div className="rounded-seek-md bg-danger/10 p-seek-3 border border-danger/20">
              <Text className="text-xs text-danger font-medium">{error}</Text>
            </div>
          )}

          {/* Доод үйлдлийн товчлуурууд */}
          <div className="flex justify-end gap-seek-2 border-t border-border pt-seek-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Болих
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-slate-950 text-white hover:bg-slate-900 flex items-center justify-center gap-seek-2 shadow-seek-md active:scale-95 transition-all"
              disabled={loading}
            >
              {loading ? (
                'Үүсгэж байна...'
              ) : (
                <>
                  <Icons.SavePen className="h-4 w-4 stroke-[1.8]" />
                  <span>Үүсгэх</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
