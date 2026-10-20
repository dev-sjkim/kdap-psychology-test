// "마음결에 대해" 모달의 만든 사람·크레딧(D54, D56, D60).

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

/** 만든 사람 카드 맨 아래 각주 한 줄. 접지 않고 늘 보이되 작게 둔다. */
export const THANKS =
  "글꼴은 마루 부리·Pretendard·나눔손글씨 펜(SIL 오픈 폰트 라이선스), 성격 문항은 IPIP(퍼블릭 도메인), 배경음은 직접 만들었어요.";
