---
title: 'DB) DB MVCC'
slug: DB-DB-MVCC
date: 2025-02-26T05:20:33.110Z
tags: []
---
> MVCC(multiversion concuttency control)
isolation level과 함께 MVCC case study)

### MVCC

||read|write|
|---|---|---|
|read|O|O|
|read|O|X|

- MVCC는 commit된 데이터만 읽음
- commit할 때 unlock하는 이유 : recoverability를 위해 commit할 때 write lock을 unlock함

- 데이터를 읽을 때 특정 시점 기준으로 가장 최근에 commit된 데이터를 읽음
- 데이터 변화(write) 이력 관리 (그래서 데이터 저장 공간을 많이 씀)
- read와 write는 서로를 block하지 않음 (성능면에서 동시에 처리할 수 있는 transaction이 크다라는 방면에서 good)

#### isolation level
  
- read committed : read하는 시간을 기준으로 그전에 commit된 데이터를 읽음
- repeatable read : tx 시작 시간을 기준으로 그전에 commit된 데이터를 읽음
- serializable 
1. MySQL : MVCC로 동작하기보다 lock으로 동작
2. PostgreSQL : SSI(Serializable Snapshot Isolation) 기법이 적용된 MVCC로 동작
- read uncommitted 
1. MySQL : MVCC는 committed된 데이터를 읽기 때문에, 이 레벨에서는 보통 MVCC가 적용 X
2. PostgreSQL : read uncommitted level이 존재하미나, read committed level처럼 동작함

### PostgreSQL, MySQL 동작 방식
1. PostgreSQL
- repeatable read => first-updater-win : 같은 데이터에 먼저 update한 tx가 commit되면 나중 tx는 rollback됨
- transaction마다 다른 isolation level 부여 가능
- LOST UPDATE 현상을 방지하기 위해선, 양쪽 transaction의 isolation level을 모두 바꿔야 함
2. MySQL
- 위의 기능이 아예 없음!
- locking read는 가장 최근의 commit된 데이터를 읽음 (isolation level과 상관없이 진행)
- MySQL에서는 LOST UPDATE 현상 방지를 위해 locking read를 해 줘야 함
#### Locking read
SELECT ... FOR UPDATE; -> write lock 획득
SELECT ... FOR SHARE; -> read lock 획득

### WRITE SKEW (repeatable read level에서)
1. MySQL => locking read 사용
2. PostgreSQL => FOR UPDATE, FOR SHARE라는 문법이 있어서 사용 가능 But 동작 방식이 약간 다름 (first-updater-win이 적용되기 때문에)

### WRITE SKEW (serializable level에서)
1. MySQL
- repeatable read와 유사
- tx의 모든 평범한 select문은 암묵적으로 select ... for share처럼 동작
2. PostgreSQL
- SSI로 구현
- first-committer-winner