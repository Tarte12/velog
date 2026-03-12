---
title: 'DB) functional dependency (함수 종속)'
slug: DB-functional-dependency-함수-종속
date: 2025-02-26T06:48:49.678Z
tags: []
---
> DB를 설계하는 방법의 기본이 되는 functional dependency에 대해 알아보자

### functional dependency (함수 종속)
- 한 테이블에 있는 두 개의 attribute(s) 집합(set) 사이의 제약(a constraint)

- X값에 따라 Y값이 유일하게(uniquely) 결정될 때
- 'X가 Y를 함수적으로 결정한다(functionally determine)'
- 'Y가 X에 함수적으로 의존한다(functionally dependent)'
- 라고 말할 수 있고, 두 집합 사이의 이러한 제약 관계를
- functional dependency(FD)라고 함
- 기호 : X -> Y (집합 X가 집합 Y를 결정한다)

### functional dependency(FD) 파악하기
- 테이블의 스키마를 보고 '의미적'으로 파악해야 함
- 즉, 테이블의 state를 보고 FD를 파악해서는 안 됨
- 구축하려는 DB의 attributes가 관계적으로 어떤 의미(semantics)를 지닐지에 따라 FD들이 달라짐


### functional dependency(FD) 예

{stu_id} -> {stu_name, birth_date, address}
{class_id} -> {class_name, year, semester, credit}
{stu_id, class_id} -> {grade}
{bank_name, bank_account} -> {balance, open_date}
{user_id, location_id, visit_date} -> {comment, picture_url}

### X -> Y not means Y -> X

### {} -> Y
- Y값은 언제나 하나의 값만을 가진다는 의미

### 종류

### Trivial functional dependency
- when X -> Y holds, if Y is subset of X, then X -> Y is trivial FD
- {a, b, c} -> {c} is trivial FD
- {a, b, c} -> {a, c} is trivial FD
- {a, b, c} -> {a, b, c} is trivial FD

### Non-trivial functional dependency
- when X -> Y holds, if Y is NOT subset of X, then X -> Y is non-trivial FD
- {a, b, c} -> {b, c, d} is non-trivial FD
- {a, b, c} -> {d, e} is non-trivial FD
=> 겹치는 attribute(s)가 아예 없음 : completely non-trivial FD

### Partial functional dependency
- when X -> Y holds, if 'any proper subset of X' can determine Y, then X -> Y is partial FD

- when {empl_id, empl_name} -> {birth_date} holds,
- because {empl_id} can determine {birth_date},
- then this FD is partial FD

#### proper subset
- 집합 X의 proper subset은 X의 부분 집합이지만  X와 동일하지는 않은 집합
- 예를 들어 X = {a, b, c}일 때
- {a, c}, {a}, {}은 모두 X의 proper subset
- {a, b, c}는 X의 proper subset이 아님

### Full functional dependency
- when X -> Y holds, if 'every proper subset of X' can NOT determine Y, then X -> Y is full FD

- when {stu_id, class_id} -> {grade} holds,
- because {stu_id}, {calss_id}, {} can NOT determine {grade}
- then this FD is full FD

## FD 관련 추가 개념 (내가 찾아볼 것)
- Armstrong's axioms
- Closure
- minimal cover



