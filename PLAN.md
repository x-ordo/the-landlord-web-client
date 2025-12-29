# 아이소메트릭 건물 시각화 구현 계획

## 개요
"갓물주 전쟁" 게임에 **Floor796 스타일의 아이소메트릭 픽셀 아트 건물**을 추가합니다.

- **레퍼런스**: floor796.com (픽셀 아트 + 아이소메트릭 + 다크 톤)
- **구현 방식**: React SVG 컴포넌트 (추가 라이브러리 없음)
- **번들 사이즈 영향**: ~3KB gzipped

---

## 건물 레벨 매핑

| 레벨 | 건물 종류 | 시각적 특징 |
|------|----------|------------|
| 1-4 | 작은 주택 | 2x2 베이스, 뾰족한 지붕, 굴뚝, 창문 1개 |
| 5-9 | 빌라 | 3x3 베이스, 평지붕, 2층, 발코니 |
| 10-19 | 아파트 | 4x4 베이스, 4-6층, 창문 그리드, 물탱크 |
| 20+ | 마천루 | 3x5 베이스, 10층+, 안테나, 유리 외벽 |

---

## 파일 구조

```
src/components/buildings/
├── index.ts                    # 배럴 export
├── BuildingRenderer.tsx        # 메인 컴포넌트
├── types.ts                    # 타입 정의
├── buildings/
│   ├── SmallHouse.tsx          # 레벨 1-4
│   ├── Villa.tsx               # 레벨 5-9
│   ├── Apartment.tsx           # 레벨 10-19
│   └── Skyscraper.tsx          # 레벨 20+
├── effects/
│   └── UpgradeParticles.tsx    # 업그레이드 축하 효과
└── hooks/
    └── useBuildingType.ts      # 레벨→건물타입 로직
```

---

## 구현 단계

### Phase 1: 기반 작업
1. `src/components/buildings/` 디렉토리 생성
2. `types.ts` 정의 (BuildingType, BuildingRendererProps)
3. `useBuildingType.ts` 훅 구현
4. `BuildingRenderer.tsx` 플레이스홀더 생성

### Phase 2: 건물 SVG 구현
5. `SmallHouse.tsx` - 작은 주택 SVG
6. `Villa.tsx` - 빌라 SVG
7. `Apartment.tsx` - 아파트 SVG
8. `Skyscraper.tsx` - 마천루 SVG

### Phase 3: 통합
9. `BuildingRenderer.tsx` 완성 (크기 조절, 타입 전환)
10. `UserAssets.tsx`에 통합
11. 컴포넌트 export 업데이트

### Phase 4: 애니메이션
12. 창문 glow 애니메이션 (CSS keyframes)
13. 업그레이드 축하 효과 (파티클)
14. 건물 타입 전환 애니메이션

---

## 컴포넌트 인터페이스

```typescript
// types.ts
export type BuildingType = 'house' | 'villa' | 'apartment' | 'skyscraper';

export interface BuildingRendererProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';  // 48px | 96px | 144px
  showLevel?: boolean;
  animated?: boolean;
  celebrating?: boolean;
}
```

## UserAssets.tsx 통합 위치

```tsx
<Card>
  <div className="h2">내 자산</div>

  {/* 새로 추가될 건물 시각화 */}
  <BuildingRenderer
    level={state.snapshot.building_level}
    size="lg"
    animated
  />

  <div className="big">{fmtGold(computed.assets)}</div>
  {/* ... */}
</Card>
```

---

## 색상 팔레트 (styles.css 변수 활용)

| 용도 | CSS 변수 | 색상 |
|-----|---------|------|
| 어두운 벽 | --card | #14141c |
| 밝은 벽 | - | #1a1a24 |
| 지붕 | - | #3a3530 |
| 창문 빛 | --gold | #ffd24d (30% opacity) |
| 테두리 | --line | #2a2a3a |
| 그림자 | --bg | #0b0b0f |

---

## 수정 대상 파일

| 파일 | 작업 |
|------|------|
| `src/components/buildings/*` | **신규 생성** |
| `src/components/user/UserAssets.tsx` | BuildingRenderer 통합 |
| `src/components/index.ts` | BuildingRenderer export 추가 |
| `src/styles.css` | 애니메이션 keyframes 추가 |

---

## 예상 작업량

- **총 코드량**: ~715 LOC
- **예상 시간**: 2-3일
- **번들 사이즈 증가**: ~3KB gzipped (+3.75%)
