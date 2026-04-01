

## 대시보드 진도/정답률 오류 수정

### 원인
Supabase는 기본적으로 쿼리당 **최대 1,000행**만 반환합니다.
- `questions` 테이블: **3,414행** → 1,000행만 가져옴
- `attempts` 테이블: **5,575행** → 1,000행만 가져옴

`useDashboardData.ts`에서 이 두 테이블을 `.select()`로 전체 조회하지만, 1,000행 제한에 걸려 이승철 세무회계 등 후반부 교재의 문제 수가 0 또는 축소 계산됩니다.

### 해결 방법

**`src/hooks/useDashboardData.ts` 수정** — 1,000행 초과 테이블에 대해 페이지네이션 적용

1. `questions` 조회: `range()`를 사용하여 1,000행씩 반복 fetch하는 헬퍼 함수 도입
2. `attempts` 조회: 동일하게 페이지네이션 적용 (user_id 필터가 있지만, 활발한 사용자는 5,000건 이상)
3. 기존 로직(맵 구성, 통계 계산)은 변경 없음 — 데이터만 완전하게 불러오면 됨

```typescript
// 헬퍼 함수 예시
async function fetchAll(table, query, pageSize = 1000) {
  let all = [];
  let from = 0;
  while (true) {
    const { data } = await supabase.from(table).select(query).range(from, from + pageSize - 1);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}
```

### 수정 파일

| 파일 | 작업 |
|------|------|
| `src/hooks/useDashboardData.ts` | `questions`, `attempts` 조회에 페이지네이션 헬퍼 적용 |

코드 변경 1개 파일, DB 변경 없음.

