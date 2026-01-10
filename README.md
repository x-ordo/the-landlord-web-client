# The Landlord Web Client (Vite + React)

백엔드 템플릿과 붙여서 **API 시현**하는 용도(= Unity 팀이 오기 전, 계약/멱등/경제 로직 검증용).

## Run
```bash
cp .env.example .env
npm i
npm run dev
```

## Requires backend
`VITE_API_BASE_URL`를 backend 주소로 지정.

## Toss SDK
이 프로젝트는 Toss 환경이 아닐 때도 돌아가게 **fallback mock**을 넣어둠.

Toss 환경에서 실제로 빌드하려면:
- `@apps-in-toss/web-framework` 설치/번들 가능 여부 확인
- `contactsViral` moduleId를 실제 값으로 교체


## Week3 Additions

### Targeted viral (contacts)
- Set `VITE_TOSS_MODULE_ID` in `.env` (from Toss console / module settings).
- The client calls `/viral/contacts/send` (server cooldown + reward) then triggers `contactsViral(moduleId)`.

### Revenge deep-link
- Shared URLs use `?revenge=<raid_id>` (also accepts `raid_id` / `raid` for compatibility).
- When the app loads with a revenge param, it calls `/raid/resolve` and shows a **복수하기** CTA.
