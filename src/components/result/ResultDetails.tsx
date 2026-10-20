// [자세히 보기]를 누르면 펼치는 상세 정보. 문장은 데이터 파일과 규칙에서만 만든다.

import { REFERENCES } from "@/data/references";
import { VALUES } from "@/data/values";
import { TRAITS } from "@/data/words";
import type { Analysis } from "@/lib/analysis/analyze";
import { LIMITATIONS } from "@/lib/prompt/prompt-data";
import { stepById } from "@/lib/steps";
import { formatSeconds } from "@/lib/text/format";

const BAND = { high: "높은 쪽", middle: "중간", low: "낮은 쪽" } as const;

export function ResultDetails({ analysis: a }: { analysis: Analysis }) {
  return (
    <div className="details">
      {a.patterns.length > 0 && (
        <>
          <h2 className="sec">눈여겨볼 점</h2>
          <ul className="lines">
            {a.patterns.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}

      <h2 className="sec">평소의 나</h2>
      <ul className="lines trait-lines">
        {a.personality.tendencies.map((t) => (
          <li key={t.trait}>
            <b>{TRAITS[t.trait].label}</b>
            <span className={`lean-band lean-${t.band}`}>{BAND[t.band]}</span>
            <span>{t.lean}</span>
          </li>
        ))}
      </ul>

      <h2 className="sec">끝까지 남긴 가치</h2>
      <ul className="lines">
        {a.values.kept.map((k) => (
          <li key={k.wordId}>
            <span className="m num" aria-hidden="true">
              {k.rank}
            </span>
            <b>{k.word}</b> · {VALUES[k.valueId].definition}
          </li>
        ))}
      </ul>
      <p className="footnote">마지막에 내려놓은 단어: {a.values.letGo.map((l) => l.word).join(", ")}</p>

      <h2 className="sec">요즘과 앞으로</h2>
      <ul className="lines">
        <li>
          <b>요즘</b> {a.now.join(", ")}
        </li>
        {a.release.length > 0 && (
          <li>
            <b>비우고 싶은</b> {a.release.map((r) => `${r.word} → ${VALUES[r.valueId].label}에 자리`).join(", ")}
          </li>
        )}
        <li>
          <b>키우고 싶은 힘</b> {a.grow.map((id) => VALUES[id].label).join(", ")}
        </li>
      </ul>

      <h2 className="sec">고르는 동안</h2>
      <ul className="lines">
        <li>
          가장 오래 머문 단계는 <b>{a.hesitation.slowest.title}</b>({formatSeconds(a.hesitation.slowest.seconds)})였어요.
        </li>
        {a.hesitation.removed.map((r) => (
          <li key={r.stepId}>
            {stepById(r.stepId).title}에서 골랐다가 뺀 것: <b>{r.words.join(", ")}</b>
          </li>
        ))}
      </ul>

      <details className="disclosure" style={{ marginTop: 16, fontSize: 14 }}>
        <summary>어떻게 만들었나요?</summary>
        <div className="disclosure-body">
          <ul>
            {LIMITATIONS.map((l) => (
              <li key={l}>{l}</li>
            ))}
            <li>성격은 특성마다 두 문항(한쪽은 반대로 읽음)의 평균으로 어느 쪽에 기울었는지만 봐요.</li>
            <li>가치는 끝까지 남긴 순서를 가장 크게 보고, 1순위로 남긴 가치를 결과 카드 그림으로 보여 줘요.</li>
          </ul>
          <p>참고한 연구</p>
          <ul>
            {REFERENCES.map((r) => (
              <li key={r.id}>
                {r.citation}{" "}
                {r.doi && (
                  <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer">
                    doi:{r.doi}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}
