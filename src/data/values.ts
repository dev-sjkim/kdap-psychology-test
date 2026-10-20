// Schwartz 기본가치 10가지와 상위 차원 정의.
// 근거: Schwartz (1992, 2012). 표시명은 일상어, 학술명은 결과 JSON에 함께 적는다.

export const VALUE_IDS = [
  "self_direction",
  "stimulation",
  "hedonism",
  "achievement",
  "power",
  "security",
  "conformity",
  "tradition",
  "benevolence",
  "universalism",
] as const;

export type ValueId = (typeof VALUE_IDS)[number];

export type ValueGroup = "openness" | "enhancement" | "conservation" | "transcendence" | "boundary";

export interface ValueInfo {
  id: ValueId;
  /** 화면 표시명 */
  label: string;
  /** 국내 문헌의 학술 번역어 */
  academicKo: string;
  labelEn: string;
  /** 카드에 쓰는 짧은 설명 */
  cardDesc: string;
  /** 결과 화면과 JSON에 쓰는 한 줄 정의 */
  definition: string;
  group: ValueGroup;
}

export const VALUES: Record<ValueId, ValueInfo> = {
  self_direction: {
    id: "self_direction",
    label: "자기주도",
    academicKo: "자율",
    labelEn: "Self-Direction",
    cardDesc: "스스로 정하기",
    definition: "내 생각대로 고르고 직접 해 보는 것",
    group: "openness",
  },
  stimulation: {
    id: "stimulation",
    label: "새로움",
    academicKo: "자극",
    labelEn: "Stimulation",
    cardDesc: "새 경험과 도전",
    definition: "새로운 경험과 도전에서 얻는 활력",
    group: "openness",
  },
  hedonism: {
    id: "hedonism",
    label: "즐거움",
    academicKo: "쾌락",
    labelEn: "Hedonism",
    cardDesc: "삶을 누리기",
    definition: "삶을 즐기고 기분 좋은 일을 누리는 것",
    group: "boundary",
  },
  achievement: {
    id: "achievement",
    label: "성취",
    academicKo: "성취",
    labelEn: "Achievement",
    cardDesc: "해내고 인정받기",
    definition: "노력해서 해내고 그만큼 인정받는 것",
    group: "enhancement",
  },
  power: {
    id: "power",
    label: "영향력",
    academicKo: "권력",
    labelEn: "Power",
    cardDesc: "이끌고 정하기",
    definition: "사람과 일을 이끌고 결정하는 것",
    group: "enhancement",
  },
  security: {
    id: "security",
    label: "안정",
    academicKo: "안전",
    labelEn: "Security",
    cardDesc: "안전과 질서",
    definition: "안전하고 질서 있는 생활",
    group: "conservation",
  },
  conformity: {
    id: "conformity",
    label: "규범",
    academicKo: "순응",
    labelEn: "Conformity",
    cardDesc: "예의와 약속",
    definition: "예의를 지키고 남에게 폐 끼치지 않는 것",
    group: "conservation",
  },
  tradition: {
    id: "tradition",
    label: "전통",
    academicKo: "전통",
    labelEn: "Tradition",
    cardDesc: "이어 온 관습",
    definition: "이어져 온 관습과 믿음을 지키는 것",
    group: "conservation",
  },
  benevolence: {
    id: "benevolence",
    label: "배려",
    academicKo: "박애",
    labelEn: "Benevolence",
    cardDesc: "곁의 사람 돌보기",
    definition: "가까운 사람들을 돌보고 챙기는 것",
    group: "transcendence",
  },
  universalism: {
    id: "universalism",
    label: "공존",
    academicKo: "보편주의",
    labelEn: "Universalism",
    cardDesc: "모두가 조화롭게",
    definition: "모든 사람과 자연이 함께 잘 사는 것",
    group: "transcendence",
  },
};

export type HigherOrderId = "openness_to_change" | "conservation" | "self_transcendence" | "self_enhancement";

/** 상위 4차원. 즐거움은 변화 개방과 자기고양에 걸친 가치라(Schwartz, 2012) 축 계산에서 뺀다. */
export const HIGHER_ORDER: { id: HigherOrderId; label: string; valueIds: ValueId[] }[] = [
  { id: "openness_to_change", label: "변화 개방", valueIds: ["self_direction", "stimulation"] },
  { id: "conservation", label: "보존", valueIds: ["security", "conformity", "tradition"] },
  { id: "self_transcendence", label: "자기초월", valueIds: ["universalism", "benevolence"] },
  { id: "self_enhancement", label: "자기고양", valueIds: ["achievement", "power"] },
];

/** 가치 원형에서 서로 반대편에 있는 쌍 (Schwartz, 1992, 2012) */
export const CONFLICT_PAIRS: [ValueId, ValueId][] = [
  ["self_direction", "conformity"],
  ["self_direction", "tradition"],
  ["self_direction", "security"],
  ["stimulation", "conformity"],
  ["stimulation", "tradition"],
  ["stimulation", "security"],
  ["universalism", "achievement"],
  ["universalism", "power"],
  ["benevolence", "achievement"],
  ["benevolence", "power"],
  ["hedonism", "conformity"],
  ["hedonism", "tradition"],
];
