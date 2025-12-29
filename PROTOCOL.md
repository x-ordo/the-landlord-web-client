# 🛠️ Development Execution Protocol: "The Landlord" (MVP)

> **목표:** 7일 내 'Apps in Toss' 샌드박스 배포 및 기능 검증 완료.
> **원칙:** **"Make it Work, Then Make it Better."**

---

## 📅 Part 1. 개발팀 실행 체크리스트 (1-Week Sprint)

### [Day 1-2] 지반 공사 (Infrastructure & Identity)

- [ ] **[Setup] 프로젝트 초기화**
  - Unity 2022.3 LTS 이상 설치 (WebGL 호환성 최적)
  - 앱인토스 Unity SDK 패키지 설치
  - `granite.config.ts` 설정: `webViewProps.type: 'game'` 및 `permissions`

- [ ] **[Identity] 유저 식별 구현**
  - `AIT.GetUserKeyForGame()` 호출하여 `hash` 값 획득
  - **필수 방어:** 반환값 `undefined` 시 업데이트 안내 팝업

- [ ] **[DB] 데이터 연동**
  - 서버(Node.js/Go) 구축 및 `app_user` 테이블 생성
  - `Login API`: hash → DB 조회 → 유저 정보 반환

### [Day 3-4] 핵심 루프 구현 (Core Loop & Viral)

- [ ] **[Game] 수금/성장 로직**
  - 건물 클릭 시 `AIT.GenerateHapticFeedback({ type: 'selection' })` 호출
  - 서버에 `Collect` 요청 → 골드 증가 → 건물 업그레이드 UI 반영

- [ ] **[Viral] 친구 고용 (Mass Viral)**
  - `AIT.ContactsViral({ moduleId: 'YOUR_MODULE_ID' })` 호출
  - 샌드박스에서 `console.log`로 `sendViral` 이벤트 확인

### [Day 5] 수익화 연동 (The Cash Flow)

- [ ] **[Ads] 광고 연동**
  - 게임 시작 시 `AIT.LoadFullScreenAd({ adGroupId: 'ait-ad-test-rewarded-id' })` 미리 로드
  - 수금 2배 버튼 → `ShowFullScreenAd()` → `userEarnedReward` 이벤트 수신 시 보상

- [ ] **[IAP] 인앱 결제 연동**
  - 콘솔에 테스트 상품(`shield_24h`) 등록
  - `AIT.CreateOneTimePurchaseOrder()` 연동
  - **필수:** 앱 시작 시 `AIT.GetPendingOrders()` 호출 (미지급 건 복구 로직)

### [Day 6-7] 정책 준수 및 폴리싱 (Compliance & Polish)

- [ ] **[Policy] 약관 동의 UI**
  - 인트로 화면에 "서비스 이용약관(필수)" 체크박스
  - 약관 URL은 노션 페이지로 연결 가능

- [ ] **[UX] 로딩 화면**
  - 초기 로딩 3초 이상 시 이탈 방지용 브랜드 로고 노출

- [ ] **[Test] 최종 점검**
  - `npx ait deploy`로 빌드 업로드 및 QR 코드 실기기 테스트
  - iOS 오디오 재생/중지 체크

---

## 🔗 Part 2. 핵심 API 호출 시퀀스

### 1. 앱 시작 및 로그인 (Startup Sequence)

```
1. Client: AIT.GetUserKeyForGame() 호출
2. Client: hash 값 획득 (실패 시 업데이트 안내)
3. Client -> Server: POST /login { hash }
4. Server: DB 조회 (없으면 신규 생성) -> 유저 데이터 반환
5. Client: AIT.GetPendingOrders() 호출 [중요!]
   -> 있다면 Server에 지급 요청 -> AIT.CompleteProductGrant() 호출
```

### 2. 친구 초대 및 보상 (Viral Sequence)

```
1. User: "친구 고용하기" 버튼 클릭
2. Client: AIT.ContactsViral({ options: { moduleId: '...' } }) 호출
3. Toss App: 연락처 목록 팝업 -> 유저가 친구 선택 -> 발송
4. Client: 'sendViral' 이벤트 수신
   -> data: { rewardAmount: 100, rewardUnit: '원' }
5. Client -> Server: 초대 보상(에너지) 지급 요청
```

### 3. 광고 보고 부활/방어 (Ad Sequence)

```
1. Client (게임 시작 시): AIT.LoadFullScreenAd({ adGroupId: '...' }) 미리 호출
2. User: "광고 보고 방어하기" 버튼 클릭
3. Client: AIT.ShowFullScreenAd() 호출
4. Client: 'userEarnedReward' 이벤트 수신 (광고 완주)
   -> data: { unitType: 'shield', unitAmount: 1 }
5. Client -> Server: 방패 아이템 지급 및 방어 처리 요청
6. Client: 'dismissed' 이벤트 수신 -> 게임 재개
```

### 4. 아이템 구매 (IAP Sequence)

```
1. Client: AIT.GetProductItemList() 호출 -> 상점 UI 구성
2. User: "방패 구매" 클릭
3. Client: AIT.CreateOneTimePurchaseOrder({ sku: 'shield_24h' })
4. Toss App: 결제 프로세스 진행 (지문/페이스ID)
5. Client: 결제 성공 콜백 수신 -> Server에 영수증 검증 요청
6. Server: 검증 완료 후 아이템 지급 처리
7. Client: AIT.CompleteProductGrant({ orderId }) 호출 [필수!]
```

---

## ⚠️ 기술 스택 결정 필요

| 옵션 | 현재 상태 | 프로토콜 제안 |
|------|----------|--------------|
| **프론트엔드** | React + TypeScript + Vite | Unity 2022.3 LTS + WebGL |
| **장점** | 빠른 개발, 가벼운 번들 | 아이소메트릭 그래픽, SDK 공식 지원 |
| **단점** | 복잡한 그래픽 구현 어려움 | 무거운 번들, 로딩 시간 |

**결정 대기 중...**
