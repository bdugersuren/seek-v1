"use client";

import { Button, Card, PageContainer, Text, Icons } from "@seek/ui";

export default function SupportPage() {
  return (
    <PageContainer className="max-w-none bg-slate-50/50 min-h-screen px-0 py-0 font-sans">
      <div className="max-w-[1400px] mx-auto p-seek-6 space-y-seek-6">
        
        {/* Header Section */}
        <div className="space-y-seek-2 border-b border-slate-100 pb-seek-4">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Тусламж, дэмжлэг
          </h1>
          <Text variant="muted" className="text-xs text-slate-500 font-medium">
            Үнэлгээ өгөх, төлбөр төлөх, сертификат авахтай холбоотой заавар, тусламж.
          </Text>
        </div>

        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 gap-seek-5 sm:grid-cols-2 lg:grid-cols-3">
          <SupportCard
            title="Үнэлгээнд хэрхэн нэгдэх вэ?"
            body="Кодтой үнэлгээнд /join-assessment дээрээс, нээлттэй үнэлгээнд /catalog дээрээс нэгдэнэ."
            iconColor="text-blue-500 bg-blue-50 border-blue-100"
          />
          <SupportCard
            title="Төлбөрийн асуудал"
            body="Төлбөр амжилтгүй болсон бол төлбөрийн хуудсаас дахин оролдоно."
            iconColor="text-amber-500 bg-amber-50 border-amber-100"
          />
          <SupportCard
            title="Сертификат авах"
            body="Шаардлага хангасан үнэлгээний сертификат /certificates дээр харагдана."
            iconColor="text-emerald-500 bg-emerald-50 border-emerald-100"
          />
        </div>

        {/* Contact Info Card */}
        <Card className="p-seek-6 border border-slate-200 bg-white rounded-seek-2xl shadow-seek-xs hover:shadow-seek-sm transition-all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-seek-4">
            <div className="space-y-seek-2">
              <h2 className="text-lg font-bold text-slate-800">
                Холбоо барих
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Утас: <span className="font-bold text-slate-700">7666-1234</span> · Имэйл: <span className="font-bold text-slate-700">support@competency.mn</span> · Ажлын цаг: <span className="font-bold text-slate-700">09:00 - 18:00</span>
              </p>
            </div>
            
            <Button 
              type="button" 
              className="bg-primary text-white hover:bg-primary-hover font-bold text-xs py-2.5 px-6 rounded-seek-xl shadow-seek-xs transition-colors self-start md:self-auto"
            >
              Яаралтай холбоо барих
            </Button>
          </div>
        </Card>

      </div>
    </PageContainer>
  );
}

function SupportCard({ 
  title, 
  body,
  iconColor
}: { 
  title: string; 
  body: string;
  iconColor: string;
}) {
  return (
    <Card className="p-seek-6 border border-slate-200 bg-white rounded-seek-2xl shadow-seek-xs hover:shadow-seek-sm transition-all flex flex-col justify-between min-h-[165px]">
      <div className="space-y-seek-3">
        <div className="flex items-center gap-seek-2">
          <div className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${iconColor}`}>
            i
          </div>
          <h3 className="font-bold text-slate-850 text-xs">
            {title}
          </h3>
        </div>
        <Text variant="muted" className="text-seek-xxs leading-relaxed text-slate-500">
          {body}
        </Text>
      </div>
    </Card>
  );
}
