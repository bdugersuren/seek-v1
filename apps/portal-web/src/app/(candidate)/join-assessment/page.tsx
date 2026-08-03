"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Card,
  FieldWrapper,
  Input,
  PageContainer,
  Text,
  useToast,
} from "@seek/ui";
import { createAssessmentRuntimeUrl } from "@/features/assessment-runtime/url";

export default function JoinAssessmentPage() {
  const [code, setCode] = useState("");
  const { showToast } = useToast();

  return (
    <PageContainer className="max-w-none bg-muted-background">
      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section>
          <Text variant="muted" className="text-sm">
            Нүүр хуудас › Үнэлгээ сонгох
          </Text>
          <h1 className="mt-seek-4 font-sans text-3xl font-bold text-foreground">
            Зорилтот үнэлгээнд нэгдэх
          </h1>
          <Text variant="muted" className="mt-seek-2">
            Цаанаас өгсөн кодыг оруулан тусгай үнэлгээнд нэгдэнэ үү.
          </Text>

          <Card className="mt-seek-5">
            <div className="grid grid-cols-1 gap-seek-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-center">
              <div className="grid h-64 place-items-center rounded-seek-lg bg-gradient-to-br from-violet-50 to-indigo-100 text-8xl">
                🔒
              </div>
              <div>
                <h2 className="font-sans text-2xl font-bold text-foreground">
                  Зорилтот үнэлгээнд нэгдэх
                </h2>
                <Text variant="muted" className="mt-seek-2">
                  Байгууллага, удирдагч эсвэл багшаас өгсөн нэвтрэх кодыг оруулж
                  үнэлгээнд нэгдэнэ үү.
                </Text>
                <FieldWrapper
                  id="join-code"
                  label="Нэвтрэх код"
                  className="mt-seek-5"
                >
                  <Input
                    value={code}
                    placeholder="Жишээ нь: A1B2-C3D4-E5F6"
                    onChange={(event) => setCode(event.target.value)}
                  />
                </FieldWrapper>
                <Text variant="muted" className="mt-seek-2 text-sm">
                  Код нь том жижиг үсэг, тоо, зураас агуулсан байж болно.
                </Text>
                <Button
                  type="button"
                  className="mt-seek-5 w-full"
                  onClick={() => {
                    const normalizedCode = code.trim();
                    showToast(
                      normalizedCode
                        ? "Зорилтот үнэлгээнд нэгдэх demo хүсэлт илгээгдлээ."
                        : "Эхлээд код оруулна уу.",
                      normalizedCode ? "success" : "warning",
                    );

                    if (normalizedCode) {
                      window.location.href = createAssessmentRuntimeUrl(
                        `/join/${encodeURIComponent(normalizedCode)}`,
                      );
                    }
                  }}
                >
                  Үнэлгээнд нэгдэх
                </Button>
                <div className="my-seek-4 flex items-center gap-seek-3">
                  <span className="h-px flex-1 bg-border" />
                  <Text variant="muted" className="text-sm">
                    эсвэл
                  </Text>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Link
                  href="/catalog"
                  className="inline-flex w-full items-center justify-center rounded-seek-md border border-border bg-surface px-seek-4 py-seek-2 font-sans text-sm font-semibold text-foreground hover:bg-surface-hover"
                >
                  Үнэлгээний жагсаалтаас сонгох →
                </Link>
              </div>
            </div>
          </Card>
        </section>

        <aside className="space-y-seek-4">
          <InfoCard
            title="Зорилтот үнэлгээ гэж юу вэ?"
            body="Тодорхой бүлэг, байгууллага, хичээл, арга хэмжээнд оролцогчдод зориулсан тусгай үнэлгээ."
          />
          <InfoCard
            title="Код хаанаас авах вэ?"
            body="Байгууллага, багш, сургалтын байгууллага эсвэл арга хэмжээ зохион байгуулагчаас авна."
          />
        </aside>
      </div>
    </PageContainer>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <h2 className="font-sans text-lg font-bold text-foreground">{title}</h2>
      <Text variant="muted" className="mt-seek-2 text-sm leading-6">
        {body}
      </Text>
    </Card>
  );
}
