---
title: 'DB) transaction isolation level'
slug: DB-transaction-isolation-level
date: 2025-02-25T09:32:48.830Z
tags: []
---
### transaction들이 동시에 실행될 때 발생 가능한 이상 현상들

- Dirty read : commit되지 않은 변화를 읽음
- Non-repeatable read (= Fuzzy read) : 같은 데이터의 값이 달라짐
- Phantom read : 없던 데이터가 생김

=> 위의 이상한 현상을 모두 발생하지 않게 만들 수 있음 
=> BUT, 제약사항이 많아져서 동시 처리 가능한 트랜잭션 수가 줄어들어 결국 DB의 전체 처리량(throughput)이 하락하게 됨

=> 일부 이상한 현상은 허용하는 몇 가지 level을 만들어서 사용자가 필요에 따라 적절하게 선택할 수 있도록 하자!

### isolation level (근데 나 이거 궁금한 게 필요한 건 알겟는데... 누가 하는 거임?? 무슨 원리로 level에 맞춰서 허용해 주는 거임?)
- 그게 바로 isolation level
- 세 가지 이상 현상을 정의하고 어떤 현상을 허용하는지에 따라 각각의 isolation level이 구분됨
- 애플리케이션 설계자는 isolation level을 통해 전체 처리량(throughtput)과 데이터 일관성 사이에서 어느 정도 거래(trade) 가능

| Isolation level | Dirty read | Non-repeatable read | Phantom read |
| --- | --- | --- | --- |
| Read uncommitted | O | O | O |
| Read committed | X | O | O |
| Repeatable read | X | X | O |
| Serializable | X | X | X |
- Serializable : 세 가지 현상뿐만 아니라 아예 이상한 현상 자체가 발생하지 않는 level

### isolation level 비판하는 논문
- Dirty write : commit 안 된 데이터를 write함
=> rollback 시 정상적인 recovery는 매우 중요하기 때문에, 모든 isolation level에서 dirty write를 허용하면 안 됨
- Lost update : 업데이트 내용 싹 날아감
- Dirty read : commit 되지 않은 변화를 읽음
- Read skew : inconsistent한 데이터 읽기
- Write skew : inconsistent한 데이터 쓰기
- Phantom read : 없던 데이터가 생김

### SNAPSHOT ISOLATION(type od MVCC)
- snapshot 형식으로 관리됨 -> 특정 시점에서의 형상
- transaction 시작 전에 commit된 데이터만 보임
- First-committer win

### SQL 표준에서 정의된 isolation level
