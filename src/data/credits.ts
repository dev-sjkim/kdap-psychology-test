// "이 테스트에 대해" 모달의 만든 사람·크레딧(D54, D56). 사용자가 알려 준 값만 적는다.

export interface Credits {
  maker: string;
  bio: string;
  contactLabel: string;
  contactHref: string;
}

export const CREDITS: Credits = {
  maker: "공군 대위 김성준 ✈️",
  bio: "K-DAP AI·SW 프로젝트 과정 1기입니다.",
  contactLabel: "dev.sjkim77@gmail.com",
  contactHref: "mailto:dev.sjkim77@gmail.com",
};

/** 접어 두는 라이선스 안내. "라이선스 보기"를 눌렀을 때만 펼친다. */
export const LICENSE_NOTES = [
  "글꼴: 마루 부리(네이버), Pretendard(길형진), 나눔손글씨 펜(네이버) — SIL 오픈 폰트 라이선스",
  "성격 문항: International Personality Item Pool(퍼블릭 도메인)",
  "배경음: 직접 만든 음원",
];
