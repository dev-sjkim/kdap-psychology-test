// 손으로 동그라미 친 듯한 선택 표시. 칸을 채우는 대신 이 테두리를 그린다.
// 나타날 때 연필로 그리듯 선이 이어진다(globals.css .loop path).

const PATHS = {
  wide: {
    viewBox: "0 0 300 60",
    d: "M26 37 C 17 16, 108 5, 170 7 C 247 9, 295 19, 291 34 C 287 49, 203 56, 139 54 C 69 52, 7 46, 10 30 C 12 19, 43 11, 78 8",
  },
  box: {
    viewBox: "0 0 200 100",
    d: "M20 20 C 52 5, 150 3, 187 13 C 199 30, 198 71, 189 87 C 151 98, 49 99, 13 89 C 2 70, 3 33, 22 15 C 31 9, 46 6, 61 5",
  },
} as const;

export function HandLoop({ variant }: { variant: keyof typeof PATHS }) {
  const p = PATHS[variant];
  return (
    <svg className="loop" viewBox={p.viewBox} width="0" height="0" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={p.d} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
