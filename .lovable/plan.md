

## 이승철 세무회계연습 메타데이터 업데이트 + 필터 시스템 확장

### 현재 상태
- 이승철 법인세법 (`beeb92b6...`): 11장, 227문항 — 모두 `question_type='example'`, `is_essential=false`
- 이승철 소·부·상 (`01cd0689...`): 18장, 213문항 — 동일
- 김종길 재무관리연습 8판 (`d1000000...`): 405문항, question_type 구분 있음 (예제178/기출179/실전48), 하지만 `is_essential` 미반영

### 작업 1: 필터 시스템에 커스텀 라벨 지원 추가

`ReviewGrid.tsx`에서 `filter_config`에 `type_labels` 옵션을 추가하여, 교재마다 다른 필터 라벨을 표시할 수 있도록 합니다.

**filter_config 예시:**
```json
{
  "show_type_filters": true,
  "show_essential_filter": true,
  "type_labels": { "example": "기본", "past_exam": "동차", "practice": "유예" }
}
```

변경 파일: `src/components/review/ReviewGrid.tsx`
- `FilterConfig` 인터페이스에 `type_labels?: Record<string, string>` 추가
- `sectionFilters` 및 `typeLabels` 생성 시 `filterConfig.type_labels`가 있으면 해당 라벨 사용
- 그룹 헤더(예제/기출문제/실전연습)도 커스텀 라벨 적용

### 작업 2: 이승철 교재 문항 메타데이터 업데이트

PDF에서 추출한 분류(기본/동차/유예)와 필수(O) 데이터를 기존 문항에 반영합니다.

- **매핑**: 기본 → `example`, 동차 → `past_exam`, 유예 → `practice`
- **is_essential**: O 표시 → `true`
- PDF 파싱 스크립트로 각 장별 문항 데이터를 추출 후, SQL UPDATE 실행
- **filter_config 업데이트**: 두 교재 모두
  ```json
  {
    "show_type_filters": true,
    "show_essential_filter": true,
    "show_star_filter": false,
    "type_labels": { "example": "기본", "past_exam": "동차", "practice": "유예" }
  }
  ```

### 작업 3: 김종길 재무관리연습 8판 필수 필터 추가

필수문제 리스트를 다시 제공해주시면:
- 해당 문항들의 `is_essential = true`로 UPDATE
- filter_config에 `"show_essential_filter": true` 추가
- 기존 유형 필터(예제/기출/실전)는 유지

### 수정 파일 요약

| 파일 | 변경 |
|------|------|
| `src/components/review/ReviewGrid.tsx` | FilterConfig에 type_labels 지원 추가 |
| SQL (insert tool) | 이승철 두 교재 440문항 question_type + is_essential UPDATE |
| SQL (insert tool) | 이승철 두 교재 filter_config UPDATE |
| SQL (insert tool) | 김종길 필수문항 is_essential UPDATE + filter_config UPDATE (리스트 제공 후) |

