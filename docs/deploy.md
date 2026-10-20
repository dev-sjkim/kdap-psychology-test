# 배포 절차 (Vercel)

- 기준 가이드: "Supabase + Vercel 배포" 노션 가이드의 핵심을 이 프로젝트에 맞게 줄였다. 빠진 부분은 vercel.com/docs, supabase.com/docs로 확인했다(2026-10-19~20).
- 작성일: 2026-10-20

## 1. 이 프로젝트의 유형

| 질문 | 답 |
|---|---|
| 입력한 게 새로고침 후에도 서버에 남아야 하나요? | 응답은 아니요(브라우저 탭에만). **전체 검사 횟수 숫자 하나**만 Supabase에 올려요(D61) |
| 서버 코드나 비밀 키가 있나요? | 서버 라우트는 없어요. Supabase publishable key 2개만 `NEXT_PUBLIC_`으로 두고(브라우저 공개용), 비밀 키는 쓰지 않아요 |
| **유형** | **A + Supabase(읽기·RPC만).** 화면은 모두 정적이고, 카운터만 브라우저에서 Supabase에 바로 요청해요 |

카운터 표·함수 SQL과 RLS 설정은 부록 B에 있어요(이미 만들어져 있음).

## 2. 필요한 서비스

| 서비스 | 용도 | 플랜 |
|---|---|---|
| GitHub | 코드 저장소 | **개인 계정** 저장소를 권장해요. Vercel Hobby는 GitHub 조직의 비공개 저장소를 배포할 수 없어요 |
| Vercel | 화면 호스팅 | Hobby(무료). **비상업 개인 용도만** 허용돼요. 광고나 결제를 붙이면 Pro가 필요해요. 이 프로젝트는 교육 산출물 공개라 Hobby로 충분해요(D3) |

## 3. 환경변수

| 이름 | 용도 | 공개 여부 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 주소 | 브라우저 공개 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` 키. RLS로 읽기와 RPC 하나만 허용 | 브라우저 공개(비밀 아님) |

둘 다 Vercel 환경변수(Production·Preview)에 같은 이름으로 넣고, 바꾼 뒤에는 Redeploy해요. 비워 두면 카운터 줄만 숨고 앱은 동작해요.

나중에 변수를 추가하게 되면 다음을 지켜요.

| 규칙 | 이유 |
|---|---|
| `NEXT_PUBLIC_`이 붙은 변수는 브라우저 번들에 그대로 들어가요. 비밀 키에는 절대 붙이지 않아요 | 누구나 볼 수 있어요 |
| Vercel에 넣는 이름은 코드의 `process.env.이름`과 글자 하나까지 같아야 해요 | 다르면 `undefined`가 돼요 |
| 값을 바꾼 뒤에는 **Redeploy**해야 반영돼요 | 이미 만든 배포에는 적용되지 않아요 |
| 값은 `.env.local`에만 두고 커밋하지 않아요 | `.gitignore`가 `.env*`를 막고 `.env.example`만 허용해요 |

## 4. 배포 순서

1. **로컬에서 확인**
   ```bash
   npm install
   npm run check      # 타입 검사 + 린트 + 단위 테스트
   npm run build      # 프로덕션 빌드
   npm run e2e        # (선택) 모바일 화면 흐름 테스트, 설치된 Chrome 사용
   ```
2. **GitHub에 올리기** (사용자가 요청할 때 진행)
   - push 전에 `git status`로 `.env.local`이 목록에 없는지 확인해요.
   - 개인 계정에 저장소를 만들고 push해요.
3. **Vercel에서 가져오기**
   - vercel.com → Add New → Project → GitHub 저장소 선택 → Import
4. **설정값** (대부분 자동 감지됨)

   | 항목 | 값 |
   |---|---|
   | Framework Preset | Next.js (자동) |
   | Root Directory | `./` |
   | Install Command | `npm install` (기본) |
   | Build Command | `npm run build` (기본) |
   | Output Directory | 기본값 그대로 (Next.js가 관리) |
   | Node.js Version | 22.x 이상 (`package.json`의 `engines.node`를 `>=22`로 맞춰 둠) |
   | Environment Variables | 위 2개 |
   | Function Region / maxDuration | 해당 없음. 서버 함수가 없어요 |

5. **Deploy** → 발급된 `https://<프로젝트>.vercel.app` 주소를 열어요.
6. 이후에는 main 브랜치에 push할 때마다 자동으로 다시 배포돼요. 다른 브랜치는 Preview 주소가 따로 생겨요.

