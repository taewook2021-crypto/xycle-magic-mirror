

## 이승철 세무회계연습 — 문제순서 유지 + 분류 필터

### 문제
현재 회독표는 `sectionFilter === "all"`일 때 문항을 유형별(기본→유예→동차)로 **재정렬**하여 그룹 헤더와 함께 표시합니다. 이승철 교재에서는 문제번호 순서(1→n)를 유지하면서, 주제 열에 기본/유예/동차를 표시하고, 필터 버튼으로 특정 유형만 보기/숨기기만 하면 됩니다.

### 변경 사항

**1. ReviewGrid.tsx 코드 수정**

- `FilterConfig` 인터페이스에 `group_by_type?: boolean` 추가 (기본값 `true`)
- `visualOrder` useMemo: `group_by_type === false`이면 유형별 재정렬 없이 `filtered` 순서 그대로 사용
- `groupedByType()`: `group_by_type === false`이면 단일 그룹 반환 (그룹 헤더 미표시)
- 유형 필터 버튼은 그대로 동작 (선택 시 해당 유형만 필터링)

**2. DB 업데이트 (insert tool)**

이승철 두 교재의 `filter_config` 업데이트:
```json
{
  "show_type_filters": true,
  "show_essential_filter": true,
  "show_star_filter": false,
  "group_by_type": false,
  "type_labels": {"example": "기본", "past_exam": "동차", "practice": "유예"}
}
```
- `show_type_filters: true` → 기본/동차/유예 필터 버튼 활성화
- `group_by_type: false` → 문제번호 순서 유지, 그룹 헤더 없음

### 수정 파일

| 대상 | 변경 |
|------|------|
| `src/components/review/ReviewGrid.tsx` | `group_by_type` 플래그 지원 (3곳 수정) |
| DB `books` 테이블 | 이승철 2교재 filter_config UPDATE |

