import Link from "next/link";
import { Button } from "@seek/ui";
import { RuntimeNotice, RuntimeShell } from "@/features/runtime/RuntimeShell";

export default function ConnectionLostPage() {
  return (
    <RuntimeShell
      title="Сүлжээ тасарсан"
      subtitle="Offline answer buffer болон reconnect recovery policy."
    >
      <RuntimeNotice tone="warning" title="Хугацаа сунгагдахгүй">
        Сүлжээ тасарсан үед client local buffer хадгална. Server timer Redis дээр үргэлжилнэ.
        Дахин холбогдох үед үлдсэн хугацаагаар үргэлжлүүлнэ, хугацаа дууссан бол
        pending submit retry хийнэ.
      </RuntimeNotice>
      <div className="mt-seek-4">
        <Link href="/waiting/mock-attempt-001">
          <Button type="button">Session сэргээх</Button>
        </Link>
      </div>
    </RuntimeShell>
  );
}
