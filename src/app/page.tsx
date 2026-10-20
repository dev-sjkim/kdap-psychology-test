import { FieldsBand, Notebook } from "@/components/Notebook";
import { BasisDialog } from "@/components/start/BasisDialog";
import { StartActions } from "@/components/start/StartActions";
import { STEPS } from "@/lib/steps";

const COUNTS = ["20문항", "7개", "3개", "1~3개", "1~2개", "1~2개"];

export default function Home() {
  return (
    <Notebook band={<FieldsBand extra={<BasisDialog />} />} foot={<StartActions />}>
      <div className="enter home">
        <h1 className="wordmark">마음결</h1>
        <p className="lede">
          4분 만에 적어 보는
          <br />
          나의 성격과 가치
        </p>

        <ol className="toc">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <span className="m">{i + 1}</span>
              <span>{s.title}</span>
              <span className="toc-dots" aria-hidden="true" />
              <span className="num">{COUNTS[i]}</span>
            </li>
          ))}
        </ol>

        <p className="para">
          문항에 답하고 마음 가는 단어를 고르면 나를 그린 프로필 카드 한 장이 나와요. 버튼 하나로 복사해 평소 쓰는 AI에 붙여 넣으면 더 깊은 해석을{" "}
          <span className="nowrap">받을 수 있어요.</span>
        </p>
        <p className="para-small">
          답한 내용은 이 브라우저 안에서만 정리하고, 어디에도 보내거나 저장하지 않아요. 재미로 나를 들여다보는 테스트이고, <span className="nowrap">심리 진단</span>이 아니에요.
        </p>
      </div>
    </Notebook>
  );
}
