# 마음결 (psychology-test-demo)

4분 안팎의 가벼운 자기 이해 웹앱(D23, D50, D57). ① 평소의 나: 5지선다 20문항(Mini-IPIP 원판) ② 마음이 끌리는 단어 40개 중 7개 ③ 그중 지킬 3개를 순서대로 ④ 요즘의 나 1~3개 ⑤ 비워 내고 싶은 것 1~2개 ⑥ 더 키우고 싶은 힘 1~2개.
결과물은 둘이다(D18, D32, D51): 결과 화면의 프로필 카드 한 장(성격 오각형 그래프 + 가치 막대 + 기분, 글자 최소), 사용자가 쓰는 LLM에 붙여 넣는 "해석 프롬프트"(복사 전용). 다시 보기·저장 기능은 없다(D22). 배경음이 있다(D34). 서버 라우트 없음. **Supabase는 전체 검사 횟수 카운터 하나만**(D61, publishable key 2개가 `NEXT_PUBLIC_` 환경변수).

## 명령

| 명령 | 내용 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run check` | 타입 검사(`next typegen && tsc`) + 린트 + 단위 테스트. **단계마다 통과시킨다** |
| `npm run build` | 프로덕션 빌드 |
| `npm run e2e` | 모바일(360·390px)·PC(1280px) E2E. 설치된 Chrome 사용, `npm run build` 뒤에 실행 |
| `npm run schema` | zod 스키마로 `docs/prompt-data-schema.json` 다시 만들기 |

## 규칙

- **Next.js 16.4**: 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 해당 문서를 읽는다(AGENTS.md). `next lint` 없음, Cache Components 켜짐, 개발 표시(`devIndicators`)는 꺼 둠(D24).
- Cache Components 때문에 화면을 떠나도 이전 화면 상태가 숨겨진 채 남는다. 진행 상태는 `src/lib/state/test-store.ts` 한 곳에만 두고, 화면 컴포넌트에 들고 있지 않는다.
- 결과 정리·프롬프트 로직은 `src/lib/` 아래 **순수 함수**로 두고 테스트를 붙인다. UI는 그 결과만 그린다.
- 단어 목록, 가치 정의, 결과 카드 소재, 근거 문헌은 `src/data/`에만 둔다.
- 해석 프롬프트 데이터 구조를 바꾸면 `prompt_data_version`을 검토하고 `npm run schema`로 문서를 갱신한다.
- **근거와 한계**: 성격은 Mini-IPIP 20문항 원판, 가치 단어는 Schwartz 가치 이론을 참고해 앱이 고른 것이다. 검증된 검사라고 말하지 않는다. 점수 대신 기울기와 고른 단어로 정리한다.
- **해석 프롬프트(v5, D59)**: "기질 × 가치" 연결이 뼈대, 맨 위 "# 마음결 · 날짜의 나", 7개 항목, 1,800자 안팎, 괄호 근거·용어 나열·비유 반복·덧붙임 금지, 존댓말. 규칙 문구는 `prompt.test.ts`로 고정되어 있다.
- **글자 선택 금지(D46)**: body에 `user-select: none`. 선택을 허용하려면 `.selectable`을 붙인다(지금은 해석 프롬프트 텍스트 상자만).
- **호버(D36)**: PC에서만, 색만 바꾼다. 크기·여백·굵기·위치를 바꾸지 않는다(E2E 검사).
- **한 화면 원칙(D31)**: 360×740에서 시작·테스트 화면은 스크롤 없이 들어와야 한다(E2E가 검사). 짧은 안내문은 `text-wrap: balance`.
- **문구**: 화면, 결과, 프롬프트 모두 같은 결의 자연스러운 해요체. 조사는 `src/lib/text/josa.ts`로 붙인다("와(과)" 같은 병기 금지).
- **금지**: 진단·병명·유형 판정(결과 카드 그림에 이름 붙이기 포함), 타인 비교, 위기 안내 문구(D6), 이모지·장식 기호, 다크 모드(D24).
- **개인정보**: 고른 단어는 브라우저 안(sessionStorage)에서만 처리한다. 밖으로 나가는 것은 검사 완료 카운트 1뿐이다(`src/lib/stats/supabase.ts`, webdriver에서는 보내지 않음). 그 밖의 서버 전송, 분석 도구, 쿠키를 추가하려면 먼저 사용자에게 묻는다.
- **디자인**: `docs/ui-ux.md`(노트 속지, 움직임 §2-7). 토큰은 `src/app/globals.css`의 `:root`. 움직임은 `prefers-reduced-motion`을 지킨다.
- 화면에 보이는 숫자는 `src/lib/text/format.ts`(formatSeconds, formatCount)로 쓴다(D38). 인라인 SVG 아이콘에는 width/height를 넣는다.
- 사용자가 `next dev`를 띄워 두고 확인한다. 소스 파일은 `sed -i`로 고치지 않는다(파일 감시가 끊겨 옛 CSS가 보임). UI 변경은 사용자 서버(localhost:3000)에서도 확인한다.
- 문서와 주석은 한국어, 코드 식별자는 영어.
- 확정된 결정은 `docs/decisions.md`에 기록한다.
- git: 커밋·push는 사용자가 요청할 때만. push 전에 `.env.local`이 빠졌는지 확인한다(`.gitignore`가 `.env*`를 막고 `.env.example`만 허용).

## 폴더 지도

```
src/
  app/                 page.tsx(시작) · test/[step]/(단계별 주소, D39) · test/page.tsx(첫 단계로 이동) · result/ · layout.tsx · globals.css · fonts/ · icon.svg(파비콘)
