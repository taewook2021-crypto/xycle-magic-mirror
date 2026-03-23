

## 교재별 필터 설정 시스템

### 요약
books 테이블에 필터 설정 컬럼을 추가하여 교재마다 어떤 필터를 표시할지 DB에서 관리합니다.

### 필터 구성 정리

| 교재 | 유형 필터 (기본/응용 등) | ★ 2유 | 📝 메모 | 오답 필터 |
|------|------------------------|-------|---------|----------|
| 김기동 | O (기본/응용) | O | O | O |
| 강경태 | X | X | O | O |

### 작업 단계

**1. DB 스키마 변경 (마이그레이션)**
- `books` 테이블에 `filter_config` jsonb 컬럼 추가 (기본값: `{"show_type_filters": true, "show_star_filter": false}`)
- 구조: `{ show_type_filters: boolean, show_star_filter: boolean }`

**2. 기존 교재 데이터 업데이트 (insert tool)**
- 김기동 교재: `{"show_type_filters": true, "show_star_filter": true}`
- 강경태 교재: `{"show_type_filters": false, "show_star_filter": false}`

**3. ReviewGrid 컴포넌트 수정**
- `bookId`를 이용해 해당 교재의 `filter_config`를 조회
- `show_type_filters: false`이면 유형 필터 버튼(전체/기본/응용) 숨김
- `show_star_filter: false`이면 ★ 2유 버튼 숨김
- 📝 메모 필터와 오답 필터는 항상 표시

### 기술 상세

```text
books 테이블
┌─────────────────┬────────┬─────────────────────────────────────────────┐
│ column          │ type   │ default                                     │
├─────────────────┼────────┼─────────────────────────────────────────────┤
│ filter_config   │ jsonb  │ {"show_type_filters":true,"show_star_filter":false} │
└─────────────────┴────────┴─────────────────────────────────────────────┘
```

ReviewGrid에서 `filter_config`를 fetch하여 필터 UI를 조건부 렌더링합니다. `show_type_filters`가 false인 경우 `sectionFilter`는 항상 `"all"`로 고정됩니다.

