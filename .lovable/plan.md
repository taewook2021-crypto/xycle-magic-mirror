

## PC에서 교재 삭제 방법

### 현재 문제
스와이프 삭제는 터치 전용이라 PC(마우스)에서는 교재를 삭제할 방법이 없음.

### 추천 방안: 호버 시 삭제 아이콘 표시

교재 항목에 마우스를 올리면 그립 아이콘 옆에 작은 `X` 또는 휴지통 아이콘이 페이드인으로 나타나는 방식.

- 모바일에서는 기존 스와이프 삭제 유지
- PC에서는 hover 시 삭제 버튼 노출
- 터치 디바이스에서는 hover 아이콘이 보이지 않으므로 충돌 없음

### 구현

| 대상 | 작업 |
|------|------|
| `SubjectProgressCard.tsx` | 교재 행에 `group` 클래스 추가, hover 시 `Trash2` 아이콘 표시 (그립 아이콘 왼쪽). `opacity-0 group-hover:opacity-100 transition-opacity`로 처리 |

코드 변경은 `SubjectProgressCard.tsx` 1개 파일, 약 10줄 수정.

