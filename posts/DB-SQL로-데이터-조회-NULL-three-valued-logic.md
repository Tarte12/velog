---
title: 'DB) SQL로 데이터 조회 (NULL, three-valued logic)'
slug: DB-SQL로-데이터-조회-NULL-three-valued-logic
date: 2025-02-18T13:01:39.563Z
tags: []
---
## NULL

### SQL에서 NULL의 의미
- unknown : 알려지지 않은
- unavailable or witheld : 이용할 수 없는 (비공개라든가)
- not applicable : 적용할 수 없는 (아예 해당 사항이 없는 경우)
=> 같은 null이라도 같은 값이라고 할 수 없음!

## NULL과 Three-Valued Logic

### NULL과 Three-Valued Logic
- SQL에서 NULL과 비교 연산을 하게 되면 그 결과는 UNKNOWN
- UNKNOWN : 'TRUE일수도 있고 FALSE일 수도 있다'라는 의미
- three-valued logic : 비교/논리 연산의 결과로 TRUE, FALSE, UNKNOWN을 가짐

### WHERE절의 condition(s)
- where절에 있는 condition(s)의 결과가 TRUE인 tuple(s)만 선택됨
- 즉, 결과가 FALSE거나 UNKNOWN이면 tuple은 선택되지 않음 (중요)

