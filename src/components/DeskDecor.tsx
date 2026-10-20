/**
 * PC 화면에서 노트 바깥 책상 면에 놓인 소품 낙서(D69). 연필, 클립, 컵 자국 세 가지를 잉크 선으로 그린다.
 * 노트와 같은 선 굵기·색을 쓰고, 처음 한 번 선이 그려지듯 나타난다. 980px보다 좁으면 CSS가 숨긴다.
 * 장식일 뿐이라 접근성 트리에서 빼고(aria-hidden) 클릭도 막는다.
 */
export function DeskDecor() {
  return (
    <div className="desk-decor" aria-hidden="true">
      {/* 왼쪽 아래: 연필(비스듬히) */}
      <svg className="doodle doodle-pencil" viewBox="0 0 180 60" width="180" height="60">
        {/* 몸통(육각 연필의 세 면), 깎은 끝과 심, 쇠테와 지우개. 기울기는 CSS rotate */}
        <path className="stroke s1" d="M34 22 H146 M34 38 H146 M34 22 L10 30 L34 38" />
        <path className="stroke s2" d="M34 27.5 H146 M34 32.5 H146 M22 26 L10 30 L22 34" />
        <path className="stroke s3" d="M146 22 V38 M152 22 V38 M152 22 H166 a4 4 0 0 1 4 4 V34 a4 4 0 0 1 -4 4 H152" />
        <path className="stroke s4" d="M60 25 H120" />
      </svg>
      {/* 왼쪽 위: 종이 클립 */}
      <svg className="doodle doodle-clip" viewBox="0 0 40 90" width="40" height="90">
        <path className="stroke s1" d="M12 70 V18 a8 8 0 0 1 16 0 V62 a5 5 0 0 1 -10 0 V26" />
        <path className="stroke s2" d="M18 26 V60 a3 3 0 0 0 6 0 V22 a5 5 0 0 0 -10 0 V72 a10 10 0 0 0 20 0 V30" />
      </svg>
      {/* 오른쪽 위: 컵 자국(두 겹, 군데군데 끊김) */}
      <svg className="doodle doodle-ring" viewBox="0 0 120 120" width="120" height="120">
        <path className="stroke s1 dashed" d="M60 12 a48 48 0 1 1 -0.1 0" />
        <path className="stroke s2 dashed" d="M60 20 a40 40 0 1 0 0.1 0" />
      </svg>
    </div>
  );
}
