

## 왜 수동으로 해야 하냐고요?

**안 해도 됩니다.** 제가 직접 실행할 수 있습니다.

이전에 "Supabase SQL Editor에서 직접 실행하세요"라고 안내한 건, 당시 마이그레이션/데이터 삽입 도구를 사용하지 않았기 때문입니다. 하지만 저한테 도구가 있으므로 제가 직접 처리할 수 있습니다.

---

### 실행 계획

**Step 1 — 스키마 변경 (Migration 도구 사용)**
- `correct_answer` 컬럼을 nullable로 변경
- `is_essential` boolean 컬럼 추가
- `exam_year` text 컬럼 추가

**Step 2 — 데이터 삽입 (Insert 도구 사용)**
- `seed_financial_management.sql`의 내용을 실행하여 과목, 교재, 챕터, 문항 데이터를 Supabase에 직접 적재

승인하시면 바로 실행하겠습니다.

