import { Badge, Button, Card, PageContainer, Text } from "@seek/ui";
import { candidateGroups } from "@/features/candidate-portal/mock-data";

export default function GroupsPage() {
  return (
    <PageContainer className="max-w-none bg-muted-background">
      <h1 className="font-sans text-3xl font-bold text-foreground">
        Миний бүлгүүд
      </h1>
      <Text variant="muted" className="mt-seek-2">
        Байгууллага, сургалтын бүлэг болон зорилтот үнэлгээний бүлгүүд.
      </Text>
      <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 md:grid-cols-2">
        {candidateGroups.map((group) => (
          <Card key={group.id}>
            <div className="flex items-start justify-between gap-seek-3">
              <div>
                <h2 className="font-sans text-xl font-bold text-foreground">
                  {group.name}
                </h2>
                <Text variant="muted" className="mt-seek-1">
                  {group.role} · {group.members} гишүүн
                </Text>
              </div>
              <Badge
                variant={group.status === "Идэвхтэй" ? "success" : "warning"}
              >
                {group.status}
              </Badge>
            </div>
            <Button type="button" variant="outline" className="mt-seek-5">
              Дэлгэрэнгүй
            </Button>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
