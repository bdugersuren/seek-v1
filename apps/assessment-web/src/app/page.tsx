import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/waiting/mock-attempt-001");
}
