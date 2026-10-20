import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestFlow } from "@/components/test/TestFlow";
import { STEPS, stepById, type StepId } from "@/lib/steps";

// 단계마다 주소를 따로 둔다: /test/personality, /test/values, /test/narrow, /test/now, /test/grow (D39)
export function generateStaticParams() {
  return STEPS.map((s) => ({ step: s.id }));
}

const isStepId = (v: string): v is StepId => STEPS.some((s) => s.id === v);

export async function generateMetadata({ params }: PageProps<"/test/[step]">): Promise<Metadata> {
  const { step } = await params;
  return { title: isStepId(step) ? `${stepById(step).title} · 마음결` : "마음결" };
}

export default async function StepPage({ params }: PageProps<"/test/[step]">) {
  const { step } = await params;
  if (!isStepId(step)) notFound();
  return <TestFlow stepId={step} />;
}
