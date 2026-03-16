

## 확인 및 최종 스키마 정리

네, 과목도 선택할 수 있습니다. 토픽 계층은 이전 설계와 동일합니다:

```text
subjects (과목)          예: 중급회계, 세법
  └── topics (대단원)    예: 재고자산, 유형자산
       └── sub_topics (소주제)  예: cut-off, 감모손실
```

학생이 **과목 선택 → 대단원 선택 → 소주제별 문항 확인** 흐름으로 탐색하게 됩니다.

교재 계층(books → chapters → questions)은 별도로 존재하고, 문항에 `sub_topic_id`를 태깅해서 교재 횡단 조회가 가능합니다.

### 구현 내용

1. **Supabase 마이그레이션** — 7개 테이블 생성 (subjects, topics, sub_topics, books, chapters, questions, attempts) + RLS + 인덱스
2. **TypeScript 타입** — Supabase 타입 반영
3. **시드 데이터** — 중급회계 과목 샘플 (대단원 2~3개, 소주제, 교재, 문항)

이전 설계에서 변경 사항 없음. 승인하시면 바로 마이그레이션 실행합니다.

