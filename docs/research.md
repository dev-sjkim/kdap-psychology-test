# 1단계 조사: 척도·이론 비교

- 조사일: 2026-10-19
- 목적: 10분 안쪽의 가볍고 재미있는 자기 이해 테스트를 만들되, 근거가 탄탄하고 사용 허가가 분명한 척도를 고른다.
- 범위: 비임상 척도만 다룬다. 우울·불안 등 임상 선별검사는 제외한다.
- 검증 방식: 라이선스 문구는 개발자·배포처 페이지나 PDF 원문을 직접 열어 확인했다. 확인하지 못한 것은 **미확인**으로 적었다.
  - 소요 시간은 출처가 있는 것만 수치로 적었고, 나머지는 "추정(문항당 5~10초)"으로 표시했다.

> **2026-10-20 5판 전환 메모 (D23)**
> 이 문서는 3·4판(Mini-IPIP + TwIVI + SWLS 45문항) 기준 조사다. 사용자가 "진짜 심리검사처럼 길지 않게, 짧고 재밌게, 과학적 근거는 약간만"을 원해서 5판부터는 검증 척도 대신 **단어 고르기 5단계**를 쓴다.
> - 성격 단어: Big Five를 형용사로 묘사하는 어휘 연구 전통(Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. *Psychological Assessment, 4*(1), 26–42. doi:10.1037/1040-3590.4.1.26, Crossref로 확인)을 참고해 앱이 직접 고른 30개(특성 양쪽 끝마다 3개). Goldberg의 형용사 목록 자체를 옮기지는 않았다.
> - 가치 단어: 아래 §1의 Schwartz 기본가치 10가지마다 정의에 들어 있는 낱말 2개씩.
> - 고르고 덜어내는 방식: 아래 Personal Values Card Sort(퍼블릭 도메인)의 아이디어. 문헌상 점진적 제거가 검증된 실시 방식이 아니라는 §1-2의 판단은 그대로이므로, 5판은 결과를 점수가 아닌 정성적 정리로만 보여 준다.
> - 따라서 아래의 라이선스 판단(TwIVI·IPIP·SWLS 사용 허가)은 5판 앱에는 더 이상 해당하지 않는다. 기록으로 남긴다.

## 표기

| 기호 | 뜻 |
|---|---|
| ✅ | 원문으로 확인: 상업·비상업 구분 없이 허가 없이 사용 가능 |
| ⚠️ | 원문으로 확인: 비상업·연구용만 무료, 그 밖의 용도는 저자 허가가 필요 |
| ❓ | 미확인: 이용 조건 문구를 찾지 못함. 저자 문의 필요 |
| ⛔ | 원문으로 확인: 상업 이용 금지 또는 개인 피드백 용도 금지 |

> **"상업"의 범위에 주의할 것.** Vercel Hobby 플랜도 비상업 용도만 허용한다(→ [Vercel 공정 사용 지침](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)). 광고·결제·유료 상담 연결 계획이 있다면 척도 라이선스와 호스팅 플랜을 함께 다시 봐야 한다.

---

## 1. 가치(Values)

### 1-1. 비교표

