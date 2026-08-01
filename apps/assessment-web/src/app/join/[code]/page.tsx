import Link from "next/link";
import { Button, Card, Text } from "@seek/ui";
import { RuntimeNotice, RuntimeShell } from "@/features/runtime/RuntimeShell";

export default function JoinByCodePage({ params }: { params: { code: string } }) {
  return (
    <RuntimeShell
      title="Кодоор шалгалтад нэгдэх"
      subtitle="Private-code access mode production contract."
    >
      <div className="grid gap-seek-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="p-seek-5">
          <Text className="font-bold">Нэвтрэх код</Text>
          <Text className="mt-seek-2 font-mono text-2xl font-bold text-primary">
            {params.code}
          </Text>
          <Text variant="muted" className="mt-seek-3">
            Production үед энэ route кодыг backend дээр баталгаажуулж, тухайн
            хэрэглэгчид attempt token олгоод waiting room рүү шилжүүлнэ.
          </Text>
          <div className="mt-seek-5">
            <Link href="/waiting/mock-attempt-001">
              <Button type="button">Waiting room руу орох</Button>
            </Link>
          </div>
        </Card>
        <RuntimeNotice title="Private assessment">
          Захиалгат тест catalog дээр харагдахгүй. Зөвхөн code эсвэл assigned user
          entitlement-аар нээгдэнэ.
        </RuntimeNotice>
      </div>
    </RuntimeShell>
  );
}
