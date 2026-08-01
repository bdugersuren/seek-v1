import Link from "next/link";
import { Button } from "@seek/ui";
import { RuntimeNotice, RuntimeShell } from "@/features/runtime/RuntimeShell";

export default function LockedPage() {
  return (
    <RuntimeShell
      title="Attempt түгжигдсэн"
      subtitle="Policy violation эсвэл assessor action-оор runtime хаагдсан."
    >
      <RuntimeNotice tone="danger" title="Шалгалт үргэлжлэх боломжгүй">
        Prototype policy: fullscreen/visibility/window violation 3 хүрвэл lock placeholder
        харуулна. Production дээр энэ event audit log болон assessor review-д орно.
      </RuntimeNotice>
      <div className="mt-seek-4">
        <Link href="/">
          <Button type="button" variant="secondary">
            Нүүр рүү буцах
          </Button>
        </Link>
      </div>
    </RuntimeShell>
  );
}