> **maxDuration을 묻는 경우**: LLM 라우트를 넣지 않기로 해서 설정할 곳이 없어요. 나중에 서버 라우트를 추가하면 그 파일에 `export const maxDuration = 60`을 둬요. 2026년 기준 Hobby의 함수 최대 실행 시간은 300초라 여유가 있어요.

## 5. 배포 후 점검 체크리스트 (휴대폰에서)

가상의 응답으로 해 보세요. 실제 개인 정보를 넣을 칸은 없어요.

- [ ] 휴대폰 브라우저(Safari 또는 Chrome)에서 주소를 열면 밝은 노트 속지 화면과 "마음결" 제목이 보인다(휴대폰이 다크 모드여도 밝게 보인다)
- [ ] 시작 화면이 스크롤 없이 한 화면에 들어오고, 어색하게 한두 글자만 다음 줄로 떨어지는 곳이 없다
- [ ] 메인 화면에는 [시작하기]만 있고, 맨 위 "Date." 옆에 오늘 날짜가 손글씨로, "No." 옆에 지금까지의 검사 횟수가 손글씨로 보이며, 제목 "마음결"의 윗선이 괘선에 걸쳐 있다(환경변수가 있을 때). 결과 화면 "No."에는 내 번호가 적힌다
- [ ] 브라우저 탭에 마음결 아이콘(노트 + 결)이 보인다
- [ ] 맨 위 "?" 버튼을 누르면 "마음결에 대해" 모달이 뜨고, [마음결]·[만든 사람] 탭과 내용이 모달 안에 온전히 보이며 아래 화면은 밀리지 않는다
- [ ] [시작하기] → 주소가 `/test/personality`로 바뀌고, 답을 고르면 동그라미가 그려지며 다음 문항으로 넘어간다. "‹ 3 / 10 ›" 화살표로 이전 문항과 내 답을 볼 수 있다
- [ ] 단계를 마치면 주소가 다음 단계로 바뀌고, 진행 막대의 끝낸 칸이 빨간색이 된다. 브라우저 뒤로가기로 이전 단계로 갈 수 있다
- [ ] 2~5단계가 모두 스크롤 없이 한 화면에 들어오고, 단어를 누르면 손그림 동그라미가 그려진다
- [ ] 최소 개수 전에는 바닥 버튼이 "n개 더 골라 주세요"이고, 채우면 [다음]으로 바뀐다
- [ ] 최대 개수를 채운 뒤 다른 단어를 누르면 고르지 않고 살짝 흔들리며 "최대 n개까지" 안내가 뜬다
- [ ] 3단계 "끝까지 남길 단어"에 2단계에서 고른 다섯 개만 나오고, 누른 순서대로 1·2·3 순위가 붙는다
- [ ] 단계 중간에 새로고침해도 고른 단어가 그대로 있다
- [ ] 5단계에서 [결과 보기] → "고른 단어를 정리하고 있어요" → 카드가 내려앉고 오각형 그래프가 그려진다
- [ ] 결과 첫 화면에 프로필 카드(성격 오각형 그래프, 작은 그림, 가치 막대 3개, 기분 칩)와 [AI에게 해석 받기]가 스크롤 없이 함께 보이고, 카드 안 글자가 잘리거나 겹치지 않는다
- [ ] 결과 화면은 [자세히 보기]를 누르기 전까지 스크롤되지 않는다. [AI에게 해석 받기]를 누르면 큰 버튼 자리에 "복사했어요. AI 대화창에 붙여 넣으세요."와 [다시 복사]·[텍스트 파일로 저장]이 같은 높이로 들어오고, 화면이 밀리지 않는다(AI 서비스 링크는 없다, D70, D71)
- [ ] 쓰는 AI에 붙여 넣으면 맨 위에 "# 마음결 · 날짜의 나" 제목, 그 아래 7개 항목으로 답하고 괄호 근거나 영어 키 이름이 없다
- [ ] [자세히 보기]를 누르면 펼쳐지며 상세 맨 위로 스크롤되고, [접기] 알약이 바닥 버튼 위에 떠 있다. 접으면 맨 위로 돌아가 카드만 보인다
- [ ] "?" 모달의 [분석 방법] 탭에 한계·계산 규칙·참고 문헌이 보인다
- [ ] PC(980px 이상)에서는 노트 바깥에 옅은 점 격자와 연필·클립·컵 자국 낙서가 보이고, 휴대폰에서는 보이지 않는다
- [ ] 카카오톡으로 링크를 보내 앱 안에서 열었을 때, 복사가 안 되면 같은 자리에 "자동 복사가 안 됐어요"와 직접 복사할 글이 보인다
- [ ] 개발 서버(`npm run dev`)에서도 화면 왼쪽 아래에 Next.js 표시가 뜨지 않는다
- [ ] [시작하기]를 누르면 배경음이 서서히 커지며 나오고, 맨 위 오른쪽 스피커 버튼으로 끄고 켤 수 있다. 끈 뒤 새로고침해도 꺼진 채로 있다
- [ ] 문항 화면에는 맨 위 뒤로 화살표가 없고 "‹ 3/10 ›"만 있다. 단어 화면에서는 맨 위 화살표로 이전 단계로 돌아갈 수 있다
- [ ] 휴대폰에서 글자를 길게 눌러도 선택되지 않는다(해석 프롬프트 상자는 예외)
- [ ] 배경음 버튼이 모든 화면 맨 위 줄 오른쪽 끝에 같은 모양으로 있다
- [ ] 결과 바닥은 한 줄 [AI에게 해석 받기][↺]이고, ↺를 누르면 확인 모달이 뜬 뒤 [처음부터]를 눌러야 처음으로 간다
- [ ] 결과를 한 번 만들면 메인의 숫자가 1 올라 있다(Supabase 대시보드의 completion_counter.total도 같이)
- [ ] PC에서 단어와 버튼에 마우스를 올려도 글자 위치나 칸 크기가 변하지 않는다

