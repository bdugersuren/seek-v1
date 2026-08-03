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
    <PageContainer className="max-w-none bg-muted-background">
      <h1 className="font-sans text-3xl font-bold text-foreground">
        Төлбөрүүд
      </h1>
      <Text variant="muted" className="mt-seek-2">
        Таны төлбөрийн түүх, үлдэгдэл болон төлбөрийн аргууд.
      </Text>
      <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 md:grid-cols-4">
        <SummaryCard
          title="Нийт зарцуулсан"
          value={`${total.toLocaleString()}₮`}
        />
        <SummaryCard title="Амжилттай төлбөр" value="2" />
        <SummaryCard title="Хүлээгдэж буй" value="1" />
        <SummaryCard title="Үлдэгдэл" value="15,000₮" />
      </div>

      <Card className="mt-seek-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-seek-4 py-seek-3">Огноо</th>
                <th className="px-seek-4 py-seek-3">Үнэлгээний нэр</th>
                <th className="px-seek-4 py-seek-3">Дүн</th>
                <th className="px-seek-4 py-seek-3">Төлөв</th>
                <th className="px-seek-4 py-seek-3">Арга</th>
              </tr>
            </thead>
            <tbody>
              {candidatePayments.map((payment) => (
                <tr key={payment.id} className="border-b border-border">
                  <td className="px-seek-4 py-seek-4">{payment.date}</td>
                  <td className="px-seek-4 py-seek-4">{payment.assessment}</td>
                  <td className="px-seek-4 py-seek-4 font-bold">
                    {payment.amount}
                  </td>
                  <td className="px-seek-4 py-seek-4">
                    <Badge
                      variant={
                        payment.status === "Амжилттай" ? "success" : "warning"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-seek-4 py-seek-4">{payment.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Button type="button" className="mt-seek-5">
        Цэнэглэх
      </Button>
    </PageContainer>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <Text variant="muted" className="text-sm">
        {title}
      </Text>
      <p className="mt-seek-2 font-sans text-2xl font-bold text-foreground">
        {value}
      </p>
    </Card>
  );
}
