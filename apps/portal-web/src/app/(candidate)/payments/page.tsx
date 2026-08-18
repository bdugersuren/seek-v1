"use client";

import { Badge, Button, Card, PageContainer, Text } from "@seek/ui";
import { candidatePayments } from "@/features/candidate-portal/mock-data";

export default function PaymentsPage() {
  const total = candidatePayments
    .filter((payment) => payment.status === "Амжилттай")
    .reduce(
      (sum, payment) => sum + Number(payment.amount.replace(/\D/g, "")),
      0,
    );

  return (
    <PageContainer className="max-w-none bg-slate-50/50 min-h-screen px-0 py-0 font-sans">
      <div className="max-w-[1400px] mx-auto p-seek-6 space-y-seek-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-seek-4 border-b border-slate-100 pb-seek-4">
          <div className="space-y-seek-2">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Төлбөрүүд
            </h1>
            <Text variant="muted" className="text-xs text-slate-500 font-medium">
              Таны төлбөрийн түүх, үлдэгдэл болон төлбөрийн аргууд.
            </Text>
          </div>
          
          <Button 
            type="button" 
            className="bg-primary text-white hover:bg-primary-hover font-bold text-xs py-2.5 px-6 rounded-seek-xl shadow-seek-xs transition-colors self-start sm:self-auto"
          >
            + Данс цэнэглэх
          </Button>
        </div>

        {/* Summary metrics grid */}
        <div className="grid grid-cols-2 gap-seek-4 md:grid-cols-4">
          <SummaryCard
            title="Нийт зарцуулсан"
            value={`${total.toLocaleString()}₮`}
            iconColor="text-emerald-500 bg-emerald-50 border-emerald-100"
          />
          <SummaryCard 
            title="Амжилттай төлбөр" 
            value="2" 
            iconColor="text-blue-500 bg-blue-50 border-blue-100"
          />
          <SummaryCard 
            title="Хүлээгдэж буй" 
            value="1" 
            iconColor="text-amber-500 bg-amber-50 border-amber-100"
          />
          <SummaryCard 
            title="Үлдэгдэл" 
            value="15,000₮" 
            iconColor="text-indigo-500 bg-indigo-50 border-indigo-100"
          />
        </div>

        {/* Payment History Table */}
        <Card className="overflow-hidden border border-slate-200 bg-white rounded-seek-2xl shadow-seek-xs p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-left text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-800">
                  <th className="px-seek-5 py-seek-3.5">Огноо</th>
                  <th className="px-seek-5 py-seek-3.5">Үнэлгээний нэр</th>
                  <th className="px-seek-5 py-seek-3.5">Дүн</th>
                  <th className="px-seek-5 py-seek-3.5">Төлөв</th>
                  <th className="px-seek-5 py-seek-3.5">Арга</th>
                </tr>
              </thead>
              <tbody>
                {candidatePayments.map((payment) => {
                  const isSuccess = payment.status === "Амжилттай";
                  return (
                    <tr key={payment.id} className="border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors">
                      <td className="px-seek-5 py-seek-4 font-medium text-slate-500">{payment.date}</td>
                      <td className="px-seek-5 py-seek-4 font-bold text-slate-800">{payment.assessment}</td>
                      <td className="px-seek-5 py-seek-4 font-extrabold text-slate-900">{payment.amount}</td>
                      <td className="px-seek-5 py-seek-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-seek-md text-[9px] font-bold tracking-wider ${
                          isSuccess ? "bg-emerald-100/70 text-emerald-700" : "bg-amber-100/70 text-amber-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-seek-5 py-seek-4 font-medium text-slate-500">{payment.method}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </PageContainer>
  );
}

function SummaryCard({ 
  title, 
  value,
  iconColor
}: { 
  title: string; 
  value: string;
  iconColor: string;
}) {
  return (
    <Card className="p-seek-5 border border-slate-200 bg-white rounded-seek-2xl shadow-seek-xs flex flex-col justify-between min-h-[100px] hover:shadow-seek-sm transition-all">
      <div>
        <Text variant="muted" className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
          {title}
        </Text>
        <p className="mt-seek-2 font-sans text-xl font-extrabold text-slate-850">
          {value}
        </p>
      </div>
      <div className={`self-end h-6 w-6 rounded-full border flex items-center justify-center ${iconColor} text-[8px] font-bold mt-2`}>
        ✔
      </div>
    </Card>
  );
}
