// 결과 화면 맨 위의 프로필 카드 한 장(D51). 글자는 최소로 두고 그래프로 보여 준다.
// 왼쪽 위: 성격 오각형 그래프 / 오른쪽 위: 1순위 가치의 작은 상징 그림
// 아래: 남긴 가치 3개 막대(1·2·3순위) / 요즘 기분 칩 / 키우고 싶은 힘
// 모든 글자는 2~7자 단어라 어떤 결과에서도 줄이 깨지지 않는다. 긴 풀이는 LLM 해석으로 넘긴다.

import { VALUES } from "@/data/values";
import type { Analysis } from "@/lib/analysis/analyze";
import { Motif } from "./Motif";
import { ProfileRadar } from "./ProfileRadar";

export function ResultCard({ analysis }: { analysis: Analysis }) {
  const kept = analysis.values.kept;
  return (
    <article className="result-card profile" aria-label="결과 카드">
      <div className="profile-top">
        <ProfileRadar tendencies={analysis.personality.tendencies} />
        <div className="profile-motif">
          <Motif valueId={analysis.card.valueId} />
        </div>
      </div>

      <dl className="profile-rows">
        <div>
          <dt>지키는 가치</dt>
          <dd className="value-bars">
            {kept.map((k) => {
              const v = VALUES[k.valueId];
              const width = [100, 72, 48][k.rank - 1];
              return (
                <span key={k.wordId} className="vbar">
                  <span className="vbar-rank num" aria-hidden="true">
                    {k.rank}
                  </span>
                  <span className={`vbar-fill v-${v.group}`} style={{ width: `${width}%` }}>
                    <span className="vbar-word">{k.word}</span>
                  </span>
                </span>
              );
            })}
          </dd>
        </div>
        <div>
          <dt>요즘</dt>
          <dd className="chip-row">
            {analysis.now.map((w) => (
              <span key={w} className="mini-chip">
                {w}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>키우고 싶은</dt>
          <dd className="chip-row">
            {analysis.grow.map((id) => (
              <span key={id} className={`mini-chip pencil v-${VALUES[id].group}`}>
                {VALUES[id].label}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <p className="card-note">유형이나 점수가 아니라, 응답이 기운 방향을 그린 거예요.</p>
    </article>
  );
}
