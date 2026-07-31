import React from "react";
import {
  PageContainer,
  PageTitle,
  Card,
  Stack,
  ProgressBar,
  Heading,
  Radio,
  Button,
} from "@seek/ui";

export default function AssessmentSessionPage() {
  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageTitle title="Үнэлгээний явц" subtitle="Асуулт 3/10" />
        <span className="font-mono text-lg font-bold text-primary">
          54:20 үлдсэн
        </span>
      </div>
      <ProgressBar value={30} />
      <Card>
        <Stack gap={6}>
          <Heading level={3}>
            Асуулт 3: HTTP протоколын 200 статус код нь ямар утга илэрхийлдэг
            вэ?
          </Heading>
          <Stack gap={3}>
            <Radio name="http-200" label="Created (Шинээр үүссэн)" />
            <Radio
              name="http-200"
              label="OK (Амжилттай хүлээн авсан)"
              defaultChecked
            />
            <Radio name="http-200" label="Accepted (Зөвшөөрсөн)" />
            <Radio name="http-200" label="No Content (Хоосон)" />
          </Stack>
          <div className="flex justify-between mt-4">
            <Button variant="outline">Өмнөх</Button>
            <Button variant="primary">
              <a href="/assessment/result">Дараах</a>
            </Button>
          </div>
        </Stack>
      </Card>
    </PageContainer>
  );
}
