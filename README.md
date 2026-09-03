# 명리온 (Myeongri:ON)

근거를 보여주는 AI 사주 상담 MVP.

## 시작하기

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## 환경 변수

- `OPENAI_API_KEY` — AI 해석용 (없으면 로컬 fallback 해석 사용)
- `OPENAI_MODEL` — 기본 `gpt-4.1-mini`
- `RATE_LIMIT_DAILY` — IP당 일일 API 한도

## 스크립트

- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run test` — Vitest 테스트

## 배포

Vercel에 연결 후 환경 변수를 등록하세요. `vercel.json`에 icn1 리전이 설정되어 있습니다.
