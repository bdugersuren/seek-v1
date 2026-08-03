import { Badge, Card, PageContainer, Text } from "@seek/ui";
import { candidateNotifications } from "@/features/candidate-portal/mock-data";

export default function NotificationsPage() {
  return (
    <PageContainer className="max-w-none bg-muted-background">
      <h1 className="font-sans text-3xl font-bold text-foreground">Мэдэгдэл</h1>
      <Text variant="muted" className="mt-seek-2">
        Үнэлгээ, сертификат, төлбөр болон аюулгүй байдлын мэдэгдлүүд.
      </Text>
      <div className="mt-seek-5 space-y-seek-3">
        {candidateNotifications.map((notification) => (
          <Card key={notification.id}>
            <div className="flex items-start justify-between gap-seek-3">
              <div>
                <h2 className="font-sans text-lg font-bold text-foreground">
                  {notification.title}
                </h2>
                <Text variant="muted" className="mt-seek-1">
                  {notification.body}
                </Text>
                <Text variant="muted" className="mt-seek-2 text-xs">
                  {notification.time}
                </Text>
              </div>
              {notification.unread && <Badge>Шинэ</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