| 도구 | 원 논문 | 라이선스/허가 | 문항 수 | 소요 시간 | 신뢰도·타당도 | 한국어판 검증 | 점수 계산법 |
|---|---|---|---|---|---|---|---|
| **PVQ-RR** (19가치) | Schwartz et al. (2012). *JPSP, 103*(4), 663–688. doi:10.1037/a0029393 / Schwartz & Cieciuch (2022). *Assessment, 29*(5), 1005–1019. doi:10.1177/1073191121998760 | ⚠️/❓ 표기가 충돌함. Repository 논문은 CC BY-NC-ND 3.0, 2022 논문은 CC BY-NC 4.0, OSF 프로젝트 메타데이터는 CC0. 앱 용도를 명시한 문서는 없음. 저자에게 서면 허가를 받는 것이 안전함 ([Repository](https://scholarworks.gvsu.edu/orpc/vol2/iss2/9/), [OSF](https://osf.io/w9as3/)) | 57 (가치당 3) | 미확인 (추정 8~12분) | 49개 집단 N=53,472. 19가치 평균 α .70, Humility는 평균 α .47로 낮음. 상위 4차원은 평균 α .84. MDS로 원형 구조 재현. 재검사 자료는 미확인 | **있음.** 최정원·이영호 (2014). *한국심리학회지: 일반, 33*(3), 553–590. N=559, α .59–.89. 57문항 한국어 텍스트는 OSF에 공개됨 | 가치 점수 = 3문항 평균. MRAT = 57문항 전체 평균. 중심화 점수 = 가치 점수 − MRAT (SD로 나누지 않음) |
| **PVQ-21** (ESS, 10가치) | Schwartz (2003). ESS 질문지 개발 보고서 7장. ZIS doi:10.6102/zis234 | ⚠️ "free of charge for non-commercial research purposes … other purposes … consent of the authors must be obtained" ([GESIS ZIS](https://access.gesis.org/zis/524)) | 21 | 미확인 | 29개국 α .15–.85. GESIS가 "많은 신뢰도가 관행 기준으로 낮다"고 명시. 측정 동일성은 metric 수준까지 | 없음 | 역코딩 → 가치별 평균 → 21문항 평균을 빼서 중심화 |
| **PVQ-40** | Schwartz et al. (2001). *JCCP, 32*(5), 519–542. doi:10.1177/0022022101032005001 | ❓ Repository CC BY-NC-ND 적용으로 추정 | 40 | 미확인 | α .51–.89. 2주 재검사 평균 .81 | 타당화 연구 미발견 | 가치별 평균 → 40문항 평균을 빼서 중심화 |
| **TwIVI** / TIVI | Sandy, Gosling, Schwartz & Koelkebeck (2017). *Journal of Personality Assessment, 99*(5), 545–555. doi:10.1080/00223891.2016.1231115 | ✅ "ANYONE CAN USE IT FOR ANY PURPOSE. NO NEED TO ASK ME FOR PERMISSION." ([Gosling 연구실](https://gosling.psy.utexas.edu/two-short-measures-of-values-tivi-and-twivi/)). 문항 원천은 PVQ-40이고 Schwartz가 공저자 | 20 / 10 | 미확인 (추정 2~3분) | 도출 표본 N=38,049, 검증 표본 N=29,143. TwIVI α .33–.91(평균 .71). PVQ-40과의 수렴 r 평균 .91(TIVI .81). 2주 재검사 평균 .67 | 없음 | 역채점 없음. 가치별 2문항 평균 → 개인의 20문항 평균을 빼서 중심화(또는 공변량 처리) |
| **SSVS** | Lindeman & Verkasalo (2005). *JPA, 85*(2), 170–178. doi:10.1207/s15327752jpa8502_09 | ❓ | 10 | 미확인 | 초록상 "good reliability and validity". 수치는 미확인(논문 비공개) | 없음 | 미확인 |
| **Personal Values Card Sort** | Miller, C'de Baca, Matthews & Wilbourne (2001), UNM. 2011년 개정판 있음 | ✅ "This instrument is in the public domain and may be copied, adapted and used without permission" ([CASAA PDF](https://casaa.unm.edu/assets/inst/personal-values-card-sort.pdf)) | 카드 83장(2001) / 100장(2011) | 미확인 | **심리측정 연구 없음.** 동기강화상담의 면담 보조 활동이다. "이 과정의 가치는 뒤따르는 면담에 있다"고 안내함 | 번역·타당화 없음 | 점수 없음. 3~5개 더미로 분류 → 상위 5~10개 → 순위 매기기 |
| (참고) **Best-Worst Scaling 가치 측정** | Lee, Soutar & Louviere (2008). *JPA, 90*(4), 335–347. doi:10.1080/00223890802107925 | 미확인 | 설계에 따라 다름 | SVS보다 짧음(초록) | 이론상의 가치 구조와 행동 상관을 재현함 | 없음 | 최선·최악 선택 횟수로 계산 |

### 1-2. 가치 쪽 핵심 판단

1. **참고 사이트처럼 "20개 고르기 → 5개로 줄이기"하는 점진적 제거 방식은 어떤 척도에서도 검증된 실시 방식이 아니다.**
   - Personal Values Card Sort의 공식 절차(더미 분류 → 상위 5~10개 → 순위)가 가장 비슷하다. 하지만 이 도구 자체가 심리측정 도구가 아니다.
   - Schwartz 계열 리커트 문항을 고르기·제거 방식으로 바꾸면 점수가 강제선택(ipsative) 데이터가 된다. 그러면 원 척도의 신뢰도와 점수 해석을 그대로 쓸 수 없다.
   - 선택형 중에 검증된 대안은 Best-Worst Scaling이지만, 순차적으로 덜어내는 방식과는 다르다.
2. **라이선스와 근거를 함께 놓고 보면 TwIVI가 가장 낫다.**
   - "누구나, 어떤 목적이든" 쓸 수 있다고 원문에 적혀 있다.
   - Schwartz 기본가치 이론의 10가치와 원형 구조를 그대로 해석에 쓸 수 있다.
   - 약점은 한국어판 검증이 없다는 것이다. 직접 번역해야 하고, "번역판 미검증"을 한계로 명시해야 한다.
3. **한국어판이 검증된 것은 PVQ-RR뿐이다.** 다만 57문항이라 길고, 앱에서 써도 되는지 라이선스가 불분명하다.
   - 나중에 Schwartz와 번역자(최정원)의 허가를 받으면 "정밀판"으로 업그레이드할 수 있다.
4. **카드 소트는 근거가 없지만 재미 요소로 쓸 만하다.** 점수에는 넣지 않는 "성찰 활동"으로만 쓰는 것이 정직하다. 면담 질문 예시("이 가치는 당신에게 어떤 의미인가요?")는 퍼블릭 도메인이라 성찰 질문의 출처로 쓸 수 있다.

---

## 2. 성격(Big Five)

### 2-1. 비교표

| 도구 | 원 논문 | 라이선스/허가 | 문항 수 | 소요 시간 | 신뢰도·타당도 | 한국어판 검증 | 점수 계산법 |
|---|---|---|---|---|---|---|---|
| **Mini-IPIP** | Donnellan, Oswald, Baird & Lucas (2006). *Psychological Assessment, 18*(2), 192–203. doi:10.1037/1040-3590.18.2.192 | ✅ "permission has already been automatically granted for any person to use IPIP items, scales, and inventories for any purpose, commercial or non-commercial" ([IPIP 허가](https://ipip.ori.org/newPermission.htm)) | 20 (요인당 4) | 약 2분 (Millisecond 매뉴얼) | α: E .77, A .70, C .69, N .68, I .65 ([IPIP 키 페이지](https://ipip.ori.org/MiniIPIPKey.htm)). 초록상 다섯 연구 모두 α ".60 이상", 재검사와 수렴·변별 타당도는 모척도와 비슷함. 성별·인종 간 scalar invariance 없음(Baldasaro et al., 2013) | **타당화 논문 미발견.** In-Sue Oh 등의 IPIP 100문항 한국어 역번역이 있으나 IPIP 측이 "정확성 미검증"이라고 명시 ([번역 목록](https://ipip.ori.org/newItemTranslations.htm)) | 1–5점. − 문항은 6−x로 역채점. 요인별 4문항 합(4–20) 또는 평균(1–5) |
| IPIP-BFM-50 | Goldberg (1992) 어휘 마커, IPIP | ✅ (위와 같음) | 50 (요인당 10) | 미확인 (추정 5~7분) | α .79–.87 (IPIP 키 페이지) | 미발견. 한국어 IPIP-NEO-120 대규모 사용 사례 있음(Jyung et al., 2026, *Sci Rep*, ω .79–.92) | Mini-IPIP와 같음 |
| BFI-2-XS / BFI-2-S | Soto & John (2017). *JRP, 68*, 69–81. doi:10.1016/j.jrp.2017.02.004 | ⚠️ "Permission is granted for personal and research use"(Colby), "the BFI-2 is for non-commercial uses only"(Berkeley). 상업 이용은 따로 요청해야 함 | 15 / 30 | XS 2~3분 / S 3~5분 | XS: α 평균 .59–.63, 재검사 .70–.76. S: α 평균 .77–.78, 재검사 .76–.83 | 전체 60문항 BFI-2 한국판은 검증됨(Choi et al., 2025, *Assessment*). S/XS 단독 검증은 미발견 | 1–5점. R 문항 역채점 후 평균 |
| TIPI | Gosling, Rentfrow & Swann (2003). *JRP, 37*, 504–528. doi:10.1016/S0092-6566(03)00046-1 | ✅ "ANYONE CAN USE IT FOR ANY PURPOSE" ([Gosling 연구실](https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/)) | 10 | 약 1분 | α .40–.73(문항이 2개라 낮게 나오는 게 예상된 결과). 6주 재검사 평균 .72 | TIPI-K(Ha et al., 2013)가 있으나 한국어판 α가 A .10, C .40으로 **문제 있음**(Matsuda et al., 2018) | 1–7점. 짝수 문항 역채점(8−x) 후 2문항 평균 |
| BFI-K (간편형) | 김지현·김복환·하문선 (2011). *인간이해, 32*(1), 47–65 (원문 미확인) | ⚠️/❓ 원판 BFI는 비상업 연구용만 허용. 한국어판 라이선스는 미확인 | 15 | 미확인 | 2차 표본 α .69–.85 | 한국어 원판 자체 | 5점, 요인별 3문항 (역문항 세부는 미확인) |
| BFI-10 | Rammstedt & John (2007). *JRP, 41*, 203–212. doi:10.1016/j.jrp.2006.02.001 | ⛔ "must not be used for commercial purposes", "should not be used for individual diagnostics" (GESIS) | 10 | 1분 이하 | BFI-44와 r .83, 재검사 .65–.79 | 미발견 | 1–5점, 요인별 2문항 평균 |

### 2-2. 성격 쪽 핵심 판단

1. **Mini-IPIP가 라이선스(퍼블릭 도메인, 상업·번역·수정 허용), 길이(20문항, 약 2분), 신뢰도의 균형이 가장 좋다.**
   - 약점은 요인당 4문항이라 α가 .65–.77 수준이라는 점이다. 개인 점수의 측정오차가 크다.
   - 따라서 점수를 백분위처럼 한 점으로 단정하지 않고, 넓은 구간과 경향 정도로만 보여 줘야 한다.
2. **규준이 없다.** IPIP 공식 입장은 "웹사이트에 규준은 없으며, 대부분의 '규준'은 오해를 부른다. 로컬 규준이 훨씬 타당하다"이다([IPIP 규준](https://ipip.ori.org/newNorms.htm)).
   - 한국인 규준도 없다. 그래서 MVP는 **척도 중간점(3점) 기준의 기술적 구분**만 쓰고, 결과 JSON에 "규준 없음"을 명시한다.
   - IPIP는 범주(유형 판정)로 해석하지 말라고도 권고한다([IPIP 해석 지침](https://ipip.ori.org/InterpretingIndividualIPIPScaleScores.htm)). 그래서 "~형" 같은 유형명은 쓰지 않는다.
3. TIPI는 라이선스가 자유롭지만 한국어판 신뢰도가 너무 낮다. BFI 계열은 상업 이용 제한이 있어 제외한다.

---

## 3. 기본 심리욕구(SDT)·ACT 가치·웰빙

### 3-1. 비교표

| 도구 | 원 논문 | 라이선스/허가 | 문항 수 | 소요 시간 | 신뢰도·타당도 | 한국어판 검증 | 점수 계산법 |
|---|---|---|---|---|---|---|---|
| **BPNSFS** (자율성·유능성·관계성 × 만족·좌절) | Chen et al. (2015). *Motivation and Emotion, 39*, 216–236. doi:10.1007/s11031-014-9450-1 | ⚠️ "All academic use is permitted, but you must obtain permission … for commercial use." 매뉴얼은 "formal, written permission of the authors"를 요구함 ([SDT 척도 페이지](https://selfdeterminationtheory.org/basic-psychological-need-satisfaction-and-frustration-scale/)). 무료 공개 앱이 "학술 용도"인지는 회색지대 | 24 (12문항 단축판 있음) | 추정 3~4분 | 4개국에서 6요인 구조와 metric invariance 확인. α .64–.89 | 청소년판(이은주, 2020, *교육심리연구*)과 암 생존자판(Yeom & Lee, 2024, *Healthcare*)만 있음. **일반 성인판은 미발견** | 1–5점, 6개 하위척도 평균 |
| Valuing Questionnaire (VQ) | Smout et al. (2014). *JCBS, 3*(3), 164–172. doi:10.1016/j.jcbs.2014.06.001 | ❓ (ACBS 회원 전용, 허가 문구 없음) | 10 | 추정 1.5~2분 | α .79–.89, 2요인 CFA 양호 | 학회 발표만 있음(유춘자·박경, 2017) | 0–6점. Progress와 Obstruction 각 합산 |
| Valued Living Questionnaire (VLQ) | Wilson et al. (2010). *Psychological Record, 60*, 249–272 | ❓ | 20 (10영역 × 2) | 추정 3~5분 | 재검사 신뢰도 "높음"(계수 미확인) | 번역본 있음, 검증은 미확인 | 영역별 중요도 × 일관성의 합 |
| Engaged Living Scale (ELS) | Trompetter et al. (2013). *Psychological Assessment, 25*(4), 1235–1246. doi:10.1037/a0033813 | ❓ | 16 | 추정 2~3분 | 내적합치도 "good"(수치 미확인) | Park (2020) 있음, 원문 미확인 | 하위척도 합산(추정) |
| Bull's-Eye Values Survey | Lundgren et al. (2012). *Cognitive and Behavioral Practice, 19*(4), 518–526. doi:10.1016/j.cbpra.2012.01.004 | ❓ | 서술형 4영역 | 추정 5~10분 | 재검사 신뢰도 확인(2차 요약) | 없음 | 과녁 평정 합산. 서술형이라 자동 채점에 부적합 |
| **SWLS** (삶의 만족) | Diener, Emmons, Larsen & Griffin (1985). *JPA, 49*, 71–75 | ✅ "in public domain, and may be used if proper citation is given" ([Diener SWLS](https://labs.psychology.illinois.edu/~ediener/SWLS.html)) | 5 | 약 1분 | α .87, 2개월 재검사 .82 | 있음. 임영진 (2012). *한국심리학회지: 일반, 31*(3), 877–896 (한국 표본에서는 2요인) | 1–7점 합산 5–35 |
| Flourishing Scale | Diener et al. (2010). *Social Indicators Research, 97*(2), 143–156. doi:10.1007/s11205-009-9493-y | ✅ "free to use it without permission or charge … as long as you give credit" ([Diener FS](https://labs.psychology.illinois.edu/~ediener/FS.html)) | 8 | 추정 1~1.5분 | α .87, 1개월 재검사 .71 (2차 출처) | 한국어 번역본은 공개됨. 타당화 논문은 미확인 | 1–7점 합산 8–56 |
| MLQ (삶의 의미) | Steger et al. (2006). *J Couns Psychol, 53*(1), 80–93. doi:10.1037/0022-0167.53.1.80 | ⚠️ 상업 이용은 사전 서면 허가 필요. 비상업 이용도 사전 연락을 요청함 ([Steger](https://www.michaelfsteger.com/?page_id=13)) | 10 | 추정 1.5분 | α .81–.92, 1개월 재검사 .70/.73 | 있음. 원두리·권선중·김교헌 (2005). *한국심리학회지: 건강, 10*(2) | 1–7점. Presence와 Search 각 합산 |
| ~~WHO-5~~ | — | 미확인 | 5 | 1분 | — | — | **제외.** 우울 선별 컷오프(≤50)로 널리 쓰여 임상 선별검사처럼 보인다 |

### 3-2. 이 범주의 판단

- **"지금의 상태"에 가장 잘 맞는 것은 BPNSFS다.** 지시문이 "현재 내 삶에서"이다. 다만 상업 이용에 서면 허가가 필요하고, 일반 성인 한국어판이 없으며, 좌절 문항("실수 때문에 실패자처럼 느낀다" 등)은 정서 고통과 겹쳐 보일 수 있다. **MVP에서는 제외하고, 허가를 받으면 2차 버전에 추가하는 후보로 둔다.**
- ACT 계열 척도(VQ, VLQ, ELS, BEVS)는 이론적으로 잘 맞지만 이용 조건을 확인할 수 없다. 대신 ACT의 "가치는 방향이고 목표는 도달점" 같은 **개념만** 성찰 질문 문구에 반영한다(척도는 쓰지 않음).
- **SWLS는 라이선스(퍼블릭 도메인)와 한국어판 검증이 모두 확보된 유일한 "현재 상태" 척도다.** 5문항, 1분이다. 선택 모듈 후보로 둔다(→ open-questions Q1).
  - 다만 낮은 점수 구간의 공식 라벨("Extremely dissatisfied")은 부드럽게 바꿔 써야 한다.
  - 낮은 점수가 고통 신호처럼 읽힐 수 있으므로 안내 문구도 함께 설계해야 한다.

---

## 4. 해석에 쓸 이론 근거

| 근거 | 출처 (Crossref로 DOI 확인) | 앱에서 쓰는 곳 |
|---|---|---|
| Schwartz 기본가치 이론: 10가치와 원형 구조. 인접 가치는 양립하고 반대편 가치는 긴장 관계 | Schwartz (1992). *Advances in Experimental Social Psychology, 25*, 1–65. doi:10.1016/S0065-2601(08)60281-6 / Schwartz (2012). An Overview of the Schwartz Theory of Basic Values. *Online Readings in Psychology and Culture, 2*(1). doi:10.9707/2307-0919.1116 (오픈 액세스) | 가치 정의 문장, 상위 4차원(변화 개방 ↔ 보존, 자기초월 ↔ 자기고양), "긴장 관계" 해설 |
| 응답 성향 보정(MRAT 중심화) | TwIVI 채점 지침 원문, PVQ-RR 채점 지침(OSF) | 가치 점수를 "본인 평균보다 얼마나 더 중요한지"로 해석 |
| 성격–가치 관계 | Roccas, Sagiv, Schwartz & Knafo (2002). *PSPB, 28*(6), 789–801. doi:10.1177/0146167202289008 / Parks-Leduc, Feldman & Bardi (2015). *PSPR, 19*(1), 3–29. doi:10.1177/1088868314538548 (메타분석) | 성격과 가치를 잇는 해설(예: 개방성 ↔ 자기주도·보편주의). **구체적인 상관 방향과 크기는 구현 전에 원문 표와 대조해야 한다**(→ open-questions Q10) |
| IPIP 해석 지침: 규준 없음, 범주화 지양 | [ipip.ori.org](https://ipip.ori.org/InterpretingIndividualIPIPScaleScores.htm) | 성격 점수 표시 방식, 결과 JSON의 한계 문구 |
| 가치 성찰 면담 질문 | Personal Values Card Sort (Miller et al., 2001, 퍼블릭 도메인) | 리포트 끝의 성찰 질문 템플릿 |

---

## 5. 추천 조합 (MVP)

### 추천: **Mini-IPIP(성격 20문항) + TwIVI(가치 20문항)**, 그리고 점수에 넣지 않는 "가치 카드 고르기" 성찰 단계

| 항목 | 내용 |
|---|---|
| 총 문항 | 40문항 + 카드 고르기 1화면 |
| 예상 시간 | 약 6~8분 (Mini-IPIP 약 2분은 출처 있음, TwIVI 2~3분과 카드 1분은 추정) |
| 라이선스 | 두 척도 모두 원문에서 "어떤 목적이든 허가 불필요"를 확인함(✅). 상업화해도 척도 쪽 제약은 없음 |
| 근거 | Big Five와 Schwartz 가치는 둘 다 대규모 다문화 연구가 쌓인 이론이고, 둘의 관계도 메타분석이 있다. 그래서 "성격(어떻게 행동하는 편인가) × 가치(무엇을 중요하게 여기는가)"라는 해석 축이 생긴다 |
| 재미 요소 | 원 척도는 리커트 방식이라 문항당 한 번 탭으로 빠르게 진행된다. 마지막에 가치 카드 10장 중 "지금 가장 지키고 싶은 3개"를 고르게 하면 참고 사이트의 '고르는 재미'를 살릴 수 있다. 측정 결과와 직접 고른 결과를 비교하는 것도 해석의 재료가 된다 |
| 한계 (결과에 반드시 표시) | ① 두 척도 모두 **한국어판이 검증되지 않았다**(앱 자체 번역). ② 한국인 **규준이 없다**. ③ 단축형이라 개인 점수의 오차가 크다(Mini-IPIP α .65–.77, TwIVI α .33–.91). ④ 카드 고르기는 검증된 측정이 아니다. ⑤ TwIVI는 원 척도를 그대로 쓰기 위해 종교 문항(전통 가치)을 포함한다 |

### 고려했지만 MVP에서 뺀 대안

| 대안 | 장점 | 뺀 이유 |
|---|---|---|
| PVQ-RR 한국어판 | 한국어판이 검증된 유일한 가치 척도 | 57문항이라 길고, 앱 사용 허가가 불분명함 → 허가를 받으면 정밀판 후보 |
| BPNSFS | "지금의 상태"에 가장 잘 맞음 | 상업 이용 허가 필요, 일반 성인 한국어판 없음, 고통 문항과 겹칠 수 있음 → 허가 후 후보 |
| 카드 소트만 사용 | 참고 사이트와 가장 비슷하고 재미있음 | 심리측정 근거가 없어 "근거 있는 해석"이라는 목표에 맞지 않음 |
| SWLS 추가 | 퍼블릭 도메인, 한국어판 검증됨, 1분 | "현재 상태" 축을 더하는 장점이 있음. 다만 낮은 점수가 고통 신호로 보일 수 있어 안내 설계가 필요함 → **선택 사항으로 제안**(open-questions Q1) |

---

## 6. 원 자료 링크 (직접 열어 본 것만)

- IPIP: [홈](https://ipip.ori.org/), [허가](https://ipip.ori.org/newPermission.htm), [Mini-IPIP 키](https://ipip.ori.org/MiniIPIPKey.htm), [번역 목록](https://ipip.ori.org/newItemTranslations.htm), [채점](https://ipip.ori.org/newScoringInstructions.htm), [해석 지침](https://ipip.ori.org/InterpretingIndividualIPIPScaleScores.htm), [규준 입장](https://ipip.ori.org/newNorms.htm)
- TwIVI/TIVI: [Gosling 연구실 페이지](https://gosling.psy.utexas.edu/two-short-measures-of-values-tivi-and-twivi/), [실시·채점 지침 docx](https://gosling.psy.utexas.edu/wp-content/uploads/2016/12/TwIVI-TIVI-Administration-and-Scoring-Instructions.docx), [Sandy et al. PDF](https://gosling.psy.utexas.edu/wp-content/uploads/2016/12/Sandy-et-al-JPA-2016-Brief-values-measures.pdf)
- Schwartz: [Repository(ORPC)](https://scholarworks.gvsu.edu/orpc/vol2/iss2/9/), [OSF PVQ-RR](https://osf.io/w9as3/), [GESIS PVQ-21](https://access.gesis.org/zis/524), [한국판 PVQ-R 논문](https://www.accesson.kr/kpageneral/v.33/3/553/15947)
- Personal Values Card Sort: [CASAA PDF(퍼블릭 도메인 문구 있음)](https://casaa.unm.edu/assets/inst/personal-values-card-sort.pdf), [MINT 사본](https://www.motivationalinterviewing.org/sites/default/files/valuescardsort_0.pdf)
- BFI-2: [Soto & John 2017 PDF](https://www.colby.edu/wp-content/uploads/2013/08/Soto_John_2017b.pdf), Colby·Berkeley 라이선스 페이지(실시간 접속이 403이라 Wayback 스냅샷으로 확인)
- TIPI: [Gosling 연구실 페이지](https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/), [TIPI-K 검증(Matsuda et al., 2018)](https://toyo.repo.nii.ac.jp/record/10768/files/shakaigakubu56-2_071-078.pdf)
- BFI-10: GESIS 페이지(Wayback 2026-01-16 스냅샷)
- SDT: [척도 목록](https://selfdeterminationtheory.org/questionnaires/), [BPNSFS](https://selfdeterminationtheory.org/basic-psychological-need-satisfaction-and-frustration-scale/), [매뉴얼 PDF](https://selfdeterminationtheory.org/wp-content/uploads/2022/02/BPNSFS_Complete_2020.pdf)
- ACT: [VQ](https://contextualscience.org/node/11297), [VLQ](https://contextualscience.org/valued_living_questionnaire_vlq), [ELS](https://contextualscience.org/book/export/html/33899), [BEVS](https://contextualscience.org/bulls_eye_values_survey_bevs)
- Diener: [SWLS](https://labs.psychology.illinois.edu/~ediener/SWLS.html), [FS](https://labs.psychology.illinois.edu/~ediener/FS.html), [척도 허가](https://labs.psychology.illinois.edu/~ediener/scales.html)
- MLQ: [Steger](https://www.michaelfsteger.com/?page_id=13)
- 메타데이터: Crossref API로 Schwartz 1992·2012, Roccas et al. 2002, Parks-Leduc et al. 2015의 DOI를 확인함
