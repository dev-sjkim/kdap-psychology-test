// 결과 카드 그림 10종. 연필 선(ink)과 색연필 칠(tint), 점선(dash)으로 그린 단순한 SVG다.
// 사람 얼굴 없이 사물만 그리고, 칠 색은 가치의 상위 차원 색(--v)을 쓴다(spec §5-1).

import { RESULT_CARDS } from "@/data/result-cards";
import { VALUES, type ValueId } from "@/data/values";
import { josa } from "@/lib/text/josa";

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

function wheel() {
  const cx = 120;
  const cy = 76;
  const spokes: string[] = [];
  const knobs: string[] = [];
  for (let i = 0; i < 8; i++) {
    const t = (i * Math.PI) / 4;
    const p = (r: number) => `${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
    spokes.push(`M${p(8)} L${p(46)}`);
    knobs.push(circle(Number((cx + 50 * Math.cos(t)).toFixed(1)), Number((cy + 50 * Math.sin(t)).toFixed(1)), 4));
  }
  return (
    <>
      <path className="tint" fillRule="evenodd" d={`${circle(cx, cy, 34)} Z ${circle(cx, cy, 26)} Z`} />
      <path className="ink" d={`${circle(cx, cy, 34)} ${circle(cx, cy, 26)} ${circle(cx, cy, 8)} ${spokes.join(" ")} ${knobs.join(" ")}`} />
      <path className="dash" d="M30 140 C 70 132, 170 148, 210 138" />
    </>
  );
}

function pencils() {
  return [84, 112, 140].map((x) => (
    <g key={x}>
      <path className="tint" d={`M${x} 50 L${x} 118 L${x + 20} 118 L${x + 20} 50 Z`} />
      <path
        className="ink"
        d={`M${x} 50 L${x} 118 L${x + 10} 138 L${x + 20} 118 L${x + 20} 50 M${x} 50 L${x} 38 Q${x} 34 ${x + 4} 34 L${x + 16} 34 Q${x + 20} 34 ${x + 20} 38 L${x + 20} 50 Z M${x} 118 L${x + 20} 118 M${x + 6} 130 L${x + 14} 130`}
      />
    </g>
  ));
}

const DRAWINGS: Record<ValueId, () => React.ReactNode> = {
  self_direction: () => (
    <>
      <path className="dash" d="M18 130 C 40 122, 30 104, 56 98" />
      <path className="tint" d="M60 92 L190 40 L128 112 Z" />
      <path className="ink" d="M60 92 L190 40 L128 112 L112 88 Z M190 40 L112 88 M112 88 L106 116 L126 108" />
    </>
  ),
  stimulation: () => (
    <>
      <path className="dash" d="M30 60 C 34 50, 50 50, 54 58 C 64 56, 70 66, 62 70 L32 70 C 24 70, 24 60, 30 60 Z M178 96 C 182 88, 194 88, 197 94 C 205 93, 209 101, 202 104 L180 104 C 173 104, 173 96, 178 96 Z" />
      <path className="tint" d="M120 18 C 160 18, 172 52, 160 74 C 150 92, 132 100, 128 108 L112 108 C 108 100, 90 92, 80 74 C 68 52, 80 18, 120 18 Z" />
      <path
        className="ink"
        d="M120 18 C 160 18, 172 52, 160 74 C 150 92, 132 100, 128 108 L112 108 C 108 100, 90 92, 80 74 C 68 52, 80 18, 120 18 Z M120 18 C 104 40, 106 80, 114 108 M120 18 C 136 40, 134 80, 126 108 M113 108 L110 122 M127 108 L130 122 M106 122 L134 122 L131 138 L109 138 Z"
      />
      <path className="dash" d="M20 146 C 80 134, 160 150, 222 138" />
    </>
  ),
  hedonism: () => (
    <>
      <path className="tint" d={`M40 100 L200 100 L224 140 L16 140 Z ${circle(190, 30, 14)}`} />
      <path
        className="ink"
        d={`M40 100 L200 100 L224 140 L16 140 Z M80 100 L72 140 M120 100 L120 140 M160 100 L168 140 M28 120 L212 120 ${circle(190, 30, 14)} M190 8 L190 12 M190 48 L190 52 M168 30 L172 30 M208 30 L212 30 M175 15 L178 18 M202 42 L205 45 M205 15 L202 18 M178 42 L175 45 M70 84 L104 84 L100 100 L74 100 Z M76 84 C 78 70, 96 70, 98 84`}
      />
    </>
  ),
  achievement: () => (
    <>
      <path className="tint" d="M20 140 L100 46 L132 84 L152 64 L222 140 Z M100 14 L128 22 L100 30 Z" />
      <path className="ink" d="M20 140 L100 46 L132 84 L152 64 L222 140 Z M86 62 L94 70 L100 62 L108 70 L114 64 M100 46 L100 14 M100 14 L128 22 L100 30" />
    </>
  ),
  power: wheel,
  security: () => (
    <>
      <path className="tint" d="M98 86 h22 v20 h-22 Z M58 78 L120 30 L182 78 Z" />
      <path
        className="ink"
        d="M70 74 L70 136 L170 136 L170 74 M58 78 L120 30 L182 78 M98 86 h22 v20 h-22 Z M109 86 v20 M98 96 h22 M136 136 v-34 h20 v34 M150 50 v-16 h12 v26 M40 136 L200 136"
      />
      <path className="dash" d="M156 30 C 150 22, 162 16, 156 8" />
    </>
  ),
  conformity: () => (
    <>
      {pencils()}
      <path className="dash" d="M60 146 L180 146" />
    </>
  ),
  tradition: () => (
    <>
      <path
        className="tint"
        d={`M70 80 C 50 70, 56 40, 80 42 C 86 20, 124 16, 132 36 C 156 30, 172 52, 160 70 C 172 86, 150 102, 132 94 C 120 106, 92 104, 86 94 C 70 100, 56 92, 70 80 Z M174 128 a16 7 0 1 0 32 0 a16 7 0 1 0 -32 0`}
      />
      <path
        className="ink"
        d="M70 80 C 50 70, 56 40, 80 42 C 86 20, 124 16, 132 36 C 156 30, 172 52, 160 70 C 172 86, 150 102, 132 94 C 120 106, 92 104, 86 94 C 70 100, 56 92, 70 80 Z M106 98 L102 140 M126 98 L132 140 M90 140 L144 140 M174 128 a16 7 0 1 0 32 0 a16 7 0 1 0 -32 0 M181 128 a9 4 0 1 0 18 0 a9 4 0 1 0 -18 0 M174 128 L174 140 M206 128 L206 140 M174 140 C 180 144, 200 144, 206 140"
      />
    </>
  ),
  benevolence: () => (
    <>
      <path className="dash" d="M30 30 L24 44 M48 20 L42 34 M22 66 L16 80 M42 56 L36 70" />
      <path
        className="tint"
        d="M64 74 C 66 40, 120 14, 176 46 C 166 52, 156 52, 148 50 C 140 58, 128 58, 120 58 C 112 66, 100 66, 92 66 C 84 74, 72 76, 64 74 Z M176 104 C 166 98, 164 92, 170 90 C 176 92, 178 98, 176 104 Z M176 100 C 184 92, 192 94, 190 100 C 186 104, 180 104, 176 100 Z"
      />
      <path
        className="ink"
        d="M64 74 C 66 40, 120 14, 176 46 C 166 52, 156 52, 148 50 C 140 58, 128 58, 120 58 C 112 66, 100 66, 92 66 C 84 74, 72 76, 64 74 Z M118 30 L120 24 M122 44 L142 126 C 144 136, 134 138, 132 130 M160 120 h28 l-4 18 h-20 Z M174 120 C 174 110, 174 106, 176 98 M176 104 C 166 98, 164 92, 170 90 C 176 92, 178 98, 176 104 Z M176 100 C 184 92, 192 94, 190 100 C 186 104, 180 104, 176 100 Z"
      />
    </>
  ),
  universalism: () => (
    <>
      <path
        className="tint"
        d={`${circle(60, 70, 14)} M88 50 L94 60 L100 48 L106 60 L112 50 C 114 70, 108 78, 100 78 C 92 78, 86 70, 88 50 Z ${circle(146, 76, 16)} M172 86 C 172 76, 188 76, 188 86 L192 96 L168 96 Z ${circle(30, 104, 6)}`}
      />
      <path
        className="ink"
        d={`${circle(60, 70, 14)} ${circle(60, 70, 5)} M60 84 C 58 104, 62 120, 60 140 M88 50 L94 60 L100 48 L106 60 L112 50 C 114 70, 108 78, 100 78 C 92 78, 86 70, 88 50 Z M100 78 L100 140 M100 116 C 88 108, 84 100, 88 96 C 96 100, 100 108, 100 116 ${circle(146, 76, 16)} ${circle(146, 76, 7)} M146 92 C 148 110, 144 126, 146 140 M172 86 C 172 76, 188 76, 188 86 L192 96 L168 96 Z M180 96 L180 140 ${circle(30, 104, 6)} M30 110 L32 140 M16 140 C 80 134, 160 144, 224 136`}
      />
    </>
  ),
};

export function Motif({ valueId }: { valueId: ValueId }) {
  const v = VALUES[valueId];
  return (
    <svg className={`motif v-${v.group}`} viewBox="0 0 240 150" role="img" aria-label={`${RESULT_CARDS[valueId].motif} 그림. ${josa(v.label, "을/를")} 상징해요.`}>
      {DRAWINGS[valueId]()}
    </svg>
  );
}