public/audio/          bgm-loop.mp3(배경음, 80초 반복)
  components/
    Notebook.tsx       노트 한 장 틀(머리 · 본문 · 바닥 버튼)
    SoundToggle.tsx    배경음 켜기/끄기(맨 위 줄 오른쪽, D63)
    HandDate.tsx       손글씨 날짜(나눔손글씨 펜)
    ProgressBand.tsx   맨 위 다섯 칸 진행도
    HandLoop.tsx       손그림 동그라미(선택 표시, 그려지는 움직임)
    test/              TestFlow(단계 순서 · 바닥 버튼) · LikertQuestion(1단계 5지선다) · WordStep(단어 칩 · 가치 카드 고르기)
    result/            ResultScreen · ResultCard(프로필) · ProfileRadar(오각형) · Motif(그림 10종) · ResultDetails · AskAi(복사 → AI 버튼) · RestartButton
    start/             StartActions(늘 새로 시작) · BasisDialog("?" → 마음결에 대해 탭 모달) · CompletionCount(지금까지 N명)
  data/                credits(만든 사람 · 크레딧) · likert(성격 20문항) · words(특성 문장 · 가치 40 · 기분 12 · 비움 12) · values(10가치) · result-cards(그림 소재) · references
  lib/
    steps.ts           다섯 단계 정의(제목 · 안내 · 최소/최대 개수)
    analysis/          analyze(응답 → 기울기 · 가치 순서 · 눈여겨볼 연결) · fixtures
    prompt/            prompt-data(zod) · build-copy-prompt(해석)
    audio/bgm.ts       배경음(재생 · 페이드 · 켜기/끄기 기억)
    state/             test-store(응답 저장소, 지금 단계는 주소가 정함) · use-visible-timer
    text/              josa(받침에 맞는 조사) · format(시간 · 큰 수 짧게)
    stats/supabase.ts  검사 횟수 카운터(읽기 · RPC, D61)
    clipboard.ts       복사 · 텍스트 파일 저장 · 인앱 브라우저 감지
e2e/                   Playwright 모바일 흐름 테스트
docs/                  research · spec · ui-ux · decisions · deploy · open-questions · prompt-data-schema.json · mockup/
```

## 원격 저장소

- https://github.com/dev-sjkim/kdap-psychology-test (main)
