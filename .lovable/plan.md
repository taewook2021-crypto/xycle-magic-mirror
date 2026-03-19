

## 세모(△) 필터 추가 계획

### 현황
현재 X(오답) 횟수 필터가 `1✕`, `2✕`, `3✕+` 버튼으로 구현되어 있음. 동일한 방식으로 △ 버튼을 추가하면 필터 줄이 너무 길어져 UI가 지저분해짐.

### 접근: 드롭다운으로 통합

X 버튼 3개 + △ 버튼 3개 = 6개를 나열하는 대신, **하나의 드롭다운 Select**로 통합.

드롭다운 옵션:
- (기본) 전체
- 1✕ 이상 / 2✕ 이상 / 3✕ 이상
- 1△ 이상 / 2△ 이상 / 3△ 이상

### 수정 파일: `src/components/review/ReviewGrid.tsx`

1. `wrongCountFilter` 상태를 `resultFilter` 로 변경 — `{ type: "wrong" | "half", count: number } | null`
2. 기존 6개 버튼 영역을 `Select` 드롭다운 1개로 교체 (compact, 필터 줄에 인라인)
3. `filtered` 로직에서 `half` 카운트 필터 조건 추가
4. `groupedByType`에서 resultFilter 활성 시 헤더 제거 (기존 wrongCountFilter와 동일 동작)

UI 변화: 기존 `1✕ 2✕ 3✕+` 버튼 3개가 작은 드롭다운 1개로 대체되어 오히려 더 깔끔해짐.

