// "이 테스트에 대해" 모달의 만든 사람·크레딧 정보(D54). 사용자가 알려 준 값만 적는다. 비워 두면 그 줄은 화면에 나오지 않는다.

export interface Credits {
  /** 만든 사람 이름이나 닉네임 */
  maker: string;
  /** 한 줄 소개(선택) */
  bio?: string;
  /** 연락처나 링크(선택). 표시 글자와 주소 */
  links: { label: string; href: string }[];
  /** 만든 계기(선택). 예: "바이브 코딩 교육 과정 산출물" */
  context?: string;
}

export const CREDITS: Credits = {
  maker: "",
  bio: "",
  links: [],
  context: "바이브 코딩 교육 과정에서 만든 산출물이에요.",
};

export const OPEN_SOURCE_CREDITS = [
  "글꼴: 마루 부리(네이버), Pretendard(길형진), 나눔손글씨 펜(네이버) — 모두 SIL 오픈 폰트 라이선스",
  "배경음: 직접 만든 음원",
  "성격 문항: International Personality Item Pool(퍼블릭 도메인)",
];
