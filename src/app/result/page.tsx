import type { Metadata } from "next";
import { ResultScreen } from "@/components/result/ResultScreen";

export const metadata: Metadata = { title: "결과 · 마음결" };

export default function ResultPage() {
  return <ResultScreen />;
}
