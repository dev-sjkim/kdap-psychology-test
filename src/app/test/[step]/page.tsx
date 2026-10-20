import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FieldsBand, Notebook } from "@/components/Notebook";
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

// params(주소 데이터)는 Suspense 안에서만 읽는다. 그래야 다섯 단계가 같은 App Shell을 나눠 쓰고
// 링크 이동이 즉시 일어난다(Next 16 "URL data outside of Suspense" 안내, D47).
async function Step({ params }: { params: PageProps<"/test/[step]">["params"] }) {
  const { step } = await params;
  if (!isStepId(step)) notFound();
  return <TestFlow stepId={step} />;
}

export default function StepPage({ params }: PageProps<"/test/[step]">) {
  return (
    <Suspense fallback={<Notebook band={<FieldsBand />}>{null}</Notebook>}>
      <Step params={params} />
    </Suspense>
  );
}
