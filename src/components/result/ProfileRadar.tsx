// 성격 5요인 오각형 그래프(D51). 글자는 축 이름 2~3자뿐이라 어떤 결과에서도 깨지지 않는다.
// 선은 먹색 연필, 채움은 강조색을 옅게. 가운데 점선 오각형은 척도 중간(3점) 기준선이다.

import { TRAIT_ORDER, TRAITS } from "@/data/words";
import type { Tendency } from "@/lib/analysis/analyze";

const CX = 110;
const CY = 100;
const R = 70;

function point(i: number, ratio: number): [number, number] {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return [CX + Math.cos(angle) * R * ratio, CY + Math.sin(angle) * R * ratio];
}

const ring = (ratio: number) =>
  TRAIT_ORDER.map((_, i) => point(i, ratio))
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ") + " Z";

export function ProfileRadar({ tendencies }: { tendencies: Tendency[] }) {
  const byTrait = new Map(tendencies.map((t) => [t.trait, t]));
  const shape =
    TRAIT_ORDER.map((trait, i) => point(i, Math.max(0.06, byTrait.get(trait)?.ratio ?? 0)))
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ") + " Z";
  const summary = TRAIT_ORDER.map((t) => `${TRAITS[t].label} ${byTrait.get(t)?.mean.toFixed(1) ?? "-"}`).join(", ");

  return (
    <svg className="radar" viewBox="0 0 220 200" role="img" aria-label={`성격 다섯 특성 그래프. ${summary}`}>
      <path className="radar-grid" d={ring(1)} />
      <path className="radar-grid" d={ring(0.75)} />
      <path className="radar-mid" d={ring(0.5)} />
      <path className="radar-grid" d={ring(0.25)} />
      {TRAIT_ORDER.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} className="radar-spoke" x1={CX} y1={CY} x2={x} y2={y} />;
      })}
      <path className="radar-shape" d={shape} />
      {TRAIT_ORDER.map((trait, i) => {
        const [x, y] = point(i, Math.max(0.06, byTrait.get(trait)?.ratio ?? 0));
        return <circle key={trait} className="radar-dot" cx={x} cy={y} r="3.2" />;
      })}
      {TRAIT_ORDER.map((trait, i) => {
        const [x, y] = point(i, 1.26);
        return (
          <text key={trait} className="radar-label" x={x} y={y + 4} textAnchor="middle">
            {TRAITS[trait].short}
          </text>
        );
      })}
    </svg>
  );
}
