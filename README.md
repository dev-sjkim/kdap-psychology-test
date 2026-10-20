# 마음결

4분 만에 적어 보는 나의 성격과 가치. 문항에 답하고 마음 가는 단어를 고르고 덜어내면 성격 그래프와 가치가 담긴 프로필 카드 한 장이 나오고, 버튼 하나로 복사해 평소 쓰는 AI(ChatGPT, Gemini, Claude 등)에 붙여 넣으면 항목별 해석을 받을 수 있습니다.

- **단계**: 평소의 나(5지선다 20문항) → 마음이 끌리는 단어 → 끝까지 남길 단어(순위) → 요즘의 나 → 더 키우고 싶은 힘
- **근거**: 성격은 Mini-IPIP(Donnellan 외, 2006) 20문항, 가치 단어는 Schwartz 기본가치 이론을 참고했습니다. 검증된 검사는 아니고, 점수 대신 기울기와 고른 단어를 정성적으로 봅니다.
- **개인정보**: 모든 정리는 브라우저 안에서 합니다. 서버, DB, 환경변수가 없습니다.
- 재미로 나를 들여다보는 도구이며 심리 진단이 아닙니다.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # 타입 검사 + 린트 + 단위 테스트
npm run build && npm run e2e   # 모바일 화면 흐름 테스트(설치된 Chrome 사용)
```

## 문서

| 문서 | 내용 |
|---|---|
| [docs/research.md](docs/research.md) | 척도·이론 조사(3·4판 기준)와 5판 전환 메모 |
| [docs/spec.md](docs/spec.md) | 단계, 단어 근거, 결과 정리 규칙, 결과 카드, 프롬프트 |
| [docs/ui-ux.md](docs/ui-ux.md) · [docs/mockup/](docs/mockup/) | 노트 속지 디자인 규칙과 목업 |
| [docs/decisions.md](docs/decisions.md) | 확정된 결정 |
| [docs/deploy.md](docs/deploy.md) | Vercel 배포 절차와 점검 체크리스트 |
| [docs/prompt-data-schema.json](docs/prompt-data-schema.json) | 해석 프롬프트 데이터의 JSON Schema |
| [CLAUDE.md](CLAUDE.md) | 프로젝트 규칙과 폴더 지도 |
