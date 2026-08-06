'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Input,
  Text,
  Icons,
  useToast,
} from '@seek/ui';
import { QuestionType } from './types';
import { questionTypeLabels } from './mock-data';
import { createQuestion } from './api';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (questionId: string) => void;
}

// Асуултын төрлүүдийн иконуудын зураглал
const questionTypeIcons: Record<QuestionType, React.ComponentType<any>> = {
  SINGLE_CHOICE: Icons.SingleChoose,
  MULTIPLE_CHOICE: Icons.MultiChoose,
  TRUE_FALSE: Icons.TrueFalse,
  ORDERING: Icons.Ordering,
  MATCHING: Icons.Matching,
  SHORT_TEXT: Icons.ShortText,
  FILL_BLANK: Icons.FillBlank,
  MATRIX: Icons.Matrix,
  NUMERIC: Icons.Numeric,
  LIKERT: Icons.Likert,
  SJT: Icons.Sjt,
  CASE_BUNDLE: Icons.CaseBundle,
  ESSAY: Icons.Essay,
};

export function CreateQuestionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateQuestionModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [type, setType] = useState<QuestionType>('SINGLE_CHOICE');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [visibilityScope, setVisibilityScope] = useState<'PRIVATE' | 'TENANT'>('PRIVATE');

  // Custom Dropdown-ийн төлөвүүд
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Хамрах хүрээний Custom Dropdown төлөвүүд
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const scopeDropdownRef = useRef<HTMLDivElement>(null);

  // Санамсаргүй код үүсгэх туслах функц
  const generateRandomCode = () => {
    setCode(`Q-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (scopeDropdownRef.current && !scopeDropdownRef.current.contains(event.target as Node)) {
        setShowScopeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 3. Сүүлд сонгосон төрлийг сэргээх болон шинэ код үүсгэх логик
  useEffect(() => {
    if (isOpen) {
      generateRandomCode();
      setTitle('');
      setError('');
      
      // sessionStorage-оос сүүлд сонгосон утгуудыг сэргээх
      const savedType = sessionStorage.getItem('last_question_type') as QuestionType;
      if (savedType && questionTypeIcons[savedType]) {
        setType(savedType);
      } else {
        setType('SINGLE_CHOICE');
      }

      const savedScope = sessionStorage.getItem('last_visibility_scope') as 'PRIVATE' | 'TENANT';
      if (savedScope === 'PRIVATE' || savedScope === 'TENANT') {
        setVisibilityScope(savedScope);
      } else {
        setVisibilityScope('PRIVATE');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Асуултын кодыг оруулна уу.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await createQuestion({
        code: code.trim(),
        title: title.trim() || 'Гарчиггүй асуулт',
        type,
        visibilityScope,
        ownerUserId: 'mock-assessor',
        stem: '',
        options: [],
        feedbackCorrect: '',
        feedbackIncorrect: '',
        scoringMode: 'all_or_nothing',
        scoringConfig: {},
        points: 1,
        durationSeconds: 60,
        tags: [],
      });

      // Сүүлд сонгосон төрлийг хадгалах
      sessionStorage.setItem('last_question_type', type);
      sessionStorage.setItem('last_visibility_scope', visibilityScope);

      showToast('Шинэ асуулт амжилттай үүслээ.', 'success');
      onSuccess(res.id);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || '';
      if (msg.includes('already exists') || msg.includes('давхардсан') || msg.includes('400') || msg.includes('conflict')) {
        setError(`Давхардал: Асуултын код "${code}" аль хэдийн бүртгэгдсэн байна. Та өөр код оруулна уу.`);
      } else {
        setError(msg || 'Асуулт үүсгэхэд алдаа гарлаа.');
      }
    } finally {
      setLoading(false);
    }
  };

  const SelectedTypeIcon = questionTypeIcons[type] || Icons.Info;

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
            <Text className="text-sm font-bold text-slate-900">Шинэ асуулт үүсгэх</Text>
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
          
          {/* Асуултын төрөл сонгох Custom Dropdown */}
          <div className="space-y-1" ref={dropdownRef}>
            <Text className="font-semibold text-slate-700">Асуултын төрөл *</Text>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-seek-md border border-input bg-background px-seek-3 py-seek-2 text-left shadow-seek-sm focus:outline-none focus:ring-1 focus:ring-ring active:scale-[0.99] transition-transform"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <div className="flex items-center gap-seek-2">
                  <SelectedTypeIcon className="h-4 w-4 text-primary stroke-[1.8]" />
                  <span className="text-slate-800 font-medium">
                    {questionTypeLabels[type]}
                  </span>
                </div>
                <Icons.ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
              </button>

              {showTypeDropdown && (
                <div className="absolute left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto rounded-seek-md border border-border bg-background py-1 shadow-seek-lg animate-in fade-in slide-in-from-top-1 duration-150">
                  {Object.entries(questionTypeLabels).map(([val, label]) => {
                    const ItemIcon = questionTypeIcons[val as QuestionType] || Icons.Info;
                    return (
                      <button
                        key={val}
                        type="button"
                        className={`w-full flex items-center gap-seek-3 px-seek-3 py-2 text-left hover:bg-slate-50 transition-colors ${type === val ? 'bg-primary/5 font-semibold text-primary' : 'text-slate-700'}`}
                        onClick={() => {
                          setType(val as QuestionType);
                          setShowTypeDropdown(false);
                        }}
                      >
                        <ItemIcon className={`h-4 w-4 stroke-[1.8] ${type === val ? 'text-primary' : 'text-slate-500'}`} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Асуултын код оруулах талбар */}
          <div className="space-y-1">
            <Text className="font-semibold text-slate-700">Асуултын код *</Text>
            <div className="relative">
              {/* Зүүн талын икон */}
              <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Icons.Hash className="h-4 w-4 text-slate-400 stroke-[1.8]" />
              </div>
              <Input
                value={code}
                // 4. Regex код шүүлтүүр (зөвхөн A-Z, 0-9, - тэмдэгтүүдийг зөвшөөрнө)
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                placeholder="Жишээ: Q-ALGEBRA-101"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              {/* Баруун талын санамсаргүй код үүсгэгч товч */}
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

          {/* Асуултын гарчиг оруулах талбар */}
          <div className="space-y-1">
            <Text className="font-semibold text-slate-700">Асуултын гарчиг</Text>
            <div className="relative">
              <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Icons.Type className="h-4 w-4 text-slate-400 stroke-[1.8]" />
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Жишээ: Квадрат тэгшитгэл бодох"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Хамрах хүрээ сонгох Custom Dropdown */}
          <div className="space-y-1" ref={scopeDropdownRef}>
            <Text className="font-semibold text-slate-700">Хуваалцах хамрах хүрээ *</Text>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-seek-md border border-input bg-background px-seek-3 py-seek-2 text-left shadow-seek-sm focus:outline-none focus:ring-1 focus:ring-ring active:scale-[0.99] transition-transform"
                onClick={() => setShowScopeDropdown(!showScopeDropdown)}
              >
                <div className="flex items-center gap-seek-2">
                  <Icons.UserLock className="h-4 w-4 text-slate-400 stroke-[1.8]" />
                  <span className="text-slate-800 font-medium">
                    {visibilityScope === 'PRIVATE' 
                      ? 'Зөвхөн надад харагдах (Хувийн)' 
                      : 'Байгууллагын бусад багш нартай хуваалцах (Tenant Share)'}
                  </span>
                </div>
                <Icons.ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
              </button>

              {showScopeDropdown && (
                <div className="absolute left-0 right-0 mt-1 z-50 rounded-seek-md border border-border bg-background py-1 shadow-seek-lg animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    type="button"
                    className={`w-full flex items-center gap-seek-3 px-seek-3 py-2 text-left hover:bg-slate-50 transition-colors ${visibilityScope === 'PRIVATE' ? 'bg-primary/5 font-semibold text-primary' : 'text-slate-700'}`}
                    onClick={() => {
                      setVisibilityScope('PRIVATE');
                      setShowScopeDropdown(false);
                    }}
                  >
                    <Icons.UserLock className={`h-4 w-4 stroke-[1.8] ${visibilityScope === 'PRIVATE' ? 'text-primary' : 'text-slate-500'}`} />
                    <span>Зөвхөн надад харагдах (Хувийн)</span>
                  </button>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-seek-3 px-seek-3 py-2 text-left hover:bg-slate-50 transition-colors ${visibilityScope === 'TENANT' ? 'bg-primary/5 font-semibold text-primary' : 'text-slate-700'}`}
                    onClick={() => {
                      setVisibilityScope('TENANT');
                      setShowScopeDropdown(false);
                    }}
                  >
                    <Icons.UserLock className={`h-4 w-4 stroke-[1.8] ${visibilityScope === 'TENANT' ? 'text-primary' : 'text-slate-500'}`} />
                    <span>Бусад багш нартай хуваалцах(Байгууллагын)</span>
                  </button>
                </div>
              )}
            </div>
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
                  <span>Үргэлжлүүлэх</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
