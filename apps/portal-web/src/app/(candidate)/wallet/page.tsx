import Link from "next/link";
export default function Unavailable(){return <main className="mx-auto max-w-xl p-6 space-y-4"><h1 className="text-2xl font-bold">Үйлчилгээ бэлтгэгдэж байна</h1><p>Энэ үйлчилгээ одоогоор идэвхгүй. Танд оноосон шалгалтууд Миний үнэлгээ хэсэгт байна.</p><Link className="text-primary underline" href="/my-assessments">Миний үнэлгээ</Link></main>;}
