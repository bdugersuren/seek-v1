import React from "react";
import {
  PageContainer,
  Display,
  Heading,
  Text,
  Card,
  Stack,
  Alert,
} from "@seek/ui";

export default function AssessmentCompletedPage() {
  return (
    <PageContainer>
      <Stack gap={6} className="max-w-xl mx-auto text-center py-12">
        <Display>Үнэлгээ дууслаа</Display>
        <Text variant="lead">
          Таны хариултууд амжилттай илгээгдэж, үнэлгээ бүрэн дууслаа.
        </Text>
        <Alert type="success" title="Мэдэгдэл">
          Үнэлгээний тайлан таны бүртгэлтэй имэйл хаягаар илгээгдэх болно.
        </Alert>
        <Card className="text-left mt-4">
          <Stack gap={2}>
            <Heading level={3}>Дараагийн алхам</Heading>
            <Text variant="muted">
              Та хөтөчийг хааж эсвэл нүүр хуудас руу шилжин үйлчилгээгээ
              үргэлжлүүлнэ үү.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </PageContainer>
  );
}
