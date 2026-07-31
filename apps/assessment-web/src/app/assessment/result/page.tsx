import React from "react";
import {
  PageContainer,
  PageTitle,
  Card,
  Stack,
  Heading,
  Text,
  Badge,
  Button,
} from "@seek/ui";

export default function AssessmentResultPage() {
  return (
    <PageContainer>
      <PageTitle
        title="Үнэлгээний дүн"
        subtitle="Таны хариултын дэлгэрэнгүй дүн шинжилгээ"
      />
      <Card>
        <Stack gap={6} className="items-center text-center">
          <Badge variant="success" className="text-sm px-4 py-1">
            Амжилттай давсан
          </Badge>
          <Stack gap={2}>
            <Heading level={2}>Нийт оноо: 85%</Heading>
            <Text variant="muted">
              Та чадамжийн босго оноог амжилттай давлаа.
            </Text>
          </Stack>
          <Button variant="primary">
            <a href="/assessment/completed">Баталгаажуулах</a>
          </Button>
        </Stack>
      </Card>
    </PageContainer>
  );
}