## 6. Supabase 휴면 방지 (D71)

무료 Supabase 프로젝트는 한 주 동안 DB 요청이 없으면 일시 정지될 수 있어요. 정지되면 앱은 No. 칸만 비우고 그대로 동작하지만, 숫자를 계속 보이게 하려면 다음을 한 번만 해 두세요.

1. GitHub 저장소 → **Settings → Secrets and variables → Actions → New repository secret**
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Vercel 환경변수와 **같은 이름, 같은 값**을 한 번 더 넣어요(GitHub Actions는 Vercel 변수를 볼 수 없어요). Vercel 쪽은 그대로 둬요
2. **Actions** 탭 → "Supabase 휴면 방지" → **Run workflow**로 한 번 돌려 `HTTP 200`과 `[{"total":…}]`가 찍히는지 확인해요.
3. 그 뒤로는 매일 06:17(KST)에 자동으로 한 번 읽어요(`.github/workflows/supabase-keepalive.yml`).

알아 둘 것:
- 공개 저장소는 **60일 동안 커밋이 없으면 예약 실행이 자동으로 꺼져요**(GitHub가 미리 메일을 보내요). 꺼지면 Actions 탭에서 "Enable workflow"를 누르면 돼요.
- 이미 정지된 프로젝트는 앱이 되살릴 수 없어요. Supabase 대시보드에서 **Restore**를 눌러요(정지 후 90일 안).
- 무료 플랜에 결제 수단이 없으면 요금은 나가지 않아요. 하루 한 번 읽기는 한도에 비해 아주 작아요.

## 7. 자주 막히는 문제

