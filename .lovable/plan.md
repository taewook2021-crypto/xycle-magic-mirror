

## 교재 순서 변경 (드래그) + 스와이프 삭제 기능

### 개요
대시보드의 과목별 교재 목록에서:
1. 우측 그립 아이콘(≡)을 길게 눌러 위아래로 드래그하여 순서 변경
2. 교재를 왼쪽으로 스와이프하면 삭제 버튼 노출

### DB 변경

`user_books` 테이블에 `display_order` 컬럼이 없으므로 추가 필요:

```sql
ALTER TABLE user_books ADD COLUMN display_order integer DEFAULT 0;
```

### 구현 계획

**1. 라이브러리 추가**
- `@dnd-kit/core` + `@dnd-kit/sortable` — React용 드래그앤드롭 (터치 지원 포함)

**2. `useDashboardData.ts` 수정**
- `user_books` 조회 시 `display_order` 기준 정렬
- `reorderBook(userBookId, newOrder)` 함수 추가 → `user_books.display_order` UPDATE
- `removeBook(userBookId)` 함수 추가 → `user_books` DELETE

**3. `SubjectProgressCard.tsx` 수정**
- 각 교재 아이템을 `SortableItem`으로 래핑
- 우측에 `GripVertical` 아이콘 추가 (드래그 핸들)
- 스와이프 삭제: 터치 swipe-left 감지 → 빨간 "삭제" 버튼 노출 (CSS transform + 상태)
- 삭제 확인 없이 즉시 삭제 (or 간단한 confirm)

**4. `Dashboard.tsx` 수정**
- `DndContext` + `SortableContext`로 과목별 교재 리스트 감싸기
- `onDragEnd`에서 순서 업데이트 호출

**5. 스와이프 삭제 구현 (커스텀)**
- 별도 `SwipeableBookItem` 컴포넌트
- `onTouchStart/Move/End`로 좌측 스와이프 감지
- 임계값 초과 시 삭제 버튼(빨간색) 노출
- 삭제 버튼 클릭 시 `removeBook` 호출

### 수정 대상

| 대상 | 작업 |
|------|------|
| DB migration | `user_books`에 `display_order` 컬럼 추가 |
| `package.json` | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` 추가 |
| `useDashboardData.ts` | `reorderBook`, `removeBook` 함수 추가, 정렬 적용 |
| `SubjectProgressCard.tsx` | 드래그 핸들 + 스와이프 삭제 UI 통합 |
| `Dashboard.tsx` | DndContext 래핑, 드래그 이벤트 핸들링 |

