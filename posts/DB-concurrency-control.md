---
title: 'DB) concurrency control'
slug: DB-concurrency-control
date: 2025-02-25T08:36:52.949Z
tags: []
---
### schedule
- 여러 transaction들이 동시에 실행될 때, 각 transaction에 속한 operations들의 실행 순서
- 각 transaction 내에 operations들의 순서는 바뀌지 않음 

### Serial schedule (순차적)
- transaction들이 겹치지 않고 한 번에 하나씩 실행되는 schedule

### 성능
- 이상한 결과를 내진 않음
- 한 번에 하나의 transaction만 실행되기 때문에 -> 좋은 성능을 낼 수 없고, 현실적으로 사용할 수 없는 방식

### Nonserial schedule (순차적)
- transaction들이 겹쳐서(interleaving) 실행되는 하나씩 실행되는 schedule

### 성능
- transaction들이 어떤 형태로 겹쳐서 실행되는지에 따라 이상한 결과 나올 수 있음
- transaction들이 겹쳐서 실행되기 때문에 -> 동시성이 높아져서 같은 시간 동안 더 많은 transaction들을 처리 가능

### 고민
- 성능 때문에 nonserial schedule 쓰고 싶음
- 근데 이상한 결과가 나오는 건 싫음

=> nonserial schedule을 써도 이상한 결과가 나오지 않을 방법을 찾자

=> serial schedule과 동일한 nonserial schedule을 실행하면 되겠다!

그렇다면 'schedule이 동일하다'의 의미가 무엇인지 정의해야 함

### Conflict (of two operations)
- 세 가지 조건을 모두 만족하면 conflict
1. 서로 다른 transaction 소속
2. 같은 데이터에 접근
3. 최소 하나는 write operation

- conflict operation은 순서가 바뀌면 결과도 바뀜

### Conflict equivalent (for two schedules)
- 두 조건 모두 만족하는 conflict equivalent
1. 두 schedule은 같은 transaction들을 가짐
2. 어떤(any) conflicting operations의 순서도 양쪽 schedule 모두 동일함

### Conflict serializable
- serial schedule과 conflict equivalent일 때

### 해결책
- conflict serializable한 nonserial schedule을 허용하자!

### 구현
- 여러 transaction을 동시에 실행해도 schedule이 conflict serializable하도록 보장하는 프로토콜을 적용

### unrecoverable schedule
- schedule 내에서 commit된 transaction이 rollback된 transaction이 write했던 데이터를 읽은 경우
- rollback을 해도 이전 상태로 회복 불가능할 수 있기 때문에 이런 schedule은 DBMS가 허용하면 안 됨

=> 그렇다면 어떤 schedule이 recoverable한가?

recoverable schedule : rollback 시에 이전 상태로 회복 가능한 schedule

### cascadeless schedule
- schedule 내에 어떤(any) transaction도 commit되지 않은 transaction들이 write한 데이터는 읽지 않는 경우

### strict schedule
- schedule 내에 어떤(any) transaction도 commit되지 않은 transaction들이 write한 데이터는 쓰지도 읽지도 않는 경우
- rollback할 때 recovery가 쉬움 -> transaction 이전 상태로 돌려놓기만 하면 됨