import React from "react";
import {
  PageContainer,
  Display,
  Heading,
  Text,
  Card,
  Stack,
  Button,
} from "@seek/ui";

export default function AssessmentLandingPage() {
  return (
    <PageContainer>
      <Stack gap={6} className="max-w-2xl mx-auto text-center py-12">
        <Display>Чадамжийн үнэлгээ</Display>
        <Text variant="lead">
          Өөрийн мэргэжлийн ур чадварыг олон улсын стандартын дагуу үнэлүүлж,
          баталгаажуулна уу.
        </Text>
        <Card className="text-left mt-6">
          <Stack gap={4}>
            <Heading level={3}>Үнэлгээний заавар</Heading>
            <ul className="list-disc list-inside font-sans text-sm text-foreground flex flex-col gap-2">
              <li>Үнэлгээний нийт хугацаа 60 минут байна.</li>
              <li>Сүлжээ тасрах үед таны явц автоматаар хадгалагдана.</li>
              <li>Үнэлгээг зөвхөн нэг удаа өгөх боломжтойг анхаарна уу.</li>
            </ul>
            <Button variant="primary" className="w-full">
              <a href="/assessment/session" className="w-full h-full block">
                Үнэлгээг эхлүүлэх
              </a>
            </Button>
          </Stack>
        </Card>
      </Stack>
    </PageContainer>
  );
}
