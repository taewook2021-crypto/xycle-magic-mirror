## 상황 먼저

네, 안타깝지만 실화입니다. Supabase 프로젝트를 삭제하면 그 안의 Postgres 데이터베이스도 함께 사라지고, Lovable 쪽에는 사본이 남지 않습니다. 지금 복구된 건 코드에 마이그레이션으로 남아 있던 **스키마 + 교재 시드 데이터**뿐이고, 계정/풀이기록/메모/그룹 같은 런타임 데이터는 코드에 존재한 적이 없어서 되살릴 방법이 없습니다.

단 하나 남은 가능성: Supabase는 삭제된 프로젝트를 일정 기간 보관하는 경우가 있어, **Supabase 지원팀(support@supabase.io 또는 대시보드 Support 티켓)에 프로젝트 ref `tyudxggyqdzzbdhpnzzn`(구 프로젝트 ref) 복원 요청**을 넣어볼 수 있습니다. 유료 플랜이면 성공 확률이 올라갑니다. 이건 제가 대신 못 하고 직접 티켓을 넣으셔야 합니다 — 빠를수록 좋습니다.

## 지금 고칠 빌드 오류

`src/lib/supabaseHelpers.ts:12` — `supabase.from(table)`에 `string`을 넘기는데, 재생성된 타입에서는 테이블명이 리터럴 유니온이라 `never`로 좁혀져 오류가 납니다.

수정 내용:
- `table` 파라미터 타입을 `string` 그대로 두되, 호출부에서 타입 단언으로 우회 (`supabase.from(table as never)`) 하거나
- 더 깔끔하게: `import type { Database }`로 `keyof Database["public"]["Tables"]` 유니온을 파라미터 타입으로 지정하고, 기존 호출부가 전부 실제 테이블명 문자열이면 그대로 통과하도록 함.

기본은 두 번째(타입 안전) 방식으로 가고, 리터럴이 아닌 동적 문자열을 넘기는 호출부가 있으면 해당 호출부만 `as` 캐스팅으로 맞추겠습니다.

## 이후 재발 방지 (선택)

- 주 1회 주요 테이블 CSV 백업을 내려받는 절차 안내
- Supabase 대시보드에서 자동 백업(PITR) 활성화 여부 확인

## 기술 세부

- 편집 파일: `src/lib/supabaseHelpers.ts`
- 전체 호출부를 `rg "fetchAllRows"` 로 확인 후 타입 충돌 나는 곳만 조정
- 수정 후 `tsgo` 타입체크로 검증
