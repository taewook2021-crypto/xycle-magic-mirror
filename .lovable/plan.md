

## 이승철 세무회계연습 메타데이터 업데이트 + 김종길 필수문제 — 완료

### 완료된 작업

#### 작업 1: 이승철 법인세법 메타데이터 업데이트 ✅
- 227문항 question_type (기본/동차/유예) + is_essential 업데이트 완료
- filter_config에 type_labels 반영: `{"example": "기본", "past_exam": "동차", "practice": "유예"}`

#### 작업 2: 이승철 소·부·상 메타데이터 + 누락 문항 추가 ✅
- 213문항 기존 메타데이터 업데이트 완료
- 48문항 신규 추가 (사업소득 11, 근로·연금·기타 8, 종합소득공제 2, 과세표준·매출세액 17, 증여세 10)
- 총 261문항으로 확장
- filter_config 업데이트 완료

#### 작업 3: 김종길 재무관리연습 8판 필수문제 표시 ✅
- PDF 기반 191개 필수문제 is_essential = true 설정
- filter_config에 show_essential_filter: true 추가
- 기존 유형 필터(예제/기출/실전)는 유지

#### ReviewGrid type_labels 지원 ✅
- 이전에 이미 구현 완료 — 추가 코드 변경 없음
