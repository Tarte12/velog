---
title: 'DB) LOCK 활용한 concurrency control 기법'
slug: DB-LOCK-활용한-concurrency-control-기법
date: 2025-02-26T04:30:52.208Z
tags: []
---
> **wirte-lock, read-lock, 2PL(two-phase locking) protocol**

### wirte-lock (exclusive lock)
- read/write(insert, modify, delete)할 때 사용
- 다른 tx가 같은 데이터를 read.write하는 것을 허용하지 않음

### read-lock (shared lock)
- read할 때 사용
- 다른 tx가 같은 데이터를 read하는 것을 허용

### lock 호환성

||read-lock|write-lock|
|---|---|---|
|read-lock|O|X|
|write-lock|X|X|

### 2PL protocol
- tx에서 모든 locking operation이 최초의 unlock operation보다 먼저 수행되도록 하는 것
- Serializability 보장

### Expanding phase (growing phase)
- lock을 취득하기만 하고 반환하지 않는 phase

### Shrinking phase (contracting phase)
- lock을 반환만 하고 취득하지 않는 phase

### Deadlock (OS에서도 배움 -> 검색해 봐야지)
- 2PL에서는 상황에 따라 Deadlock이 발생할 수 있음

### conservative 2PL
- 모든 lock을 취득한 뒤 transaction을 시작
- deadlock-free
- but, 실용적이지 않음

### strict 2PL (S2PL)
- strict schedule을 보장하는 2PL
- recoverability 보장
- write-lock을 commit/rollback 될 때 반환

### strong strict 2PL (SS2PL or rigorous 2PL)
- strict schedule을 보장하는 2PL
- recoverability 보장
- read-lock/write-lock을 commit/rollback 될 때 반환
- S2PL보다 구현이 쉬움

### lock 호환성 방식의 약점
- read-read를 제외하고는 한쪽이 block이 되니까 전체 처리량이 좋지 않음
=> read와 write가 서로를 block하는 것이라도 해결해 보자
=> 해결책 : MVCC (multiversion concurrency control)

||read-lock|write-lock|
|---|---|---|
|read-lock|O|X|
|write-lock|X|X|