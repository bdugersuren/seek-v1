import { Button, Card, PageContainer, Text } from "@seek/ui";

export default function SupportPage() {
  return (
    <PageContainer className="max-w-none bg-muted-background">
      <h1 className="font-sans text-3xl font-bold text-foreground">
        Тусламж, дэмжлэг
      </h1>
      <Text variant="muted" className="mt-seek-2">
        Үнэлгээ өгөх, төлбөр төлөх, сертификат авахтай холбоотой тусламж.
      </Text>
      <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 lg:grid-cols-3">
        <SupportCard
          title="Үнэлгээнд хэрхэн нэгдэх вэ?"
          body="Кодтой үнэлгээнд /join-assessment дээрээс, нээлттэй үнэлгээнд /catalog дээрээс нэгдэнэ."
        />
        <SupportCard
          title="Төлбөрийн асуудал"
          body="Төлбөр амжилтгүй болсон бол төлбөрийн хуудсаас дахин оролдоно."
        />
        <SupportCard
          title="Сертификат авах"
          body="Шаардлага хангасан үнэлгээний сертификат /certificates дээр харагдана."
        />
      </div>
      <Card className="mt-seek-5">
        <h2 className="font-sans text-xl font-bold text-foreground">
          Холбоо барих
        </h2>
        <Text variant="muted" className="mt-seek-2">
          7666-1234 · support@competency.mn · Ажлын цаг: 09:00 - 18:00
        </Text>
        <Button type="button" className="mt-seek-4">
          Холбоо барих
        </Button>
      </Card>
    </PageContainer>
  );
}

function SupportCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <h2 className="font-sans text-lg font-bold text-foreground">{title}</h2>
      <Text variant="muted" className="mt-seek-2 text-sm leading-6">
        {body}
      </Text>
    </Card>
  );
}
