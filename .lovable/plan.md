

## 이승철 세무회계연습 + 김종길 필수문제 업데이트

### 작업 요약

3가지 작업을 수행합니다:

1. **이승철 세무회계연습 메타데이터 업데이트** (Excel 기반)
2. **이승철 소·부·상 누락 문항 추가** (~49문항)
3. **김종길 재무관리연습 8판 필수문제 표시** (PDF 기반)

---

### 작업 1: 이승철 법인세법 메타데이터 업데이트

Excel 데이터와 DB 문항 수가 모든 장에서 정확히 일치합니다 (총 227문항).

| Excel | DB 챕터 | 문항 수 |
|-------|--------|--------|
| 1-1장 | ch1 법인세법 총론 | 3 |
| 1-2장 | ch2 익금 | 23 |
| 1-3장 | ch3 손금 | 36 |
| ... | ... | ... |
| 1-11장 | ch11 기타사항 | 12 |

- 각 문항의 `question_type` (기본→example, 동차→past_exam, 유예→practice) UPDATE
- 각 문항의 `is_essential` (O→true) UPDATE
- `filter_config` 업데이트

### 작업 2: 이승철 소·부·상 메타데이터 + 누락 문항 추가

DB에 213문항, Excel에 ~262문항. 5개 챕터에서 49문항 부족:

| Excel | DB 챕터 | DB 수 | Excel 수 | 차이 |
|-------|--------|-------|---------|-----|
| 2-3장 | ch2 사업소득 | 5 | 16 | +11 |
| 2-4장 | ch3 근로·연금·기타 | 16 | 24 | +8 |
| 2-6장 | ch5 종합소득공제 | 5 | 7 | +2 |
| 3-4장 | ch12 과세표준·매출세액 | 12 | 29 | +17 |
| 4-2장 | ch17 증여세 | 9 | 19 | +10 |

- 매칭되는 기존 문항: `question_type` + `is_essential` UPDATE
- 누락 문항: 해당 챕터에 신규 INSERT
- `filter_config` 업데이트

### 작업 3: 김종길 재무관리연습 8판 필수문제 표시

PDF에서 추출한 필수 문제 목록 (챕터별 예제/기출/실전 번호):

| 챕터 | 기출 | 실전 | 예제 |
|------|------|------|------|
| 1 | 2,3 | - | - |
| 2 | 2,5,7 | 2,7,10 | - |
| 3 | 2 | 1,3 | - |
| ... | ... | ... | ... |
| 17 | 2,3,4,5 | 1,2,4 | - |

- 해당 문항들의 `is_essential = true` UPDATE
- `filter_config`에 `"show_essential_filter": true` 추가

---

### 구현 방식

**Python 스크립트**로 Excel을 파싱하여 SQL 생성 후, insert tool로 실행합니다:

1. Excel 파싱 → 이승철 법인세법 227문항 UPDATE SQL 생성 + 실행
2. Excel 파싱 → 이승철 소·부·상 기존 문항 UPDATE + 49문항 INSERT SQL 생성 + 실행
3. 김종길 필수문제 UPDATE SQL 생성 + 실행 (PDF 데이터는 이미 파싱 완료)
4. 3개 교재 `filter_config` UPDATE

### 코드 변경

`ReviewGrid.tsx`의 `type_labels` 지원은 이전 작업에서 이미 추가 완료. 추가 코드 변경 없음.

### 수정 요약

| 대상 | 작업 |
|------|------|
| 이승철 법인세법 227문항 | question_type + is_essential UPDATE |
| 이승철 소·부·상 ~213문항 | question_type + is_essential UPDATE |
| 이승철 소·부·상 ~49문항 | 신규 INSERT |
| 이승철 2교재 filter_config | type_labels + 필터 설정 UPDATE |
| 김종길 ~200문항 | is_essential = true UPDATE |
| 김종길 filter_config | show_essential_filter 추가 UPDATE |

