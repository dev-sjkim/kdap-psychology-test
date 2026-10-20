import { redirect } from "next/navigation";

// /test로 들어오면 첫 단계로 보낸다. 단계 주소는 /test/<단계>다(D39).
export default function TestIndex() {
  redirect("/test/personality");
}