| 증상 | 원인과 해결 |
|---|---|
| Import 화면에 저장소가 안 보여요 | Vercel의 GitHub 앱 권한에 그 저장소가 빠져 있어요. GitHub Settings → Applications → Vercel → Repository access에서 추가해요. 조직 저장소라면 Hobby에서는 비공개 저장소를 배포할 수 없어요 |
| 커밋했는데 배포가 안 돼요 | Hobby는 커밋 작성자가 Vercel 계정 주인이어야 해요. git의 `user.email`이 Vercel에 연결된 GitHub 계정 이메일인지 확인해요 |
| 빌드는 되는데 화면이 예전 그대로예요 | 브라우저 캐시예요. 새로고침하거나 Vercel Deployments에서 최신 배포가 Production인지 확인해요 |
| 환경변수를 바꿨는데 반영이 안 돼요 | (지금은 변수 없음) 변수를 바꾼 뒤에는 Redeploy가 필요해요 |
| `npm run typecheck`에서 `LayoutProps`를 못 찾아요 | Next 16이 만드는 라우트 타입이 아직 없어서예요. 스크립트가 `next typegen`을 먼저 돌리니 `npm run typecheck`로 실행해요 |
| `next lint`가 없다고 나와요 | Next 16에서 없어졌어요. `npm run lint`(ESLint 직접 실행)를 써요 |
| [AI에게 해석 받기]를 눌러도 복사가 안 돼요 | 인앱 브라우저나 오래된 앱이 클립보드를 막는 경우예요. 같은 자리에 펼쳐지는 글을 길게 눌러 복사하거나 [텍스트 파일로 저장]을 써요. 오른쪽 위 메뉴의 "다른 브라우저로 열기"가 가장 편해요 |
| 결과가 사라졌어요 | 결과는 저장되지 않는 일회성이에요(D22). 탭을 닫으면 사라져요. 다시 쓰고 싶은 글은 복사해서 메모장에 붙여 두면 돼요. 사생활 보호 모드에서는 새로고침만 해도 사라질 수 있어요 |
| 개발 서버에서만 화면이 깨지거나 옛 모양으로 보여요 | 개발 서버의 파일 감시가 CSS 변경을 놓친 경우예요. `npm run dev`를 껐다 다시 켜요. `npm run build && npm run start`로 띄운 화면이 기준이에요 |
| 제목 글꼴이 잠깐 다른 글꼴로 보여요 | 마루 부리 파일이 커서 미리 불러오지 않게 해 뒀어요. 대체 글꼴로 먼저 그린 뒤 바뀌는 게 정상이에요 |

## 부록 A. 방문자 수만 보고 싶을 때 (선택, DB 없음)

- Vercel 대시보드 → 프로젝트 → Analytics → Enable로 Web Analytics를 켜요. 코드에 `@vercel/analytics` 패키지를 추가하고 `<Analytics />`를 넣어야 해요.
- 쿠키 없이 페이지뷰와 방문자 수만 모여요. 응답이나 결과는 이벤트로 보내지 않아요.
- 코드 변경과 개인정보 안내 문구 수정이 필요한 일이라, 하기로 정하면 decisions.md에 기록한 뒤 진행해요.

## 부록 B. Supabase 카운터 (D61, 연결됨)

응답 내용, IP, 결과는 저장하지 않고 완료 횟수만 세요. 아래 SQL은 사용자가 이미 실행해 둔 구조와 같아요(2026-10-20 확인: 표와 RPC 모두 publishable key로 동작).

1. supabase.com에서 새 프로젝트를 만들고 리전은 **Seoul (ap-northeast-2)** 로 골라요.
2. 키는 새 방식만 써요.
   - `sb_publishable_…`: 브라우저에서 써도 되는 키 → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `sb_secret_…`: 서버 전용 → 이 용도에는 필요 없어요. 브라우저 코드에 절대 넣지 않아요
   - 예전 `anon`, `service_role` 키는 쓰지 않아요(2026년 말 폐기 예정).
3. SQL에는 **표마다 RLS 켜기 + 정책 + GRANT**를 모두 넣어요. 표에 직접 쓰는 권한은 주지 않고, 1씩 올리는 함수만 열어요.
   ```sql
   create table public.completion_counter (id int primary key default 1, total bigint not null default 0, constraint single_row check (id = 1));
   insert into public.completion_counter (id, total) values (1, 0);
   alter table public.completion_counter enable row level security;
   create policy "anyone can read the counter" on public.completion_counter for select to anon, authenticated using (true);
   grant select on public.completion_counter to anon, authenticated;
   revoke insert, update, delete on public.completion_counter from anon, authenticated;

   create function public.increment_completion() returns bigint
   language sql security definer set search_path = public as $$
     update public.completion_counter set total = total + 1 where id = 1 returning total;
   $$;
   revoke all on function public.increment_completion() from public;
   grant execute on function public.increment_completion() to anon, authenticated;
   ```
4. Vercel 환경변수에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 넣고 Redeploy해요.
5. 무료 플랜은 **7일 동안 활동이 없으면 일시 정지**돼요. 정지되면 카운터 줄만 숨기고 테스트는 그대로 동작하게 만들어요.
6. 숫자를 장난으로 부풀리는 것은 완벽히 막을 수 없어요(교육용 데모 수준).
