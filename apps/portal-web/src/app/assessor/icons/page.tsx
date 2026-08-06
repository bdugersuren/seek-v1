'use client';

import { useState } from 'react';
import { Icons, Card, Text, Input, useToast } from '@seek/ui';

export default function IconsGalleryPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Иконы нэрийг хуулж авах функц
  const handleCopy = (name: string) => {
    const code = `<Icons.${name} />`;
    navigator.clipboard.writeText(code);
    showToast(`"${code}" кодыг санах ойд хууллаа.`, 'success');
  };

  // Иконуудыг хайлтаар шүүх
  const filteredIcons = Object.entries(Icons).filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-seek-5 p-seek-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-seek-4 border-b border-border pb-seek-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Иконограф (Icons Gallery)</h1>
          <Text variant="muted" className="text-sm mt-1">
            Платформ дээр локалиар ашиглагдаж буй нийт {Object.keys(Icons).length} иконы цуглуулга.
          </Text>
        </div>
        <div className="w-full md:w-80">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Иконы нэрээр хайх..."
          />
        </div>
      </div>

      {filteredIcons.length === 0 ? (
        <div className="text-center py-seek-8 text-muted-foreground bg-muted-background/20 rounded-seek-lg border border-dashed border-border">
          Хайлтад тохирох икон олдсонгүй.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-seek-4">
          {filteredIcons.map(([name, IconComponent]) => (
            <Card
              key={name}
              className="flex flex-col items-center justify-center p-seek-4 text-center cursor-pointer hover:border-slate-800 hover:shadow-seek-md transition-all duration-150 group"
              onClick={() => handleCopy(name)}
            >
              <div className="h-12 w-12 rounded-seek-lg bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <IconComponent className="h-6 w-6 stroke-[1.8]" />
              </div>
              <Text className="mt-seek-3 font-semibold text-xs text-slate-800 truncate w-full">
                {name}
              </Text>
              <Text variant="muted" className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Хуулахын тулд дар
              </Text>
            </Card>
          ))}
        </div>
      )}

      <div className="rounded-seek-lg bg-slate-50 border border-border p-seek-4 space-y-seek-3 text-xs text-slate-700">
        <Text className="font-bold text-sm text-slate-900">💡 Хөгжүүлэлтийн зааварчилгаа</Text>
        <ul className="list-disc pl-seek-4 space-y-seek-2">
          <li>
            <strong>Шинэ икон нэмэх:</strong> Иконы эх SVG кодыг <code className="font-mono bg-white px-1 py-0.5 rounded border">packages/ui/src/components/icons/[Нэр].tsx</code> хавтсанд шинээр үүсгэж, <code className="font-mono bg-white px-1 py-0.5 rounded border">index.ts</code> файлд бүртгэнэ.
          </li>
          <li>
            <strong>Ашиглах:</strong> Коддоо ашиглахдаа <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-red-600">{"import { Icons } from '@seek/ui'"}</code> гэж импортлоод дээрх жагсаалтаас дарж хуулсан нэршлээр шууд хэрэглэнэ.
          </li>
          <li>
            <strong>Загварчлах:</strong> Иконы өнгө болон хэмжээг className-ээр хялбар удирдаж болно (Жишээ нь: <code className="font-mono bg-white px-1 py-0.5 rounded border">{"<Icons.Calendar className='h-5 w-5 text-red-500' />"}</code>).
          </li>
        </ul>
      </div>
    </div>
  );
}
