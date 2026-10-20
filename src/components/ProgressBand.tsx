import { SoundToggle } from "./SoundToggle";

interface Props {
  /** 단계마다 0~1 채움 비율 */
  fills: number[];
  /** 지금 단계 번호(0부터) */
  current: number;
  /** 없으면 뒤로 버튼 자리를 비워 둔다(1단계는 문항 스테퍼가 이동을 맡는다, D45) */
  onBack?: () => void;
  backLabel?: string;
}

/**
 * 화면 맨 위 한 줄: 뒤로(여백 칸) · 단계별 칸 막대 · 배경음.
 * 끝낸 단계의 칸은 강조색(연필 빨강)으로 물들고, 지금 단계 칸은 먹색으로 차오른다(D41).
 */
export function ProgressBand({ fills, current, onBack, backLabel }: Props) {
  const done = fills.filter((f, i) => i < current && f >= 1).length;
  return (
    <div className="band band-progress">
      {onBack ? (
        <button type="button" className="icon-btn" onClick={onBack} aria-label={backLabel}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15 5 L8 12 L15 19" />
          </svg>
        </button>
      ) : (
        <span className="icon-btn" aria-hidden="true" />
      )}
      <div className="prog-track" role="progressbar" aria-label="진행" aria-valuemin={0} aria-valuemax={fills.length} aria-valuenow={done}>
        {fills.map((f, i) => (
          <span key={i} className={i < current && f >= 1 ? "done" : i === current ? "now" : ""}>
            <i style={{ width: `${Math.min(1, f) * 100}%` }} />
          </span>
        ))}
      </div>
      <SoundToggle />
    </div>
  );
}
