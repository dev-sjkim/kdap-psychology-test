// 결과 화면 맨 위의 그림 카드 한 장(spec §5-1). 점수 숫자는 넣지 않는다.

import { VALUES } from "@/data/values";
import type { Analysis } from "@/lib/analysis/analyze";
import { Motif } from "./Motif";

export function ResultCard({ analysis }: { analysis: Analysis }) {
  const v = VALUES[analysis.card.valueId];
  const others = analysis.values.kept.slice(1);
  return (
    <article className="result-card" aria-label="결과 카드">
      <Motif valueId={analysis.card.valueId} />
      <p className="card-kicker">끝까지 남긴 가치</p>
      <h1 className={`card-value pencil v-${v.group}`}>{v.label}</h1>
      <p className="card-def">{v.definition}</p>
      <dl className="card-rows">
        <div>
          <dt>함께 남긴</dt>
          <dd>{others.map((k) => k.word).join(" · ")}</dd>
        </div>
        {analysis.personality.highlights.length > 0 && (
          <div>
            <dt>나의 결</dt>
            <dd>{analysis.personality.highlights.map((t) => t.lean).join(", ")}</dd>
          </div>
        )}
        <div>
          <dt>요즘</dt>
          <dd>{analysis.now.join(" · ")}</dd>
        </div>
      </dl>
      <p className="card-note">그림은 1순위로 남긴 가치를 상징해요. 유형이나 점수가 아니에요.</p>
    </article>
  );
}
